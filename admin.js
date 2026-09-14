/* ============================================================
   admin.js — Painel Administrativo do e-Concessões

   Autenticação e persistência reais via Supabase: o login usa
   supabase.auth (só entra quem tiver um usuário criado no projeto
   Supabase — veja SETUP-SUPABASE.md) e toda alteração é publicada
   direto na tabela site_content, valendo para todos os usuários do
   site imediatamente.
   ------------------------------------------------------------ */

const CATEGORY_LABELS = {
  saude: 'Saúde', bemestar: 'Bem-estar', alimentacao: 'Alimentação',
  mobilidade: 'Mobilidade', financeiro: 'Financeiro', desenvolvimento: 'Desenvolvimento',
  familia: 'Família', outros: 'Outros'
};
const ICON_OPTIONS = ['shield', 'gift', 'heart', 'coffee', 'link', 'file', 'book', 'users', 'brain', 'target', 'compass', 'document', 'bell', 'phone', 'support', 'walk', 'clock', 'calendar'];
const APP_BRAND_OPTIONS = [
  ['', 'Nenhum'],
  ['bradescoSaude', 'Bradesco Saúde'],
  ['bradescoSeguros', 'Bradesco Seguros'],
  ['flash', 'Flash'],
  ['conexa', 'Conexa'],
];
const EVENT_CATEGORY_OPTIONS = [
  ['evento', 'Evento'],
  ['remuneracao', 'Remuneração'],
  ['beneficios', 'Concessões'],
];
const AUDIENCE_LABELS = { clt: 'CLT', cooperativa: 'Cooperativa', pj: 'PJ' };

/* ------------------------------------------------------------
   Utilidades
   ------------------------------------------------------------ */
function el(sel, ctx) { return (ctx || document).querySelector(sel); }
function els(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function slugify(s) {
  return String(s || '').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'item';
}
function uniqueId(base, existingIds) {
  let id = slugify(base);
  let i = 2;
  while (existingIds.includes(id)) { id = `${slugify(base)}-${i}`; i++; }
  return id;
}

/* ------------------------------------------------------------
   Conexão com o Supabase
   ------------------------------------------------------------ */
let sbClient = null;
if (typeof SUPABASE_CONFIGURED !== 'undefined' && SUPABASE_CONFIGURED && typeof supabase !== 'undefined') {
  try { sbClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY); }
  catch (e) { console.warn('Não foi possível conectar ao Supabase.', e); }
}

/* Conteúdo carregado do banco após o login — nulo até showApp() rodar. */
let CONTENT = null;

/* ------------------------------------------------------------
   Login / sessão
   ------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', async () => {
  if (!sbClient) {
    el('#admin-login-form').hidden = true;
    el('#admin-not-configured').hidden = false;
    return;
  }

  const { data: { session } } = await sbClient.auth.getSession();
  if (session) { await showApp(); }

  el('#admin-login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = el('#admin-login-submit');
    const email = el('#admin-user').value.trim();
    const pass = el('#admin-pass').value;
    submitBtn.disabled = true; submitBtn.textContent = 'ENTRANDO...';
    const { error } = await sbClient.auth.signInWithPassword({ email, password: pass });
    submitBtn.disabled = false; submitBtn.textContent = 'ENTRAR';
    if (error) { el('#admin-login-error').hidden = false; return; }
    el('#admin-login-error').hidden = true;
    await showApp();
  });

  el('#admin-logout').addEventListener('click', async () => {
    await sbClient.auth.signOut();
    location.reload();
  });
});

async function showApp() {
  const { data, error } = await sbClient.from('site_content').select('data').eq('id', 1).single();
  if (error || !data) {
    alert('Não foi possível carregar o conteúdo do banco de dados. Verifique sua conexão e tente entrar novamente.');
    await sbClient.auth.signOut();
    return;
  }
  CONTENT = data.data;
  /* Compatibilidade com bancos de dados criados antes da aba "Desenvolvimento"
     existir: preenche com o conteúdo padrão em vez de quebrar o painel. Ao
     salvar qualquer alteração, isso já fica gravado no banco. */
  if (!CONTENT.development) CONTENT.development = JSON.parse(JSON.stringify(DEFAULT_CONTENT.development));

  el('#admin-login').hidden = true;
  el('#admin-app').hidden = false;

  setupNav();
  setupAudienceTabs();
  setupModal();
  setupDataTab();
  setupDevPanel();
  el('#admin-benefit-new').addEventListener('click', () => openBenefitForm(state.audience.concessoes, null));
  el('#admin-event-new').addEventListener('click', () => openEventForm(state.audience.calendario, null));
  el('#admin-doc-new').addEventListener('click', () => openDocForm(state.audience.documentos, null));
  el('#admin-aviso-new').addEventListener('click', () => openAvisoForm(null));

  renderAll();
}

/* ------------------------------------------------------------
   Navegação (abas principais + abas de vínculo)
   ------------------------------------------------------------ */
