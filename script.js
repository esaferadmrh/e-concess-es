/* ============================================================
   e-Concessões — script.js
   Plataforma digital da e-Safer.
   JavaScript puro, sem dependências externas.

   RODADA 3 — conteúdo real substituindo dados demonstrativos.
   Onde uma informação oficial (valor, regra, link interno) ainda
   não foi confirmada, o campo é deixado como "pendente" em vez de
   inventado — ver benefitsPendingNote, extraLinks[].status
   'pending' e accessStatus 'pending'.
   ============================================================ */
const ICONS = {
  home: '<path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v9a1 1 0 0 0 1 1h4v-6h2v6h4a1 1 0 0 0 1-1v-9"/>',
  calendar: '<rect x="3.5" y="5.5" width="17" height="15" rx="2.5"/><path d="M8 3.5v4M16 3.5v4M3.5 10.5h17"/>',
  gift: '<rect x="4" y="10" width="16" height="10" rx="1.5"/><path d="M4 10h16v3H4z"/><path d="M12 10v10M12 10c-1.8 0-4-1.2-4-3.4A2.6 2.6 0 0 1 10.6 4c1.9 0 2.9 2.1 3.4 4.2M12 10c1.8 0 4-1.2 4-3.4A2.6 2.6 0 0 0 13.4 4c-1.9 0-2.9 2.1-3.4 4.2"/>',
  book: '<path d="M4 5.2C4 4.5 4.6 4 5.3 4H11v16H5.3c-.7 0-1.3-.5-1.3-1.2z"/><path d="M20 5.2c0-.7-.6-1.2-1.3-1.2H13v16h5.7c.7 0 1.3-.5 1.3-1.2z"/>',
  file: '<path d="M7 3.5h7L19 8v12.5a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1z"/><path d="M14 3.5V8h5"/><path d="M9 13h6M9 16.5h6"/>',
  link: '<path d="M10 14a5 5 0 0 0 7.1.3l2-2a5 5 0 0 0-7-7l-1.1 1.1"/><path d="M14 10a5 5 0 0 0-7.1-.3l-2 2a5 5 0 0 0 7 7l1.1-1.1"/>',
  heart: '<path d="M12 20.2s-7.5-4.6-9.6-9.3C1 7.6 2.7 4.4 6 4c2.1-.3 3.8.8 6 3 2.2-2.2 3.9-3.3 6-3 3.3.4 5 3.6 3.6 6.9C19.5 15.6 12 20.2 12 20.2z"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.6-4.6"/>',
  chevronLeft: '<path d="M14.5 5 8 12l6.5 7"/>',
  chevronRight: '<path d="M9.5 5 16 12l-6.5 7"/>',
  chevronDown: '<path d="M5 8.5 12 15l7-6.5"/>',
  close: '<path d="M5 5l14 14M19 5 5 19"/>',
  check: '<path d="M4.5 12.5l5 5L19.5 7"/>',
  clock: '<circle cx="12" cy="12" r="8.2"/><path d="M12 7.5V12l3 2.2"/>',
  arrowRight: '<path d="M4 12h15.5"/><path d="M13.5 5.5 20 12l-6.5 6.5"/>',
  users: '<circle cx="8.5" cy="8" r="3"/><path d="M2.5 19c0-3 2.7-5.3 6-5.3s6 2.3 6 5.3"/><circle cx="17" cy="9" r="2.4"/><path d="M15.3 13.6c2.3.2 4.2 2.2 4.2 4.7"/>',
  shield: '<path d="M12 3.5 19 6v6c0 4.5-3 7.5-7 8.5-4-1-7-4-7-8.5V6z"/><path d="M9 12l2.2 2.2L15.5 9.7"/>',
  pause: '<rect x="6" y="4.5" width="4" height="15" rx="1"/><rect x="14" y="4.5" width="4" height="15" rx="1"/>',
  play: '<path d="M7 4.5v15l13-7.5z"/>',
  walk: '<circle cx="14" cy="4.5" r="1.8"/><path d="M12 8l-1.5 5 2 2 .5 5.5M12 8l4 1.5-1 4M10.5 13 7 15.5"/>',
  brain: '<path d="M9 4.5a3 3 0 0 0-3 3v1a2.6 2.6 0 0 0-1 4.7 2.8 2.8 0 0 0 1.6 4.6A3 3 0 0 0 9 20.5"/><path d="M15 4.5a3 3 0 0 1 3 3v1a2.6 2.6 0 0 1 1 4.7 2.8 2.8 0 0 1-1.6 4.6 3 3 0 0 1-2.4 2.7"/><path d="M9 4.5v16M15 4.5v16"/>',
  support: '<path d="M4 13a8 8 0 0 1 16 0"/><path d="M4 13v3a2 2 0 0 0 2 2h1v-6H5a1 1 0 0 0-1 1z"/><path d="M20 13v3a2 2 0 0 1-2 2h-1v-6h1a1 1 0 0 1 2 1z"/><path d="M12 18v1a2 2 0 0 1-2 2"/>',
  compass: '<circle cx="12" cy="12" r="8.5"/><path d="M15 9l-2 5-5 2 2-5z"/>',
  document: '<path d="M6 4h9l4 4v12.5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/><path d="M14 4v4.5h4.5"/>',
  bell: '<path d="M6 10.5a6 6 0 0 1 12 0v3.2l1.6 2.6H4.4L6 13.7z"/><path d="M10 19a2 2 0 0 0 4 0"/>',
  coffee: '<path d="M5 8.5h11v6a4.5 4.5 0 0 1-4.5 4.5H9.5A4.5 4.5 0 0 1 5 14.5z"/><path d="M16 10h1.5a2.3 2.3 0 0 1 0 4.6H16"/><path d="M8 5.2c0 .8-.8.9-.8 1.7M11.3 5.2c0 .8-.8.9-.8 1.7"/>',
  target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r=".6" fill="currentColor"/>',
  swap: '<path d="M4 8h13"/><path d="M13.5 4 17 8l-3.5 4"/><path d="M20 16H7"/><path d="M10.5 12 7 16l3.5 4"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5"/><circle cx="12" cy="8" r=".7" fill="currentColor"/>',
  phone: '<path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A16 16 0 0 1 5 5.1 1.5 1.5 0 0 1 6.5 3.5z"/>',
};
function icon(name, extraClass) {
  return `<svg class="icon ${extraClass || ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;
}

/* ------------------------------------------------------------
   1. FERIADOS E CÁLCULO DE DIAS ÚTEIS
   Fonte: calendário oficial de feriados nacionais 2026 (Portaria
   MGI nº 11.460/2025), feriado estadual de SP (Revolução
   Constitucionalista, 09/07) e feriados municipais de Barueri
   (Decreto Municipal nº 10.264/2025). Consulte sempre o calendário
   oficial vigente da e-Safer para confirmação.
   ------------------------------------------------------------ */
const HOLIDAYS_2026 = [
  { date: '2026-01-01', name: 'Confraternização Universal', scope: 'Nacional' },
  { date: '2026-02-16', name: 'Carnaval', scope: 'Ponto facultativo' },
  { date: '2026-02-17', name: 'Carnaval', scope: 'Ponto facultativo' },
  { date: '2026-04-03', name: 'Paixão de Cristo', scope: 'Nacional' },
  { date: '2026-04-21', name: 'Tiradentes', scope: 'Nacional' },
  { date: '2026-05-01', name: 'Dia Mundial do Trabalho', scope: 'Nacional' },
  { date: '2026-06-04', name: 'Corpus Christi', scope: 'Municipal · Barueri' },
  { date: '2026-06-24', name: 'São João Batista', scope: 'Municipal · Barueri' },
  { date: '2026-07-09', name: 'Revolução Constitucionalista', scope: 'Estadual · SP' },
  { date: '2026-09-07', name: 'Independência do Brasil', scope: 'Nacional' },
  { date: '2026-10-12', name: 'Nossa Senhora Aparecida', scope: 'Nacional' },
  { date: '2026-11-02', name: 'Finados', scope: 'Nacional' },
  { date: '2026-11-15', name: 'Proclamação da República', scope: 'Nacional' },
  { date: '2026-11-20', name: 'Dia Nacional de Zumbi e da Consciência Negra', scope: 'Nacional' },
  { date: '2026-12-25', name: 'Natal', scope: 'Nacional' },
];
function pad2(n) { return String(n).padStart(2, '0'); }
function toISODate(d) { return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; }
function holidayOn(d) { return HOLIDAYS_2026.find(h => h.date === toISODate(d)) || null; }
function isBusinessDay(d) {
  const dow = d.getDay();
  if (dow === 0 || dow === 6) return false;
  if (holidayOn(d)) return false;
  return true;
}
/* n-ésimo dia útil do mês (1-indexado). Se o mês não tiver dias úteis
   suficientes (não deveria acontecer), retorna o último dia do mês. */
function nthBusinessDay(year, month, n) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let count = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    if (isBusinessDay(d)) {
      count++;
      if (count === n) return d;
    }
  }
  return new Date(year, month, daysInMonth);
}
function lastBusinessDay(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = daysInMonth; day >= 1; day--) {
    const d = new Date(year, month, day);
    if (isBusinessDay(d)) return d;
  }
  return new Date(year, month, daysInMonth);
}
/* ------------------------------------------------------------
   2. DADOS POR VÍNCULO
   ------------------------------------------------------------ */
const CATEGORY_LABELS = {
  saude: 'Saúde', bemestar: 'Bem-estar', alimentacao: 'Alimentação',
  mobilidade: 'Mobilidade', financeiro: 'Financeiro', desenvolvimento: 'Desenvolvimento',
  familia: 'Família', outros: 'Outros'
};

const BRADESCO_SAUDE_APPS = [
  { platform: 'Android', url: 'https://play.google.com/store/apps/details?id=br.com.bradseg.segurobradescosaude&hl=pt_BR' },
  { platform: 'iOS', url: 'https://apps.apple.com/br/app/bradesco-sa%C3%BAde/id432088616' },
];
const BRADESCO_SEGUROS_APPS = [
  { platform: 'Android', url: 'https://play.google.com/store/apps/details?id=br.com.bradseg.bscelular&hl=pt_BR' },
  { platform: 'iOS', url: 'https://apps.apple.com/br/app/bradesco-seguros/id1256508403' },
];
const FLASH_APPS = [
  { platform: 'Android', url: 'https://play.google.com/store/apps/details?id=br.com.flashapp' },
  { platform: 'iOS', url: 'https://apps.apple.com/br/app/flash-benef%C3%ADcios-e-despesas/id1460842290' },
];
const CONEXA_APPS = [
  { platform: 'Android', url: 'https://play.google.com/store/apps/details?id=br.com.conexasaude&hl=pt_BR' },
  { platform: 'iOS', url: 'https://apps.apple.com/br/app/conexa-sa%C3%BAde/id1476749720' },
];

/* Marcas de aplicativos — ícone oficial (quando o arquivo estiver disponível em assets/icons/)
   + nome + links de download. Se o arquivo de imagem ainda não existir, o ícone some
   silenciosamente (onerror) em vez de usar um ícone genérico no lugar da marca real. */
const APP_BRANDS = {
  bradescoSaude: { name: 'Bradesco Saúde', asset: 'assets/icons/bradesco-saude.png', links: BRADESCO_SAUDE_APPS },
  bradescoSeguros: { name: 'Bradesco Seguros', asset: 'assets/icons/bradesco-seguros.png', links: BRADESCO_SEGUROS_APPS },
  flash: { name: 'Flash', asset: 'assets/icons/flash.png', links: FLASH_APPS },
  conexa: { name: 'Conexa', asset: 'assets/icons/conexa.png', links: CONEXA_APPS },
};

/* ------------------------------------------------------------
   1b. CONTEÚDO EDITÁVEL (Painel Administrativo)
   Carrega os dados padrão de data.js (DEFAULT_CONTENT) e, se o
   administrador já tiver salvo alterações neste navegador
   (admin.html), sobrepõe com o que estiver em localStorage.
   ------------------------------------------------------------ */
/* Clona o conteúdo padrão em vez de usá-lo diretamente, para nunca alterar
   o objeto original DEFAULT_CONTENT (definido em data.js) em memória. */
let CONTENT = JSON.parse(JSON.stringify(DEFAULT_CONTENT));

/* Cliente do Supabase (banco de dados + autenticação reais). Se
   supabase-config.js ainda estiver com os valores de exemplo (ou o
   script do Supabase não carregar, por exemplo sem internet), o site
   simplesmente continua funcionando com o conteúdo padrão abaixo —
   nunca quebra por falta de conexão. */
let sbClient = null;
if (typeof SUPABASE_CONFIGURED !== 'undefined' && SUPABASE_CONFIGURED && typeof supabase !== 'undefined') {
  try { sbClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY); }
  catch (e) { console.warn('Não foi possível conectar ao Supabase, usando conteúdo padrão local.', e); }
} else {
  console.info('e-Concessões: backend não configurado (veja SETUP-SUPABASE.md). Usando conteúdo padrão local.');
}

async function fetchRemoteContent() {
  if (!sbClient) return null;
  try {
    const { data, error } = await sbClient.from('site_content').select('data').eq('id', 1).single();
    if (error || !data) return null;
    return data.data;
  } catch (e) {
    console.warn('Não foi possível buscar o conteúdo do Supabase, usando conteúdo padrão local.', e);
    return null;
  }
}

/* Substitui o conteúdo em uso SEM trocar os objetos que o resto do
   site já referencia (audiences.clt.benefits etc.) — apenas atualiza
   o conteúdo desses arrays, para que toda a lógica de renderização já
   existente continue funcionando sem alterações. */
function applyFetchedContent(newContent) {
  CONTENT = newContent;
  ['clt', 'cooperativa', 'pj'].forEach(key => {
    const aud = newContent.audiences?.[key];
    if (!aud) return;
    audiences[key].benefits.length = 0;
    audiences[key].benefits.push(...(aud.benefits || []));
    audiences[key].documents.length = 0;
    audiences[key].documents.push(...(aud.documents || []));
  });
  if (newContent.development) Object.assign(development, newContent.development);
}

/* Dispara a busca do conteúdo em segundo plano assim que o script
   carrega — sem bloquear a tela inicial. enterApp() aguarda esta
   promessa antes de renderizar, então o conteúdo já chega atualizado
   quando a pessoa escolhe o vínculo e acessa o site. */
const contentReady = (async () => {
  const remote = await fetchRemoteContent();
  if (remote) applyFetchedContent(remote);
})();

/* Avisa (sem interromper nada) quando outro administrador publica uma
   alteração enquanto alguém está com o site aberto. */
function subscribeRemoteContentUpdates() {
  if (!sbClient) return;
  sbClient
    .channel('site_content_changes')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'site_content' }, () => {
      showToast('O conteúdo foi atualizado. Atualize a página para ver as novidades.');
    })
    .subscribe();
}

const audiences = {
  clt: {
    key: 'clt',
    label: 'CLT, Jovem Aprendiz ou Estágio',
    shortLabel: 'CLT',
    benefits: CONTENT.audiences.clt.benefits,
    documents: CONTENT.audiences.clt.documents,
    calendarGenerators: [
      { rule: 'nth', n: 5, category: 'remuneracao', title: 'Remuneração', description: 'Previsão de pagamento da remuneração, no 5º dia útil do mês.', action: null },
      { rule: 'last', category: 'beneficios', title: 'Recarga das Concessões', description: 'Recarga do saldo de Vale Refeição no cartão Flash, no último dia útil do mês, referente ao mês seguinte.', action: { label: 'Entender como funciona', target: 'benefit', ref: 'vale-refeicao' } },
    ],
  },

  cooperativa: {
    key: 'cooperativa',
    label: 'Cooperativa',
    shortLabel: 'Cooperativa',
    benefits: CONTENT.audiences.cooperativa.benefits,
    benefitsPendingNote: 'As demais concessões específicas para Cooperativa serão publicadas aqui assim que definidas.',
    documents: CONTENT.audiences.cooperativa.documents,
    calendarGenerators: [
      { rule: 'nth', n: 15, category: 'remuneracao', title: 'Remuneração', description: 'Previsão de pagamento da remuneração, no 15º dia útil do mês.', action: null },
      { rule: 'nth', n: 15, category: 'beneficios', title: 'Ajuda de custo para plano de saúde', description: 'Previsão de ajuda de custo para plano de saúde, no 15º dia útil do mês.', action: null },
      { rule: 'last', category: 'beneficios', title: 'Ajudas de custo adicionais', description: 'Previsão de ajudas de custo adicionais, no último dia útil do mês.', action: null },
    ],
  },

  pj: {
    key: 'pj',
    label: 'PJ',
    shortLabel: 'PJ',
    benefits: CONTENT.audiences.pj.benefits,
    benefitsPendingNote: 'As demais concessões específicas para PJ serão publicadas aqui assim que definidas.',
    documents: CONTENT.audiences.pj.documents,
    calendarGenerators: [
      { rule: 'nth', n: 15, category: 'remuneracao', title: 'Remuneração', description: 'Previsão de pagamento da remuneração, no 15º dia útil do mês.', action: null },
      { rule: 'nth', n: 15, category: 'beneficios', title: 'Ajuda de custo para plano de saúde', description: 'Previsão de ajuda de custo para plano de saúde, no 15º dia útil do mês.', action: null },
      { rule: 'last', category: 'beneficios', title: 'Ajudas de custo adicionais', description: 'Previsão de ajudas de custo adicionais, no último dia útil do mês.', action: null },
    ],
  },
};

/* Desenvolvimento — estrutura comum a todos os vínculos (Certificações,
   Treinamentos, e-Move e e-News). Vem do conteúdo editável (data.js /
   Supabase, veja CONTENT acima) para que o Painel Administrativo consiga
   substituir os PDFs/URLs pendentes e editar as demais informações. Mantém
   a mesma referência de objeto (nunca é reatribuída) para que todo o
   restante do código, que lê "development.xxx" diretamente, continue
   funcionando sem alterações mesmo depois que applyFetchedContent()
   atualizar o conteúdo em segundo plano. */
const development = CONTENT.development;

/* Acessos rápidos — protagonismo para a NECESSIDADE, plataforma em segundo plano ("via Serviço"). */
const accessByAudience = {
  clt: [
    { necessidade: 'SOLICITAR REEMBOLSO', servico: 'VExpenses', desc: 'Envie e acompanhe suas solicitações de reembolso.', accessUrl: 'https://app.vexpenses.com/login', accessStatus: 'ready', cta: 'ACESSAR' },
    { necessidade: 'SOLICITAR FÉRIAS OU AFASTAMENTO', servico: 'Factorial', desc: 'Solicite férias, ausências ou afastamentos.', accessUrl: 'https://factorialhr.com/', accessStatus: 'ready', cta: 'ACESSAR' },
    { necessidade: 'ASSINAR DOCUMENTOS', servico: 'D4Sign', desc: 'Acesse documentos enviados para assinatura eletrônica.', accessUrl: 'https://d4sign.com.br/', accessStatus: 'ready', cta: 'ACESSAR' },
    { necessidade: 'UTILIZAR VEÍCULO', servico: 'Uber', desc: 'Acesse as informações e recursos relacionados aos deslocamentos autorizados.', accessUrl: 'https://www.uber.com/br/pt-br/', accessStatus: 'ready', cta: 'ACESSAR' },
  ],
  cooperativa: [
    { necessidade: 'SOLICITAR REEMBOLSO', servico: 'VExpenses', desc: 'Envie e acompanhe suas solicitações de reembolso.', accessUrl: 'https://app.vexpenses.com/login', accessStatus: 'ready', cta: 'ACESSAR' },
    { necessidade: 'SOLICITAR AFASTAMENTO', servico: 'Factorial', desc: 'Solicite ausências ou afastamentos.', accessUrl: 'https://factorialhr.com/', accessStatus: 'ready', cta: 'ACESSAR' },
    { necessidade: 'ASSINAR DOCUMENTOS', servico: 'D4Sign', desc: 'Acesse documentos enviados para assinatura eletrônica.', accessUrl: 'https://d4sign.com.br/', accessStatus: 'ready', cta: 'ACESSAR' },
    { necessidade: 'UTILIZAR VEÍCULO', servico: 'Uber', desc: 'Acesse as informações e recursos relacionados aos deslocamentos autorizados.', accessUrl: 'https://www.uber.com/br/pt-br/', accessStatus: 'ready', cta: 'ACESSAR' },
  ],
  pj: [
    { necessidade: 'ACOMPANHAR DESPESAS', servico: 'VExpenses', desc: 'Acompanhamento de despesas relacionadas a projetos.', accessUrl: 'https://app.vexpenses.com/login', accessStatus: 'ready', cta: 'ACESSAR' },
    { necessidade: 'ASSINAR DOCUMENTOS', servico: 'D4Sign', desc: 'Acesse contratos e documentos enviados para assinatura eletrônica.', accessUrl: 'https://d4sign.com.br/', accessStatus: 'ready', cta: 'ACESSAR' },
    { necessidade: 'ENVIAR NOTA FISCAL', servico: 'Portal PJ', desc: 'Envio de nota fiscal e acompanhamento de pagamentos.', accessStatus: 'pending', cta: 'ACESSAR' },
    { necessidade: 'UTILIZAR VEÍCULO', servico: 'Uber', desc: 'Acesse as informações e recursos relacionados aos deslocamentos autorizados.', accessUrl: 'https://www.uber.com/br/pt-br/', accessStatus: 'ready', cta: 'ACESSAR' },
  ],
};

/* Suporte comum a todos os vínculos (canais organizacionais) */
const commonSupport = [
  { icon: 'users', name: 'RH', necessidade: 'FALAR COM RH', desc: 'Dúvidas gerais sobre sua relação com a e-Safer.', contato: 'rh@e-safer.com.br' },
];

/* e-Cuidado — conteúdos por tempo disponível (comuns a todos os vínculos) */
const careActivities = {
  2: [
    { icon: 'coffee', title: 'Respiração guiada simples', desc: 'Quatro ciclos de respiração para desacelerar.', timer: 120, guided: ['Inspire em 4 segundos', 'Segure por 4 segundos', 'Expire em 6 segundos', 'Repita com calma'] },
    { icon: 'clock', title: 'Pausa visual', desc: 'Olhe para um ponto distante e descanse a vista.', timer: 120 },
    { icon: 'walk', title: 'Relaxar os ombros', desc: 'Solte os ombros e faça pequenos movimentos circulares.', timer: 120 },
    { icon: 'file', title: 'Organizar a mesa', desc: 'Deixe seu espaço mais limpo antes de continuar.', timer: null },
    { icon: 'target', title: 'Organizar os próximos minutos', desc: 'Escolha a próxima tarefa antes de seguir.', timer: null },
  ],
  5: [
    { icon: 'walk', title: 'Alongamento', desc: 'Alongue pescoço, ombros e punhos.', timer: 300 },
    { icon: 'walk', title: 'Caminhada curta', desc: 'Levante e caminhe por alguns minutos.', timer: 300 },
    { icon: 'clock', title: 'Pausa da tela', desc: 'Afaste-se das telas por alguns minutos.', timer: 300 },
    { icon: 'target', title: 'Organizar prioridades', desc: 'Liste o que realmente importa hoje.', timer: null },
    { icon: 'users', title: 'Reconhecer alguém', desc: 'Envie uma mensagem de reconhecimento a um colega.', timer: null },
  ],
  10: [
    { icon: 'walk', title: 'Caminhada', desc: 'Uma caminhada de 10 minutos, dentro ou fora do escritório.', timer: 600 },
    { icon: 'walk', title: 'Movimento', desc: 'Alongamentos mais completos para o corpo todo.', timer: 600 },
    { icon: 'book', title: 'Leitura curta', desc: 'Leia um conteúdo rápido sobre um tema de interesse.', timer: 600 },
    { icon: 'calendar', title: 'Organização da agenda', desc: 'Revise seus próximos compromissos.', timer: null },
    { icon: 'brain', title: 'Pausa consciente', desc: 'Um momento sem telas, apenas respirando.', timer: 600 },
  ],
  15: [
    { icon: 'coffee', title: 'Pausa completa', desc: 'Um intervalo real, sem notificações.', timer: 900 },
    { icon: 'book', title: 'Conteúdo de aprendizado', desc: 'Um conteúdo rápido de desenvolvimento.', timer: null },
    { icon: 'walk', title: 'Movimento', desc: 'Alongamento completo de corpo.', timer: 900 },
    { icon: 'walk', title: 'Caminhada', desc: 'Uma caminhada mais longa para desacelerar.', timer: 900 },
    { icon: 'target', title: 'Organização da rotina', desc: 'Reorganize as próximas horas do seu dia.', timer: null },
  ],
};

/* "Tem 5 minutos?" — banner compacto na Home. Ao clicar em "VER UMA SUGESTÃO", abre a
   experiência completa (pergunta o tempo disponível, sugere atividades compatíveis). */
const quickPauseActivities = {
  2: [
    { icon: 'coffee', title: 'Respirar', desc: 'Quatro ciclos de respiração guiada para desacelerar.', timer: 120, guided: ['Inspire em 4 segundos', 'Segure por 4 segundos', 'Expire em 6 segundos', 'Repita com calma'] },
    { icon: 'clock', title: 'Pausa visual', desc: 'Olhe para um ponto distante e descanse a vista.', timer: 120 },
    { icon: 'walk', title: 'Relaxar os ombros', desc: 'Solte os ombros e faça pequenos movimentos circulares.', timer: 120 },
    { icon: 'file', title: 'Organizar a mesa', desc: 'Deixe seu espaço mais limpo antes de continuar.', timer: null },
  ],
  5: [
    { icon: 'walk', title: 'Alongar', desc: 'Alongue pescoço, ombros e punhos.', timer: 300 },
    { icon: 'walk', title: 'Caminhada curta', desc: 'Levante e caminhe por alguns minutos.', timer: 300 },
    { icon: 'clock', title: 'Pausa da tela', desc: 'Afaste-se das telas por alguns minutos.', timer: 300 },
    { icon: 'target', title: 'Organizar prioridades', desc: 'Liste o que realmente importa hoje.', timer: null },
    { icon: 'users', title: 'Reconhecer alguém', desc: 'Envie uma mensagem de reconhecimento a um colega.', timer: null },
  ],
  10: [
    { icon: 'walk', title: 'Caminhada', desc: 'Uma caminhada de 10 minutos, dentro ou fora do escritório.', timer: 600 },
    { icon: 'walk', title: 'Movimento', desc: 'Alongamentos mais completos para o corpo todo.', timer: 600 },
    { icon: 'book', title: 'Leitura curta', desc: 'Leia um conteúdo rápido sobre um tema de interesse.', timer: 600 },
    { icon: 'calendar', title: 'Organização da agenda', desc: 'Revise seus próximos compromissos.', timer: null },
    { icon: 'brain', title: 'Pausa consciente', desc: 'Um momento sem telas, apenas respirando.', timer: 600 },
  ],
  15: [
    { icon: 'coffee', title: 'Pausa completa', desc: 'Um intervalo real, sem notificações.', timer: 900 },
    { icon: 'book', title: 'Conteúdo de aprendizado', desc: 'Um conteúdo rápido de desenvolvimento.', timer: null },
    { icon: 'walk', title: 'Movimento', desc: 'Alongamento completo de corpo.', timer: 900 },
    { icon: 'walk', title: 'Caminhada', desc: 'Uma caminhada mais longa para desacelerar.', timer: 900 },
    { icon: 'target', title: 'Organização da rotina', desc: 'Reorganize as próximas horas do seu dia.', timer: null },
  ],
};

const mindCards = [
  { icon: 'clock', title: 'Pausa da tela', desc: 'Afaste-se das telas por alguns minutos.' },
  { icon: 'coffee', title: 'Respiração de 2 minutos', desc: 'Quatro ciclos de respiração guiada.' },
  { icon: 'target', title: 'Organizar os próximos 10 minutos', desc: 'Escolha o que realmente importa agora.' },
  { icon: 'bell', title: 'Reduzir distrações', desc: 'Silencie notificações por um tempo.' },
  { icon: 'compass', title: 'Encerrar o expediente', desc: 'Um pequeno ritual para fechar o dia de trabalho.' },
];
const mindReads = [
  { title: 'Importância das pausas', desc: 'Por que pequenas pausas ajudam a manter o foco.' },
  { title: 'Limites na rotina', desc: 'Como organizar limites entre trabalho e descanso.' },
  { title: 'Sono e produtividade', desc: 'A relação entre boas noites de sono e desempenho.' },
  { title: 'Organização e foco', desc: 'Práticas simples para organizar o dia.' },
];
const bodyActivities = [
  { icon: 'walk', title: 'Alongamento de pescoço', time: '2 min' },
  { icon: 'walk', title: 'Alongamento de punhos', time: '2 min' },
  { icon: 'walk', title: 'Mobilidade de ombros', time: '3 min' },
  { icon: 'walk', title: 'Caminhada de 5 minutos', time: '5 min' },
  { icon: 'clock', title: 'Pausa da tela', time: '5 min' },
];
const ergoChecklist = [
  'Tela em uma altura confortável',
  'Pés apoiados',
  'Ombros relaxados',
  'Iluminação adequada',
  'Fiz pausas durante o dia',
];
const routineTips = [
  { icon: 'target', title: 'Defina prioridades pela manhã', desc: 'Escolha até três coisas essenciais para o dia.' },
  { icon: 'calendar', title: 'Reserve tempo entre reuniões', desc: 'Intervalos curtos ajudam a manter o ritmo.' },
  { icon: 'coffee', title: 'Marque pausas de verdade', desc: 'Pausas combinadas na agenda tendem a acontecer.' },
];
/* "No Escritório" — experiências presenciais, dentro do e-Cuidado (não são "concessões" isoladas).
   Café, frutas e copa são independentes entre si e da massagem — cada um é o seu próprio item,
   apresentado em formato compacto (ícone + texto), sem virar um grande bloco de card. */
const officeExperiences = [
  { id: 'cafe', icon: 'coffee', title: 'Café da manhã', schedule: 'Todos os dias, até as 9h.' },
  { id: 'frutas', icon: 'gift', title: 'Frutas', schedule: 'Segundas-feiras, a partir das 10h, na copa.' },
  { id: 'copa', icon: 'coffee', title: 'Copa', schedule: 'Geladeira, micro-ondas e itens disponíveis na copa podem ser utilizados durante o dia.' },
  {
    id: 'massagem', icon: 'heart', title: 'Massagem', schedule: 'Disponível quinzenalmente, às segundas e quartas-feiras.',
    accessUrl: 'https://opalescent-zen-book-flow.base44.app/', accessLabel: 'AGENDAR MASSAGEM',
  },
];

/* ------------------------------------------------------------
   3. ESTADO GLOBAL
   ------------------------------------------------------------ */
const state = {
  audience: null,
  currentView: 'home',
  calendarDate: new Date(),
  benefitFilter: 'todos',
  benefitQuery: '',
  docFilter: 'todos',
  docQuery: '',
  devTab: 'certificacoes',
  careSubTab: 'mind',
  careTimeSelected: null,
  currentActivity: null,
  timer: { seconds: 0, total: 0, interval: null, running: false },
  ergoChecked: new Set(),
};

/* Utilidades */
function el(sel, ctx) { return (ctx || document).querySelector(sel); }
function els(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }
function currentAudience() { return audiences[state.audience]; }

function monthEvents(refDate) {
  const aud = currentAudience();
  if (!aud) return [];
  const year = refDate.getFullYear();
  const month = refDate.getMonth();
  const events = [];

  aud.calendarGenerators.forEach(gen => {
    const d = gen.rule === 'nth' ? nthBusinessDay(year, month, gen.n) : lastBusinessDay(year, month);
    events.push({ day: d.getDate(), category: gen.category, title: gen.title, description: gen.description, action: gen.action });
  });

  HOLIDAYS_2026.forEach(h => {
    const [hy, hm] = h.date.split('-').map(Number);
    if (hy === year && (hm - 1) === month) {
      const day = Number(h.date.split('-')[2]);
      events.push({ day, category: 'feriado', title: `${h.name} (${h.scope})`, description: `Feriado — ${h.scope}. Verifique o calendário oficial vigente da e-Safer para eventuais ajustes de expediente.`, action: null });
    }
  });

  /* Eventos lançados pelo administrador via admin.html — somam-se aos eventos
     automáticos acima, sem alterar a lógica de cálculo deles. */
  (CONTENT.customEvents[aud.key] || []).forEach(ev => {
    const [ey, em, ed] = ev.date.split('-').map(Number);
    if (ey === year && (em - 1) === month) {
      events.push({ day: ed, category: ev.category || 'evento', title: ev.title, description: ev.description || '', action: null });
    }
  });

  return events.sort((a, b) => a.day - b.day);
}

const MONTH_NAMES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const CATEGORY_META = {
  remuneracao: { label: 'Remuneração', markerClass: 'marker-ring' },
  beneficios: { label: 'Concessões', markerClass: 'marker-dot' },
  feriado: { label: 'Feriado', markerClass: 'marker-yellow' },
  evento: { label: 'Evento', markerClass: 'marker-square' },
};

/* ------------------------------------------------------------
   4. INICIALIZAÇÃO
   ------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', init);

function init() {
  renderStaticIcons();
  setupLandingScreen();
  setupNav();
  setupSearch();
  setupSearchModal();
  setupModal();
  setupCare();
  setupCareSubnav();
  setupErgoChecklist();
  setupQuickPauseBanner();
  setupApoioBanner();
  subscribeRemoteContentUpdates();
}

function renderStaticIcons() {
  els('[data-icon]').forEach(node => {
    node.innerHTML = icon(node.getAttribute('data-icon'));
  });
}

/* ------------------------------------------------------------
   5. TELA INICIAL — SELEÇÃO DE VÍNCULO
   ------------------------------------------------------------ */
function setupLandingScreen() {
  const cards = els('.audience-card');
  const accessBtn = el('#btn-access');
  let selected = null;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('is-selected'));
      card.classList.add('is-selected');
      selected = card.getAttribute('data-audience');
      accessBtn.disabled = false;
    });
  });

  accessBtn.addEventListener('click', () => {
    if (!selected) return;
    enterApp(selected);
  });

  el('#btn-swap-audience').addEventListener('click', () => {
    el('#screen-main').hidden = true;
    el('#screen-landing').hidden = false;
    cards.forEach(c => c.classList.remove('is-selected'));
    accessBtn.disabled = true;
    selected = null;
    window.scrollTo(0, 0);
  });
}

async function enterApp(audienceKey) {
  await contentReady;
  state.audience = audienceKey;
  state.benefitFilter = 'todos';
  state.benefitQuery = '';
  state.docFilter = 'todos';
  state.docQuery = '';
  state.devTab = 'certificacoes';
  state.careTimeSelected = null;
  state.currentActivity = null;
  state.ergoChecked = new Set();
  el('#benefit-search').value = '';
  el('#doc-search').value = '';
  el('#global-search').value = '';
  el('#care-time-panel').hidden = true;
  els('.time-chip').forEach(c => c.classList.remove('is-active'));
  selectCareSubtab('mind');
  el('#screen-landing').hidden = true;
  el('#screen-main').hidden = false;
  el('#audience-badge').textContent = audiences[audienceKey].shortLabel;
  buildSearchIndex();
  renderHome();
  renderCalendar();
  renderBenefits();
  renderDevelopment();
  renderDocuments();
  renderAccess();
  renderCare();
  goToView('home');
  window.scrollTo(0, 0);
}

/* ------------------------------------------------------------
   6. NAVEGAÇÃO
   ------------------------------------------------------------ */
function setupNav() {
  els('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => goToView(btn.getAttribute('data-view')));
  });
  els('[data-goto]').forEach(node => {
    node.addEventListener('click', () => {
      goToView(node.getAttribute('data-goto'));
      const careTab = node.getAttribute('data-care-tab');
      if (careTab) setTimeout(() => selectCareSubtab(careTab), 30);
    });
  });
  const mobileToggle = el('#mobile-menu-toggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      el('#sidenav').classList.toggle('is-open');
    });
  }
}

function goToView(viewName) {
  state.currentView = viewName;
  els('.view').forEach(v => v.hidden = true);
  const target = el('#view-' + viewName);
  if (target) target.hidden = false;
  els('.nav-btn').forEach(btn => {
    btn.classList.toggle('is-active', btn.getAttribute('data-view') === viewName);
  });
  el('#sidenav')?.classList.remove('is-open');
  el('#app-main').scrollTo({ top: 0, behavior: 'smooth' });
  closeSearchResults();
}

/* ------------------------------------------------------------
   7. HOME
   ------------------------------------------------------------ */
function renderHome() {
  const aud = currentAudience();

  renderAvisos();

  /* Lembrete discreto no hero — apenas a próxima data, sem competir com o resto da Home */
  const upcoming = monthEvents(state.calendarDate)
    .filter(ev => ev.day >= new Date().getDate())
    .sort((a, b) => a.day - b.day)[0] || monthEvents(state.calendarDate).sort((a, b) => a.day - b.day)[0];
  const heroPill = el('#hero-upcoming');
  if (upcoming) {
    el('#hero-upcoming-text').textContent = `${String(upcoming.day).padStart(2, '0')} ${MONTH_NAMES[state.calendarDate.getMonth()].slice(0, 3).toUpperCase()} · ${upcoming.title}`;
    heroPill.hidden = false;
  } else {
    heroPill.hidden = true;
  }

  /* "Para você hoje" — mistura conteúdos */
  const todayCards = buildForTodayCards(aud);
  el('#home-fortoday').innerHTML = todayCards.map(cardHTML).join('');
  bindForTodayActions(el('#home-fortoday'));

  /* "Conheça o que está disponível" — pequenos destaques */
  const highlightBenefit = aud.benefits[1] || aud.benefits[0];
  const highlights = [];
  if (highlightBenefit) {
    highlights.push({ tag: 'CONCESSÃO', icon: highlightBenefit.icon, title: highlightBenefit.name, desc: highlightBenefit.short, cta: 'CONHECER', action: { type: 'benefit', ref: highlightBenefit.id } });
  }
  highlights.push({ tag: 'OPORTUNIDADE', icon: 'target', title: 'e-Move', desc: development.oportunidadesInfo.message, cta: 'VER', action: { type: 'view', ref: 'development' } });
  el('#home-highlights').innerHTML = highlights.map(h => `
    <button class="highlight-card" data-action="${h.action.type}" data-ref="${h.action.ref}">
      <span class="highlight-card-icon">${icon(h.icon)}</span>
      <span class="highlight-card-body">
        <span class="mini-card-tag">${h.tag}</span>
        <span class="highlight-card-title">${h.title}</span>
        <span class="highlight-card-desc">${h.desc}</span>
      </span>
      <span class="highlight-card-cta">${h.cta} ${icon('arrowRight')}</span>
    </button>`).join('');
  bindForTodayActions(el('#home-highlights'));
}

/* Avisos/comunicados publicados pelo administrador (admin.html) — aparecem em
   destaque no topo da Home apenas enquanto estiverem marcados como ativos e
   voltados para o vínculo atual (ou para "todos"). */
function renderAvisos() {
  const wrap = el('#home-avisos');
  if (!wrap) return;
  const list = (CONTENT.avisos || []).filter(a => a.active && (a.audience === 'todos' || a.audience === state.audience));
  if (!list.length) { wrap.innerHTML = ''; wrap.hidden = true; return; }
  wrap.hidden = false;
  wrap.innerHTML = list.map(a => `
    <div class="aviso-banner">
      <span class="aviso-banner-icon">${icon('bell')}</span>
      <div class="aviso-banner-body">
        <span class="aviso-banner-title">${a.title}</span>
        <span class="aviso-banner-desc">${a.message}</span>
      </div>
      ${a.link ? `<a class="btn btn-secondary btn-sm" href="${a.link}" target="_blank" rel="noopener">SAIBA MAIS</a>` : ''}
    </div>`).join('');
}

function buildForTodayCards(aud) {
  const cards = [];
  const benefit = aud.benefits[0];
  if (benefit) cards.push({ tag: 'CONCESSÃO', icon: benefit.icon, title: benefit.name, desc: 'Conheça um recurso disponível para você.', action: { type: 'benefit', ref: benefit.id } });
  const firstGroup = development.treinamentoGroups[0];
  if (firstGroup) cards.push({ tag: 'DESENVOLVIMENTO', icon: 'book', title: firstGroup.name, desc: 'Treinamentos e certificados disponíveis para você.', action: { type: 'view', ref: 'development' } });
  const nextEvent = monthEvents(state.calendarDate).filter(ev => ev.day >= new Date().getDate()).sort((a, b) => a.day - b.day)[0];
  if (nextEvent) cards.push({ tag: 'DATA IMPORTANTE', icon: 'calendar', title: nextEvent.title, desc: 'Confira no calendário do seu vínculo.', action: { type: 'view', ref: 'calendar' } });
  const office = officeExperiences.find(o => o.id === 'massagem') || officeExperiences[0];
  if (office) cards.push({ tag: 'NO ESCRITÓRIO', icon: office.icon, title: office.title, desc: office.schedule, action: { type: 'care-tab', ref: 'office' } });
  return cards;
}

function cardHTML(c) {
  return `
    <button class="mini-card" data-action="${c.action.type}" data-ref="${c.action.ref}">
      <span class="mini-card-tag">${c.tag}</span>
      <span class="mini-card-icon">${icon(c.icon)}</span>
      <span class="mini-card-title">${c.title}</span>
      <span class="mini-card-desc">${c.desc}</span>
    </button>`;
}

function bindForTodayActions(container) {
  els('.mini-card, .highlight-card', container).forEach(btn => {
    btn.addEventListener('click', () => handleQuickAction(btn.getAttribute('data-action'), btn.getAttribute('data-ref')));
  });
}

function handleQuickAction(type, ref) {
  if (type === 'benefit') { openBenefitModal(ref); }
  else if (type === 'view') { goToView(ref); }
  else if (type === 'care-tab') { goToView('care'); setTimeout(() => selectCareSubtab(ref), 50); }
}

/* Banner "Tem 5 minutos?" — abre a experiência completa em modal, sem listar
   as atividades diretamente na Home. */
function setupQuickPauseBanner() {
  const btn = el('#btn-open-quickpause');
  if (btn) btn.addEventListener('click', openQuickPauseModal);
}
function openQuickPauseModal() {
  openModal(quickPauseMinutesStepHTML());
  bindQuickPauseMinutesStep();
}
function quickPauseMinutesStepHTML() {
  return `
    <div class="modal-head">
      <span class="modal-icon">${icon('clock')}</span>
      <h3>Quanto tempo você tem agora?</h3>
    </div>
    <div class="time-chip-row">
      ${[2, 5, 10, 15].map(m => `<button class="time-chip" data-qp-time="${m}">${m} MIN</button>`).join('')}
    </div>
    <div id="qp-suggestion-area"></div>`;
}
function bindQuickPauseMinutesStep() {
  els('[data-qp-time]').forEach(btn => btn.addEventListener('click', () => {
    const minutes = parseInt(btn.getAttribute('data-qp-time'), 10);
    els('[data-qp-time]').forEach(c => c.classList.toggle('is-active', c === btn));
    renderQuickPauseSuggestion(minutes, quickPauseActivities[minutes][0]);
  }));
}
function renderQuickPauseSuggestion(minutes, activity) {
  const area = el('#qp-suggestion-area');
  if (!area) return;
  area.innerHTML = `
    <div class="care-time-panel">
      <div class="care-activity-preview">
        <span class="care-activity-icon">${icon(activity.icon)}</span>
        <div><h4>${activity.title}</h4><p>${activity.desc}</p></div>
      </div>
      <div class="care-time-actions">
        <button class="btn btn-primary" id="qp-start">COMEÇAR</button>
        <button class="btn btn-secondary" id="qp-suggest">ME SUGIRA ALGO</button>
      </div>
    </div>`;
  el('#qp-start').addEventListener('click', () => startActivityModal(activity));
  el('#qp-suggest').addEventListener('click', () => {
    const pool = quickPauseActivities[minutes];
    const pick = pool[Math.floor(Math.random() * pool.length)];
    renderQuickPauseSuggestion(minutes, pick);
  });
}

/* Banner "Apoio psicológico" — acesso rápido e acolhedor na Home, complementar ao
   card completo de Apoio Psicológico (não o substitui). */
function setupApoioBanner() {
  const btn = el('#btn-open-apoio-psicologico');
  if (btn) btn.addEventListener('click', openApoioPsicologicoModal);
}
function openApoioPsicologicoModal() {
  const aud = currentAudience();
  if (!aud) return;
  const b = aud.benefits.find(x => x.necessidade === 'Apoio psicológico');
  if (b) openBenefitModal(b.id);
}

/* ------------------------------------------------------------
   8. CALENDÁRIO
   ------------------------------------------------------------ */
function renderCalendar() {
  const grid = el('#calendar-grid');
  const label = el('#calendar-month-label');
  const date = state.calendarDate;
  label.textContent = `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;

  const firstWeekday = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const events = monthEvents(date);
  const eventsByDay = {};
  events.forEach(ev => { (eventsByDay[ev.day] = eventsByDay[ev.day] || []).push(ev); });

  let html = '';
  for (let i = 0; i < firstWeekday; i++) html += `<div class="cal-cell cal-cell-empty"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const dayEvents = eventsByDay[d] || [];
    const isToday = d === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear();
    html += `
      <button class="cal-cell ${dayEvents.length ? 'has-event' : ''} ${isToday ? 'is-today' : ''}" data-day="${d}">
        <span class="cal-day-num">${d}</span>
        <span class="cal-markers">${dayEvents.map(ev => `<span class="marker ${CATEGORY_META[ev.category].markerClass}"></span>`).join('')}</span>
      </button>`;
  }
  grid.innerHTML = html;

  els('.cal-cell.has-event', grid).forEach(cell => {
    cell.addEventListener('click', () => openDayFromCalendar(parseInt(cell.getAttribute('data-day'), 10)));
  });

  el('#calendar-prev').onclick = () => { state.calendarDate = new Date(date.getFullYear(), date.getMonth() - 1, 1); renderCalendar(); };
  el('#calendar-next').onclick = () => { state.calendarDate = new Date(date.getFullYear(), date.getMonth() + 1, 1); renderCalendar(); };
}

/* Um mesmo dia pode ter mais de um evento (ex.: feriado + data financeira) —
   por isso o modal lista todos os eventos do dia, não apenas o primeiro. */
function openDayFromCalendar(day) {
  const events = monthEvents(state.calendarDate).filter(ev => ev.day === day);
  if (!events.length) return;
  const dayLabel = `${String(day).padStart(2, '0')} ${MONTH_NAMES[state.calendarDate.getMonth()].slice(0, 3).toUpperCase()}`;
  openModal(`
    <div class="modal-head">
      <span class="modal-eyebrow">${dayLabel}</span>
      <h3>${events.length > 1 ? `${events.length} eventos neste dia` : events[0].title}</h3>
    </div>
    ${events.map(ev => `
      <div class="modal-section modal-day-event">
        <span class="tag tag-${ev.category}">${CATEGORY_META[ev.category].label}</span>
        ${events.length > 1 ? `<h4 class="modal-day-event-title">${ev.title}</h4>` : ''}
        <p>${ev.description}</p>
        ${ev.action ? `<button class="btn btn-secondary" data-event-action="${ev.action.target}" data-event-ref="${ev.action.ref}">${ev.action.label}</button>` : ''}
      </div>`).join('')}
  `);
  els('[data-event-action]').forEach(btn => btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-event-action');
    const ref = btn.getAttribute('data-event-ref');
    closeModal();
    if (target === 'benefit') { openBenefitModal(ref); }
    else if (target === 'view') { goToView(ref); }
    else if (target === 'care-tab') { goToView('care'); setTimeout(() => selectCareSubtab(ref), 50); }
  }));
}

/* ------------------------------------------------------------
   9. CONCESSÕES
   ------------------------------------------------------------ */
function renderBenefits() {
  const aud = currentAudience();
  const chips = el('#benefit-filters');
  const cats = ['todos', ...new Set(aud.benefits.map(b => b.category))];
  chips.innerHTML = cats.map(c => `<button class="chip ${c === state.benefitFilter ? 'is-active' : ''}" data-cat="${c}">${c === 'todos' ? 'Todos' : CATEGORY_LABELS[c]}</button>`).join('');
  els('.chip', chips).forEach(chip => chip.addEventListener('click', () => {
    state.benefitFilter = chip.getAttribute('data-cat');
    renderBenefits();
  }));

  const list = aud.benefits.filter(b => {
    const matchCat = state.benefitFilter === 'todos' || b.category === state.benefitFilter;
    const matchQuery = !state.benefitQuery || (b.name + b.short).toLowerCase().includes(state.benefitQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  const grid = el('#benefits-grid');
  grid.innerHTML = list.length ? list.map(benefitCardHTML).join('') : emptyStateHTML('Nenhuma concessão encontrada para essa busca.');
  els('.benefit-card', grid).forEach(card => card.addEventListener('click', () => openBenefitModal(card.getAttribute('data-id'))));

  const noteEl = el('#benefits-pending-note');
  if (noteEl) {
    if (aud.benefitsPendingNote) { noteEl.textContent = aud.benefitsPendingNote; noteEl.hidden = false; }
    else { noteEl.hidden = true; }
  }
}

function benefitCardHTML(b) {
  return `
    <button class="benefit-card" data-id="${b.id}">
      <span class="benefit-card-icon">${icon(b.icon)}</span>
      <span class="tag tag-neutral">${CATEGORY_LABELS[b.category]}</span>
      <span class="benefit-card-name">${b.name}</span>
      <span class="benefit-card-desc">${b.short}</span>
      <span class="benefit-card-link">Ver detalhes ${icon('arrowRight')}</span>
    </button>`;
}

function emptyStateHTML(msg) {
  return `<div class="empty-state">${icon('search')}<p>${msg}</p></div>`;
}
function pendingStateHTML(msg) {
  return `<div class="empty-state">${icon('info')}<p>${msg}</p></div>`;
}

/* Área visual do aplicativo: ícone oficial (quando o arquivo já estiver em assets/icons/)
   + nome + botões de download separados. Se a imagem ainda não existir, o ícone
   simplesmente não aparece (onerror) — nunca é substituído por um ícone genérico. */
function appCardHTML(brandKey, accessUrl) {
  const brand = APP_BRANDS[brandKey];
  if (!brand) return '';
  const img = `<img src="${brand.asset}" alt="${brand.name}" loading="lazy" onerror="this.closest('.app-card-icon').classList.add('is-empty'); this.remove();">`;
  const iconEl = accessUrl
    ? `<a class="app-card-icon" href="${accessUrl}" target="_blank" rel="noopener" aria-label="Abrir ${brand.name}">${img}</a>`
    : `<span class="app-card-icon">${img}</span>`;
  return `
    <div class="app-card">
      <div class="app-card-top">
        ${iconEl}
        <div class="app-card-info">
          <span class="app-card-name">${brand.name}</span>
          <span class="app-card-label">Aplicativo</span>
        </div>
      </div>
      <div class="app-card-buttons">
        ${brand.links.map(l => `<a class="btn btn-ghost btn-applink" href="${l.url}" target="_blank" rel="noopener">${l.platform}</a>`).join('')}
      </div>
    </div>`;
}
function extraLinksHTML(extraLinks) {
  if (!extraLinks || !extraLinks.length) return '';
  return extraLinks.map(l => l.status === 'ready'
    ? `<a class="link-btn link-btn-doc" href="${l.url}" target="_blank" rel="noopener">${icon('document')} ${l.label}</a>`
    : `<button class="link-btn link-btn-doc is-pending" data-pending-doc="${l.label}">${icon('document')} ${l.label} <span class="pending-tag">em breve</span></button>`
  ).join('');
}
function helpEmailsHTML(helpEmails) {
  if (!helpEmails || !helpEmails.length) return '';
  return `<div class="modal-contacts">${helpEmails.map(h => `<a class="modal-contact-link" href="mailto:${h.email}">${icon('support')} ${h.label} · ${h.email}</a>`).join('')}</div>`;
}
function crisisBlockHTML() {
  return `
    <div class="crisis-block">
      <span class="crisis-block-title">${icon('info')} Preciso de ajuda agora</span>
      <p>Se você ou alguém que você conhece está em sofrimento intenso ou em risco, procure ajuda agora: <strong>CVV — Centro de Valorização da Vida</strong>, 24 horas por dia, gratuito.</p>
      <div class="crisis-block-actions">
        <a class="btn btn-primary" href="tel:188">${icon('phone')} LIGAR 188</a>
        <a class="btn btn-secondary" href="https://cvv.org.br/chat/" target="_blank" rel="noopener">ACESSAR CHAT DO CVV</a>
      </div>
    </div>`;
}
function compareOptionsHTML(options) {
  if (!options || !options.length) return '';
  return `<div class="compare-options">${options.map(o => `
    <div class="compare-option">
      <span class="compare-option-title">${o.title}</span>
      <span class="compare-option-desc">${o.desc}</span>
    </div>`).join('')}</div>`;
}

/* Cada concessão mostra somente as informações que foram de fato especificadas para
   ela — sem forçar um template padrão (Para que serve / Quem pode utilizar / Como
   funciona / Como acessar) em todos os cards. Seções aparecem apenas quando o
   respectivo campo existe no objeto da concessão. */
function openBenefitModal(id) {
  const aud = currentAudience();
  const b = aud.benefits.find(x => x.id === id);
  if (!b) return;
  const extraLinks = extraLinksHTML(b.extraLinks);
  openModal(`
    <div class="modal-head">
      <span class="modal-icon">${icon(b.icon)}</span>
      <span class="tag tag-neutral">${CATEGORY_LABELS[b.category]}</span>
      <h3>${b.name}</h3>
      <p class="modal-lead">${b.lead || b.short}</p>
    </div>
    ${b.atendimentos ? `<div class="modal-section"><h4>Atendimentos disponíveis</h4><p>${b.atendimentos.join(' · ')}</p></div>` : ''}
    ${b.comoFunciona ? `<div class="modal-section"><h4>Como funciona</h4><p>${b.comoFunciona}</p></div>` : ''}
    ${b.compareOptions ? `<div class="modal-section">${b.solicitarNote ? `<h4>Como solicitar</h4><p>${b.solicitarNote}</p>` : ''}${compareOptionsHTML(b.compareOptions)}</div>` : ''}
    ${b.accessUrl ? `<div class="modal-actions"><a class="btn btn-primary" href="${b.accessUrl}" target="_blank" rel="noopener">${b.accessLabel || 'ACESSAR'}</a></div>` : ''}
    ${b.appBrand ? `<div class="modal-section">${appCardHTML(b.appBrand, b.accessUrl)}</div>` : ''}
    ${b.crisisBlock ? crisisBlockHTML() : ''}
    ${extraLinks ? `<div class="modal-doclinks">${extraLinks}</div>` : ''}
    ${helpEmailsHTML(b.helpEmails)}
  `);
  els('[data-pending-doc]').forEach(btn => btn.addEventListener('click', () => showToast(`"${btn.getAttribute('data-pending-doc')}" será publicado assim que estiver disponível.`)));
}

/* Busca dentro de Concessões */
document.addEventListener('DOMContentLoaded', () => {
  const input = el('#benefit-search');
  if (input) input.addEventListener('input', () => { state.benefitQuery = input.value; renderBenefits(); });
});

/* ------------------------------------------------------------
   10. DESENVOLVIMENTO
   ------------------------------------------------------------ */
const DEV_TABS = [
  ['certificacoes', 'Certificações'],
  ['treinamentos', 'Treinamentos'],
  ['oportunidades', 'e-Move'],
  ['enews', 'e-News'],
];

function renderDevelopment() {
  const tabs = el('#dev-tabs');
  tabs.innerHTML = DEV_TABS.map(([key, label]) => `<button class="chip ${key === state.devTab ? 'is-active' : ''}" data-tab="${key}">${label}</button>`).join('');
  els('.chip', tabs).forEach(t => t.addEventListener('click', () => { state.devTab = t.getAttribute('data-tab'); renderDevelopment(); }));

  const grid = el('#dev-grid');
  if (state.devTab === 'certificacoes') {
    const c = development.certificacoesInfo;
    grid.innerHTML = `
      <div class="dev-info-card dev-card-wide">
        <h3>${c.title}</h3>
        <p>${c.message}</p>
        <p class="dev-info-rule"><strong>Como funciona?</strong> ${c.comoFunciona}</p>
        <div class="modal-actions">
          ${c.policyStatus === 'ready'
            ? `<a class="btn btn-secondary" href="${c.policyUrl}" target="_blank" rel="noopener">${c.policyLabel.toUpperCase()}</a>`
            : `<button class="btn btn-secondary is-pending" data-pending-doc="${c.policyLabel}">${c.policyLabel.toUpperCase()} <span class="pending-tag">em breve</span></button>`}
        </div>
        ${helpEmailsHTML(c.helpEmails)}
      </div>`;
  } else if (state.devTab === 'treinamentos') {
    grid.innerHTML = `
      <div class="dev-card-wide">
        <div class="dev-training-groups">
          ${development.treinamentoGroups.map(g => `
            <div class="dev-training-group">
              <h4>${g.name}</h4>
              <ul class="dev-training-list">
                ${g.items.map(i => `<li>${i}</li>`).join('')}
              </ul>
            </div>`).join('')}
        </div>
        <div class="dev-training-cta">
          <p><strong>Participou de algum desses treinamentos?</strong> Acesse e baixe seu certificado.</p>
          <div class="modal-actions">
            <a class="btn btn-primary" href="${development.certificatesUrl}" target="_blank" rel="noopener">CERTIFICADOS</a>
          </div>
          ${helpEmailsHTML([{ label: 'RH', email: development.treinamentosHelpEmail }])}
        </div>
        <p class="panel-subtitle" style="margin-top:22px;">Próximos treinamentos</p>
        <p class="dev-info-rule">Novos treinamentos serão publicados aqui assim que definidos.</p>
      </div>`;
  } else if (state.devTab === 'oportunidades') {
    const o = development.oportunidadesInfo;
    grid.innerHTML = `
      <div class="dev-info-card dev-card-wide">
        <h3>e-Move</h3>
        <p>${o.message}</p>
        <div class="modal-actions">
          <a class="btn btn-primary" href="${o.jobsUrl}" target="_blank" rel="noopener">${o.jobsLabel}</a>
          ${o.policyStatus === 'ready'
            ? `<a class="btn btn-secondary" href="${o.policyUrl}" target="_blank" rel="noopener">${o.policyLabel.toUpperCase()}</a>`
            : `<button class="btn btn-secondary is-pending" data-pending-doc="${o.policyLabel}">${o.policyLabel.toUpperCase()} <span class="pending-tag">em breve</span></button>`}
        </div>
      </div>`;
  } else if (state.devTab === 'enews') {
    const n = development.enews;
    grid.innerHTML = `
      <div class="dev-info-card dev-card-wide">
        <h3>e-News</h3>
        <p>${n.desc}</p>
        ${n.accessStatus === 'ready'
          ? `<a class="btn btn-secondary" href="${n.accessUrl}" target="_blank" rel="noopener">VER E-NEWS</a>`
          : `<button class="btn btn-secondary is-pending" data-pending-doc="e-News">EM BREVE</button>`}
      </div>`;
  }
  els('[data-pending-doc]', grid).forEach(btn => btn.addEventListener('click', () => showToast(`"${btn.getAttribute('data-pending-doc')}" será disponibilizado em breve.`)));
}

/* ------------------------------------------------------------
   11. DOCUMENTOS E POLÍTICAS
   ------------------------------------------------------------ */
function renderDocuments() {
  const aud = currentAudience();
  const searchWrap = el('#doc-search')?.closest('.search-wrap');
  const chips = el('#doc-filters');
  const grid = el('#documents-grid');

  if (!aud.documents.length) {
    if (searchWrap) searchWrap.hidden = true;
    if (chips) chips.hidden = true;
    grid.innerHTML = `
      <div class="empty-state empty-state-large">
        ${icon('file')}
        <h3>Nenhum documento publicado ainda</h3>
        <p>Assim que as políticas e os documentos oficiais forem disponibilizados, você os encontrará aqui.</p>
      </div>`;
    return;
  }

  if (searchWrap) searchWrap.hidden = false;
  if (chips) chips.hidden = false;
  const cats = ['todos', ...new Set(aud.documents.map(d => d.category))];
  chips.innerHTML = cats.map(c => `<button class="chip ${c === state.docFilter ? 'is-active' : ''}" data-cat="${c}">${c === 'todos' ? 'Todos' : c}</button>`).join('');
  els('.chip', chips).forEach(chip => chip.addEventListener('click', () => { state.docFilter = chip.getAttribute('data-cat'); renderDocuments(); }));

  const list = aud.documents.filter(d => {
    const matchCat = state.docFilter === 'todos' || d.category === state.docFilter;
    const matchQuery = !state.docQuery || (d.name + d.short).toLowerCase().includes(state.docQuery.toLowerCase());
    return matchCat && matchQuery;
  });
  grid.innerHTML = list.length ? list.map(docCardHTML).join('') : emptyStateHTML('Nenhum documento encontrado para essa busca.');
}

function docCardHTML(d) {
  const href = d.fileData || d.url;
  return `
    <div class="doc-card">
      <span class="doc-card-icon">${icon(d.icon || 'file')}</span>
      <span class="tag tag-neutral">${d.category}</span>
      <h4>${d.name}</h4>
      <p>${d.short}</p>
      ${href ? `<a class="btn btn-secondary btn-sm" href="${href}" target="_blank" rel="noopener" ${d.fileData ? `download="${d.name}.pdf"` : ''}>VER DOCUMENTO</a>` : ''}
    </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  const input = el('#doc-search');
  if (input) input.addEventListener('input', () => { state.docQuery = input.value; renderDocuments(); });
});

