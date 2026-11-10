/* Hipnos AI — página «Posts para redes sociales». Idioma EN/ES (empieza en inglés), modo claro/oscuro (empieza claro). */
(function () {
  'use strict';

  var WA_NUMBER = '593983120422';
  var CHECK = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0866FF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>';

  var COPY = {
    es: {
      docTitle: 'Diseño de posts para redes sociales — Hipnos AI',
      docDesc: 'Posts para Facebook, Instagram, TikTok y todas tus redes sociales, con tu logo, tus colores y un mensaje claro, listos para publicar.',
      navLabel: 'Menú principal', menuLabel: 'Abrir o cerrar el menú', langLabel: 'Idioma', platformsLabel: 'Plataformas',
      themeLabel: 'Cambiar entre modo claro y oscuro',
      nav1: 'Inicio', navDesign: 'Diseño', nav2: 'Agentes IA', nav3: 'Desarrollo', nav4: 'Automatización', nav6: 'Soluciones', nav7: 'Recursos', navCta: 'Consulta gratis',
      kicker: 'Diseño gráfico', available: 'Disponible',
      examplesTitle: 'Posts para cada red social', galEmpty: 'Diseños en preparación',
      galPrev: 'Anterior', galNext: 'Siguiente', galGo: 'Ir a la imagen', galZoom: 'Ampliar', galClose: 'Cerrar',
      title: 'Posts para redes sociales',
      nets: 'Para Facebook, Instagram, TikTok, LinkedIn, X y todas tus redes sociales.',
      sub: 'Diseñamos los posts de tus redes con tu logo, tus colores y un mensaje claro, en la medida que pide cada red. Listos para publicar.',
      quoteBtn: 'Cotiza por WhatsApp',
      whatTitle: 'Qué es',
      whatText: 'Una imagen diseñada para publicar en tus redes. Muestra tu marca, un título corto, tu oferta o mensaje y cómo contactarte.',
      includesTitle: 'Qué incluye',
      includes: [
        'Diseño con tu logo y tus colores',
        'Título corto, tu oferta o mensaje y una invitación a escribirte',
        'El texto que acompaña la publicación',
        'En español o en inglés',
        'La medida que pide cada red: vertical, cuadrada o de historia',
        'Archivo listo para subir a tus redes'
      ],
      sizesTitle: 'Medidas que entregamos',
      sizesLead: 'PNG para diseños con texto y JPG para fotos. Listos para subir desde tu celular o tu computadora.',
      portrait: 'Vertical · 1080 × 1350 px', portraitT: 'Para Facebook e Instagram. Ocupa más pantalla en el celular.',
      square: 'Cuadrada · 1080 × 1080 px', squareT: 'Se ve bien en cualquier red y equipo.',
      story: 'Historias y TikTok · 1080 × 1920 px', storyT: 'Pantalla completa en Historias, Reels y TikTok.',
      stepsTitle: 'Cómo funciona',
      steps: [
        ['1', 'Cuéntanos qué anunciar', 'Escríbenos por WhatsApp con tu oferta, producto o novedad.'],
        ['2', 'Envíanos tu marca', 'Tu logo, tus colores y tus fotos, si las tienes.'],
        ['3', 'Revisa el diseño', 'Te enviamos el diseño para que lo revises antes de publicar.'],
        ['4', 'Publica', 'Recibes el archivo listo para subir a tus redes.']
      ],
      contactTitle: 'Cotiza tus posts',
      contactSub: 'Cuéntanos cuántos posts necesitas, para qué redes y qué quieres anunciar, y te enviamos el precio.',
      contactWhatsApp: 'Escríbenos por WhatsApp',
      waText: 'Hola Hipnos AI, quiero cotizar posts para redes sociales.',
      privacyLink: 'Privacidad',
      footerTag: '© 2026 Hipnos AI. Tú lo sueñas. Nosotros lo construimos con IA.'
    },
    en: {
      docTitle: 'Social media post design — Hipnos AI',
      docDesc: 'Posts for Facebook, Instagram, TikTok and all your social networks, with your logo, your colors and a clear message, ready to publish.',
      navLabel: 'Main menu', menuLabel: 'Open or close the menu', langLabel: 'Language', platformsLabel: 'Platforms',
      themeLabel: 'Switch between light and dark mode',
      nav1: 'Home', navDesign: 'Design', nav2: 'AI Agents', nav3: 'Development', nav4: 'Automation', nav6: 'Solutions', nav7: 'Resources', navCta: 'Free consultation',
      kicker: 'Graphic design', available: 'Available',
      examplesTitle: 'Posts for each social network', galEmpty: 'Designs in progress',
      galPrev: 'Previous', galNext: 'Next', galGo: 'Go to image', galZoom: 'Enlarge', galClose: 'Close',
      title: 'Social media posts',
      nets: 'For Facebook, Instagram, TikTok, LinkedIn, X and all your social networks.',
      sub: 'We design posts for your social networks with your logo, your colors and a clear message, in the size each network asks for. Ready to publish.',
      quoteBtn: 'Get a quote on WhatsApp',
      whatTitle: 'What it is',
      whatText: 'An image designed to post on your social networks. It shows your brand, a short headline, your offer or message, and how to reach you.',
      includesTitle: 'What’s included',
      includes: [
        'Design with your logo and your colors',
        'A short headline, your offer or message, and an invitation to contact you',
        'The text that goes with the post',
        'In English or Spanish',
        'The size each network asks for: portrait, square or story',
        'A file ready to upload to your social networks'
      ],
      sizesTitle: 'Sizes we deliver',
      sizesLead: 'PNG for designs with text, JPG for photos. Ready to upload from your phone or computer.',
      portrait: 'Portrait · 1080 × 1350 px', portraitT: 'For Facebook and Instagram. Takes up more of the screen on phones.',
      square: 'Square · 1080 × 1080 px', squareT: 'Looks right on any network and device.',
      story: 'Stories and TikTok · 1080 × 1920 px', storyT: 'Full screen on Stories, Reels and TikTok.',
      stepsTitle: 'How it works',
      steps: [
        ['1', 'Tell us what to announce', 'Message us on WhatsApp with your offer, product or news.'],
        ['2', 'Send us your brand', 'Your logo, your colors and your photos, if you have them.'],
        ['3', 'Review the design', 'We send you the design to check before you publish.'],
        ['4', 'Publish', 'You get the file ready to upload to your social networks.']
      ],
      contactTitle: 'Get a quote for your posts',
      contactSub: 'Tell us how many posts you need, for which networks and what you want to announce, and we will send you the price.',
      contactWhatsApp: 'Message us on WhatsApp',
      waText: 'Hi Hipnos AI, I would like a quote for social media posts.',
      privacyLink: 'Privacy',
      footerTag: '© 2026 Hipnos AI. You dream it. We build it with AI.'
    }
  };

  // Idioma elegido por el visitante: se guarda en su navegador y se usa en todas las páginas.
  var LANG_KEY = 'hipnos-lang';
  function savedLang() { try { return localStorage.getItem(LANG_KEY) === 'es' ? 'es' : 'en'; } catch (e) { return 'en'; } }
  function saveLang(l) { try { localStorage.setItem(LANG_KEY, l); } catch (e) { /* sin almacenamiento: solo esta página */ } }

  var state = { lang: savedLang(), theme: 'light' };

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]; }); }

  /* Un carrusel por red social (datos en /data/posts-redes.json, código en /js/galeria.js) */
  var examples = null;
  function renderExamples() {
    var box = $('fb-gallery');
    if (!box || !examples || !window.HipnosGaleria) { return; }
    var c = COPY[state.lang];
    window.HipnosGaleria.render(box, examples, { lang: state.lang, showEmpty: true, text: { prev: c.galPrev, next: c.galNext, go: c.galGo, see: '', zoom: c.galZoom, close: c.galClose, empty: c.galEmpty } });
  }
  function loadExamples() {
    fetch('/data/posts-redes.json', { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d && Array.isArray(d.carousels)) { examples = d.carousels; renderExamples(); } })
      .catch(function () { /* sin datos: la página queda como antes */ });
  }

  function applyTheme() {
    var dark = state.theme === 'dark';
    if (dark) { document.documentElement.setAttribute('data-theme', 'dark'); } else { document.documentElement.removeAttribute('data-theme'); }
    $('theme-btn').setAttribute('aria-pressed', dark ? 'true' : 'false');
  }

  function applyLang() {
    var c = COPY[state.lang];
    document.documentElement.lang = state.lang;
    document.title = c.docTitle;
    var meta = document.querySelector('meta[name="description"]');
    if (meta) { meta.setAttribute('content', c.docDesc); }
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'), function (el) {
      var k = el.getAttribute('data-i18n'); if (typeof c[k] === 'string') { el.textContent = c[k]; }
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n-aria]'), function (el) {
      var k = el.getAttribute('data-i18n-aria'); if (typeof c[k] === 'string') { el.setAttribute('aria-label', c[k]); }
    });
    $('includes').innerHTML = c.includes.map(function (f) { return '<li>' + CHECK + '<span>' + esc(f) + '</span></li>'; }).join('');
    $('steps').innerHTML = c.steps.map(function (s) {
      return '<li><span class="step-n">' + esc(s[0]) + '</span><h3>' + esc(s[1]) + '</h3><p>' + esc(s[2]) + '</p></li>';
    }).join('');
    var wa = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(c.waText);
    $('wa-link').href = wa;
    $('wa-hero').href = wa;
    $('lang-es').setAttribute('aria-pressed', state.lang === 'es' ? 'true' : 'false');
    $('lang-en').setAttribute('aria-pressed', state.lang === 'en' ? 'true' : 'false');
    renderExamples();
  }

  function init() {
    applyTheme();
    applyLang();
    document.documentElement.classList.remove('lang-wait');
    loadExamples();
    $('lang-es').addEventListener('click', function () { if (state.lang !== 'es') { state.lang = 'es'; saveLang('es'); applyLang(); } });
    $('lang-en').addEventListener('click', function () { if (state.lang !== 'en') { state.lang = 'en'; saveLang('en'); applyLang(); } });
    $('theme-btn').addEventListener('click', function () { state.theme = state.theme === 'dark' ? 'light' : 'dark'; applyTheme(); });
    var menuBtn = $('menu-btn'), nav = $('main-nav');
    function setMenu(open) { nav.classList.toggle('is-open', open); menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false'); }
    menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
    Array.prototype.forEach.call(nav.querySelectorAll('a'), function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setMenu(false); } });
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
