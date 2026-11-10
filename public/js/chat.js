/* Hipnos AI — chat flotante para las páginas de servicio: arranca minimizado (solo el botón redondo)
   y al hacer clic se abre la ventana. Usa el mismo asistente que la página principal (/api/chat).
   Saludo propio de cada página: <script src="/js/chat.js" data-hello-es="…" data-hello-en="…" defer> */
(function () {
  'use strict';

  var me = document.currentScript;
  var COPY = {
    es: {
      chatTitle: 'Asistente de Hipnos AI', chatLogLabel: 'Conversación', chatPlaceholder: 'Escribe tu mensaje…', chatSend: 'Enviar',
      chatNote: 'Las respuestas de la IA pueden tener errores. Los mensajes los procesa nuestro proveedor de IA; no compartas datos sensibles.',
      privacyLink: 'Privacidad',
      chatHello: '¡Hola! Soy el asistente de Hipnos AI. ¿En qué te ayudo?',
      chatTyping: 'Escribiendo…', chatNew: 'Nuevo chat', chatClose: 'Cerrar chat', chatOpen: 'Abrir chat', chatMin: 'Minimizar', chatMax: 'Ampliar', chatRestore: 'Tamaño normal',
      chatErrNotConfigured: 'El asistente todavía no está conectado. Escríbenos por WhatsApp: https://wa.me/593983120422',
      chatErrBusy: 'Hay muchas consultas en este momento. Espera un minuto e inténtalo de nuevo.',
      chatErr: 'No pude responder ahora. Escríbenos por WhatsApp: https://wa.me/593983120422'
    },
    en: {
      chatTitle: 'Hipnos AI assistant', chatLogLabel: 'Conversation', chatPlaceholder: 'Write your message…', chatSend: 'Send',
      chatNote: 'AI answers may contain mistakes. Messages are processed by our AI provider; please don’t share sensitive data.',
      privacyLink: 'Privacy',
      chatHello: 'Hi! I’m the Hipnos AI assistant. How can I help?',
      chatTyping: 'Typing…', chatNew: 'New chat', chatClose: 'Close chat', chatOpen: 'Open chat', chatMin: 'Minimize', chatMax: 'Expand', chatRestore: 'Restore size',
      chatErrNotConfigured: 'The assistant isn’t connected yet. Message us on WhatsApp: https://wa.me/593983120422',
      chatErrBusy: 'Too many requests right now. Please wait a minute and try again.',
      chatErr: 'I couldn’t answer right now. Message us on WhatsApp: https://wa.me/593983120422'
    }
  };
  if (me && me.dataset.helloEs) { COPY.es.chatHello = me.dataset.helloEs; }
  if (me && me.dataset.helloEn) { COPY.en.chatHello = me.dataset.helloEn; }

  var LOGO = '<svg width="29" height="21" viewBox="300 232 420 302" aria-hidden="true"><defs><linearGradient id="lgc" gradientUnits="userSpaceOnUse" x1="590" y1="244" x2="312" y2="530"><stop offset="0" stop-color="#3EBBF7"></stop><stop offset="1" stop-color="#1D6DE5"></stop></linearGradient></defs><g fill="none" stroke="#3EB6F4" stroke-width="10" stroke-linejoin="round"><path d="M580 328H628L660 272"></path><path d="M580 368H664"></path><path d="M580 406H628L660 462"></path></g><rect x="318" y="242" width="274" height="234" rx="58" fill="url(#lgc)"></rect><path d="M318 420V530L382 470Z" fill="url(#lgc)"></path><rect x="365" y="310" width="184" height="116" rx="58" fill="#0D1729"></rect><rect x="414" y="338" width="24" height="58" rx="12" fill="#3FE2E8"></rect><rect x="487" y="338" width="24" height="58" rx="12" fill="#3FE2E8"></rect><g fill="#3EB6F4"><circle cx="668" cy="264" r="25"></circle><circle cx="688" cy="368" r="25"></circle><circle cx="668" cy="472" r="25"></circle></g><g fill="#FFFFFF"><circle cx="668" cy="264" r="17"></circle><circle cx="688" cy="368" r="17"></circle><circle cx="668" cy="472" r="17"></circle></g><g fill="#0D1729"><circle cx="668" cy="264" r="12.5"></circle><circle cx="688" cy="368" r="12.5"></circle><circle cx="668" cy="472" r="12.5"></circle></g></svg>';
  var MARKUP =
    '<aside class="chat-panel is-small" id="chat-panel" aria-labelledby="panel-title" hidden>' +
      '<div class="panel-head">' + LOGO + '<h2 id="panel-title" data-c="chatTitle"></h2>' +
        '<button type="button" class="win-btn" id="panel-new" data-c-label="chatNew"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"></path><path d="M3 3v5h5"></path></svg></button>' +
        '<button type="button" class="win-btn" id="panel-min"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M5 18h14"></path></svg></button>' +
        '<button type="button" class="win-btn" id="panel-max"><svg class="ico-max" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path></svg><svg class="ico-restore" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7"></path></svg></button>' +
        '<button type="button" class="win-btn" id="panel-close" data-c-label="chatClose"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"></path></svg></button>' +
      '</div>' +
      '<div class="chat-log panel-log" id="panel-log" role="log" aria-live="polite" aria-relevant="additions" tabindex="0" data-c-label="chatLogLabel"></div>' +
      '<form class="chat-form" id="panel-form" autocomplete="off">' +
        '<label class="sr-only" for="panel-input" data-c="chatPlaceholder"></label>' +
        '<div class="field"><input id="panel-input" type="text" maxlength="800" data-c-ph="chatPlaceholder"></div>' +
        '<button type="submit" class="btn-search" id="panel-send" data-c="chatSend"></button>' +
      '</form>' +
      '<p class="chat-note"><span data-c="chatNote"></span> <a href="/privacy.html" data-c="privacyLink"></a></p>' +
    '</aside>' +
    '<button type="button" class="chat-fab" id="chat-fab" data-c-label="chatOpen"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.6A8.5 8.5 0 1 1 21 11.5z"></path><path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01"></path></svg></button>';

  // Memoria de la conversación: ventana de mensajes recientes + resumen acumulado de lo anterior (igual que en la página principal).
  var WINDOW = 10, MAX_UNSUMMARIZED = 14;
  var state = { history: [], summary: '', summarized: 0, busy: false, view: 'closed' };

  function $(id) { return document.getElementById(id); }
  function lang() { return document.documentElement.lang === 'es' ? 'es' : 'en'; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]; }); }
  function linkify(text) {
    return text
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(https?:\/\/[^\s<]+[^\s<.,;:!?)\]])/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
  }
  function addMsg(kind, text) {
    var log = $('panel-log');
    var div = document.createElement('div');
    div.className = 'msg ' + kind;
    div.innerHTML = linkify(esc(text));
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
    return div;
  }
  function resetChat() {
    state.history = []; state.summary = ''; state.summarized = 0;
    $('panel-log').innerHTML = '';
    addMsg('bot', COPY[lang()].chatHello);
  }
  function isDesktop() { return window.matchMedia('(min-width: 761px)').matches; }
  function setLabel(el, text) { el.setAttribute('aria-label', text); el.title = text; }
  // 'closed' (solo el botón redondo), 'small' (ventana), 'min' (solo la barra), 'max' (panel a la derecha).
  function setView(v) {
    var c = COPY[lang()];
    var panel = $('chat-panel');
    state.view = v;
    panel.hidden = v === 'closed';
    panel.classList.toggle('is-small', v === 'small');
    panel.classList.toggle('is-min', v === 'min');
    panel.classList.toggle('is-max', v === 'max');
    document.body.classList.toggle('chat-max', v === 'max');
    $('chat-fab').hidden = v !== 'closed';
    setLabel($('panel-max'), v === 'max' ? c.chatRestore : c.chatMax);
    setLabel($('panel-min'), v === 'min' ? c.chatRestore : c.chatMin);
  }
  function focusInput() {
    if ((state.view === 'small' || state.view === 'max') && isDesktop()) { $('panel-input').focus({ preventScroll: true }); }
  }
  function translate() {
    var c = COPY[lang()];
    var root = document.querySelectorAll('#chat-panel, #chat-fab');
    Array.prototype.forEach.call(root, function (box) {
      var els = [box].concat(Array.prototype.slice.call(box.querySelectorAll('[data-c],[data-c-label],[data-c-ph]')));
      els.forEach(function (el) {
        if (el.dataset.c) { el.textContent = c[el.dataset.c]; }
        if (el.dataset.cLabel) { setLabel(el, c[el.dataset.cLabel]); }
        if (el.dataset.cPh) { el.setAttribute('placeholder', c[el.dataset.cPh]); }
      });
    });
    setView(state.view);
    if (!state.history.length) { resetChat(); }
  }
  function setBusy(on) { state.busy = on; $('panel-send').disabled = on; }
  function send(text) {
    var c = COPY[lang()];
    text = String(text || '').trim();
    if (!text || state.busy) { return; }
    if (text.length > 800) { text = text.slice(0, 800); }
    addMsg('user', text);
    state.history.push({ role: 'user', content: text });
    var pending = state.history.slice(state.summarized);
    var older = [], windowMsgs = pending, foldTo = state.summarized;
    if (pending.length > MAX_UNSUMMARIZED) {
      older = pending.slice(0, pending.length - WINDOW);
      windowMsgs = pending.slice(pending.length - WINDOW);
      foldTo = state.history.length - WINDOW;
    }
    $('panel-input').value = '';
    setBusy(true);
    var typing = addMsg('bot typing', c.chatTyping);
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ lang: lang(), summary: state.summary, older: older, messages: windowMsgs })
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (d) { return { status: r.status, data: d }; });
    }).then(function (res) {
      typing.remove();
      if (res.status === 200 && res.data && res.data.reply) {
        if (typeof res.data.summary === 'string') { state.summary = res.data.summary; state.summarized = foldTo; }
        addMsg('bot', res.data.reply);
        state.history.push({ role: 'assistant', content: res.data.reply });
      } else {
        state.history.pop(); // el mensaje sin respuesta no entra en la memoria
        if (res.data && res.data.error === 'not_configured') { addMsg('error', c.chatErrNotConfigured); }
        else if (res.status === 429) { addMsg('error', c.chatErrBusy); }
        else { addMsg('error', c.chatErr); }
      }
    }).catch(function () {
      typing.remove();
      state.history.pop();
      addMsg('error', c.chatErr);
    }).then(function () {
      setBusy(false);
      focusInput();
    });
  }

  function init() {
    var holder = document.createElement('div');
    holder.innerHTML = MARKUP;
    while (holder.firstChild) { document.body.appendChild(holder.firstChild); }
    translate();
    $('panel-form').addEventListener('submit', function (e) { e.preventDefault(); send($('panel-input').value); });
    $('panel-close').addEventListener('click', function () { setView('closed'); $('chat-fab').focus({ preventScroll: true }); });
    $('panel-min').addEventListener('click', function () { setView(state.view === 'min' ? 'small' : 'min'); focusInput(); });
    $('panel-max').addEventListener('click', function () { setView(state.view === 'max' ? 'small' : 'max'); focusInput(); });
    $('chat-fab').addEventListener('click', function () { setView('small'); focusInput(); });
    $('panel-new').addEventListener('click', function () { if (!state.busy) { resetChat(); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && (state.view === 'small' || state.view === 'max')) { setView('min'); } });
    // El idioma lo cambia la página (botones EN/ES): el chat lo sigue.
    new MutationObserver(translate).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
