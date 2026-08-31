/* ============================================================
   supabase-config.js
   Chaves de conexão com o Supabase (banco de dados + autenticação
   reais do e-Concessões).

   COMO PREENCHER:
   1. Siga o guia SETUP-SUPABASE.md para criar o projeto gratuito.
   2. No painel do Supabase, vá em Project Settings → API.
   3. Copie o "Project URL" e cole em SUPABASE_URL abaixo.
   4. Copie a chave "anon public" e cole em SUPABASE_ANON_KEY abaixo.

   IMPORTANTE — isso é seguro de fazer:
   A chave "anon public" é feita para ficar no código do site, visível
   a qualquer pessoa (é assim que o Supabase foi projetado). Ela NÃO dá
   acesso de escrita a ninguém — quem protege as alterações de verdade
   são as regras de segurança (RLS) criadas pelo supabase-setup.sql,
   que só permitem gravar dados a quem estiver logado no Painel
   Administrativo. NUNCA copie aqui a chave "service_role" — essa sim é
   secreta e nunca deve aparecer em código de site.

   Enquanto os valores abaixo continuarem como estão (SUA_URL_AQUI /
   SUA_CHAVE_AQUI), o site funciona normalmente em modo local: mostra o
   conteúdo padrão e o Painel Administrativo avisa que o backend ainda
   não foi configurado.
   ------------------------------------------------------------ */
const SUPABASE_URL = 'SUA_URL_AQUI';
const SUPABASE_ANON_KEY = 'SUA_CHAVE_AQUI';

const SUPABASE_CONFIGURED = SUPABASE_URL !== 'SUA_URL_AQUI' && SUPABASE_ANON_KEY !== 'SUA_CHAVE_AQUI';
