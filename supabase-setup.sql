/* ============================================================
   e-Concessões — supabase-setup.sql
   Execute este script inteiro no SQL Editor do seu projeto Supabase
   (Supabase Dashboard → SQL Editor → New query → colar tudo → Run).

   O que ele faz:
   1. Cria a tabela site_content, que guarda TODO o conteúdo editável
      do site (concessões, documentos, eventos do calendário e avisos)
      em uma única linha, no formato JSON.
   2. Ativa Row Level Security (RLS) e cria duas regras:
        - Leitura: qualquer pessoa pode LER (é o que faz o site
          público funcionar sem exigir login).
        - Escrita: só quem estiver autenticado (logado no Painel
          Administrativo) pode ATUALIZAR o conteúdo.
   3. Cria um espaço de armazenamento (bucket) chamado "documents",
      usado pelo painel para publicar arquivos PDF.
   4. Insere o conteúdo inicial (o mesmo que já está publicado hoje),
      para o site já nascer funcionando.
   ============================================================ */

-- 1. Tabela de conteúdo -----------------------------------------------
create table if not exists site_content (
  id int primary key default 1,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  constraint site_content_single_row check (id = 1)
);

-- 2. Segurança (RLS) ----------------------------------------------------
alter table site_content enable row level security;

drop policy if exists "Leitura pública do conteúdo" on site_content;
create policy "Leitura pública do conteúdo"
  on site_content for select
  using (true);

drop policy if exists "Escrita apenas para administradores logados" on site_content;
create policy "Escrita apenas para administradores logados"
  on site_content for update
  using (auth.role() = 'authenticated');

drop policy if exists "Inserção apenas para administradores logados" on site_content;
create policy "Inserção apenas para administradores logados"
  on site_content for insert
  with check (auth.role() = 'authenticated');

-- Mantém "updated_at" sempre atualizado automaticamente
create or replace function set_site_content_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_site_content_updated_at on site_content;
create trigger trg_site_content_updated_at
  before update on site_content
  for each row execute function set_site_content_updated_at();

-- 3. Armazenamento de documentos (PDFs) ---------------------------------
insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do nothing;

drop policy if exists "Leitura pública de documentos" on storage.objects;
create policy "Leitura pública de documentos"
  on storage.objects for select
  using (bucket_id = 'documents');

drop policy if exists "Upload autenticado de documentos" on storage.objects;
create policy "Upload autenticado de documentos"
  on storage.objects for insert
  with check (bucket_id = 'documents' and auth.role() = 'authenticated');

drop policy if exists "Atualização autenticada de documentos" on storage.objects;
create policy "Atualização autenticada de documentos"
  on storage.objects for update
  using (bucket_id = 'documents' and auth.role() = 'authenticated');

drop policy if exists "Exclusão autenticada de documentos" on storage.objects;
create policy "Exclusão autenticada de documentos"
  on storage.objects for delete
  using (bucket_id = 'documents' and auth.role() = 'authenticated');

