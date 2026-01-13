const RecordingService = require('../services/RecordingService');

class RecordingController {
  /**
   * Iniciar gravação de uma câmera
   * POST /api/recordings/start
   */
  async startRecording(req, res) {
    try {
      const { cameraId, userId, duration } = req.body;

      // Iniciar gravação (processo assíncrono)
      const record = await RecordingService.recordFromRTSP(cameraId, userId, duration);

      return res.status(201).json({
        message: 'Gravação concluída com sucesso',
        record
      });
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
      return res.status(400).json({
        error: error.message || 'Erro ao iniciar gravação'
      });
    }
  }

  /**
   * Iniciar gravação de múltiplas câmeras
   * POST /api/recordings/start-multiple
   */
  async startMultipleRecordings(req, res) {
    try {
      const { recordings } = req.body;

      const results = await RecordingService.recordMultipleCameras(recordings);

      const successful = results.filter(r => r.status === 'fulfilled');
      const failed = results.filter(r => r.status === 'rejected');

      return res.status(201).json({
        message: `${successful.length} gravação(ões) concluída(s), ${failed.length} falha(s)`,
        successful: successful.map(r => r.value),
        failed: failed.map(r => ({ error: r.reason.message }))
      });
    } catch (error) {
      console.error('Erro ao iniciar gravações:', error);
      return res.status(400).json({
        error: error.message || 'Erro ao iniciar gravações'
      });
    }
  }

  /**
   * Status de gravação (para implementar sistema de filas)
   * GET /api/recordings/status/:recordId
   */
  async getRecordingStatus(req, res) {
    try {
      const { recordId } = req.params;

      // TODO: Implementar sistema de filas (Bull, BullMQ, etc.)
      // Por enquanto, retorna o registro
      const RecordRepository = require('../repositories/RecordRepository');
      const record = await RecordRepository.findById(recordId);

      if (!record) {
        return res.status(404).json({
          error: 'Gravação não encontrada'
        });
      }

      return res.status(200).json({
        message: 'Status da gravação',
        record,
        status: 'completed' // Pode ser: pending, processing, completed, failed
      });
    } catch (error) {
      console.error('Erro ao buscar status:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }
}

module.exports = new RecordingController();