/* ------------------------------------------------------------
   12. ACESSOS — organizados por necessidade
   ------------------------------------------------------------ */
/* Ícone oficial da plataforma nos cards de Acessos. Mostra o SVG genérico por padrão
   e só troca pela imagem real depois que ela carrega com sucesso — se o arquivo não
   existir, o ícone genérico simplesmente permanece (nunca fica um ícone quebrado). */
const ACCESS_BRAND_ICONS = {
  'VExpenses': 'assets/icons/vexpenses.png',
  'Factorial': 'assets/icons/factorial.png',
  'D4Sign': 'assets/icons/d4sign.png',
  'Uber': 'assets/icons/uber.png',
};
function accessCardIconHTML(servico) {
  const asset = ACCESS_BRAND_ICONS[servico];
  const fallback = `<span class="access-card-icon-fallback">${icon('link')}</span>`;
  const img = asset
    ? `<img class="access-card-icon-img" src="${asset}" alt="${servico}" onload="this.previousElementSibling.style.display='none'; this.style.display='block';" onerror="this.remove();">`
    : '';
  return `<span class="access-card-icon">${fallback}${img}</span>`;
}

function renderAccess() {
  const items = accessByAudience[state.audience];
  const grid = el('#access-grid');
  grid.innerHTML = items.map(a => `
    <div class="access-card">
      ${accessCardIconHTML(a.servico)}
      <h4>${a.necessidade}</h4>
      <span class="access-card-via">via ${a.servico}</span>
      <p>${a.desc}</p>
      ${a.accessStatus === 'ready'
        ? `<a class="btn btn-primary btn-block" href="${a.accessUrl}" target="_blank" rel="noopener">${a.cta}</a>`
        : `<button class="btn btn-primary btn-block is-pending" data-pending-access="${a.servico}">${a.cta}</button>`}
    </div>`).join('');
  els('[data-pending-access]', grid).forEach(btn => btn.addEventListener('click', () => showToast(`O acesso via ${btn.getAttribute('data-pending-access')} será disponibilizado em breve. Consulte o RH.`)));
}

