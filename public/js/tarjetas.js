/* Hipnos AI — página "Tarjetas de cumpleaños y más": cinco carruseles (datos en /data/tarjetas.json).
   Idioma EN/ES guardado en el navegador, modo claro/oscuro, menú del celular. */
(function () {
  'use strict';

  var WA_NUMBER = '593983120422';
  var COPY = {
    es: {
      docTitle: 'Diseños de tarjetas de cumpleaños y más — Hipnos AI',
      docDesc: 'Diseño de tarjetas e invitaciones para cada ocasión: cumpleaños, felicitaciones, Navidad, agradecimientos y diplomas.',
      navLabel: 'Menú principal', menuLabel: 'Abrir o cerrar el menú', langLabel: 'Idioma', platformsLabel: 'Plataformas',
      themeLabel: 'Cambiar entre modo claro y oscuro', navCta: 'Consulta gratis',
      kicker: 'Diseño gráfico',
      title: 'Diseños de tarjetas de cumpleaños y más',
      sub: 'Diseñamos tarjetas e invitaciones para cada ocasión: cumpleaños, felicitaciones, Navidad, agradecimientos y diplomas.',
      galleryTitle: 'Diseños por ocasión',
      galPrev: 'Anterior', galNext: 'Siguiente', galGo: 'Ir a la imagen', galSee: 'Ver más', galZoom: 'Ampliar', galClose: 'Cerrar',
      galEmpty: 'Diseños en preparación',
      contactTitle: 'Cotiza tu tarjeta',
      contactSub: 'Cuéntanos la ocasión, qué debe decir la tarjeta y cuántas necesitas, y te enviamos el precio.',
      contactWhatsApp: 'Escríbenos por WhatsApp',
      waText: 'Hola Hipnos AI, quiero cotizar el diseño de una tarjeta.',
      privacyLink: 'Privacidad',
      footerTag: '© 2026 Hipnos AI. Tú lo sueñas. Nosotros lo construimos con IA.'
    },
    en: {
      docTitle: 'Birthday card designs and more — Hipnos AI',
      docDesc: 'Card and invitation design for every occasion: birthdays, congratulations, Christmas, thank-you cards and diplomas.',
      navLabel: 'Main menu', menuLabel: 'Open or close the menu', langLabel: 'Language', platformsLabel: 'Platforms',
      themeLabel: 'Switch between light and dark mode', navCta: 'Free consultation',
      kicker: 'Graphic design',
      title: 'Birthday card designs and more',
      sub: 'We design cards and invitations for every occasion: birthdays, congratulations, Christmas, thank-you cards and diplomas.',
      galleryTitle: 'Designs by occasion',
      galPrev: 'Previous', galNext: 'Next', galGo: 'Go to image', galSee: 'See more', galZoom: 'Enlarge', galClose: 'Close',
      galEmpty: 'Designs in progress',
      contactTitle: 'Get a quote for your card',
      contactSub: 'Tell us the occasion, what the card should say and how many you need, and we will send you the price.',
      contactWhatsApp: 'Message us on WhatsApp',
      waText: 'Hi Hipnos AI, I would like a quote for a card design.',
      privacyLink: 'Privacy',
      footerTag: '© 2026 Hipnos AI. You dream it. We build it with AI.'
    }
  };

  // Idioma elegido por el visitante: se guarda en su navegador y se usa en todas las páginas.
  var LANG_KEY = 'hipnos-lang';
  function savedLang() { try { return localStorage.getItem(LANG_KEY) === 'es' ? 'es' : 'en'; } catch (e) { return 'en'; } }
  function saveLang(l) { try { localStorage.setItem(LANG_KEY, l); } catch (e) { /* sin almacenamiento: solo esta página */ } }

  var state = { lang: savedLang(), theme: 'light' };
  var cards = null;

  function $(id) { return document.getElementById(id); }

  function applyTheme() {
    var dark = state.theme === 'dark';
    if (dark) { document.documentElement.setAttribute('data-theme', 'dark'); } else { document.documentElement.removeAttribute('data-theme'); }
    $('theme-btn').setAttribute('aria-pressed', dark ? 'true' : 'false');
  }

  function renderCards() {
    var box = $('cards-gallery');
    if (!box || !cards || !window.HipnosGaleria) { return; }
    var c = COPY[state.lang];
    window.HipnosGaleria.render(box, cards, {
      lang: state.lang, showEmpty: true,
      text: { prev: c.galPrev, next: c.galNext, go: c.galGo, see: c.galSee, zoom: c.galZoom, close: c.galClose, empty: c.galEmpty }
    });
  }
  function loadCards() {
    fetch('/data/tarjetas.json', { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d && Array.isArray(d.carousels)) { cards = d.carousels; renderCards(); } })
      .catch(function () { /* sin datos: la página queda con el título y el contacto */ });
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
    $('wa-link').href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(c.waText);
    $('lang-es').setAttribute('aria-pressed', state.lang === 'es' ? 'true' : 'false');
    $('lang-en').setAttribute('aria-pressed', state.lang === 'en' ? 'true' : 'false');
    renderCards();
  }

  function init() {
    applyTheme();
    applyLang();
    document.documentElement.classList.remove('lang-wait');
    loadCards();
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