const state = { tab: 'concessoes', audience: { concessoes: 'clt', calendario: 'clt', documentos: 'clt' } };

function setupNav() {
  els('.admin-nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      state.tab = btn.getAttribute('data-tab');
      els('.admin-nav-item').forEach(b => b.classList.toggle('is-active', b === btn));
      els('.admin-panel').forEach(p => p.hidden = p.getAttribute('data-panel') !== state.tab);
    });
  });
}
function setupAudienceTabs() {
  els('[data-audience-tabs]').forEach(wrap => {
    const panel = wrap.getAttribute('data-audience-tabs');
    els('.chip', wrap).forEach(chip => {
      chip.addEventListener('click', () => {
        state.audience[panel] = chip.getAttribute('data-aud');
        els('.chip', wrap).forEach(c => c.classList.toggle('is-active', c === chip));
        if (panel === 'concessoes') renderBenefitsList();
        if (panel === 'calendario') renderEventsList();
        if (panel === 'documentos') renderDocsList();
      });
    });
  });
}
function renderAll() {
  renderBenefitsList();
  renderEventsList();
  renderDocsList();
  renderAvisosList();
  renderDevForm();
}

/* ------------------------------------------------------------
   Modal genérico de formulário
   ------------------------------------------------------------ */
function setupModal() {
  el('#admin-modal-close').addEventListener('click', closeAdminModal);
  el('#admin-modal-overlay').addEventListener('click', (e) => { if (e.target.id === 'admin-modal-overlay') closeAdminModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAdminModal(); });
}
function openAdminModal(html) {
  el('#admin-modal-body').innerHTML = html;
  el('#admin-modal-overlay').hidden = false;
}
function closeAdminModal() {
  el('#admin-modal-overlay').hidden = true;
  el('#admin-modal-body').innerHTML = '';
}

let toastTimeout;
function showToast(message) {
  const toast = el('#admin-toast');
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('is-visible'), 4200);
}

function emptyRow(msg) { return `<div class="admin-empty">${esc(msg)}</div>`; }

/* Publica o CONTENT atual no Supabase. Sempre retorna se deu certo ou
   não — os formulários seguem em frente de qualquer forma (o que foi
   editado já está refletido localmente), mas avisam claramente quando
   a publicação falhou, para o administrador saber que precisa tentar
   salvar de novo. */
async function saveContent(successMsg) {
  try {
    const { error } = await sbClient.from('site_content').update({ data: CONTENT }).eq('id', 1);
    if (error) throw error;
    showToast(successMsg);
    return true;
  } catch (err) {
    showToast(`Não foi possível publicar a alteração (${err.message || 'erro de conexão'}). Tente salvar novamente.`);
    return false;
  }
}

/* ------------------------------------------------------------
   CONCESSÕES
   ------------------------------------------------------------ */
function renderBenefitsList() {
  const aud = state.audience.concessoes;
  const list = CONTENT.audiences[aud].benefits;
  const wrap = el('#admin-benefits-list');
  wrap.innerHTML = list.length ? list.map(b => `
    <div class="admin-row">
      <div class="admin-row-body">
        <span class="admin-row-title">${esc(b.name)}</span>
        <span class="admin-row-desc">${esc(b.short)}</span>
      </div>
      <div class="admin-row-actions">
        <button class="btn btn-ghost" data-edit="${esc(b.id)}">EDITAR</button>
      </div>
    </div>`).join('') : emptyRow('Nenhuma concessão cadastrada para este vínculo ainda.');
  els('[data-edit]', wrap).forEach(btn => btn.addEventListener('click', () => {
    const b = CONTENT.audiences[aud].benefits.find(x => x.id === btn.getAttribute('data-edit'));
    openBenefitForm(aud, b);
  }));
}

function linesToCompareOptions(text) {
  return text.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
    const [title, desc] = l.split('|').map(s => (s || '').trim());
    return { title: title || l, desc: desc || '' };
  });
}
function compareOptionsToLines(opts) { return (opts || []).map(o => `${o.title} | ${o.desc}`).join('\n'); }
function linesToExtraLinks(text) {
  return text.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
    const [label, url] = l.split('|').map(s => (s || '').trim());
    return url ? { label: label || l, status: 'ready', url } : { label: label || l, status: 'pending' };
  });
}
function extraLinksToLines(links) { return (links || []).map(l => l.status === 'ready' ? `${l.label} | ${l.url}` : l.label).join('\n'); }
function linesToEmails(text) {
  return text.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
    const [label, email] = l.split('|').map(s => (s || '').trim());
    return { label: label || 'Contato', email: email || label };
  });
}
function emailsToLines(emails) { return (emails || []).map(h => `${h.label} | ${h.email}`).join('\n'); }

