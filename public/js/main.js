/* Hipnos AI — web base. Idioma EN/ES (empieza en inglés), modo claro/oscuro (empieza claro), chat con IA y luces de los bordes. */
(function () {
  'use strict';

  var COPY = {
    es: {
      docTitle: 'Hipnos AI — Agentes de IA, chatbots y páginas web',
      docDesc: 'Hipnos AI crea chatbots y agentes de IA para tu web y WhatsApp, automatizaciones y páginas web. Tú lo sueñas. Nosotros lo construimos con IA.',
      navLabel: 'Menú principal', menuLabel: 'Abrir o cerrar el menú', langLabel: 'Idioma', platformsLabel: 'Plataformas',
      nav1: 'Inicio', navDesign: 'Diseño', nav2: 'Agentes IA', nav3: 'Desarrollo', nav4: 'Automatización', nav6: 'Soluciones', nav7: 'Recursos', navCta: 'Consulta gratis',
      themeLabel: 'Cambiar entre modo claro y oscuro',
      h1a: 'Tu idea,', h1b: 'hecha realidad.',
      heroSub: 'Creamos asistentes, agentes de IA, automatizaciones y aplicaciones para que tu negocio atienda y venda sin pausa.',
      chatTitle: 'Asistente de Hipnos AI', chatLogLabel: 'Conversación', chatPlaceholder: 'Escribe tu mensaje…', chatSend: 'Enviar',
      chatNote: 'Las respuestas de la IA pueden tener errores. Los mensajes los procesa nuestro proveedor de IA; no compartas datos sensibles.',
      privacyLink: 'Privacidad', chipsLabel: 'Preguntas sugeridas',
      chatHello: '¡Hola! Soy el asistente de Hipnos AI. Pregúntame cómo un chatbot o un agente de IA puede ayudar a tu negocio.',
      chatTyping: 'Escribiendo…', chatNew: 'Nuevo chat', chatClose: 'Cerrar chat', chatOpen: 'Abrir chat', chatMin: 'Minimizar', chatMax: 'Ampliar', chatRestore: 'Tamaño normal',
      chatMoved: 'Tu conversación sigue en la ventana del chat, abajo a la derecha.',
      chatErrNotConfigured: 'El asistente todavía no está conectado. Escríbenos por WhatsApp: https://wa.me/593983120422',
      chatErrBusy: 'Hay muchas consultas en este momento. Espera un minuto e inténtalo de nuevo.',
      chatErr: 'No pude responder ahora. Escríbenos por WhatsApp: https://wa.me/593983120422',
      chips: ['¿Qué puede hacer un chatbot por mi negocio?', '¿Cómo es el proceso?', '¿Funciona en WhatsApp?', '¿Cómo pido una propuesta?'],
      createTitle: '¿Qué podemos crear hoy?',
      ready: 'Disponible', soonShort: 'Próximamente',
      galPrev: 'Anterior', galNext: 'Siguiente', galGo: 'Ir a la imagen', galSee: 'Ver el servicio', galZoom: 'Ampliar', galClose: 'Cerrar',
      servicesTitle: 'Lo que construimos', servicesLead: 'Empezamos por lo que más piden los negocios: atender y vender por chat sin depender de horarios.',
      available: 'Disponible', soon: 'Próximamente',
      sChat: 'Chatbots y agentes de IA', sChatT: 'Un asistente entrenado con la información de tu negocio que atiende a tus clientes en tu página web y en WhatsApp.',
      chatFeatures: ['Responde con la información de tu negocio', 'Atiende en tu web y en WhatsApp', 'Agenda citas en tu calendario', 'Guarda los datos de cada cliente en tu CRM', 'Pasa la conversación a una persona cuando hace falta', 'Habla español e inglés'],
      aboutTitle: 'Sobre nosotros',
      aboutText: 'Hipnos AI está en Quito, Ecuador, y la dirige Josue Villacís. Creamos chatbots y agentes de IA y diseño para redes sociales, y trabajamos a distancia con negocios, en español y en inglés.',
      aboutTag: 'Tú lo sueñas. Nosotros lo construimos con IA.',
      aboutF1: 'Quito, Ecuador', aboutF1d: 'Dónde estamos', aboutF2: 'Español e inglés', aboutF2d: 'Los idiomas en que trabajamos',
      aboutF3: '100% en línea', aboutF3d: 'Trabajamos a distancia, estés donde estés',
      sDesign: 'Diseño de posts para Facebook', sDesignT: 'Posts para tu página de Facebook con tu logo, tus colores y un mensaje claro, listos para publicar.', sDesignLink: 'Ver el servicio',
      sAuto: 'Automatización de procesos', sAutoT: 'Conectamos tus aplicaciones para que las tareas repetitivas se hagan solas.',
      sWeb: 'Páginas web y aplicaciones', sWebT: 'Sitios rápidos y modernos, listos para vender.',
      sData: 'Datos y dashboards', sDataT: 'Tus números en paneles claros para decidir mejor.',
      tiles: [
        ['Agente de ventas', 'ventas whatsapp chat agente cliente', 1],
        ['Automatización de tareas', 'tareas automatizacion automatización procesos seguimiento', 0],
        ['Desarrollo de apps', 'desarrollo apps aplicaciones', 0],
        ['Desarrollo de IA', 'ia desarrollo agente modelo', 0],
        ['Análisis de datos', 'datos dashboard reportes excel', 0],
        ['Chatbot para WhatsApp', 'whatsapp chat agente mensajes', 1],
        ['Atención al cliente', 'soporte atencion atención chat whatsapp cliente', 1],
        ['Páginas web', 'web pagina página desarrollo sitio', 0]
      ],
      processTitle: 'De la primera llamada a tu agente funcionando',
      steps: [
        ['1', 'Llamada', 'Conocemos tu negocio y lo que quieres automatizar.'],
        ['2', 'Propuesta', 'Recibes alcance, plazo y precio cerrados.'],
        ['3', 'Construcción', 'Creamos y probamos el agente con tu información real.'],
        ['4', 'Lanzamiento', 'Lo publicamos y te acompañamos con soporte.']
      ],
      faqTitle: 'Preguntas frecuentes',
      faq: [
        ['¿Funciona en WhatsApp?', 'Sí. WhatsApp cobra por mensaje según sus propias tarifas, y lo incluimos en la cotización.'],
        ['¿Necesito saber de tecnología?', 'No. Lo construimos, lo instalamos y te enseñamos a usarlo.'],
        ['¿En qué idiomas atiende?', 'En español y en inglés.']
      ],
      contactTitle: 'Hablemos de tu negocio', contactSub: 'Cuéntanos qué quieres automatizar y te enviamos una propuesta.',
      contactWhatsApp: 'Escríbenos por WhatsApp', waText: 'Hola Hipnos AI, vengo de su página web y quiero información.',
      footerTag: '© 2026 Hipnos AI. Tú lo sueñas. Nosotros lo construimos con IA.'
    },
    en: {
      docTitle: 'Hipnos AI — AI agents, chatbots and websites',
      docDesc: 'Hipnos AI builds AI chatbots and agents for your website and WhatsApp, automations and websites. You dream it. We build it with AI.',
      navLabel: 'Main menu', menuLabel: 'Open or close the menu', langLabel: 'Language', platformsLabel: 'Platforms',
      nav1: 'Home', navDesign: 'Design', nav2: 'AI Agents', nav3: 'Development', nav4: 'Automation', nav6: 'Solutions', nav7: 'Resources', navCta: 'Free consultation',
      themeLabel: 'Switch between light and dark mode',
      h1a: 'Your idea,', h1b: 'brought to life.',
      heroSub: 'We build assistants, AI agents, automations and apps so your business answers and sells around the clock.',
      chatTitle: 'Hipnos AI assistant', chatLogLabel: 'Conversation', chatPlaceholder: 'Write your message…', chatSend: 'Send',
      chatNote: 'AI answers may contain mistakes. Messages are processed by our AI provider; please don’t share sensitive data.',
      privacyLink: 'Privacy', chipsLabel: 'Suggested questions',
      chatHello: 'Hi! I’m the Hipnos AI assistant. Ask me how an AI chatbot or agent can help your business.',
      chatTyping: 'Typing…', chatNew: 'New chat', chatClose: 'Close chat', chatOpen: 'Open chat', chatMin: 'Minimize', chatMax: 'Expand', chatRestore: 'Restore size',
      chatMoved: 'Your conversation continues in the chat window at the bottom right.',
      chatErrNotConfigured: 'The assistant isn’t connected yet. Message us on WhatsApp: https://wa.me/593983120422',
      chatErrBusy: 'Too many requests right now. Please wait a minute and try again.',
      chatErr: 'I couldn’t answer right now. Message us on WhatsApp: https://wa.me/593983120422',
      chips: ['What can an AI chatbot do for my business?', 'How does the process work?', 'Does it work on WhatsApp?', 'How do I get a proposal?'],
      createTitle: 'What can we build today?',
      ready: 'Available', soonShort: 'Coming soon',
      galPrev: 'Previous', galNext: 'Next', galGo: 'Go to image', galSee: 'See the service', galZoom: 'Enlarge', galClose: 'Close',
      servicesTitle: 'What we build', servicesLead: 'We start with what businesses ask for most: answering and selling over chat, around the clock.',
      available: 'Available', soon: 'Coming soon',
      sChat: 'AI chatbots and agents', sChatT: 'An assistant trained on your business information that serves your customers on your website and on WhatsApp.',
      chatFeatures: ['Answers with your business information', 'Works on your website and WhatsApp', 'Books appointments on your calendar', 'Saves each customer to your CRM', 'Hands the chat to a person when needed', 'Speaks English and Spanish'],
      aboutTitle: 'About us',
      aboutText: 'Hipnos AI is based in Quito, Ecuador, and is run by Josue Villacís. We build AI chatbots and agents and design for social media, and we work remotely with businesses in English and Spanish.',
      aboutTag: 'You dream it. We build it with AI.',
      aboutF1: 'Quito, Ecuador', aboutF1d: 'Where we are', aboutF2: 'English and Spanish', aboutF2d: 'The languages we work in',
      aboutF3: '100% online', aboutF3d: 'We work remotely, wherever you are',
      sDesign: 'Facebook post design', sDesignT: 'Posts for your Facebook page with your logo, your colors and a clear message, ready to publish.', sDesignLink: 'See the service',
      sAuto: 'Process automation', sAutoT: 'We connect your apps so repetitive tasks run on their own.',
      sWeb: 'Websites and apps', sWebT: 'Fast, modern sites ready to sell.',
      sData: 'Data and dashboards', sDataT: 'Your numbers in clear dashboards for better decisions.',
      tiles: [
        ['Sales agent', 'sales whatsapp chat agent customer', 1],
        ['Task automation', 'tasks automation process tracking', 0],
        ['App development', 'development apps applications', 0],
        ['AI development', 'ai development agent model', 0],
        ['Data analysis', 'data dashboard reports excel', 0],
        ['WhatsApp chatbot', 'whatsapp chat agent messages', 1],
        ['Customer support', 'support customer chat whatsapp', 1],
        ['Websites', 'web website development site', 0]
      ],
      processTitle: 'From the first call to a working agent',
      steps: [
        ['1', 'Call', 'We learn your business and what you want to automate.'],
        ['2', 'Proposal', 'You get a fixed scope, timeline and price.'],
        ['3', 'Build', 'We build and test the agent with your real information.'],
        ['4', 'Launch', 'We go live and stay with you for support.']
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        ['Does it work on WhatsApp?', 'Yes. WhatsApp charges per message at its own rates, and we include that in the quote.'],
        ['Do I need technical skills?', 'No. We build it, install it and show you how to use it.'],
        ['Which languages does it speak?', 'English and Spanish.']
      ],
      contactTitle: 'Let’s talk about your business', contactSub: 'Tell us what you want to automate and we will send you a proposal.',
      contactWhatsApp: 'Message us on WhatsApp', waText: 'Hi Hipnos AI, I found you on your website and I would like more information.',
      footerTag: '© 2026 Hipnos AI. You dream it. We build it with AI.'
    }
  };

  var LOOK = [
    ['#5AA8FF', '#0650D6', 'rgba(8,102,255,0.30)', 'M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.6A8.5 8.5 0 1 1 21 11.5zM8 10.5l2.5 2.5L16 8'],
    ['#7F95B8', '#3A4F72', 'rgba(58,79,114,0.30)', 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM19.4 13a7.6 7.6 0 0 0 0-2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-1.7-1L15 3.5h-4l-.4 2.5a7 7 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.6a7.6 7.6 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 1.7 1l.4 2.5h4l.4-2.5a7 7 0 0 0 1.7-1l2.4 1 2-3.4z'],
    ['#3CCFCF', '#0C8C99', 'rgba(12,140,153,0.30)', 'M8 9l-4 3 4 3m8-6 4 3-4 3M14 5l-4 14'],
    ['#5AB4FF', '#1F6FD6', 'rgba(31,111,214,0.30)', 'M3 4h18v12H3zM8 20h8M12 16v4M8 10l2 2-2 2m5 0h3'],
    ['#A98BFF', '#6A45D6', 'rgba(106,69,214,0.30)', 'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zm0 0v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3'],
    ['#3BE07F', '#159947', 'rgba(37,211,102,0.30)', 'M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.6A8.5 8.5 0 1 1 21 11.5z'],
    ['#6CC4FF', '#1479D6', 'rgba(20,121,214,0.30)', 'M4 13a8 8 0 0 1 16 0M4 13v4h3v-5H4m16 1v4h-3v-5h3'],
    ['#6A9BFF', '#2F55D6', 'rgba(47,85,214,0.30)', 'M3 5h18v14H3zM3 9h18M7 7h.01']
  ];
  var UPCOMING = [
    ['sAuto', 'sAutoT', '#8B7CFF', '#4B3BD6', 'M4 7h11m0 0-3-3m3 3-3 3M20 17H9m0 0 3-3m-3 3 3 3'],
    ['sWeb', 'sWebT', '#3CCFCF', '#0C8C99', 'M3 5h18v14H3zM3 9h18'],
    ['sData', 'sDataT', '#FF9B6A', '#D6531F', 'M4 20V10m6 10V4m6 16v-7m4 7H3']
  ];
  var CHECK = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0866FF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>';
  var WA_NUMBER = '593983120422';

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]; }); }
  function icon(path, size) { return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + path + '"></path></svg>'; }

  // Siempre empieza en inglés y en modo claro (público principal: habla inglesa).
  // Idioma elegido por el visitante: se guarda en su navegador y se usa en todas las páginas.
  var LANG_KEY = 'hipnos-lang';
  function savedLang() { try { return localStorage.getItem(LANG_KEY) === 'es' ? 'es' : 'en'; } catch (e) { return 'en'; } }
  function saveLang(l) { try { localStorage.setItem(LANG_KEY, l); } catch (e) { /* sin almacenamiento: solo esta página */ } }

  var state = { lang: savedLang(), theme: 'light', history: [], summary: '', summarized: 0, busy: false, view: 'closed' };
  // Memoria de la conversación: ventana de mensajes recientes + resumen acumulado de lo anterior.
  var WINDOW = 10, MAX_UNSUMMARIZED = 14;

  /* ---------- tema ---------- */
  function applyTheme() {
    var dark = state.theme === 'dark';
    if (dark) { document.documentElement.setAttribute('data-theme', 'dark'); } else { document.documentElement.removeAttribute('data-theme'); }
    $('theme-btn').setAttribute('aria-pressed', dark ? 'true' : 'false');
  }

  /* ---------- listas ---------- */
  function renderTiles() {
    var c = COPY[state.lang];
    $('tiles').innerHTML = c.tiles.map(function (row, i) {
      var L = LOOK[i];
      var ready = row[2] === 1;
      return '<li><a class="tile' + (i === 0 ? ' is-on' : '') + '" href="#servicios">' +
        '<span class="tile-icon" style="--g1:' + L[0] + ';--g2:' + L[1] + ';--glow:' + L[2] + '">' + icon(L[3], 22) + '</span>' +
        '<span class="tile-text"><span>' + esc(row[0]) + '</span><span class="tile-status' + (ready ? ' ready' : '') + '">' + esc(ready ? c.ready : c.soonShort) + '</span></span>' +
        '</a></li>';
    }).join('');
  }

  /* ---------- galería: tres carruseles con trabajos reales (datos en /data/galeria.json, código en /js/galeria.js) ---------- */
  var gallery = null;
  function loadGallery() {
    fetch('/data/galeria.json', { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d || !Array.isArray(d.carousels)) { return; }
        // Solo se muestran los carruseles que ya tienen fotos reales.
        gallery = d.carousels.filter(function (g) { return g && Array.isArray(g.images) && g.images.length; }).slice(0, 3);
        renderGallery();
      })
      .catch(function () { /* sin galería: quedan los recuadros de siempre */ });
  }
  function renderGallery() {
    var box = $('gallery');
    if (!box) { return; }
    if (!gallery || !gallery.length || !window.HipnosGaleria) { box.hidden = true; $('tiles').hidden = false; return; }
    var c = COPY[state.lang];
    window.HipnosGaleria.render(box, gallery, { lang: state.lang, text: { prev: c.galPrev, next: c.galNext, go: c.galGo, see: c.galSee, zoom: c.galZoom, close: c.galClose } });
    box.hidden = false;
    $('tiles').hidden = true;
  }

  /* ---------- chat ---------- */
  function linkify(text) {
    // texto ya escapado: negritas **x** y enlaces http(s)
    return text
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(https?:\/\/[^\s<]+[^\s<.,;:!?)\]])/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
  }
  function addMsg(kind, text, logId) {
    var log = $(logId || 'panel-log');
    var div = document.createElement('div');
    div.className = 'msg ' + kind;
    div.innerHTML = linkify(esc(text));
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
    return div;
  }
  function resetChat() {
    var c = COPY[state.lang];
    state.history = []; state.summary = ''; state.summarized = 0;
    $('panel-log').innerHTML = '';
    $('hero-log').innerHTML = '';
    addMsg('bot', c.chatHello, 'panel-log');
    addMsg('bot', c.chatHello, 'hero-log');
  }
  function isDesktop() { return window.matchMedia('(min-width: 761px)').matches; }
  // Ventana del chat: 'closed' (solo el botón redondo), 'small' (ventana tipo WhatsApp), 'min' (solo la barra), 'max' (panel a la derecha).
  function setView(v) {
    var c = COPY[state.lang];
    var panel = $('chat-panel');
    state.view = v;
    panel.hidden = v === 'closed';
    panel.classList.toggle('is-small', v === 'small');
    panel.classList.toggle('is-min', v === 'min');
    panel.classList.toggle('is-max', v === 'max');
    document.body.classList.toggle('chat-max', v === 'max');
    $('chat-fab').hidden = v !== 'closed';
    var maxBtn = $('panel-max'), minBtn = $('panel-min');
    var maxLabel = v === 'max' ? c.chatRestore : c.chatMax;
    var minLabel = v === 'min' ? c.chatRestore : c.chatMin;
    maxBtn.setAttribute('aria-label', maxLabel); maxBtn.title = maxLabel;
    minBtn.setAttribute('aria-label', minLabel); minBtn.title = minLabel;
  }
  function focusInput() {
    if ((state.view === 'small' || state.view === 'max') && isDesktop()) { $('panel-input').focus({ preventScroll: true }); }
  }
  function openPanel() {
    if (state.view === 'closed' || state.view === 'min') { setView('small'); }
    var hero = $('hero-log');
    if (state.history.length && !hero.querySelector('.moved')) { addMsg('bot moved', COPY[state.lang].chatMoved, 'hero-log'); }
  }
  function renderChips() {
    var c = COPY[state.lang];
    var box = $('chips');
    box.innerHTML = '';
    c.chips.forEach(function (q) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.textContent = q;
      b.addEventListener('click', function () { send(q); });
      box.appendChild(b);
    });
  }
  function setBusy(on) {
    state.busy = on;
    $('panel-send').disabled = on;
    $('hero-send').disabled = on;
  }
  function send(text) {
    var c = COPY[state.lang];
    text = String(text || '').trim();
    if (!text || state.busy) { return; }
    if (text.length > 800) { text = text.slice(0, 800); }
    addMsg('user', text);
    state.history.push({ role: 'user', content: text });
    openPanel();
    // Algoritmo de coherencia: lo que no cabe en la ventana se manda para resumir.
    var pending = state.history.slice(state.summarized);
    var older = [], windowMsgs = pending, foldTo = state.summarized;
    if (pending.length > MAX_UNSUMMARIZED) {
      older = pending.slice(0, pending.length - WINDOW);
      windowMsgs = pending.slice(pending.length - WINDOW);
      foldTo = state.history.length - WINDOW;
    }
    $('panel-input').value = '';
    $('hero-input').value = '';
    setBusy(true);
    var typing = addMsg('bot typing', c.chatTyping);
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ lang: state.lang, summary: state.summary, older: older, messages: windowMsgs })
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

  function renderStatic() {
    var c = COPY[state.lang];
    $('chat-features').innerHTML = c.chatFeatures.map(function (f) { return '<li>' + CHECK + '<span>' + esc(f) + '</span></li>'; }).join('');
    $('upcoming').innerHTML = UPCOMING.map(function (u) {
      return '<div class="upcoming-row"><span class="upcoming-icon" style="--g1:' + u[2] + ';--g2:' + u[3] + '">' + icon(u[4], 22) + '</span>' +
        '<div class="upcoming-text"><h3>' + esc(c[u[0]]) + '</h3><p>' + esc(c[u[1]]) + '</p></div>' +
        '<span class="badge soft">' + esc(c.soon) + '</span></div>';
    }).join('');
    $('steps').innerHTML = c.steps.map(function (s) {
      return '<li><span class="step-n">' + esc(s[0]) + '</span><h3>' + esc(s[1]) + '</h3><p>' + esc(s[2]) + '</p></li>';
    }).join('');
    $('faq').innerHTML = c.faq.map(function (f) {
      return '<details><summary>' + esc(f[0]) + '</summary><p>' + esc(f[1]) + '</p></details>';
    }).join('');
  }

  /* ---------- idioma ---------- */
  function applyLang() {
    var c = COPY[state.lang];
    document.documentElement.lang = state.lang;
    document.title = c.docTitle;
    var meta = document.querySelector('meta[name="description"]');
    if (meta) { meta.setAttribute('content', c.docDesc); }
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'), function (el) {
      var k = el.getAttribute('data-i18n'); if (c[k] !== undefined) { el.textContent = c[k]; }
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n-placeholder]'), function (el) {
      var k = el.getAttribute('data-i18n-placeholder'); if (c[k] !== undefined) { el.setAttribute('placeholder', c[k]); }
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n-aria]'), function (el) {
      var k = el.getAttribute('data-i18n-aria'); if (c[k] !== undefined) { el.setAttribute('aria-label', c[k]); }
    });
    $('lang-es').setAttribute('aria-pressed', state.lang === 'es' ? 'true' : 'false');
    $('lang-en').setAttribute('aria-pressed', state.lang === 'en' ? 'true' : 'false');
    $('wa-link').href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(c.waText);
    renderChips(); renderTiles(); renderGallery(); renderStatic();
    if (state.history.length === 0) { resetChat(); }
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n-title]'), function (el) { var k = el.getAttribute('data-i18n-title'); if (c[k] !== undefined) { el.title = c[k]; } });
    setView(state.view);
  }

  /* ---------- luces de los bordes ---------- */
  function makeLights(seed) {
    var r = seed;
    function rnd() { r = (r * 9301 + 49297) % 233280; return r / 233280; }
    var sparks = [];
    for (var i = 0; i < 80; i++) {
      var size = 6 + Math.round(rnd() * 7);
      sparks.push({
        top: (1 + (i / 80) * 98 + (rnd() * 1.2 - 0.6)).toFixed(2) + '%',
        left: (6 + Math.round(Math.pow(rnd(), 1.3) * 118)) + 'px',
        size: size + 'px',
        tw: (1.6 + rnd() * 2.6).toFixed(2) + 's',
        drift: (6 + rnd() * 7).toFixed(2) + 's',
        delay: (-rnd() * 6).toFixed(2) + 's'
      });
    }
    var travel = [];
    for (var j = 0; j < 7; j++) {
      travel.push({ left: (14 + Math.round(rnd() * 90)) + 'px', dur: (12 + rnd() * 14).toFixed(1) + 's', delay: (-rnd() * 30).toFixed(1) + 's' });
    }
    return { sparks: sparks, travel: travel };
  }
  function paintLights(boxId, seed) {
    var box = $(boxId); if (!box) { return; }
    var L = makeLights(seed);
    var html = '';
    L.sparks.forEach(function (s) {
      html += '<span class="spark" style="top:' + s.top + ';left:' + s.left + ';animation-duration:' + s.drift + ';animation-delay:' + s.delay + '">' +
        '<span style="width:' + s.size + ';height:' + s.size + ';animation-duration:' + s.tw + ';animation-delay:' + s.delay + '"></span></span>';
    });
    L.travel.forEach(function (t) {
      html += '<span class="traveler" style="left:' + t.left + ';animation-duration:' + t.dur + ';animation-delay:' + t.delay + '"></span>';
    });
    box.innerHTML = html;
  }

  /* ---------- eventos ---------- */
  function init() {
    applyTheme();
    applyLang();
    document.documentElement.classList.remove('lang-wait');
    paintLights('sparks-l', 1234);
    paintLights('sparks-r', 98765);
    loadGallery();
    $('lang-es').addEventListener('click', function () { if (state.lang !== 'es') { state.lang = 'es'; saveLang('es'); applyLang(); } });
    $('lang-en').addEventListener('click', function () { if (state.lang !== 'en') { state.lang = 'en'; saveLang('en'); applyLang(); } });
    $('theme-btn').addEventListener('click', function () { state.theme = state.theme === 'dark' ? 'light' : 'dark'; applyTheme(); });
    $('hero-form').addEventListener('submit', function (e) { e.preventDefault(); send($('hero-input').value); });
    $('panel-form').addEventListener('submit', function (e) { e.preventDefault(); send($('panel-input').value); });
    $('panel-close').addEventListener('click', function () { setView('closed'); $('chat-fab').focus({ preventScroll: true }); });
    $('panel-min').addEventListener('click', function () { setView(state.view === 'min' ? 'small' : 'min'); focusInput(); });
    $('panel-max').addEventListener('click', function () { setView(state.view === 'max' ? 'small' : 'max'); focusInput(); });
    $('chat-fab').addEventListener('click', function () { setView('small'); focusInput(); });
    $('panel-new').addEventListener('click', function () { if (!state.busy) { resetChat(); $('hero-log').innerHTML = ''; addMsg('bot', COPY[state.lang].chatHello, 'hero-log'); } });
    var menuBtn = $('menu-btn'), nav = $('main-nav');
    function setMenu(open) { nav.classList.toggle('is-open', open); menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false'); }
    menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
    Array.prototype.forEach.call(nav.querySelectorAll('a'), function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setMenu(false); if (state.view === 'small' || state.view === 'max') { setView('min'); } } });
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