/* ------------------------------------------------------------
   13. e-CUIDADO
   ------------------------------------------------------------ */
function renderCare() {
  const aud = currentAudience();

  /* Preciso de apoio: concessões com apoio:true + canais comuns — também organizado por necessidade */
  const supportBenefits = aud.benefits.filter(b => b.apoio);
  const supportGrid = el('#support-grid');
  supportGrid.innerHTML = [
    ...supportBenefits.map(b => `
      <div class="support-card">
        <span class="support-card-icon">${icon(b.icon)}</span>
        <h4>${(b.necessidade || b.name).toUpperCase()}</h4>
        <span class="access-card-via">via ${b.name}</span>
        <p>${b.short}</p>
        <button class="btn btn-secondary btn-block" data-support-benefit="${b.id}">VER COMO ACESSAR</button>
      </div>`),
    ...commonSupport.map(s => `
      <div class="support-card">
        <span class="support-card-icon">${icon(s.icon)}</span>
        <h4>${s.necessidade}</h4>
        <span class="access-card-via">via ${s.name}</span>
        <p>${s.desc}</p>
        <a class="btn btn-secondary btn-block" href="mailto:${s.contato}">FALAR COM ${s.name.toUpperCase()}</a>
      </div>`)
  ].join('');
  els('[data-support-benefit]', supportGrid).forEach(btn => btn.addEventListener('click', () => openBenefitModal(btn.getAttribute('data-support-benefit'))));

  /* Cuidar da mente */
  el('#mind-grid').innerHTML = mindCards.map(c => `
    <div class="care-mini-card">
      <span class="care-mini-icon">${icon(c.icon)}</span>
      <h4>${c.title}</h4>
      <p>${c.desc}</p>
    </div>`).join('');
  el('#mind-reads').innerHTML = mindReads.map(r => `
    <div class="read-card">
      <h4>${r.title}</h4>
      <p>${r.desc}</p>
    </div>`).join('');

  /* Movimentar o corpo */
  el('#body-grid').innerHTML = bodyActivities.map((a, i) => `
    <div class="care-mini-card">
      <span class="care-mini-icon">${icon(a.icon)}</span>
      <h4>${a.title}</h4>
      <span class="tag tag-neutral">${a.time}</span>
      <button class="btn btn-primary btn-block" data-body-activity="${i}">COMEÇAR</button>
    </div>`).join('');
  els('[data-body-activity]', el('#body-grid')).forEach(btn => btn.addEventListener('click', () => {
    const a = bodyActivities[parseInt(btn.getAttribute('data-body-activity'), 10)];
    startActivityModal({ icon: a.icon, title: a.title, desc: 'Reserve este tempo só para isso.', timer: parseInt(a.time) * 60 || 120 });
  }));

  /* No Escritório — lista compacta (ícone + texto), cada item independente dos demais */
  const officeGrid = el('#office-grid');
  if (officeGrid) {
    officeGrid.innerHTML = officeExperiences.map(o => `
      <div class="office-list-item">
        <span class="office-list-icon">${icon(o.icon)}</span>
        <div class="office-list-body">
          <span class="office-list-title">${o.title}</span>
          <span class="office-list-desc">${o.schedule}</span>
          ${o.accessUrl ? `<a class="btn btn-primary btn-sm" href="${o.accessUrl}" target="_blank" rel="noopener">${o.accessLabel}</a>` : ''}
        </div>
      </div>`).join('');
  }

  /* Melhorar minha rotina */
  el('#routine-grid').innerHTML = routineTips.map(t => `
    <div class="care-mini-card">
      <span class="care-mini-icon">${icon(t.icon)}</span>
      <h4>${t.title}</h4>
      <p>${t.desc}</p>
    </div>`).join('');
}

