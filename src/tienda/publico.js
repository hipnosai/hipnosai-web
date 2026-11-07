// Páginas públicas del bot de tiendas:
//   /c/<código>          comprobante para el cliente (enlace imposible de adivinar)
//   /c/<código>/wa       abre WhatsApp con el mensaje personalizado ya escrito (el usuario toca Enviar)
//   /c/<código>/correo   abre el correo con el mensaje ya escrito (el usuario toca Enviar)
//   /p/<negocio>         aviso de privacidad del negocio (LOPDP)

import { esc, dinero, fechaLarga, telefonoIntl, primerNombre } from './util.js';
import { numeroComprobante } from './mensajes.js';

const CABECERAS = {
  'content-type': 'text/html; charset=utf-8',
  'cache-control': 'no-store',
  'x-robots-tag': 'noindex, nofollow',
  'referrer-policy': 'no-referrer',
  'x-content-type-options': 'nosniff',
};

function pagina(titulo, cuerpo, status = 200) {
  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${esc(titulo)}</title>
<link rel="icon" href="/logo/hipnos-ai-icono.svg" type="image/svg+xml">
<style>
@font-face { font-family: 'Inter'; font-weight: 400; font-display: swap; src: url(/fonts/inter-latin-400-normal.woff2) format('woff2'); }
@font-face { font-family: 'Inter'; font-weight: 600; font-display: swap; src: url(/fonts/inter-latin-600-normal.woff2) format('woff2'); }
@font-face { font-family: 'Plus Jakarta Sans'; font-weight: 800; font-display: swap; src: url(/fonts/plus-jakarta-sans-latin-800-normal.woff2) format('woff2'); }
:root { --bg: #F7FAFF; --card: #FFFFFF; --ink: #0B1B33; --ink2: #2E3F57; --muted: #4A5B73; --line: #DCE5F2; --blue: #0650D6; --tint: #E3EEFF; --warn: #8A4B00; --warnbg: #FFF4E5; }
@media (prefers-color-scheme: dark) { :root { --bg: #08111F; --card: #0F1C31; --ink: #E8EFFA; --ink2: #C3CFE0; --muted: #A6B4CA; --line: #1E2C44; --blue: #7DB3FF; --tint: #13284A; --warn: #FFCF8A; --warnbg: #2A1E0C; } }
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--ink); font: 16px/1.55 Inter, system-ui, -apple-system, 'Segoe UI', sans-serif; }
main { max-width: 560px; margin: 0 auto; padding: 28px 16px 48px; }
.card { background: var(--card); border: 1px solid var(--line); border-radius: 18px; padding: 24px 20px; box-shadow: 0 10px 30px rgba(20,60,140,0.08); }
h1 { font-family: 'Plus Jakarta Sans', Inter, sans-serif; font-weight: 800; font-size: 1.6rem; letter-spacing: -0.02em; margin: 0 0 4px; }
h2 { font-size: 1.05rem; margin: 22px 0 6px; }
.sub { color: var(--muted); margin: 0 0 18px; }
table { width: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }
td { padding: 8px 0; border-bottom: 1px solid var(--line); vertical-align: top; }
td.n { text-align: right; white-space: nowrap; padding-left: 12px; }
tr.total td { border-bottom: 0; font-weight: 600; font-size: 1.15rem; padding-top: 14px; }
.meta { display: grid; grid-template-columns: auto 1fr; gap: 4px 14px; margin: 0 0 18px; color: var(--ink2); }
.meta b { color: var(--muted); font-weight: 400; }
.aviso { background: var(--warnbg); color: var(--warn); border-radius: 12px; padding: 10px 12px; font-size: .92rem; margin-top: 18px; }
.anulado { background: #B42318; color: #fff; display: inline-block; padding: 4px 10px; border-radius: 8px; font-weight: 600; margin-bottom: 12px; }
.btn { display: inline-block; background: var(--blue); color: #fff; text-decoration: none; font-weight: 600; padding: 12px 18px; border-radius: 12px; margin-top: 12px; }
@media (prefers-color-scheme: dark) { .btn { color: #08111F; } }
footer { text-align: center; color: var(--muted); font-size: .85rem; margin-top: 18px; }
footer a, p a, li a { color: var(--blue); }
li { margin: 4px 0; }
@media print { body { background: #fff; } .card { box-shadow: none; } .btn { display: none; } }
</style>
</head>
<body><main>${cuerpo}
<footer>Hecho con <a href="/" rel="noopener">Hipnos AI</a></footer>
</main></body></html>`;
  return new Response(html, { status, headers: CABECERAS });
}

function noEncontrado() {
  return pagina('No encontrado', '<div class="card"><h1>No encontrado</h1><p class="sub">Este enlace no existe o ya no está disponible.</p></div>', 404);
}

async function cargarComprobante(env, codigo) {
  if (!/^[A-Za-z0-9]{16}$/.test(codigo)) return null;
  return env.DB.prepare(
    `SELECT c.*, n.nombre AS negocio, n.slug, n.telefono AS negocio_tel, cl.nombre AS cliente, cl.telefono, cl.correo, cl.consentimiento
     FROM comprobantes c JOIN negocios n ON n.id = c.negocio_id LEFT JOIN clientes cl ON cl.id = c.cliente_id
     WHERE c.codigo = ?`,
  ).bind(codigo).first();
}

export async function handlePublic(request, env, url) {
  if (!env.DB) return noEncontrado();
  const partes = url.pathname.split('/').filter(Boolean); // ['c', codigo, accion?]
  if (partes[0] === 'p' && partes.length === 2) return avisoPrivacidad(env, partes[1]);
  if (partes[0] !== 'c' || partes.length < 2 || partes.length > 3) return noEncontrado();
  const c = await cargarComprobante(env, partes[1]);
  if (!c) return noEncontrado();
  const accion = partes[2] || '';

  if (accion === 'wa') {
    const tel = telefonoIntl(c.telefono);
    if (!tel || !c.consentimiento || c.estado !== 'emitido') return pagina('No disponible', '<div class="card"><h1>No disponible</h1><p class="sub">Este comprobante no se puede enviar por WhatsApp (falta el teléfono, el consentimiento del cliente o está anulado).</p></div>', 400);
    return Response.redirect(`https://wa.me/${tel}?text=${encodeURIComponent(c.mensaje || '')}`, 302);
  }
  if (accion === 'correo') {
    if (!c.correo || !c.consentimiento || c.estado !== 'emitido') return pagina('No disponible', '<div class="card"><h1>No disponible</h1><p class="sub">Este comprobante no se puede enviar por correo (falta el correo, el consentimiento del cliente o está anulado).</p></div>', 400);
    const asunto = `Tu comprobante de compra · ${c.negocio}`;
    const mailto = `mailto:${encodeURIComponent(c.correo)}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(c.mensaje || '')}`;
    return pagina('Enviar por correo', `<div class="card"><h1>Enviar por correo</h1>
<p class="sub">Se abrirá tu aplicación de correo con el mensaje ya escrito para ${esc(primerNombre(c.cliente))}. Revisa y toca <b>Enviar</b>.</p>
<a class="btn" id="go" href="${esc(mailto)}">Abrir mi correo</a></div>
<script>setTimeout(function(){ location.href = document.getElementById('go').href; }, 300);</script>`);
  }
  if (accion) return noEncontrado();

  const items = JSON.parse(c.items || '[]');
  const filas = items.map((it) => `<tr><td>${it.c > 1 ? esc(it.c) + ' × ' : ''}${esc(it.d)}${it.c > 1 ? `<br><small style="color:var(--muted)">${dinero(it.p)} c/u</small>` : ''}</td><td class="n">${dinero(it.c * it.p)}</td></tr>`).join('');
  return pagina(`Comprobante ${numeroComprobante(c.numero)} · ${c.negocio}`, `<div class="card">
${c.estado === 'anulado' ? '<div class="anulado">ANULADO</div>' : ''}
<h1>${esc(c.negocio)}</h1>
<p class="sub">Comprobante de compra</p>
<div class="meta"><b>N.º</b><span>${numeroComprobante(c.numero)}</span><b>Fecha</b><span>${fechaLarga(c.fecha)}</span><b>Cliente</b><span>${esc(c.cliente || 'Consumidor')}</span></div>
<table>${filas}<tr class="total"><td>Total</td><td class="n">${dinero(c.total)}</td></tr></table>
<div class="aviso">Documento informativo de la compra. <b>No es una factura ni una nota de venta autorizada por el SRI.</b></div>
<a class="btn" href="javascript:window.print()">Imprimir o guardar en PDF</a>
</div>`);
}

async function avisoPrivacidad(env, slug) {
  if (!/^[a-z0-9-]{2,60}$/.test(slug)) return noEncontrado();
  const n = await env.DB.prepare('SELECT nombre, telefono FROM negocios WHERE slug = ?').bind(slug).first();
  if (!n) return noEncontrado();
  const contacto = n.telefono ? `en el local o al ${esc(n.telefono)}` : 'directamente en el local';
  return pagina(`Aviso de privacidad · ${n.nombre}`, `<div class="card">
<h1>Aviso de privacidad</h1>
<p class="sub">${esc(n.nombre)}</p>
<p>Este aviso explica cómo ${esc(n.nombre)} trata tus datos personales, según la Ley Orgánica de Protección de Datos Personales del Ecuador.</p>
<h2>Qué datos guardamos</h2>
<p>Tu nombre y, si nos los das, tu teléfono, tu número de cédula y tu correo electrónico, junto con el detalle de tus compras.</p>
<h2>Para qué los usamos</h2>
<ul><li>Registrar tus compras y enviarte el comprobante por WhatsApp o por correo.</li><li>Atenderte cuando nos escribas sobre tus compras.</li></ul>
<p>No vendemos ni compartimos tus datos con otras empresas para publicidad.</p>
<h2>Dónde se guardan</h2>
<p>En un sistema de Hipnos AI alojado en servidores de Cloudflare. Solo el personal autorizado del negocio puede verlos.</p>
<h2>Cuánto tiempo</h2>
<p>Mientras seas cliente o mientras la ley exija conservar el registro de las ventas.</p>
<h2>Tus derechos</h2>
<p>Puedes pedir ver, corregir o eliminar tus datos, o retirar tu consentimiento, ${contacto}.</p>
<h2>Tu consentimiento</h2>
<p>Al aceptar este aviso, autorizas el uso de tus datos para los fines indicados. Darlos es voluntario: si no aceptas, igual puedes comprar sin comprobante enviado.</p>
</div>`);
}