function openBenefitForm(aud, b) {
  const isNew = !b;
  const iconOpts = ICON_OPTIONS.map(i => `<option value="${i}" ${b && b.icon === i ? 'selected' : ''}>${i}</option>`).join('');
  const catOpts = Object.entries(CATEGORY_LABELS).map(([k, label]) => `<option value="${k}" ${b && b.category === k ? 'selected' : ''}>${label}</option>`).join('');
  const brandOpts = APP_BRAND_OPTIONS.map(([k, label]) => `<option value="${k}" ${b && b.appBrand === k ? 'selected' : ''}>${label}</option>`).join('');
  openAdminModal(`
    <h3>${isNew ? 'Nova concessão' : 'Editar concessão'}</h3>
    <p class="admin-modal-note">Vínculo: <strong>${AUDIENCE_LABELS[aud]}</strong>. Deixe em branco os campos que não se aplicam — eles simplesmente não aparecerão no card.</p>
    <form class="admin-form" id="benefit-form">
      <div class="admin-form-row">
        <label class="admin-field"><span>Nome *</span><input type="text" id="bf-name" required value="${esc(b?.name)}"></label>
        <label class="admin-field"><span>Categoria</span><select id="bf-category">${catOpts}</select></label>
      </div>
      <label class="admin-field"><span>Descrição curta (aparece no card) *</span><input type="text" id="bf-short" required value="${esc(b?.short)}"></label>
      <div class="admin-form-row">
        <label class="admin-field"><span>Ícone</span><select id="bf-icon">${iconOpts}</select></label>
        <label class="admin-field"><span>Necessidade (opcional)</span><input type="text" id="bf-necessidade" value="${esc(b?.necessidade)}"></label>
      </div>
      <p class="admin-form-hint">"Necessidade" é usada para agrupar em "Preciso de apoio". Não altere o valor "Apoio psicológico" em concessões já existentes, pois o banner da Home procura exatamente por esse texto.</p>
      <label class="admin-field"><span>Texto de apresentação no modal (opcional)</span><textarea id="bf-lead">${esc(b?.lead)}</textarea></label>
      <label class="admin-field"><span>Como funciona (opcional)</span><textarea id="bf-comofunciona">${esc(b?.comoFunciona)}</textarea></label>
      <label class="admin-field"><span>Atendimentos disponíveis (opcional, separados por vírgula)</span><input type="text" id="bf-atendimentos" value="${esc((b?.atendimentos || []).join(', '))}"></label>
      <div class="admin-form-row">
        <label class="admin-field"><span>Link de acesso (opcional)</span><input type="url" id="bf-accessurl" value="${esc(b?.accessUrl)}"></label>
        <label class="admin-field"><span>Texto do botão</span><input type="text" id="bf-accesslabel" value="${esc(b?.accessLabel || 'ACESSAR CONCESSÃO')}"></label>
      </div>
      <label class="admin-field"><span>Aplicativo oficial associado (opcional)</span><select id="bf-appbrand">${brandOpts}</select></label>
      <label class="admin-field"><span>Como solicitar (opcional)</span><input type="text" id="bf-solicitarnote" value="${esc(b?.solicitarNote)}"></label>
      <label class="admin-field"><span>Opções para comparar (opcional, uma por linha: Título | Descrição)</span><textarea id="bf-compareoptions">${esc(compareOptionsToLines(b?.compareOptions))}</textarea></label>
      <label class="admin-field"><span>Links extras (opcional, uma por linha: Rótulo | URL — sem URL fica "em breve")</span><textarea id="bf-extralinks">${esc(extraLinksToLines(b?.extraLinks))}</textarea></label>
      <label class="admin-field"><span>Contatos de ajuda (opcional, um por linha: Rótulo | e-mail)</span><textarea id="bf-helpemails">${esc(emailsToLines(b?.helpEmails))}</textarea></label>
      <label class="admin-form-check"><input type="checkbox" id="bf-apoio" ${b?.apoio ? 'checked' : ''}> Mostrar em "Preciso de apoio" (e-Cuidado)</label>
      <label class="admin-form-check"><input type="checkbox" id="bf-crisis" ${b?.crisisBlock ? 'checked' : ''}> Mostrar bloco do CVV ("Preciso de ajuda agora")</label>
      <div class="admin-form-actions">
        <div>${isNew ? '' : `<button type="button" class="admin-form-delete" id="bf-delete">EXCLUIR CONCESSÃO</button>`}</div>
        <div class="admin-form-actions-right">
          <button type="button" class="btn btn-ghost" id="bf-cancel">CANCELAR</button>
          <button type="submit" class="btn btn-primary">SALVAR</button>
        </div>
      </div>
    </form>
  `);
  el('#bf-cancel').addEventListener('click', closeAdminModal);
  if (!isNew) el('#bf-delete').addEventListener('click', async () => {
    if (!confirm(`Excluir a concessão "${b.name}"? Isso será publicado imediatamente para todos.`)) return;
    const arr = CONTENT.audiences[aud].benefits;
    arr.splice(arr.findIndex(x => x.id === b.id), 1);
    await saveContent('Concessão excluída.');
    closeAdminModal();
    renderBenefitsList();
  });
  el('#benefit-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = el('#bf-name').value.trim();
    const short = el('#bf-short').value.trim();
    if (!name || !short) return;
    const atendimentos = el('#bf-atendimentos').value.split(',').map(s => s.trim()).filter(Boolean);
    const obj = {
      id: isNew ? uniqueId(name, CONTENT.audiences[aud].benefits.map(x => x.id)) : b.id,
      icon: el('#bf-icon').value,
      category: el('#bf-category').value,
      name, short,
    };
    if (el('#bf-necessidade').value.trim()) obj.necessidade = el('#bf-necessidade').value.trim();
    if (el('#bf-lead').value.trim()) obj.lead = el('#bf-lead').value.trim();
    if (el('#bf-comofunciona').value.trim()) obj.comoFunciona = el('#bf-comofunciona').value.trim();
    if (atendimentos.length) obj.atendimentos = atendimentos;
    if (el('#bf-accessurl').value.trim()) { obj.accessUrl = el('#bf-accessurl').value.trim(); obj.accessLabel = el('#bf-accesslabel').value.trim() || 'ACESSAR CONCESSÃO'; }
    if (el('#bf-appbrand').value) obj.appBrand = el('#bf-appbrand').value;
    if (el('#bf-solicitarnote').value.trim()) obj.solicitarNote = el('#bf-solicitarnote').value.trim();
    const compareOptions = linesToCompareOptions(el('#bf-compareoptions').value);
    if (compareOptions.length) obj.compareOptions = compareOptions;
    const extraLinks = linesToExtraLinks(el('#bf-extralinks').value);
    if (extraLinks.length) obj.extraLinks = extraLinks;
    const helpEmails = linesToEmails(el('#bf-helpemails').value);
    if (helpEmails.length) obj.helpEmails = helpEmails;
    obj.apoio = el('#bf-apoio').checked;
    if (el('#bf-crisis').checked) obj.crisisBlock = true;

    const arr = CONTENT.audiences[aud].benefits;
    if (isNew) arr.push(obj);
    else arr[arr.findIndex(x => x.id === b.id)] = obj;
    await saveContent(isNew ? 'Concessão criada e publicada.' : 'Concessão atualizada e publicada.');
    closeAdminModal();
    renderBenefitsList();
  });
}