-- 4. Conteúdo inicial (seed) --------------------------------------------
-- Mesmo conteúdo que já está no site hoje — assim, assim que a conexão
-- for ativada, nada muda visualmente para quem já usa o e-Concessões.
insert into site_content (id, data)
values (1, '{"audiences":{"clt":{"benefits":[{"id":"plano-saude","icon":"shield","category":"saude","name":"Plano de Saúde","short":"Cobertura médica para você e dependentes elegíveis.","necessidade":"Atendimento médico","lead":"Cobertura médica para você e dependentes elegíveis de até 21 anos.","comoFunciona":"Coparticipação de 30% sobre a utilização de atendimentos.","accessUrl":"https://www.bradescoseguros.com.br/clientes/produtos/plano-saude","accessLabel":"ACESSAR CONCESSÃO","appBrand":"bradescoSaude","extraLinks":[{"label":"Ver hospitais e laboratórios","status":"pending"}],"helpEmails":[{"label":"Financeiro","email":"financeiro@e-safer.com.br"}],"apoio":true},{"id":"plano-odonto","icon":"shield","category":"saude","name":"Plano Odontológico","short":"Cobertura odontológica complementar 100% custeada pela empresa.","accessUrl":"https://www.bradescoseguros.com.br/clientes/produtos/plano-dental","accessLabel":"ACESSAR CONCESSÃO","appBrand":"bradescoSeguros","helpEmails":[{"label":"Financeiro","email":"financeiro@e-safer.com.br"}],"apoio":false},{"id":"vale-refeicao","icon":"gift","category":"alimentacao","name":"Vale Refeição","short":"Crédito mensal para refeição disponível no cartão Flash.","comoFunciona":"O crédito é realizado automaticamente no cartão no último dia útil do mês, referente ao mês seguinte. Para novos contratados, o pagamento do valor retroativo é realizado no último dia útil do mês, junto com o crédito referente ao próximo mês.","accessUrl":"https://user.flashapp.com.br/login","accessLabel":"ACESSAR CONCESSÃO","appBrand":"flash","helpEmails":[{"label":"Financeiro","email":"financeiro@e-safer.com.br"}],"apoio":false},{"id":"vale-transporte","icon":"link","category":"mobilidade","name":"Vale Transporte","short":"Auxílio para deslocamento entre casa e trabalho.","comoFunciona":"Desconto de 6% em folha de pagamento. Estagiários não possuem o desconto de 6%.","solicitarNote":"Solicite ao Departamento Pessoal e escolha entre as duas modalidades:","compareOptions":[{"title":"Cartão de transporte padrão","desc":"Crédito para uso em bilhetes/cartões de transporte público tradicionais."},{"title":"Cartão Flash","desc":"Crédito de mobilidade disponibilizado no próprio cartão Flash."}],"helpEmails":[{"label":"Departamento Pessoal","email":"financeiro@e-safer.com.br"}],"apoio":false},{"id":"apoio-psicologico","icon":"heart","category":"bemestar","name":"Apoio Psicológico","short":"Atendimento psicológico e psiquiátrico online.","necessidade":"Apoio psicológico","atendimentos":["Psicologia","Psiquiatria","Psiquiatria Pediátrica"],"comoFunciona":"Atendimento realizado por teleatendimento, disponibilizado por meio do Bradesco pela plataforma Conexa. Suporte disponível 24 horas por dia.","accessUrl":"https://paciente.conexasaude.com.br/","accessLabel":"ACESSAR ATENDIMENTO","appBrand":"conexa","crisisBlock":true,"apoio":true},{"id":"day-off","icon":"coffee","category":"bemestar","name":"Day Off de Aniversário","short":"Um dia de folga para comemorar o seu aniversário.","comoFunciona":"Válido somente durante o mês do aniversário. A solicitação deve ser previamente alinhada com o gestor da área.","apoio":false}],"documents":[]},"cooperativa":{"benefits":[{"id":"apoio-psicologico-coop","icon":"heart","category":"bemestar","name":"Apoio Psicológico","short":"Atendimento psicológico e psiquiátrico online.","necessidade":"Apoio psicológico","atendimentos":["Psicologia","Psiquiatria","Psiquiatria Pediátrica"],"comoFunciona":"Atendimento realizado por teleatendimento, disponibilizado por meio do Bradesco pela plataforma Conexa. Suporte disponível 24 horas por dia.","accessUrl":"https://paciente.conexasaude.com.br/","accessLabel":"ACESSAR ATENDIMENTO","appBrand":"conexa","crisisBlock":true,"apoio":true}],"documents":[]},"pj":{"benefits":[{"id":"apoio-psicologico-pj","icon":"heart","category":"bemestar","name":"Apoio Psicológico","short":"Atendimento psicológico e psiquiátrico online, quando aplicável ao seu contrato.","necessidade":"Apoio psicológico","atendimentos":["Psicologia","Psiquiatria","Psiquiatria Pediátrica"],"comoFunciona":"Atendimento realizado por teleatendimento, disponibilizado por meio do Bradesco pela plataforma Conexa. Suporte disponível 24 horas por dia.","accessUrl":"https://paciente.conexasaude.com.br/","accessLabel":"ACESSAR ATENDIMENTO","appBrand":"conexa","crisisBlock":true,"apoio":true}],"documents":[]}},"customEvents":{"clt":[],"cooperativa":[],"pj":[]},"avisos":[]}'::jsonb)
on conflict (id) do update set data = excluded.data;
