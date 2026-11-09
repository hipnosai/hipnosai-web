/* Hipnos AI — página de servicios de diseño. Idioma EN/ES (empieza en inglés), modo claro/oscuro (empieza claro). */
(function () {
  'use strict';

  var WA_NUMBER = '593983120422';
  var CHECK = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0866FF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>';

  var COPY = {
    es: {
      docTitle: 'Diseño de posts para Facebook — Hipnos AI',
      docDesc: 'Posts para Facebook con tu logo, tus colores y un mensaje claro, en la medida que mejor se ve en el celular y listos para publicar.',
      navLabel: 'Menú principal', menuLabel: 'Abrir o cerrar el menú', langLabel: 'Idioma', platformsLabel: 'Plataformas',
      themeLabel: 'Cambiar entre modo claro y oscuro',
      nav1: 'Inicio', navDesign: 'Diseño', nav2: 'Agentes IA', nav3: 'Desarrollo', nav4: 'Automatización', nav6: 'Soluciones', nav7: 'Recursos', navCta: 'Consulta gratis',
      kicker: 'Diseño gráfico', available: 'Disponible',
      title: 'Posts para Facebook, listos para publicar.',
      sub: 'Diseñamos los posts de tu página de Facebook con tu logo, tus colores y un mensaje claro, en la medida que mejor se ve en el celular.',
      quoteBtn: 'Cotiza por WhatsApp',
      whatTitle: 'Qué es',
      whatText: 'Una imagen diseñada para el muro de tu página. Muestra tu marca, un título corto, tu oferta o mensaje y cómo contactarte.',
      includesTitle: 'Qué incluye',
      includes: [
        'Diseño con tu logo y tus colores',
        'Título corto, tu oferta o mensaje y una invitación a escribirte',
        'El texto que acompaña la publicación',
        'En español o en inglés',
        'Medida vertical o cuadrada, la que prefieras',
        'Archivo listo para subir a Facebook'
      ],
      sizesTitle: 'Medidas que entregamos',
      sizesLead: 'PNG para diseños con texto y JPG para fotos. Listos para subir desde tu celular o tu computadora.',
      portrait: 'Vertical · 1080 × 1350 px', portraitT: 'Ocupa más pantalla en el celular.',
      square: 'Cuadrada · 1080 × 1080 px', squareT: 'Se ve bien en cualquier equipo.',
      stepsTitle: 'Cómo funciona',
      steps: [
        ['1', 'Cuéntanos qué anunciar', 'Escríbenos por WhatsApp con tu oferta, producto o novedad.'],
        ['2', 'Envíanos tu marca', 'Tu logo, tus colores y tus fotos, si las tienes.'],
        ['3', 'Revisa el diseño', 'Te enviamos el diseño para que lo revises antes de publicar.'],
        ['4', 'Publica', 'Recibes el archivo listo para subir a tu página.']
      ],
      contactTitle: 'Cotiza tus posts',
      contactSub: 'Cuéntanos cuántos posts necesitas y qué quieres anunciar, y te enviamos el precio.',
      contactWhatsApp: 'Escríbenos por WhatsApp',
      waText: 'Hola Hipnos AI, quiero cotizar posts para Facebook.',
      privacyLink: 'Privacidad',
      footerTag: '© 2026 Hipnos AI. Tú lo sueñas. Nosotros lo construimos con IA.'
    },
    en: {
      docTitle: 'Facebook post design — Hipnos AI',
      docDesc: 'Facebook posts designed with your logo, your colors and a clear message, sized for phones and ready to publish.',
      navLabel: 'Main menu', menuLabel: 'Open or close the menu', langLabel: 'Language', platformsLabel: 'Platforms',
      themeLabel: 'Switch between light and dark mode',
      nav1: 'Home', navDesign: 'Design', nav2: 'AI Agents', nav3: 'Development', nav4: 'Automation', nav6: 'Solutions', nav7: 'Resources', navCta: 'Free consultation',
      kicker: 'Graphic design', available: 'Available',
      title: 'Facebook posts, ready to publish.',
      sub: 'We design posts for your Facebook page with your logo, your colors and a clear message, sized to look right on phones.',
      quoteBtn: 'Get a quote on WhatsApp',
      whatTitle: 'What it is',
      whatText: 'An image designed for your page’s feed. It shows your brand, a short headline, your offer or message, and how to reach you.',
      includesTitle: 'What’s included',
      includes: [
        'Design with your logo and your colors',
        'A short headline, your offer or message, and an invitation to contact you',
        'The text that goes with the post',
        'In English or Spanish',
        'Portrait or square size, whichever you prefer',
        'A file ready to upload to Facebook'
      ],
      sizesTitle: 'Sizes we deliver',
      sizesLead: 'PNG for designs with text, JPG for photos. Ready to upload from your phone or computer.',
      portrait: 'Portrait · 1080 × 1350 px', portraitT: 'Takes up more of the screen on phones.',
      square: 'Square · 1080 × 1080 px', squareT: 'Looks right on any device.',
      stepsTitle: 'How it works',
      steps: [
        ['1', 'Tell us what to announce', 'Message us on WhatsApp with your offer, product or news.'],
        ['2', 'Send us your brand', 'Your logo, your colors and your photos, if you have them.'],
        ['3', 'Review the design', 'We send you the design to check before you publish.'],
        ['4', 'Publish', 'You get the file ready to upload to your page.']
      ],
      contactTitle: 'Get a quote for your posts',
      contactSub: 'Tell us how many posts you need and what you want to announce, and we will send you the price.',
      contactWhatsApp: 'Message us on WhatsApp',
      waText: 'Hi Hipnos AI, I would like a quote for Facebook posts.',
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
  }

  function init() {
    applyTheme();
    applyLang();
    document.documentElement.classList.remove('lang-wait');
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