/* ------------------------------------------------------------
   CALENDÁRIO — eventos personalizados
   ------------------------------------------------------------ */
function renderEventsList() {
  const aud = state.audience.calendario;
  const list = (CONTENT.customEvents[aud] || []).slice().sort((a, b) => a.date.localeCompare(b.date));
  const wrap = el('#admin-events-list');
  wrap.innerHTML = list.length ? list.map((ev, i) => `
    <div class="admin-row">
      <div class="admin-row-body">
        <span class="admin-row-title">${formatDateBR(ev.date)} · ${esc(ev.title)}</span>
        <span class="admin-row-desc">${esc(ev.description || '')}</span>
      </div>
      <div class="admin-row-actions">
        <button class="btn btn-ghost" data-edit="${i}">EDITAR</button>
      </div>
    </div>`).join('') : emptyRow('Nenhum evento personalizado cadastrado para este vínculo ainda.');
  els('[data-edit]', wrap).forEach(btn => btn.addEventListener('click', () => {
    openEventForm(aud, list[parseInt(btn.getAttribute('data-edit'), 10)]);
  }));
}
function formatDateBR(iso) {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}
function openEventForm(aud, ev) {
  const isNew = !ev;
  const catOpts = EVENT_CATEGORY_OPTIONS.map(([k, label]) => `<option value="${k}" ${ev && ev.category === k ? 'selected' : ''}>${label}</option>`).join('');
  openAdminModal(`
    <h3>${isNew ? 'Novo evento' : 'Editar evento'}</h3>
    <p class="admin-modal-note">Vínculo: <strong>${AUDIENCE_LABELS[aud]}</strong>. Este evento aparecerá no calendário apenas na data escolhida, junto aos eventos automáticos.</p>
    <form class="admin-form" id="event-form">
      <div class="admin-form-row">
        <label class="admin-field"><span>Data *</span><input type="date" id="ev-date" required value="${ev?.date || ''}"></label>
        <label class="admin-field"><span>Categoria</span><select id="ev-category">${catOpts}</select></label>
      </div>
      <label class="admin-field"><span>Título *</span><input type="text" id="ev-title" required value="${esc(ev?.title)}"></label>
      <label class="admin-field"><span>Descrição (opcional)</span><textarea id="ev-desc">${esc(ev?.description)}</textarea></label>
      <div class="admin-form-actions">
        <div>${isNew ? '' : `<button type="button" class="admin-form-delete" id="ev-delete">EXCLUIR EVENTO</button>`}</div>
        <div class="admin-form-actions-right">
          <button type="button" class="btn btn-ghost" id="ev-cancel">CANCELAR</button>
          <button type="submit" class="btn btn-primary">SALVAR</button>
        </div>
      </div>
    </form>
  `);
  el('#ev-cancel').addEventListener('click', closeAdminModal);
  const arr = CONTENT.customEvents[aud];
  if (!isNew) el('#ev-delete').addEventListener('click', async () => {
    if (!confirm(`Excluir o evento "${ev.title}"? Isso será publicado imediatamente para todos.`)) return;
    arr.splice(arr.indexOf(ev), 1);
    await saveContent('Evento excluído.');
    closeAdminModal();
    renderEventsList();
  });
  el('#event-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const date = el('#ev-date').value;
    const title = el('#ev-title').value.trim();
    if (!date || !title) return;
    const obj = { date, title, category: el('#ev-category').value, description: el('#ev-desc').value.trim() };
    if (isNew) arr.push(obj);
    else Object.assign(ev, obj);
    await saveContent(isNew ? 'Evento criado e publicado.' : 'Evento atualizado e publicado.');
    closeAdminModal();
    renderEventsList();
  });
}

