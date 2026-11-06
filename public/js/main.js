/* Hipnos AI — web base (paso 1). Idioma ES/EN, modo claro/oscuro, buscador de servicios y luces de los bordes. */
(function () {
  'use strict';

  var COPY = {
    es: {
      docTitle: 'Hipnos AI — Agentes de IA, chatbots y páginas web',
      docDesc: 'Hipnos AI crea chatbots y agentes de IA para tu web y WhatsApp, automatizaciones y páginas web. Tú lo sueñas. Nosotros lo construimos con IA.',
      navLabel: 'Menú principal', menuLabel: 'Abrir o cerrar el menú', langLabel: 'Idioma', platformsLabel: 'Plataformas',
      nav1: 'Inicio', nav2: 'Agentes IA', nav3: 'Desarrollo', nav4: 'Automatización', nav6: 'Soluciones', nav7: 'Recursos', navCta: 'Consulta gratis',
      themeLabel: 'Cambiar entre modo claro y oscuro',
      h1a: 'Tu idea,', h1b: 'hecha realidad.',
      heroSub: 'Creamos asistentes, agentes de IA, automatizaciones y aplicaciones para que tu negocio atienda y venda sin pausa.',
      searchLabel: 'Asistente de Hipnos AI', searchPlaceholder: 'Busca una tarea, automatización o herramienta…', searchBtn: 'Buscar',
      chips: [['Ventas', 'ventas'], ['WhatsApp', 'whatsapp'], ['Seguimiento de tareas', 'tareas'], ['Desarrollo', 'desarrollo']],
      createTitle: '¿Qué podemos crear hoy?', showAll: 'Ver todo', noResults: 'Todavía no ofrecemos eso. Escríbenos y lo evaluamos contigo.',
      ready: 'Disponible', soonShort: 'Próximamente',
      servicesTitle: 'Lo que construimos', servicesLead: 'Empezamos por lo que más piden los negocios: atender y vender por chat sin depender de horarios.',
      available: 'Disponible', soon: 'Próximamente',
      sChat: 'Chatbots y agentes de IA', sChatT: 'Un asistente entrenado con la información de tu negocio que atiende a tus clientes en tu página web y en WhatsApp.',
      chatFeatures: ['Responde con la información de tu negocio', 'Atiende en tu web y en WhatsApp', 'Agenda citas en tu calendario', 'Guarda los datos de cada cliente en tu CRM', 'Pasa la conversación a una persona cuando hace falta', 'Habla español e inglés'],
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
      nav1: 'Home', nav2: 'AI Agents', nav3: 'Development', nav4: 'Automation', nav6: 'Solutions', nav7: 'Resources', navCta: 'Free consultation',
      themeLabel: 'Switch between light and dark mode',
      h1a: 'Your idea,', h1b: 'brought to life.',
      heroSub: 'We build assistants, AI agents, automations and apps so your business answers and sells around the clock.',
      searchLabel: 'Hipnos AI assistant', searchPlaceholder: 'Search for a task, automation or tool…', searchBtn: 'Search',
      chips: [['Sales', 'sales'], ['WhatsApp', 'whatsapp'], ['Task tracking', 'tasks'], ['Development', 'development']],
      createTitle: 'What can we build today?', showAll: 'Show all', noResults: 'We don’t offer that yet. Message us and we’ll look at it with you.',
      ready: 'Available', soonShort: 'Coming soon',
      servicesTitle: 'What we build', servicesLead: 'We start with what businesses ask for most: answering and selling over chat, around the clock.',
      available: 'Available', soon: 'Coming soon',
      sChat: 'AI chatbots and agents', sChatT: 'An assistant trained on your business information that serves your customers on your website and on WhatsApp.',
      chatFeatures: ['Answers with your business information', 'Works on your website and WhatsApp', 'Books appointments on your calendar', 'Saves each customer to your CRM', 'Hands the chat to a person when needed', 'Speaks English and Spanish'],
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

  function load(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function save(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } }
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]; }); }
  function icon(path, size) { return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + path + '"></path></svg>'; }

  var savedLang = load('hipnos_lang');
  var state = {
    lang: savedLang === 'en' ? 'en' : 'es',
    theme: load('hipnos_theme') === 'dark' ? 'dark' : 'light',
    applied: ''
  };

  /* ---------- tema ---------- */
  function applyTheme() {
    var dark = state.theme === 'dark';
    if (dark) { document.documentElement.setAttribute('data-theme', 'dark'); } else { document.documentElement.removeAttribute('data-theme'); }
    $('theme-btn').setAttribute('aria-pressed', dark ? 'true' : 'false');
  }

  /* ---------- listas ---------- */
  function renderTiles() {
    var c = COPY[state.lang];
    var q = state.applied;
    var html = '';
    var shown = 0;
    c.tiles.forEach(function (row, i) {
      var hay = (row[0] + ' ' + row[1]).toLowerCase();
      if (q && hay.indexOf(q) === -1) { return; }
      shown++;
      var L = LOOK[i];
      var ready = row[2] === 1;
      html += '<li><a class="tile' + (i === 0 ? ' is-on' : '') + '" href="#servicios">' +
        '<span class="tile-icon" style="--g1:' + L[0] + ';--g2:' + L[1] + ';--glow:' + L[2] + '">' + icon(L[3], 22) + '</span>' +
        '<span class="tile-text"><span>' + esc(row[0]) + '</span><span class="tile-status' + (ready ? ' ready' : '') + '">' + esc(ready ? c.ready : c.soonShort) + '</span></span>' +
        '</a></li>';
    });
    $('tiles').innerHTML = html;
    $('no-results').hidden = shown !== 0;
    $('show-all').hidden = !q;
  }

  function renderChips() {
    var c = COPY[state.lang];
    var box = $('chips');
    box.innerHTML = '';
    c.chips.forEach(function (row) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.textContent = row[0];
      var on = state.applied === row[1];
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.addEventListener('click', function () {
        var nowOn = state.applied === row[1];
        state.applied = nowOn ? '' : row[1];
        $('aic-search').value = nowOn ? '' : row[0];
        renderChips(); renderTiles();
      });
      box.appendChild(b);
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
    state.applied = '';
    $('aic-search').value = '';
    renderChips(); renderTiles(); renderStatic();
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
    paintLights('sparks-l', 1234);
    paintLights('sparks-r', 98765);
    $('lang-es').addEventListener('click', function () { if (state.lang !== 'es') { state.lang = 'es'; save('hipnos_lang', 'es'); applyLang(); } });
    $('lang-en').addEventListener('click', function () { if (state.lang !== 'en') { state.lang = 'en'; save('hipnos_lang', 'en'); applyLang(); } });
    $('theme-btn').addEventListener('click', function () { state.theme = state.theme === 'dark' ? 'light' : 'dark'; save('hipnos_theme', state.theme); applyTheme(); });
    $('search-form').addEventListener('submit', function (e) {
      e.preventDefault();
      state.applied = $('aic-search').value.trim().toLowerCase();
      renderChips(); renderTiles();
    });
    var menuBtn = $('menu-btn'), nav = $('main-nav');
    function setMenu(open) { nav.classList.toggle('is-open', open); menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false'); }
    menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
    Array.prototype.forEach.call(nav.querySelectorAll('a'), function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setMenu(false); } });
    $('show-all').addEventListener('click', function () { state.applied = ''; $('aic-search').value = ''; renderChips(); renderTiles(); });
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