function setupCare() {
  els('.time-chip').forEach(chip => {
    chip.addEventListener('click', () => selectCareTime(parseInt(chip.getAttribute('data-time'), 10)));
  });
  el('#care-suggest').addEventListener('click', () => {
    if (!state.careTimeSelected) return;
    const pool = careActivities[state.careTimeSelected];
    const pick = pool[Math.floor(Math.random() * pool.length)];
    renderCareActivityPreview(pick);
  });
  el('#care-start').addEventListener('click', () => {
    if (state.currentActivity) startActivityModal(state.currentActivity);
  });
}

/* Sub-navegação do e-Cuidado: mostra uma área por vez em vez de empilhar tudo em uma página longa. */
function setupCareSubnav() {
  els('.care-subnav-item').forEach(btn => {
    btn.addEventListener('click', () => selectCareSubtab(btn.getAttribute('data-caretab')));
  });
  selectCareSubtab(state.careSubTab || 'mind');
}

function selectCareSubtab(tab) {
  state.careSubTab = tab;
  els('.care-subpanel').forEach(panel => {
    panel.hidden = panel.getAttribute('data-caretab-panel') !== tab;
  });
  els('.care-subnav-item').forEach(btn => {
    btn.classList.toggle('is-active', btn.getAttribute('data-caretab') === tab);
  });
}

