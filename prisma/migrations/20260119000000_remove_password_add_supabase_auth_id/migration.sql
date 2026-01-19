-- AlterTable: Remover campo password e adicionar supabaseAuthId
-- Migração para usar APENAS Supabase Auth

-- 1. Adicionar novo campo supabaseAuthId (nullable por enquanto)
ALTER TABLE "usuarios" ADD COLUMN "supabaseAuthId" TEXT;

-- 2. Criar índice único para supabaseAuthId
CREATE UNIQUE INDEX "usuarios_supabaseAuthId_key" ON "usuarios"("supabaseAuthId");

-- 3. Remover campo password (não mais necessário - Supabase gerencia)
ALTER TABLE "usuarios" DROP COLUMN "password";

-- NOTA: 
-- - Usuários existentes terão supabaseAuthId = NULL até próximo login
-- - Novos usuários terão supabaseAuthId preenchido no registro
-- - Password agora é gerenciado APENAS pelo Supabase Auth (auth.users)
