/* ============================================================
   e-Concessões — data.js
   Conteúdo editável pelo Painel Administrativo (admin.html).

   Este arquivo define os dados PADRÃO do site (DEFAULT_CONTENT).
   Quando um administrador salva alterações em admin.html, elas ficam
   guardadas no navegador dele (localStorage) e passam a valer ali,
   sobrepondo estes dados padrão.

   Para publicar as alterações para TODOS os usuários (já que este é
   um site estático, hospedado no GitHub), use o botão "Baixar data.js
   atualizado" dentro do painel administrativo — ele gera uma nova
   versão deste arquivo já com as alterações, para substituir este
   aqui no repositório antes de publicar.
   ============================================================ */
const CONTENT_STORAGE_KEY = 'econcessoes_admin_content_v1';

const DEFAULT_CONTENT = {
  audiences: {
    clt: {
      benefits: [
        {
          id: 'plano-saude', icon: 'shield', category: 'saude',
          name: 'Plano de Saúde', short: 'Cobertura médica para você e dependentes elegíveis.',
          necessidade: 'Atendimento médico',
          lead: 'Cobertura médica para você e dependentes elegíveis de até 21 anos.',
          comoFunciona: 'Coparticipação de 30% sobre a utilização de atendimentos.',
          accessUrl: 'https://www.bradescoseguros.com.br/clientes/produtos/plano-saude',
          accessLabel: 'ACESSAR CONCESSÃO',
          appBrand: 'bradescoSaude',
          extraLinks: [{ label: 'Ver hospitais e laboratórios', status: 'pending' }],
          helpEmails: [{ label: 'Financeiro', email: 'financeiro@e-safer.com.br' }],
          apoio: true,
        },
        {
          id: 'plano-odonto', icon: 'shield', category: 'saude',
          name: 'Plano Odontológico', short: 'Cobertura odontológica complementar 100% custeada pela empresa.',
          accessUrl: 'https://www.bradescoseguros.com.br/clientes/produtos/plano-dental',
          accessLabel: 'ACESSAR CONCESSÃO',
          appBrand: 'bradescoSeguros',
          helpEmails: [{ label: 'Financeiro', email: 'financeiro@e-safer.com.br' }],
          apoio: false,
        },
        {
          id: 'vale-refeicao', icon: 'gift', category: 'alimentacao',
          name: 'Vale Refeição', short: 'Crédito mensal para refeição disponível no cartão Flash.',
          comoFunciona: 'O crédito é realizado automaticamente no cartão no último dia útil do mês, referente ao mês seguinte. Para novos contratados, o pagamento do valor retroativo é realizado no último dia útil do mês, junto com o crédito referente ao próximo mês.',
          accessUrl: 'https://user.flashapp.com.br/login',
          accessLabel: 'ACESSAR CONCESSÃO',
          appBrand: 'flash',
          helpEmails: [{ label: 'Financeiro', email: 'financeiro@e-safer.com.br' }],
          apoio: false,
        },
        {
          id: 'vale-transporte', icon: 'link', category: 'mobilidade',
          name: 'Vale Transporte', short: 'Auxílio para deslocamento entre casa e trabalho.',
          comoFunciona: 'Desconto de 6% em folha de pagamento. Estagiários não possuem o desconto de 6%.',
          solicitarNote: 'Solicite ao Departamento Pessoal e escolha entre as duas modalidades:',
          compareOptions: [
            { title: 'Cartão de transporte padrão', desc: 'Crédito para uso em bilhetes/cartões de transporte público tradicionais.' },
            { title: 'Cartão Flash', desc: 'Crédito de mobilidade disponibilizado no próprio cartão Flash.' },
          ],
          helpEmails: [{ label: 'Departamento Pessoal', email: 'financeiro@e-safer.com.br' }],
          apoio: false,
        },
        {
          id: 'apoio-psicologico', icon: 'heart', category: 'bemestar',
          name: 'Apoio Psicológico', short: 'Atendimento psicológico e psiquiátrico online.',
          necessidade: 'Apoio psicológico',
          atendimentos: ['Psicologia', 'Psiquiatria', 'Psiquiatria Pediátrica'],
          comoFunciona: 'Atendimento realizado por teleatendimento, disponibilizado por meio do Bradesco pela plataforma Conexa. Suporte disponível 24 horas por dia.',
          accessUrl: 'https://paciente.conexasaude.com.br/',
          accessLabel: 'ACESSAR ATENDIMENTO',
          appBrand: 'conexa',
          crisisBlock: true,
          apoio: true,
        },
        {
          id: 'day-off', icon: 'coffee', category: 'bemestar',
          name: 'Day Off de Aniversário', short: 'Um dia de folga para comemorar o seu aniversário.',
          comoFunciona: 'Válido somente durante o mês do aniversário. A solicitação deve ser previamente alinhada com o gestor da área.',
          apoio: false,
        },
      ],
      documents: [],
    },

    cooperativa: {
      benefits: [
        {
          id: 'apoio-psicologico-coop', icon: 'heart', category: 'bemestar',
          name: 'Apoio Psicológico', short: 'Atendimento psicológico e psiquiátrico online.',
          necessidade: 'Apoio psicológico',
          atendimentos: ['Psicologia', 'Psiquiatria', 'Psiquiatria Pediátrica'],
          comoFunciona: 'Atendimento realizado por teleatendimento, disponibilizado por meio do Bradesco pela plataforma Conexa. Suporte disponível 24 horas por dia.',
          accessUrl: 'https://paciente.conexasaude.com.br/',
          accessLabel: 'ACESSAR ATENDIMENTO',
          appBrand: 'conexa',
          crisisBlock: true,
          apoio: true,
        },
      ],
      documents: [],
    },

    pj: {
      benefits: [
        {
          id: 'apoio-psicologico-pj', icon: 'heart', category: 'bemestar',
          name: 'Apoio Psicológico', short: 'Atendimento psicológico e psiquiátrico online, quando aplicável ao seu contrato.',
          necessidade: 'Apoio psicológico',
          atendimentos: ['Psicologia', 'Psiquiatria', 'Psiquiatria Pediátrica'],
          comoFunciona: 'Atendimento realizado por teleatendimento, disponibilizado por meio do Bradesco pela plataforma Conexa. Suporte disponível 24 horas por dia.',
          accessUrl: 'https://paciente.conexasaude.com.br/',
          accessLabel: 'ACESSAR ATENDIMENTO',
          appBrand: 'conexa',
          crisisBlock: true,
          apoio: true,
        },
      ],
      documents: [],
    },
  },

  /* Eventos personalizados lançados pelo administrador — somam-se aos eventos
     automáticos (remuneração, recarga, feriados), que continuam sendo calculados
     normalmente e não são afetados por este painel. */
  customEvents: {
    clt: [],
    cooperativa: [],
    pj: [],
  },

  /* Avisos/comunicados publicados pelo administrador para aparecer em destaque
     na Home. audience: 'todos' | 'clt' | 'cooperativa' | 'pj'. */
  avisos: [],
};
