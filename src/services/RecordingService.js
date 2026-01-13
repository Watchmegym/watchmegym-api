const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs').promises;
const CameraRepository = require('../repositories/CameraRepository');
const RecordRepository = require('../repositories/RecordRepository');

class RecordingService {
  constructor() {
    // Diretório temporário para gravações
    this.tempDir = path.join(__dirname, '../../temp/recordings');
    this.ensureTempDir();
    
    // Repositories (já são singletons exportados como instâncias)
    this.userRepository = require('../repositories/UserRepository');
    this.cameraRepository = CameraRepository;
  }

  async ensureTempDir() {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      console.error('Erro ao criar diretório temporário:', error);
    }
  }

  /**
   * Grava um stream (RTSP, HTTP, MJPEG) por X segundos
   * @param {string} cameraId - ID da câmera
   * @param {string} userId - ID do usuário
   * @param {number} duration - Duração em segundos
   * @returns {Promise<Object>} - Record criado
   */
  async recordFromRTSP(cameraId, userId, duration) {
    try {
      // 1. Verificar se câmera existe e tem streamUrl
      const camera = await CameraRepository.findById(cameraId);
      if (!camera) {
        throw new Error('Câmera não encontrada');
      }

      if (!camera.streamUrl) {
        throw new Error('Câmera não possui URL de stream configurada');
      }

      // 2. Validar duração
      if (duration < 1 || duration > 300) { // Máximo 5 minutos
        throw new Error('Duração deve ser entre 1 e 300 segundos');
      }

      // 3. Gerar nome do arquivo
      const timestamp = Date.now();
      const filename = `camera-${cameraId}-${timestamp}.mp4`;
      const tempFilePath = path.join(this.tempDir, filename);

      // 4. Gravar stream RTSP
      console.log(`🎥 Iniciando gravação da câmera ${cameraId} por ${duration}s...`);
      await this.captureRTSPStream(camera.streamUrl, tempFilePath, duration);
      console.log(`✅ Gravação concluída: ${filename}`);

      // 5. Upload para storage
      const storageUrl = await this.uploadToStorage(tempFilePath, filename, userId, cameraId);

      // 6. Criar registro no banco
      const record = await RecordRepository.create({
        cameraId,
        userId,
        url: storageUrl,
      });

      // 7. Limpar arquivo temporário
      await this.cleanupTempFile(tempFilePath);

      return record;
    } catch (error) {
      console.error('Erro ao gravar stream:', error);
      throw error;
    }
  }

  /**
   * Captura stream (RTSP, HTTP, MJPEG) usando FFmpeg
   */
  captureRTSPStream(streamUrl, outputPath, duration) {
    return new Promise((resolve, reject) => {
      // Detectar tipo de stream
      const isRTSP = streamUrl.toLowerCase().startsWith('rtsp://');
      const isHTTP = streamUrl.toLowerCase().startsWith('http://') || streamUrl.toLowerCase().startsWith('https://');
      
      console.log(`🎬 Stream detectado: ${isRTSP ? 'RTSP' : isHTTP ? 'HTTP/MJPEG' : 'Desconhecido'}`);
      
      let command;
      let durationTimer;
      let hasEnded = false;
      const startTime = Date.now();

      // Construir comando FFmpeg
      command = ffmpeg(streamUrl);

      // Input options baseadas no tipo de stream
      if (isRTSP) {
        // Opções específicas para RTSP
        command.inputOptions([
          '-rtsp_transport', 'tcp', // TCP para estabilidade
          '-analyzeduration', '5000000',
          '-probesize', '5000000',
        ]);
      } else if (isHTTP) {
        // Opções para HTTP/MJPEG streams
        // Deixar FFmpeg detectar framerate automaticamente
        command.inputOptions([
          '-use_wallclock_as_timestamps', '1', // Usar relógio do sistema
        ]);
      }

      // Output options comuns
      // NÃO usar .duration() - vamos controlar manualmente
      command
        .videoFilters('setpts=PTS-STARTPTS') // Resetar timestamps para começar do zero
        .outputOptions([
          '-c:v', 'libx264', // Codec H.264 (compatibilidade)
          '-preset', 'ultrafast', // Mais rápido possível
          '-crf', '28', // Qualidade menor = arquivo menor
          '-movflags', '+faststart', // Otimizar para streaming
          '-f', 'mp4', // Forçar formato MP4
        ])
        .output(outputPath)
        .on('start', (commandLine) => {
          console.log('🎬 FFmpeg iniciado:', commandLine);
          console.log(`⏱️  Gravação configurada para ${duration} segundos`);
          console.log(`⏱️  Timer manual iniciado`);
          
          // Timer manual para parar após a duração exata
          durationTimer = setTimeout(() => {
            if (!hasEnded) {
              console.log(`⏱️  Tempo de gravação atingido (${duration}s) - parando FFmpeg`);
              hasEnded = true;
              
              // Parar o FFmpeg graciosamente
              try {
                command.ffmpegProc.stdin.write('q'); // Comando 'q' para quit
                
                // Se não parar em 2 segundos, forçar
                setTimeout(() => {
                  try {
                    if (command.ffmpegProc && !command.ffmpegProc.killed) {
                      command.kill('SIGTERM');
                    }
                  } catch (e) {
                    // Ignorar erro se já terminou
                  }
                }, 2000);
                
              } catch (e) {
                // Se não conseguir parar graciosamente, forçar
                try {
                  command.kill('SIGTERM');
                } catch (e2) {
                  console.error('Erro ao parar FFmpeg:', e2.message);
                }
              }
            }
          }, duration * 1000);
        })
        .on('progress', (progress) => {
          if (!hasEnded) {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const timemarkStr = progress.timemark || 'N/A';
            console.log(`⏱️  Gravando: ${timemarkStr} (${elapsed}s / ${duration}s)`);
          }
        })
        .on('end', () => {
          if (!hasEnded) {
            hasEnded = true;
            if (durationTimer) clearTimeout(durationTimer);
            const totalTime = Math.floor((Date.now() - startTime) / 1000);
            console.log(`✅ Gravação finalizada com sucesso (${totalTime}s)`);
            resolve(outputPath);
          } else {
            // Terminou após timeout manual - ainda é sucesso
            const totalTime = Math.floor((Date.now() - startTime) / 1000);
            console.log(`✅ Gravação finalizada após timer manual (${totalTime}s)`);
            resolve(outputPath);
          }
        })
        .on('error', (err, stdout, stderr) => {
          if (!hasEnded) {
            hasEnded = true;
            if (durationTimer) clearTimeout(durationTimer);
            
            // Verificar se é erro real ou apenas parada forçada
            if (err.message && (err.message.includes('SIGTERM') || err.message.includes('Exiting normally'))) {
              const totalTime = Math.floor((Date.now() - startTime) / 1000);
              console.log(`✅ Gravação concluída após ${totalTime}s`);
              resolve(outputPath);
            } else {
              console.error('❌ Erro no FFmpeg:', err.message);
              if (stderr && stderr.length < 500) {
                console.error('FFmpeg stderr:', stderr);
              }
              reject(new Error(`Erro ao gravar stream: ${err.message}`));
            }
          }
        })
        .run();
    });
  }

  /**
   * Upload para storage
   * Prioridade: Supabase > AWS S3 > Local
   */
  async uploadToStorage(filePath, filename, userId, cameraId) {
    try {
      // OPÇÃO 1: Supabase Storage (RECOMENDADO)
      if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return await this.uploadToSupabase(filePath, filename, userId, cameraId);
      }

      // OPÇÃO 2: AWS S3
      if (process.env.AWS_BUCKET_NAME && process.env.AWS_ACCESS_KEY_ID) {
        return await this.uploadToS3(filePath, filename);
      }

      // OPÇÃO 3: Local (desenvolvimento apenas)
      console.warn('⚠️  Usando storage local (não recomendado para produção)');
      return await this.uploadToLocal(filePath, filename);

    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      throw new Error(`Erro ao fazer upload do arquivo: ${error.message}`);
    }
  }

  /**
   * Upload para Supabase Storage
   * Organiza: data/usuario/camera/arquivo.mp4
   */
  async uploadToSupabase(filePath, filename, userId, cameraId) {
    const { supabase } = require('../config/supabase');

    if (!supabase) {
      throw new Error('Supabase não configurado');
    }

    // Buscar informações do usuário e câmera para organizar melhor
    let userName = 'unknown';
    let cameraName = 'unknown';

    try {
      const user = await this.userRepository.findById(userId);
      if (user && user.name) {
        // Normalizar nome para usar no path (remover espaços, acentos, etc)
        userName = user.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove acentos
          .replace(/[^a-z0-9]/g, '-') // Substitui caracteres especiais por -
          .replace(/-+/g, '-') // Remove hífens duplicados
          .replace(/^-|-$/g, ''); // Remove hífens no início/fim
      }
    } catch (e) {
      console.warn('Não foi possível buscar nome do usuário:', e.message);
    }

    try {
      const camera = await this.cameraRepository.findById(cameraId);
      if (camera && camera.name) {
        // Normalizar nome da câmera
        cameraName = camera.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
      }
    } catch (e) {
      console.warn('Não foi possível buscar nome da câmera:', e.message);
    }

    // Ler arquivo
    const fileBuffer = await fs.readFile(filePath);
    
    // Nome do bucket
    const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'recordings';
    
    // Path no bucket organizado: data/usuario/camera/arquivo.mp4
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0]; // 2026-01-13
    const storagePath = `${dateStr}/${userName}/${cameraName}/${filename}`;

    console.log(`📁 Organizando: ${storagePath}`);

    // Upload para Supabase
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(storagePath, fileBuffer, {
        contentType: 'video/mp4',
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(`Erro no Supabase: ${error.message}`);
    }

    // Retornar URL pública
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(storagePath);

    console.log(`✅ Upload para Supabase: ${publicUrlData.publicUrl}`);
    return publicUrlData.publicUrl;
  }

  /**
   * Upload para AWS S3
   */
  async uploadToS3(filePath, filename) {
    const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
    
    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const fileContent = await fs.readFile(filePath);
    const bucketName = process.env.AWS_BUCKET_NAME;
    const key = `recordings/${filename}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileContent,
      ContentType: 'video/mp4',
    });

    await s3Client.send(command);
    const url = `https://${bucketName}.s3.amazonaws.com/${key}`;
    console.log(`✅ Upload para S3: ${url}`);
    return url;
  }

  /**
   * Upload local (apenas desenvolvimento)
   */
  async uploadToLocal(filePath, filename) {
    const publicDir = path.join(__dirname, '../../public/recordings');
    await fs.mkdir(publicDir, { recursive: true });
    
    const finalPath = path.join(publicDir, filename);
    await fs.copyFile(filePath, finalPath);
    
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const url = `${baseUrl}/recordings/${filename}`;
    console.log(`✅ Upload local: ${url}`);
    return url;
  }

  /**
   * Limpar arquivo temporário
   */
  async cleanupTempFile(filePath) {
    try {
      await fs.unlink(filePath);
      console.log(`🗑️  Arquivo temporário removido: ${filePath}`);
    } catch (error) {
      console.error('Erro ao remover arquivo temporário:', error);
    }
  }

  /**
   * Gravar múltiplas câmeras simultaneamente
   */
  async recordMultipleCameras(recordings) {
    const promises = recordings.map(({ cameraId, userId, duration }) =>
      this.recordFromRTSP(cameraId, userId, duration)
    );

    return await Promise.allSettled(promises);
  }
}

module.exports = new RecordingService();
