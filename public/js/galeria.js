/* Hipnos AI — carruseles de fotos y visor a pantalla completa, compartidos por todas las páginas.
   Uso: HipnosGaleria.render(contenedor, carruseles, { lang, text: { prev, next, go, see, zoom, close, empty }, showEmpty })
   Cada carrusel: { id, title: {es, en}, desc: {es, en}, link?, images: [{ src, alt: {es, en}, w, h }] } */
(function () {
  'use strict';

  var ARROW_L = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg>';
  var ARROW_R = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>';
  var CLOSE = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"></path></svg>';
  var PICTURE = '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-4.5-4.5L7 20"></path></svg>';

  function esc(s) { return String(s).replace(/[&<>"']/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]; }); }
  function pick(o, lang) { return o ? (o[lang] || o.en || o.es || '') : ''; }

  function cardHtml(g, opts) {
    var t = opts.text, lang = opts.lang;
    var imgs = Array.isArray(g.images) ? g.images : [];
    var n = imgs.length;
    var head = '<h3>' + esc(pick(g.title, lang)) + '</h3>' + (g.desc ? '<p>' + esc(pick(g.desc, lang)) + '</p>' : '') +
      (g.link ? '<a class="gal-link" href="' + esc(g.link) + '">' + esc(t.see) + ' →</a>' : '');
    if (!n) {
      // Aún sin fotos: el recuadro lo dice tal cual, sin imágenes de relleno.
      return '<article class="gal-card is-empty" aria-label="' + esc(pick(g.title, lang)) + '">' +
        '<div class="gal-view gal-empty"><div class="gal-empty-in">' + PICTURE + '<span>' + esc(t.empty || '') + '</span></div></div>' + head + '</article>';
    }
    var slides = imgs.map(function (im, i) {
      var size = im.w && im.h ? ' width="' + Number(im.w) + '" height="' + Number(im.h) + '"' : '';
      return '<li class="gal-slide" aria-label="' + (i + 1) + ' / ' + n + '"><button type="button" class="gal-zoom" data-i="' + i + '" aria-label="' + esc(t.zoom + ': ' + pick(im.alt, lang)) + '">' +
        '<img src="' + esc(im.src) + '" alt="' + esc(pick(im.alt, lang)) + '"' + size + ' loading="' + (i === 0 ? 'eager' : 'lazy') + '" decoding="async"></button></li>';
    }).join('');
    var nav = n > 1
      ? '<button type="button" class="gal-nav gal-prev" aria-label="' + esc(t.prev) + '">' + ARROW_L + '</button>' +
        '<button type="button" class="gal-nav gal-next" aria-label="' + esc(t.next) + '">' + ARROW_R + '</button>'
      : '';
    var dots = n > 1 ? imgs.map(function (im, i) {
      return '<button type="button" class="gal-dot" data-i="' + i + '" aria-label="' + esc(t.go) + ' ' + (i + 1) + '"' + (i === 0 ? ' aria-current="true"' : '') + '></button>';
    }).join('') : '';
    return '<article class="gal-card" aria-roledescription="carousel" aria-label="' + esc(pick(g.title, lang)) + '">' +
      '<div class="gal-view"><ul class="gal-track" tabindex="0">' + slides + '</ul>' + nav + '</div>' +
      '<div class="gal-foot"><div class="gal-dots">' + dots + '</div><span class="gal-count" aria-live="polite">1 / ' + n + '</span></div>' +
      head + '</article>';
  }

  function wireCarousel(card) {
    var track = card.querySelector('.gal-track');
    if (!track) { return; }
    var dots = card.querySelectorAll('.gal-dot');
    var count = card.querySelector('.gal-count');
    var n = track.children.length;
    var current = 0;
    var smooth = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    function go(i) { i = (i + n) % n; track.scrollTo({ left: i * track.clientWidth, behavior: smooth }); }
    function mark(i) {
      if (i === current) { return; }
      current = i;
      Array.prototype.forEach.call(dots, function (d, k) { if (k === i) { d.setAttribute('aria-current', 'true'); } else { d.removeAttribute('aria-current'); } });
      count.textContent = (i + 1) + ' / ' + n;
    }
    var ticking = false;
    track.addEventListener('scroll', function () {
      if (ticking) { return; }
      ticking = true;
      requestAnimationFrame(function () { ticking = false; mark(Math.round(track.scrollLeft / Math.max(1, track.clientWidth))); });
    });
    var prev = card.querySelector('.gal-prev'), next = card.querySelector('.gal-next');
    if (prev) { prev.addEventListener('click', function () { go(current - 1); }); }
    if (next) { next.addEventListener('click', function () { go(current + 1); }); }
    Array.prototype.forEach.call(dots, function (d) { d.addEventListener('click', function () { go(Number(d.getAttribute('data-i'))); }); });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(current + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(current - 1); }
    });
  }

  /* Visor a pantalla completa: flechas, Esc para cerrar, el foco vuelve a la foto. */
  var lb = null;
  function buildLightbox() {
    lb = document.createElement('div');
    lb.className = 'lb';
    lb.hidden = true;
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML = '<figure class="lb-fig"><img class="lb-img" alt=""><figcaption class="lb-cap"></figcaption></figure>' +
      '<button type="button" class="lb-btn lb-close">' + CLOSE + '</button>' +
      '<button type="button" class="lb-btn lb-prev">' + ARROW_L + '</button><button type="button" class="lb-btn lb-next">' + ARROW_R + '</button>';
    document.body.appendChild(lb);
    lb.addEventListener('click', function (e) { if (e.target === lb) { closeLightbox(); } });
    lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
    lb.querySelector('.lb-prev').addEventListener('click', function () { showLb(lb.i - 1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { showLb(lb.i + 1); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) { return; }
      if (e.key === 'Escape') { e.stopPropagation(); closeLightbox(); }
      if (e.key === 'ArrowRight') { showLb(lb.i + 1); }
      if (e.key === 'ArrowLeft') { showLb(lb.i - 1); }
    }, true);
  }
  function openLightbox(g, i, opener, opts) {
    if (!lb) { buildLightbox(); }
    var t = opts.text;
    lb.g = g; lb.lang = opts.lang; lb.opener = opener;
    lb.setAttribute('aria-label', pick(g.title, opts.lang));
    lb.querySelector('.lb-close').setAttribute('aria-label', t.close);
    lb.querySelector('.lb-prev').setAttribute('aria-label', t.prev);
    lb.querySelector('.lb-next').setAttribute('aria-label', t.next);
    lb.querySelector('.lb-prev').hidden = lb.querySelector('.lb-next').hidden = g.images.length < 2;
    lb.hidden = false;
    document.body.classList.add('lb-open');
    showLb(i);
    lb.querySelector('.lb-close').focus();
  }
  function showLb(i) {
    var imgs = lb.g.images, n = imgs.length;
    i = (i + n) % n; lb.i = i;
    var im = imgs[i];
    var img = lb.querySelector('.lb-img');
    img.src = im.src; img.alt = pick(im.alt, lb.lang);
    lb.querySelector('.lb-cap').textContent = pick(im.alt, lb.lang) + ' · ' + (i + 1) + ' / ' + n;
  }
  function closeLightbox() {
    if (!lb || lb.hidden) { return; }
    lb.hidden = true;
    document.body.classList.remove('lb-open');
    if (lb.opener && document.body.contains(lb.opener)) { lb.opener.focus({ preventScroll: true }); }
  }

  function render(box, list, opts) {
    var shown = (list || []).filter(function (g) { return g && (opts.showEmpty || (Array.isArray(g.images) && g.images.length)); });
    box.innerHTML = shown.map(function (g) { return cardHtml(g, opts); }).join('');
    Array.prototype.forEach.call(box.querySelectorAll('.gal-card'), function (card, gi) {
      var g = shown[gi];
      wireCarousel(card);
      Array.prototype.forEach.call(card.querySelectorAll('.gal-zoom'), function (b) {
        b.addEventListener('click', function () { openLightbox(g, Number(b.getAttribute('data-i')), b, opts); });
      });
    });
    return shown.length;
  }

  window.HipnosGaleria = { render: render };
})();