/* ------------------------------------------------------------
   DOCUMENTOS
   ------------------------------------------------------------ */
function renderDocsList() {
  const aud = state.audience.documentos;
  const list = CONTENT.audiences[aud].documents;
  const wrap = el('#admin-docs-list');
  wrap.innerHTML = list.length ? list.map((d, i) => `
    <div class="admin-row">
      <div class="admin-row-body">
        <span class="admin-row-title">${esc(d.name)}</span>
        <span class="admin-row-desc">${esc(d.category)} · ${esc(d.short)}</span>
      </div>
      <div class="admin-row-actions">
        <button class="btn btn-ghost" data-edit="${i}">EDITAR</button>
      </div>
    </div>`).join('') : emptyRow('Nenhum documento publicado para este vínculo ainda.');
  els('[data-edit]', wrap).forEach(btn => btn.addEventListener('click', () => {
    openDocForm(aud, list[parseInt(btn.getAttribute('data-edit'), 10)]);
  }));
}
function openDocForm(aud, d) {
  const isNew = !d;
  openAdminModal(`
    <h3>${isNew ? 'Novo documento' : 'Editar documento'}</h3>
    ${isNew ? `
    <p class="admin-modal-note">Escolha para quais vínculos este documento será publicado. Pode marcar mais de um para não precisar repetir o upload.</p>
    <div class="chip-row" id="doc-audience-chips">
      <button type="button" class="chip${aud === 'clt' ? ' is-active' : ''}" data-aud="clt">CLT</button>
      <button type="button" class="chip${aud === 'cooperativa' ? ' is-active' : ''}" data-aud="cooperativa">Cooperativa</button>
      <button type="button" class="chip${aud === 'pj' ? ' is-active' : ''}" data-aud="pj">PJ</button>
    </div>
    ` : `<p class="admin-modal-note">Vínculo: <strong>${AUDIENCE_LABELS[aud]}</strong>. Para publicar este mesmo documento em outro vínculo, crie um novo documento e marque os vínculos desejados.</p>`}
    <p class="admin-modal-note">Anexe um arquivo PDF ou informe uma URL de um documento já hospedado — use apenas uma das duas opções.</p>
    <form class="admin-form" id="doc-form">
      <div class="admin-form-row">
        <label class="admin-field"><span>Nome *</span><input type="text" id="doc-name" required value="${esc(d?.name)}"></label>
        <label class="admin-field"><span>Categoria *</span><input type="text" id="doc-category" required value="${esc(d?.category)}" placeholder="Ex.: Política, RH..."></label>
      </div>
      <label class="admin-field"><span>Descrição curta *</span><input type="text" id="doc-short" required value="${esc(d?.short)}"></label>
      <label class="admin-field"><span>Anexar arquivo PDF</span><input type="file" id="doc-file" accept="application/pdf"></label>
      <p class="admin-form-hint">${d?.fileName ? `Arquivo atual: ${esc(d.fileName)}. Escolha outro arquivo para substituir.` : 'Ao anexar um arquivo, ele é enviado e publicado automaticamente.'}</p>
      <label class="admin-field"><span>Ou informe uma URL</span><input type="url" id="doc-url" value="${esc(d?.fileData ? '' : d?.url)}"></label>
      <p class="admin-login-error" id="doc-audience-error" hidden>Selecione pelo menos um vínculo.</p>
      <div class="admin-form-actions">
        <div>${isNew ? '' : `<button type="button" class="admin-form-delete" id="doc-delete">EXCLUIR DOCUMENTO</button>`}</div>
        <div class="admin-form-actions-right">
          <button type="button" class="btn btn-ghost" id="doc-cancel">CANCELAR</button>
          <button type="submit" class="btn btn-primary" id="doc-submit">SALVAR</button>
        </div>
      </div>
    </form>
  `);
  el('#doc-cancel').addEventListener('click', closeAdminModal);
  if (isNew) {
    els('#doc-audience-chips .chip').forEach(chip => chip.addEventListener('click', () => {
      chip.classList.toggle('is-active');
    }));
  }
  const arr = CONTENT.audiences[aud].documents;
  if (!isNew) el('#doc-delete').addEventListener('click', async () => {
    if (!confirm(`Excluir o documento "${d.name}"? Isso será publicado imediatamente para todos.`)) return;
    arr.splice(arr.indexOf(d), 1);
    await saveContent('Documento excluído.');
    closeAdminModal();
    renderDocsList();
  });
  el('#doc-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = el('#doc-name').value.trim();
    const category = el('#doc-category').value.trim();
    const short = el('#doc-short').value.trim();
    if (!name || !category || !short) return;

    let targetAuds = [aud];
    if (isNew) {
      targetAuds = els('#doc-audience-chips .chip.is-active').map(chip => chip.getAttribute('data-aud'));
      if (!targetAuds.length) { el('#doc-audience-error').hidden = false; return; }
      el('#doc-audience-error').hidden = true;
    }

    const file = el('#doc-file').files[0];
    const submitBtn = el('#doc-submit');

    const obj = { icon: 'file', name, category, short };
    if (file) {
      submitBtn.disabled = true; submitBtn.textContent = 'ENVIANDO...';
      const path = `${targetAuds.join('-')}/${Date.now()}-${slugify(file.name)}.pdf`;
      const { error: upErr } = await sbClient.storage.from('documents').upload(path, file, { upsert: true, contentType: file.type || 'application/pdf' });
      submitBtn.disabled = false; submitBtn.textContent = 'SALVAR';
      if (upErr) { showToast('Erro ao enviar o arquivo: ' + upErr.message); return; }
      const { data: pub } = sbClient.storage.from('documents').getPublicUrl(path);
      obj.url = pub.publicUrl;
      obj.fileName = file.name;
    } else if (el('#doc-url').value.trim()) {
      obj.url = el('#doc-url').value.trim();
    } else if (d?.url) {
      obj.url = d.url; obj.fileName = d.fileName;
    } else if (d?.fileData) {
      obj.fileData = d.fileData; obj.fileName = d.fileName;
    }

    if (isNew) {
      targetAuds.forEach(a => CONTENT.audiences[a].documents.push({ ...obj }));
    } else {
      arr[arr.indexOf(d)] = obj;
    }
    await saveContent(isNew
      ? (targetAuds.length > 1 ? `Documento publicado para ${targetAuds.length} vínculos.` : 'Documento publicado.')
      : 'Documento atualizado e publicado.');
    closeAdminModal();
    renderDocsList();
  });
}