function selectCareTime(minutes) {
  state.careTimeSelected = minutes;
  els('.time-chip').forEach(c => c.classList.toggle('is-active', parseInt(c.getAttribute('data-time'), 10) === minutes));
  const pool = careActivities[minutes];
  renderCareActivityPreview(pool[0]);
  el('#care-time-panel').hidden = false;
  el('#care-time-panel').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renderCareActivityPreview(activity) {
  state.currentActivity = { ...activity, minutes: state.careTimeSelected };
  const wrap = el('#care-activity-preview');
  wrap.innerHTML = `
    <span class="care-activity-icon">${icon(activity.icon)}</span>
    <div>
      <h4>${activity.title}</h4>
      <p>${activity.desc}</p>
    </div>`;
}

function startActivityModal(activity) {
  const hasTimer = !!activity.timer;
  openModal(`
    <div class="modal-head">
      <span class="modal-icon">${icon(activity.icon)}</span>
      <h3>${activity.title}</h3>
      <p class="modal-lead">${activity.desc || 'Aproveite este momento.'}</p>
    </div>
    ${hasTimer ? `
      <div class="timer-box">
        <span id="timer-display" class="timer-display">${formatTime(activity.timer)}</span>
        <div class="timer-actions">
          <button class="btn btn-primary" id="timer-toggle">Começar</button>
          <button class="btn btn-secondary" id="timer-finish">Finalizar</button>
        </div>
      </div>
      <p id="timer-feedback" class="modal-note-text" hidden>Pausa concluída. Volte quando quiser.</p>
    ` : `
      <div class="modal-actions"><button class="btn btn-primary" id="activity-done">Concluir</button></div>
    `}
  `);
  if (hasTimer) {
    setupTimer(activity.timer);
  } else {
    el('#activity-done').addEventListener('click', () => {
      closeModal();
      showToast('Pausa concluída.');
    });
  }
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function setupTimer(totalSeconds) {
  clearInterval(state.timer.interval);
  state.timer = { seconds: totalSeconds, total: totalSeconds, interval: null, running: false };
  const toggleBtn = el('#timer-toggle');
  const finishBtn = el('#timer-finish');
  const feedback = el('#timer-feedback');

  toggleBtn.addEventListener('click', () => {
    if (state.timer.running) {
      clearInterval(state.timer.interval);
      state.timer.running = false;
      toggleBtn.textContent = 'Continuar';
    } else {
      state.timer.running = true;
      toggleBtn.textContent = 'Pausar';
      state.timer.interval = setInterval(() => {
        state.timer.seconds -= 1;
        if (!el('#timer-display')) { clearInterval(state.timer.interval); return; }
        el('#timer-display').textContent = formatTime(Math.max(state.timer.seconds, 0));
        if (state.timer.seconds <= 0) {
          clearInterval(state.timer.interval);
          state.timer.running = false;
          finishActivity();
        }
      }, 1000);
    }
  });
  finishBtn.addEventListener('click', finishActivity);

  function finishActivity() {
    clearInterval(state.timer.interval);
    if (el('#timer-toggle')) el('#timer-toggle').hidden = true;
    if (el('#timer-finish')) el('#timer-finish').hidden = true;
    if (feedback) feedback.hidden = false;
    showToast('Pausa concluída.');
  }
}

/* Checklist de ergonomia */
function setupErgoChecklist() {
  const wrap = el('#ergo-checklist');
  if (!wrap) return;
  wrap.innerHTML = ergoChecklist.map((item, i) => `
    <button class="check-item" data-i="${i}">
      <span class="check-box">${icon('check')}</span>
      <span>${item}</span>
    </button>`).join('');
  els('.check-item', wrap).forEach(btn => {
    btn.addEventListener('click', () => {
      const i = btn.getAttribute('data-i');
      if (state.ergoChecked.has(i)) state.ergoChecked.delete(i); else state.ergoChecked.add(i);
      btn.classList.toggle('is-checked', state.ergoChecked.has(i));
      updateErgoFeedback();
    });
  });
  updateErgoFeedback();
}
function updateErgoFeedback() {
  const feedback = el('#ergo-feedback');
  if (!feedback) return;
  const n = state.ergoChecked.size;
  if (n === 0) feedback.textContent = 'Marque os itens conforme for ajustando seu espaço.';
  else if (n < ergoChecklist.length) feedback.textContent = `${n} de ${ergoChecklist.length} itens ajustados.`;
  else feedback.textContent = 'Seu espaço está com uma boa configuração.';
}

/* ------------------------------------------------------------
   13b. MODAL DE BUSCA (acionado pelo ícone no header)
   ------------------------------------------------------------ */
function setupSearchModal() {
  const overlay = el('#search-overlay');
  const openBtn = el('#btn-open-search');
  if (!overlay || !openBtn) return;
  openBtn.addEventListener('click', () => {
    overlay.hidden = false;
    document.body.classList.add('no-scroll');
    setTimeout(() => el('#global-search').focus(), 60);
  });
  el('#search-close').addEventListener('click', closeSearchModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeSearchModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !overlay.hidden) closeSearchModal(); });
}
function closeSearchModal() {
  const overlay = el('#search-overlay');
  if (!overlay || overlay.hidden) return;
  overlay.hidden = true;
  document.body.classList.remove('no-scroll');
  closeSearchResults();
  el('#global-search').value = '';
}

