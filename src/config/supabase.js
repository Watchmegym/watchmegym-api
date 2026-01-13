const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'recordings';

// Criar cliente Supabase (Singleton)
let supabase = null;
let storageReady = false;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false, // Não precisa persistir sessão no backend
    },
  });
  
  // Testar conexão e bucket ao iniciar
  testSupabaseStorage();
} else {
  console.log('');
  console.warn('⚠️  Supabase Storage NÃO configurado');
  console.warn('   → Gravações serão salvas localmente (não recomendado para produção)');
  console.warn('   → Configure as variáveis: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_STORAGE_BUCKET');
  console.log('');
}

/**
 * Testa a conexão com Supabase Storage
 */
async function testSupabaseStorage() {
  try {
    console.log('');
    console.log('🔍 Testando Supabase Storage...');
    
    // 1. Verificar se consegue listar buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      throw new Error(`Erro ao conectar: ${bucketsError.message}`);
    }
    
    console.log(`   ✅ Conectado ao Supabase (${buckets.length} buckets encontrados)`);
    
    // 2. Verificar se o bucket target existe
    const targetBucket = buckets.find(b => b.name === bucketName);
    
    if (!targetBucket) {
      console.warn(`   ⚠️  Bucket "${bucketName}" NÃO encontrado`);
      console.warn(`   → Crie o bucket em: ${supabaseUrl.replace('https://', 'https://supabase.com/dashboard/project/').replace('.supabase.co', '')}/storage/buckets`);
      console.log('');
      return;
    }
    
    console.log(`   ✅ Bucket "${bucketName}" encontrado ${targetBucket.public ? '(público)' : '(privado)'}`);
    
    if (!targetBucket.public) {
      console.warn(`   ⚠️  Bucket não é público - URLs podem não funcionar`);
    }
    
    // 3. Testar upload/delete
    const testFileName = `_test/health-check-${Date.now()}.txt`;
    const testContent = `Health check: ${new Date().toISOString()}`;
    
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(testFileName, testContent, {
        contentType: 'text/plain',
        upsert: true,
      });
    
    if (uploadError) {
      throw new Error(`Erro ao fazer upload de teste: ${uploadError.message}`);
    }
    
    console.log(`   ✅ Upload testado com sucesso`);
    
    // Limpar arquivo de teste
    await supabase.storage.from(bucketName).remove([testFileName]);
    
    storageReady = true;
    console.log('   ✅ Supabase Storage totalmente funcional!');
    console.log('');
    
  } catch (error) {
    console.error('   ❌ Erro ao testar Supabase Storage:', error.message);
    console.warn('   → Gravações usarão storage local como fallback');
    console.warn('   → Verifique as credenciais e políticas RLS do bucket');
    console.log('');
  }
}

module.exports = { supabase, storageReady };