/* ------------------------------------------------------------
   AVISOS
   ------------------------------------------------------------ */
function renderAvisosList() {
  const list = CONTENT.avisos;
  const wrap = el('#admin-avisos-list');
  wrap.innerHTML = list.length ? list.map((a, i) => `
    <div class="admin-row">
      <label class="admin-toggle">
        <input type="checkbox" data-toggle="${i}" ${a.active ? 'checked' : ''}>
        <span class="admin-toggle-track"></span>
      </label>
      <div class="admin-row-body">
        <span class="admin-row-title">${esc(a.title)}</span>
        <span class="admin-row-desc">${AUDIENCE_LABELS[a.audience] || 'Todos'} · ${esc(a.message)}</span>
      </div>
      <div class="admin-row-actions">
        <button class="btn btn-ghost" data-edit="${i}">EDITAR</button>
      </div>
    </div>`).join('') : emptyRow('Nenhum aviso cadastrado ainda.');
  els('[data-edit]', wrap).forEach(btn => btn.addEventListener('click', () => openAvisoForm(list[parseInt(btn.getAttribute('data-edit'), 10)])));
  els('[data-toggle]', wrap).forEach(chk => chk.addEventListener('change', async () => {
    list[parseInt(chk.getAttribute('data-toggle'), 10)].active = chk.checked;
    await saveContent(chk.checked ? 'Aviso ativado e publicado.' : 'Aviso desativado.');
  }));
}
function openAvisoForm(a) {
  const isNew = !a;
  const audOpts = [['todos', 'Todos os vínculos'], ['clt', 'CLT'], ['cooperativa', 'Cooperativa'], ['pj', 'PJ']]
    .map(([k, label]) => `<option value="${k}" ${a && a.audience === k ? 'selected' : (isNew && k === 'todos' ? 'selected' : '')}>${label}</option>`).join('');
  openAdminModal(`
    <h3>${isNew ? 'Novo aviso' : 'Editar aviso'}</h3>
    <p class="admin-modal-note">Aparece em destaque no topo da Home enquanto estiver marcado como ativo.</p>
    <form class="admin-form" id="aviso-form">
      <label class="admin-field"><span>Título *</span><input type="text" id="av-title" required value="${esc(a?.title)}"></label>
      <label class="admin-field"><span>Mensagem *</span><textarea id="av-message" required>${esc(a?.message)}</textarea></label>
      <div class="admin-form-row">
        <label class="admin-field"><span>Link "Saiba mais" (opcional)</span><input type="url" id="av-link" value="${esc(a?.link)}"></label>
        <label class="admin-field"><span>Público</span><select id="av-audience">${audOpts}</select></label>
      </div>
      <label class="admin-form-check"><input type="checkbox" id="av-active" ${!a || a.active ? 'checked' : ''}> Ativo (visível na Home)</label>
      <div class="admin-form-actions">
        <div>${isNew ? '' : `<button type="button" class="admin-form-delete" id="av-delete">EXCLUIR AVISO</button>`}</div>
        <div class="admin-form-actions-right">
          <button type="button" class="btn btn-ghost" id="av-cancel">CANCELAR</button>
          <button type="submit" class="btn btn-primary">SALVAR</button>
        </div>
      </div>
    </form>
  `);
  el('#av-cancel').addEventListener('click', closeAdminModal);
  if (!isNew) el('#av-delete').addEventListener('click', async () => {
    if (!confirm(`Excluir o aviso "${a.title}"? Isso será publicado imediatamente para todos.`)) return;
    CONTENT.avisos.splice(CONTENT.avisos.indexOf(a), 1);
    await saveContent('Aviso excluído.');
    closeAdminModal();
    renderAvisosList();
  });
  el('#aviso-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = el('#av-title').value.trim();
    const message = el('#av-message').value.trim();
    if (!title || !message) return;
    const obj = { title, message, audience: el('#av-audience').value, active: el('#av-active').checked };
    if (el('#av-link').value.trim()) obj.link = el('#av-link').value.trim();
    if (isNew) CONTENT.avisos.push(obj);
    else Object.assign(a, { link: undefined }, obj);
    await saveContent(isNew ? 'Aviso criado e publicado.' : 'Aviso atualizado e publicado.');
    closeAdminModal();
    renderAvisosList();
  });
}

