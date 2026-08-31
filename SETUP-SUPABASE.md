# Configurar o backend do Painel Administrativo (Supabase)

Este guia mostra como ativar a proteção de verdade do Painel Administrativo do e-Concessões. Depois desses passos, o login vai exigir um usuário e senha reais (não mais um usuário fixo escrito no código), e todas as alterações feitas no painel passam a valer para todos os usuários do site automaticamente, sem precisar publicar nada manualmente.

Leva cerca de 15 minutos e não exige conhecimento técnico — é só seguir os passos na ordem. Tudo isso é **gratuito** para o volume de uso do e-Concessões.

## 1. Criar a conta e o projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e clique em **Start your project**. Crie uma conta (pode ser com o e-mail da empresa ou login do GitHub).
2. Clique em **New project**.
3. Escolha um nome (ex.: `e-concessoes`), crie uma senha forte para o banco de dados (guarde essa senha em um lugar seguro — ela não é a mesma senha do painel administrativo) e escolha uma região próxima do Brasil (ex.: São Paulo, se disponível, ou a mais próxima).
4. Clique em **Create new project** e aguarde alguns minutos até o projeto ficar pronto.

## 2. Rodar o script que cria o banco de dados

1. No menu lateral do projeto, clique em **SQL Editor**.
2. Clique em **New query**.
3. Abra o arquivo **`supabase-setup.sql`** (está junto com os arquivos do site) em qualquer editor de texto, copie todo o conteúdo e cole nessa área do Supabase.
4. Clique em **Run** (ou aperte Ctrl+Enter).
5. Deve aparecer uma mensagem de sucesso. Esse script cria a tabela que guarda o conteúdo do site, as regras de segurança (só quem estiver logado pode alterar; qualquer pessoa pode ler) e o espaço para os documentos PDF — além de já publicar o conteúdo que está no site hoje, para nada mudar visualmente.

## 3. Criar o usuário administrador

1. No menu lateral, clique em **Authentication** → **Users**.
2. Clique em **Add user** → **Create new user**.
3. Preencha um e-mail (ex.: `admin@e-safer.com.br` — pode ser o e-mail de quem vai administrar o site) e uma senha forte.
4. Marque a opção **Auto Confirm User** (ou equivalente, para não depender de confirmação por e-mail) e clique em **Create user**.
5. Repita esse passo para cada pessoa que deve ter acesso ao painel administrativo.

Guarde o e-mail e a senha criados aqui — são eles que vão ser usados para entrar em `admin.html`.

## 4. Conectar o site ao seu projeto Supabase

1. No menu lateral do Supabase, clique em **Project Settings** (ícone de engrenagem) → **API**.
2. Copie o valor de **Project URL**.
3. Copie o valor de **anon public** (na seção "Project API keys").
4. Abra o arquivo **`supabase-config.js`** (junto com os arquivos do site) em um editor de texto e substitua:
   - `SUA_URL_AQUI` pelo Project URL copiado.
   - `SUA_CHAVE_AQUI` pela chave anon public copiada.
5. Salve o arquivo.

> **Essas duas informações não são secretas** — a chave "anon public" foi projetada pelo Supabase para ficar visível no código do site. Quem protege as alterações de verdade são as regras de segurança criadas no passo 2, que só permitem gravar dados a quem estiver logado. **Nunca** copie a chave chamada "service_role" para este arquivo — essa sim é secreta.

## 5. Publicar

Publique o site normalmente (ex.: enviando os arquivos atualizados para o GitHub, incluindo o `supabase-config.js` já preenchido). Pronto:

- O site público (`index.html`) passa a buscar o conteúdo do banco de dados a cada visita.
- O painel (`admin.html`) passa a exigir login com o e-mail e senha criados no passo 3.
- Qualquer alteração salva no painel aparece para todos os usuários automaticamente.

## Testando localmente antes de publicar

Se quiser conferir que tudo está funcionando antes de publicar, abra o `admin.html` diretamente no navegador (duplo clique no arquivo) e tente fazer login com o usuário criado no passo 3. Se entrar corretamente no painel, está tudo certo.

## Problemas comuns

- **"Backend não configurado" ao abrir o admin.html**: o `supabase-config.js` ainda está com os valores de exemplo — revise o passo 4.
- **E-mail ou senha incorretos**: confira se o usuário foi criado corretamente no passo 3 e se a opção "Auto Confirm User" foi marcada.
- **O site não mostra o conteúdo atualizado**: confira se o script do passo 2 rodou sem erros, e se o `supabase-config.js` foi salvo com os valores corretos antes de publicar.
- **Quiser adicionar ou remover um administrador depois**: volte em Authentication → Users no Supabase e crie ou remova o usuário — não é preciso mexer em nenhum arquivo do site.