/* ------------------------------------------------------------
   14. BUSCA GLOBAL
   ------------------------------------------------------------ */
let searchIndex = [];
function buildSearchIndex() {
  const aud = currentAudience();
  searchIndex = [];
  aud.benefits.forEach(b => searchIndex.push({ type: 'Concessão', title: b.name, desc: b.short, action: () => openBenefitModal(b.id) }));
  aud.documents.forEach(d => searchIndex.push({ type: 'Documento', title: d.name, desc: d.short, action: () => { goToView('documents'); } }));
  monthEvents(state.calendarDate).forEach(e => searchIndex.push({ type: 'Data', title: e.title, desc: e.description, action: () => { goToView('calendar'); setTimeout(() => openDayFromCalendar(e.day), 60); } }));
  accessByAudience[state.audience].forEach(a => searchIndex.push({ type: 'Acesso', title: a.servico, desc: a.necessidade, action: () => goToView('access') }));
  development.treinamentoGroups.forEach(g => g.items.forEach(i => searchIndex.push({ type: 'Desenvolvimento', title: i, desc: g.name, action: () => goToView('development') })));
  searchIndex.push({ type: 'Desenvolvimento', title: 'e-Move', desc: development.oportunidadesInfo.message, action: () => goToView('development') });
  searchIndex.push({ type: 'Desenvolvimento', title: 'Certificações', desc: development.certificacoesInfo.message, action: () => goToView('development') });
  [...mindCards, ...bodyActivities, ...routineTips].forEach(c => searchIndex.push({ type: 'e-Cuidado', title: c.title, desc: c.desc || '', action: () => goToView('care') }));
  officeExperiences.forEach(c => searchIndex.push({ type: 'No Escritório', title: c.title, desc: c.schedule || '', action: () => { goToView('care'); setTimeout(() => selectCareSubtab('office'), 60); } }));
  Object.values(quickPauseActivities).flat().forEach(p => searchIndex.push({ type: 'Pausa rápida', title: p.title, desc: p.desc, action: () => goToView('home') }));
}