/* ------------------------------------------------------------
   DADOS E PUBLICAÇÃO
   ------------------------------------------------------------ */
function setupDataTab() {
  el('#admin-export-datajs').addEventListener('click', exportDataJs);
  el('#admin-export-backup').addEventListener('click', exportBackup);
  el('#admin-import-backup').addEventListener('change', importBackup);
  el('#admin-reset').addEventListener('click', async () => {
    if (!confirm('Isso vai publicar o conteúdo original de fábrica para TODOS os usuários agora, substituindo tudo o que foi editado neste painel. Deseja continuar?')) return;
    CONTENT = JSON.parse(JSON.stringify(DEFAULT_CONTENT));
    const ok = await saveContent('Conteúdo padrão restaurado e publicado.');
    if (ok) renderAll();
  });
}

/* ------------------------------------------------------------
   DESENVOLVIMENTO
   ------------------------------------------------------------ */
function linesToTrainingGroups(text) {
  return text.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
    const [name, itemsStr] = l.split('|').map(s => (s || '').trim());
    const items = (itemsStr || '').split(';').map(s => s.trim()).filter(Boolean);
    return { name: name || l, items };
  });
}
function trainingGroupsToLines(groups) {
  return (groups || []).map(g => `${g.name} | ${(g.items || []).join('; ')}`).join('\n');
}

function renderDevForm() {
  const d = CONTENT.development;
  const cert = d.certificacoesInfo, mov = d.oportunidadesInfo, news = d.enews;

  el('#dev-cert-message').value = cert.message || '';
  el('#dev-cert-como').value = cert.comoFunciona || '';
  el('#dev-cert-file').value = '';
  el('#dev-cert-url').value = cert.policyStatus === 'ready' ? (cert.policyUrl || '') : '';
  el('#dev-cert-file-hint').textContent = cert.policyStatus === 'ready'
    ? 'Política publicada. Anexe outro arquivo (ou informe outra URL) para substituir.'
    : 'Nada publicado ainda — o site mostra "em breve" até anexar um PDF ou informar uma URL.';
  el('#dev-cert-emails').value = emailsToLines(cert.helpEmails);

  el('#dev-train-groups').value = trainingGroupsToLines(d.treinamentoGroups);
  el('#dev-train-certurl').value = d.certificatesUrl || '';
  el('#dev-train-email').value = d.treinamentosHelpEmail || '';

  el('#dev-move-message').value = mov.message || '';
  el('#dev-move-jobsurl').value = mov.jobsUrl || '';
  el('#dev-move-jobslabel').value = mov.jobsLabel || '';
  el('#dev-move-file').value = '';
  el('#dev-move-url').value = mov.policyStatus === 'ready' ? (mov.policyUrl || '') : '';
  el('#dev-move-file-hint').textContent = mov.policyStatus === 'ready'
    ? 'Política publicada. Anexe outro arquivo (ou informe outra URL) para substituir.'
    : 'Nada publicado ainda — o site mostra "em breve" até anexar um PDF ou informar uma URL.';

  el('#dev-enews-desc').value = news.desc || '';
  el('#dev-enews-file').value = '';
  el('#dev-enews-url').value = news.accessStatus === 'ready' ? (news.accessUrl || '') : '';
  el('#dev-enews-file-hint').textContent = news.accessStatus === 'ready'
    ? 'Publicado. Anexe outro arquivo (ou informe outra URL) para substituir.'
    : 'Nada publicado ainda — o site mostra "em breve" até anexar um arquivo ou informar uma URL.';
}

