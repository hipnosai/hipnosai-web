/* Hipnos AI — menú principal con desplegables (compartido por todas las páginas).
   Escritorio: panel flotante que se abre al pasar el mouse o al hacer clic.
   Celular: dentro del menú hamburguesa, cada pestaña se abre como acordeón.
   El idioma lo sigue solo: cuando la página cambia <html lang>, el menú se traduce. */
(function () {
  'use strict';

  var COPY = {
    es: {
      navHome: 'Inicio', navAI: 'Desarrollo con IA', navDesign: 'Diseño gráfico', navOther: 'Otros',
      mHome: 'Página principal', mHomeD: 'Volver al inicio', mAbout: 'Sobre nosotros', mAboutD: 'Quiénes somos',
      mServices: 'Servicios', mServicesD: 'Lo que construimos y diseñamos', mProcess: 'Cómo trabajamos', mProcessD: 'De la primera llamada a la entrega',
      mFaq: 'Preguntas frecuentes', mFaqD: 'Respuestas rápidas', mContact: 'Contáctanos', mContactD: 'WhatsApp o correo',
      aiChat: 'Chatbots y agentes de IA', aiChatD: 'Atienden a tus clientes en tu web y WhatsApp',
      aiAuto: 'Automatización de procesos', aiAutoD: 'Tareas repetitivas que se hacen solas',
      aiWeb: 'Páginas web y aplicaciones', aiWebD: 'Sitios rápidos, listos para vender',
      aiData: 'Datos y dashboards', aiDataD: 'Tus números en paneles claros',
      dFb: 'Posts para Facebook', dFbD: 'Con tu logo, tus colores y un mensaje claro',
      dIg: 'Posts para Instagram', dIgD: 'Para el feed de tu cuenta',
      dStories: 'Stories de Instagram y Facebook', dStoriesD: 'Formato vertical de pantalla completa',
      dX: 'Posts para X', dXD: 'Imágenes para tus publicaciones',
      dPin: 'Pines de Pinterest', dPinD: 'Imágenes verticales para Pinterest',
      oAgents: 'Agentes IA', oDev: 'Desarrollo', oAuto: 'Automatización', oSolutions: 'Soluciones', oResources: 'Recursos',
      ok: 'Disponible', soon: 'Próximamente'
    },
    en: {
      navHome: 'Home', navAI: 'AI development', navDesign: 'Graphic design', navOther: 'More',
      mHome: 'Home page', mHomeD: 'Back to the top', mAbout: 'About us', mAboutD: 'Who we are',
      mServices: 'Services', mServicesD: 'What we build and design', mProcess: 'How we work', mProcessD: 'From the first call to delivery',
      mFaq: 'FAQ', mFaqD: 'Quick answers', mContact: 'Contact us', mContactD: 'WhatsApp or email',
      aiChat: 'AI chatbots and agents', aiChatD: 'They serve your customers on your website and WhatsApp',
      aiAuto: 'Process automation', aiAutoD: 'Repetitive tasks that run on their own',
      aiWeb: 'Websites and apps', aiWebD: 'Fast sites, ready to sell',
      aiData: 'Data and dashboards', aiDataD: 'Your numbers in clear dashboards',
      dFb: 'Facebook posts', dFbD: 'With your logo, your colors and a clear message',
      dIg: 'Instagram posts', dIgD: 'For your account’s feed',
      dStories: 'Instagram and Facebook Stories', dStoriesD: 'Full-screen vertical format',
      dX: 'Posts for X', dXD: 'Images for your posts',
      dPin: 'Pinterest pins', dPinD: 'Vertical images for Pinterest',
      oAgents: 'AI Agents', oDev: 'Development', oAuto: 'Automation', oSolutions: 'Solutions', oResources: 'Resources',
      ok: 'Available', soon: 'Coming soon'
    }
  };

  function translate() {
    var lang = document.documentElement.lang === 'es' ? 'es' : 'en';
    var c = COPY[lang];
    Array.prototype.forEach.call(document.querySelectorAll('[data-nav-i18n]'), function (el) {
      var k = el.getAttribute('data-nav-i18n');
      if (c[k] !== undefined) { el.textContent = c[k]; }
    });
  }

  function init() {
    translate();
    new MutationObserver(translate).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

    var items = Array.prototype.slice.call(document.querySelectorAll('.nav-item'));
    var hover = window.matchMedia('(hover: hover) and (min-width: 761px)');

    function close(it) {
      it.classList.remove('is-open');
      it.querySelector('.nav-trigger').setAttribute('aria-expanded', 'false');
    }
    function open(it) {
      items.forEach(function (o) { if (o !== it) { close(o); } });
      it.classList.add('is-open');
      it.querySelector('.nav-trigger').setAttribute('aria-expanded', 'true');
    }

    items.forEach(function (it) {
      var btn = it.querySelector('.nav-trigger');
      var timer = null;
      btn.addEventListener('click', function () {
        // Con mouse, el clic solo abre (el paso del mouse ya la abrió); en pantallas táctiles abre y cierra.
        if (hover.matches) { open(it); } else if (it.classList.contains('is-open')) { close(it); } else { open(it); }
      });
      it.addEventListener('mouseenter', function () { if (hover.matches) { clearTimeout(timer); open(it); } });
      it.addEventListener('mouseleave', function () { if (hover.matches) { timer = setTimeout(function () { close(it); }, 200); } });
      it.addEventListener('focusout', function (e) { if (!it.contains(e.relatedTarget)) { close(it); } });
      Array.prototype.forEach.call(it.querySelectorAll('a'), function (a) { a.addEventListener('click', function () { close(it); }); });
    });

    document.addEventListener('click', function (e) {
      items.forEach(function (it) { if (!it.contains(e.target)) { close(it); } });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') { return; }
      items.forEach(function (it) {
        if (it.classList.contains('is-open')) { close(it); it.querySelector('.nav-trigger').focus(); }
      });
    });
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