function setupSearch() {
  const input = el('#global-search');
  const results = el('#search-results');
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { closeSearchResults(); return; }
    const matches = searchIndex.filter(item => (item.title + ' ' + item.desc).toLowerCase().includes(q)).slice(0, 8);
    results.innerHTML = matches.length ? matches.map((m, i) => `
      <button class="search-result" data-i="${i}">
        <span class="tag tag-neutral">${m.type}</span>
        <span class="search-result-title">${m.title}</span>
      </button>`).join('') : emptyStateHTML('Nenhum resultado encontrado.');
    els('.search-result', results).forEach((btn, i) => btn.addEventListener('click', () => {
      matches[i].action();
      closeSearchResults();
      closeSearchModal();
      input.value = '';
    }));
    results.hidden = false;
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrap')) closeSearchResults();
  });
}
function closeSearchResults() {
  const results = el('#search-results');
  if (results) results.hidden = true;
}

/* ------------------------------------------------------------
   15. MODAL GENÉRICO
   ------------------------------------------------------------ */
function setupModal() {
  el('#modal-overlay').addEventListener('click', (e) => { if (e.target.id === 'modal-overlay') closeModal(); });
  el('#modal-close').addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}
function openModal(html) {
  el('#modal-body').innerHTML = html;
  el('#modal-overlay').hidden = false;
  document.body.classList.add('no-scroll');
}
function closeModal() {
  clearInterval(state.timer.interval);
  el('#modal-overlay').hidden = true;
  el('#modal-body').innerHTML = '';
  document.body.classList.remove('no-scroll');
}

/* ------------------------------------------------------------
   16. TOAST DE FEEDBACK
   ------------------------------------------------------------ */
let toastTimeout;
function showToast(message) {
  const toast = el('#toast');
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('is-visible'), 3200);
}

/* ------------------------------------------------------------
   17. LEMBRETE DE PAUSA (sutil, não invasivo)
   ------------------------------------------------------------ */
let viewChangesSinceReminder = 0;
document.addEventListener('DOMContentLoaded', () => {
  els('.nav-btn, [data-goto]').forEach(node => {
    node.addEventListener('click', () => {
      viewChangesSinceReminder++;
      if (viewChangesSinceReminder === 5) {
        showToast('Tem alguns minutos? Veja as pausas rápidas na Home.');
      }
    });
  });
});