async function uploadDevFile(file, label) {
  const path = `desenvolvimento/${Date.now()}-${slugify(file.name)}.pdf`;
  const { error } = await sbClient.storage.from('documents').upload(path, file, { upsert: true, contentType: file.type || 'application/pdf' });
  if (error) throw new Error(`${label}: ${error.message}`);
  const { data: pub } = sbClient.storage.from('documents').getPublicUrl(path);
  return pub.publicUrl;
}

function setupDevPanel() {
  renderDevForm();
  el('#dev-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const d = CONTENT.development;
    const cert = d.certificacoesInfo, mov = d.oportunidadesInfo, news = d.enews;
    const certFile = el('#dev-cert-file').files[0];
    const moveFile = el('#dev-move-file').files[0];
    const enewsFile = el('#dev-enews-file').files[0];
    const submitBtn = el('#dev-submit');

    submitBtn.disabled = true; submitBtn.textContent = 'SALVANDO...';
    try {
      if (certFile) {
        cert.policyUrl = await uploadDevFile(certFile, 'Certificações');
        cert.policyStatus = 'ready';
      } else if (el('#dev-cert-url').value.trim()) {
        cert.policyUrl = el('#dev-cert-url').value.trim();
        cert.policyStatus = 'ready';
      }
      cert.message = el('#dev-cert-message').value.trim();
      cert.comoFunciona = el('#dev-cert-como').value.trim();
      cert.helpEmails = linesToEmails(el('#dev-cert-emails').value);

      d.treinamentoGroups = linesToTrainingGroups(el('#dev-train-groups').value);
      d.certificatesUrl = el('#dev-train-certurl').value.trim();
      d.treinamentosHelpEmail = el('#dev-train-email').value.trim();

      if (moveFile) {
        mov.policyUrl = await uploadDevFile(moveFile, 'e-Move');
        mov.policyStatus = 'ready';
      } else if (el('#dev-move-url').value.trim()) {
        mov.policyUrl = el('#dev-move-url').value.trim();
        mov.policyStatus = 'ready';
      }
      mov.message = el('#dev-move-message').value.trim();
      mov.jobsUrl = el('#dev-move-jobsurl').value.trim();
      mov.jobsLabel = el('#dev-move-jobslabel').value.trim();

      if (enewsFile) {
        news.accessUrl = await uploadDevFile(enewsFile, 'e-News');
        news.accessStatus = 'ready';
      } else if (el('#dev-enews-url').value.trim()) {
        news.accessUrl = el('#dev-enews-url').value.trim();
        news.accessStatus = 'ready';
      }
      news.desc = el('#dev-enews-desc').value.trim();
    } catch (err) {
      submitBtn.disabled = false; submitBtn.textContent = 'SALVAR DESENVOLVIMENTO';
      showToast('Erro ao enviar arquivo: ' + err.message);
      return;
    }

    await saveContent('Desenvolvimento atualizado e publicado.');
    submitBtn.disabled = false; submitBtn.textContent = 'SALVAR DESENVOLVIMENTO';
    renderDevForm();
  });
}
function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
function exportDataJs() {
  const text = `/* ============================================================
   e-Concessões — data.js
   Cópia local gerada pelo Painel Administrativo a partir do conteúdo
   publicado no banco de dados. Serve como conteúdo padrão/inicial —
   as alterações do dia a dia já estão publicadas automaticamente e
   não dependem deste arquivo.
   ============================================================ */
const CONTENT_STORAGE_KEY = 'econcessoes_admin_content_v1';

const DEFAULT_CONTENT = ${JSON.stringify(CONTENT, null, 2)};
`;
  downloadFile('data.js', text, 'text/javascript');
  showToast('data.js gerado com o conteúdo atual.');
}
function exportBackup() {
  downloadFile('e-concessoes-backup.json', JSON.stringify(CONTENT, null, 2), 'application/json');
  showToast('Backup baixado.');
}
function importBackup(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (!parsed.audiences || !parsed.customEvents) throw new Error('formato inválido');
      CONTENT = parsed;
      const ok = await saveContent('Backup importado e publicado.');
      if (ok) renderAll();
    } catch (err) {
      alert('Não foi possível importar este arquivo: ' + err.message);
    }
    e.target.value = '';
  };
  reader.readAsText(file);
}
