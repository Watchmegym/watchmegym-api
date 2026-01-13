/**
 * Script para verificar se o Supabase Storage está configurado corretamente
 * 
 * Como usar:
 *   node scripts/check-supabase-config.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

console.log('🔍 Verificando configuração do Supabase Storage...\n');

// 1. Verificar variáveis de ambiente
console.log('📋 Variáveis de Ambiente:');
console.log('─────────────────────────────────────────');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'recordings';

console.log(`SUPABASE_URL: ${supabaseUrl ? '✅ Configurado' : '❌ Não encontrado'}`);
if (supabaseUrl) {
  console.log(`  → ${supabaseUrl}`);
}

console.log(`SUPABASE_SERVICE_ROLE_KEY: ${supabaseKey ? '✅ Configurado' : '❌ Não encontrado'}`);
if (supabaseKey) {
  console.log(`  → ${supabaseKey.substring(0, 20)}...${supabaseKey.substring(supabaseKey.length - 10)}`);
}

console.log(`SUPABASE_STORAGE_BUCKET: ${bucketName}`);
console.log('');

// 2. Verificar conexão
if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Configure as variáveis no arquivo .env:');
  console.log('');
  console.log('SUPABASE_URL=https://pswjybzvotuftydrdnql.supabase.co');
  console.log('SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key');
  console.log('SUPABASE_STORAGE_BUCKET=recordings');
  console.log('');
  console.log('📖 Ver guia: CONFIGURE_SUPABASE.md');
  process.exit(1);
}

console.log('🔌 Testando conexão com Supabase...');
console.log('─────────────────────────────────────────');

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});

// 3. Verificar se o bucket existe
(async () => {
  try {
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

    if (bucketsError) {
      console.log('❌ Erro ao conectar:', bucketsError.message);
      console.log('');
      console.log('💡 Verifique:');
      console.log('  1. SUPABASE_URL está correto');
      console.log('  2. SUPABASE_SERVICE_ROLE_KEY está correto (não use anon key)');
      process.exit(1);
    }

    console.log(`✅ Conectado ao Supabase!`);
    console.log(`📦 Buckets encontrados: ${buckets.length}`);
    console.log('');

    // Listar buckets
    console.log('📦 Lista de Buckets:');
    console.log('─────────────────────────────────────────');
    buckets.forEach((bucket) => {
      const isTarget = bucket.name === bucketName;
      console.log(`${isTarget ? '✅' : '  '} ${bucket.name} ${bucket.public ? '(público)' : '(privado)'}`);
    });
    console.log('');

    // Verificar se o bucket target existe
    const targetBucket = buckets.find((b) => b.name === bucketName);

    if (!targetBucket) {
      console.log(`❌ Bucket "${bucketName}" não encontrado!`);
      console.log('');
      console.log('📝 Crie o bucket:');
      console.log(`  1. Acesse: ${supabaseUrl.replace('.supabase.co', '')}/storage/buckets`);
      console.log(`  2. Clique em "New bucket"`);
      console.log(`  3. Nome: ${bucketName}`);
      console.log(`  4. Marque como: Público ✅`);
      console.log('');
      console.log('📖 Ver guia completo: CONFIGURE_SUPABASE.md');
      process.exit(1);
    }

    if (!targetBucket.public) {
      console.log(`⚠️  Bucket "${bucketName}" existe mas NÃO é público`);
      console.log('');
      console.log('💡 Para URLs públicas funcionarem, marque o bucket como público no dashboard');
      console.log('');
    }

    // 4. Testar upload (opcional)
    console.log('🧪 Testando upload...');
    console.log('─────────────────────────────────────────');

    const testFileName = `test-${Date.now()}.txt`;
    const testContent = `Teste de upload - ${new Date().toISOString()}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(`test/${testFileName}`, testContent, {
        contentType: 'text/plain',
      });

    if (uploadError) {
      console.log('❌ Erro ao fazer upload:', uploadError.message);
      console.log('');
      console.log('💡 Possíveis causas:');
      console.log('  1. Bucket não tem políticas RLS configuradas');
      console.log('  2. Use Service Role Key (não anon key)');
      console.log('');
      console.log('📖 Ver guia: CONFIGURE_SUPABASE.md (Passo 1.3)');
      process.exit(1);
    }

    console.log('✅ Upload bem-sucedido!');
    console.log(`  → Arquivo: test/${testFileName}`);

    // Pegar URL pública
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(`test/${testFileName}`);

    console.log(`  → URL: ${publicUrlData.publicUrl}`);
    console.log('');

    // Limpar arquivo de teste
    await supabase.storage.from(bucketName).remove([`test/${testFileName}`]);

    // 5. Resultado final
    console.log('═════════════════════════════════════════');
    console.log('✅ CONFIGURAÇÃO COMPLETA!');
    console.log('═════════════════════════════════════════');
    console.log('');
    console.log('🎉 O Supabase Storage está funcionando perfeitamente!');
    console.log('');
    console.log('🚀 Próximos passos:');
    console.log('  1. Reinicie o servidor: npm run dev');
    console.log('  2. Faça uma gravação de teste');
    console.log('  3. Verifique o arquivo no dashboard do Supabase');
    console.log('');
    console.log(`📊 Dashboard: ${supabaseUrl.replace('https://', 'https://supabase.com/dashboard/project/')}/storage/buckets/${bucketName}`);

  } catch (error) {
    console.log('❌ Erro inesperado:', error.message);
    console.log('');
    console.log('📞 Contate o suporte ou verifique a documentação');
    process.exit(1);
  }
})();
