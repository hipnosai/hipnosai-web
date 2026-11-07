// Hipnos AI · Bot de tiendas en Telegram (Fase 1).
// Webhook: POST /api/tg/webhook   ·   Registrar webhook: GET /api/tg/setup
// Base de datos: Cloudflare D1 (binding DB), un registro por negocio (multi-negocio).

import { interpretar } from './parse.js';
import { tg, secretoWebhook, nombreDeUsuarioBot } from './telegram.js';
import { mensajeComprobante, numeroComprobante } from './mensajes.js';
import {
  normalizar, esc, dinero, hoyISO, sumarDias, fechaCorta, lunesDe, telefonoIntl, telefonoOculto,
  codigoAleatorio, primerNombre, fila,
} from './util.js';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
}

// ---------- Entrada ----------

export async function handleTelegramSetup(request, env, url) {
  if (!env.TELEGRAM_BOT_TOKEN) return json({ ok: false, error: 'not_configured' }, 503);
  if (env.CHAT_LIMITER) {
    const { success } = await env.CHAT_LIMITER.limit({ key: 'tgsetup:' + (request.headers.get('cf-connecting-ip') || 'anon') });
    if (!success) return json({ ok: false, error: 'rate_limited' }, 429);
  }
  const secret = await secretoWebhook(env);
  const r = await tg(env, 'setWebhook', {
    url: url.origin + '/api/tg/webhook',
    secret_token: secret,
    allowed_updates: ['message', 'callback_query', 'my_chat_member'],
    max_connections: 10,
  });
  await tg(env, 'setMyCommands', {
    commands: [
      { command: 'ayuda', description: 'Ver lo que puedo hacer' },
      { command: 'borrar', description: 'Deshacer mi último registro' },
    ],
  });
  const usuario = await nombreDeUsuarioBot(env);
  return json({ ok: !!(r && r.ok), webhook: r ? r.description : 'sin respuesta', bot: usuario });
}

export async function handleTelegram(request, env, url) {
  if (request.method !== 'POST') return new Response('ok');
  if (!env.TELEGRAM_BOT_TOKEN || !env.DB) return new Response('not configured', { status: 503 });
  if (request.headers.get('x-telegram-bot-api-secret-token') !== (await secretoWebhook(env))) {
    return new Response('forbidden', { status: 403 });
  }
  let upd;
  try { upd = await request.json(); } catch { return new Response('bad request', { status: 400 }); }
  try {
    if (typeof upd.update_id === 'number') {
      const ins = await env.DB.prepare('INSERT OR IGNORE INTO updates (update_id) VALUES (?)').bind(upd.update_id).run();
      if (!ins.meta.changes) return new Response('ok'); // ya procesado
      if (upd.update_id % 50 === 0) await env.DB.prepare("DELETE FROM updates WHERE creado < datetime('now','-3 days')").run();
    }
    await procesar(env, upd, url.origin);
  } catch (e) {
    console.error('tg_procesar', e && e.name, e && e.message && e.message.slice(0, 200));
  }
  return new Response('ok'); // siempre 200 para que Telegram no reintente en bucle
}

// ---------- Contexto ----------

async function procesar(env, upd, origin) {
  if (upd.callback_query) return onBoton(env, upd.callback_query, origin);
  if (upd.my_chat_member) return onAgregadoAGrupo(env, upd.my_chat_member);
  const msg = upd.message;
  if (!msg || !msg.from || msg.from.is_bot) return;
  const texto = msg.text || '';
  if (!texto) return; // Fase 1: solo texto (las fotos con código de barras llegan en la Fase 1b)

  const hoy = hoyISO();
  const esGrupo = msg.chat.type === 'group' || msg.chat.type === 'supergroup';
  const intento = interpretar(texto, hoy);
  const ctx = { env, msg, origin, hoy, esGrupo, usuario: msg.from.id, nombreUsuario: nombreDe(msg.from) };

  if (intento && intento.tipo === 'start' && !esGrupo) return unirsePorInvitacion(ctx, intento.codigo);

  if (esGrupo) {
    const chat = await env.DB.prepare('SELECT negocio_id FROM chats WHERE tg_chat_id = ?').bind(msg.chat.id).first();
    if (!chat) {
      if (intento && intento.tipo === 'vincular') return vincularGrupo(ctx);
      return; // grupo no vinculado: silencio
    }
    ctx.negocio = await negocioPorId(env, chat.negocio_id);
    ctx.rol = await asegurarMiembro(env, chat.negocio_id, msg.from);
  } else {
    const m = await env.DB.prepare('SELECT negocio_id, rol FROM miembros WHERE tg_user_id = ? ORDER BY creado DESC LIMIT 1').bind(msg.from.id).first();
    if (!m) {
      return responder(ctx, 'Hola 👋 Este bot es privado y trabaja solo para los negocios registrados.\nSi te compartieron un enlace de invitación, ábrelo para entrar.');
    }
    ctx.negocio = await negocioPorId(env, m.negocio_id);
    ctx.rol = m.rol;
  }
  if (!ctx.negocio) return;

  if (!intento) {
    if (!esGrupo) return responder(ctx, 'No entendí 🤔 Escribe <b>ayuda</b> para ver ejemplos.');
    return; // charla normal del grupo: el bot no interrumpe
  }

  switch (intento.tipo) {
    case 'ayuda': return responder(ctx, textoAyuda(ctx.negocio));
    case 'vincular': return responder(ctx, `Este grupo ya está vinculado a <b>${esc(ctx.negocio.nombre)}</b> ✅`);
    case 'invitar': return invitar(ctx);
    case 'borrar': return borrarUltimo(ctx);
    case 'caja': return guardarCaja(ctx, intento);
    case 'venta_rapida': return guardarVentaRapida(ctx, intento);
    case 'ver_ventas': return verVentas(ctx, intento.periodo);
    case 'pago': return guardarPago(ctx, intento);
    case 'ver_pagos': return verPagos(ctx, intento);
    case 'pagado': return marcarPagado(ctx, intento);
    case 'cliente': return guardarCliente(ctx, intento);
    case 'venta': return crearComprobante(ctx, intento);
    case 'error': return responder(ctx, textoError(intento));
    default: return;
  }
}

function nombreDe(u) {
  return [u.first_name, u.last_name].filter(Boolean).join(' ').slice(0, 60) || (u.username ? '@' + u.username : 'Usuario');
}

async function negocioPorId(env, id) {
  return env.DB.prepare('SELECT id, nombre, slug, telefono, redes FROM negocios WHERE id = ?').bind(id).first();
}

async function asegurarMiembro(env, negocioId, from) {
  const m = await env.DB.prepare('SELECT rol FROM miembros WHERE negocio_id = ? AND tg_user_id = ?').bind(negocioId, from.id).first();
  if (m) return m.rol;
  // Quien escribe en el grupo vinculado ya fue aceptado en el grupo por el administrador.
  await env.DB.prepare('INSERT OR IGNORE INTO miembros (negocio_id, tg_user_id, nombre, rol) VALUES (?, ?, ?, ?)').bind(negocioId, from.id, nombreDe(from), 'miembro').run();
  return 'miembro';
}

async function responder(ctx, html, extra = {}) {
  const datos = {
    chat_id: ctx.msg.chat.id,
    text: html,
    parse_mode: 'HTML',
    link_preview_options: { is_disabled: true },
    ...extra,
  };
  if (ctx.esGrupo) datos.reply_parameters = { message_id: ctx.msg.message_id, allow_sending_without_reply: true };
  return tg(ctx.env, 'sendMessage', datos);
}

async function anotar(ctx, tabla, filaId, datos = null) {
  await ctx.env.DB.prepare('INSERT INTO registros (negocio_id, autor, tabla, fila_id, datos) VALUES (?, ?, ?, ?, ?)')
    .bind(ctx.negocio.id, ctx.usuario, tabla, filaId, datos ? JSON.stringify(datos) : null).run();
}

function pre(lineas) {
  return '<pre>' + esc(lineas.join('\n')) + '</pre>';
}

// ---------- Textos ----------

function textoAyuda(negocio) {
  return [
    `<b>${esc(negocio.nombre)} · lo que puedo hacer</b>`,
    '',
    '💵 <b>Caja</b>',
    '<code>inicio de caja 5</code>',
    '<code>cierre de caja 120</code>',
    '',
    '🚚 <b>Pagos a proveedores</b>',
    '<code>Rey Leche 15.50</code> → se paga mañana',
    '<code>Rey Leche 15.50 hoy</code> · <code>Pronaca 42 lunes</code> · <code>Coca Cola 30 20/11</code>',
    '<code>pagos hoy</code> · <code>pagos mañana</code> · <code>pagos</code> (todo lo pendiente)',
    '<code>pagado Rey Leche</code>',
    '',
    '🛒 <b>Ventas</b>',
    '<code>ventas 230</code>',
    '<code>ventas hoy</code> · <code>ventas semana</code> · <code>ventas mes</code>',
    '',
    '👤 <b>Clientes y comprobantes</b>',
    '<code>cliente Juan Pérez 0991234567</code>',
    '<code>cliente Ana Ruiz 0987654321 cedula 1712345678 correo ana@mail.com</code>',
    '<code>venta Juan: 2 leche 1.00, pan 0.15</code>',
    '<code>venta Juan 10.55</code>',
    '',
    '↩️ <code>borrar último</code> deshace lo último que registraste.',
  ].join('\n');
}

function textoError(e) {
  switch (e.motivo) {
    case 'cliente_sin_contacto': return 'Para registrar un cliente necesito su teléfono o su correo.\nEjemplo: <code>cliente Juan Pérez 0991234567</code>';
    case 'cliente_formato': return 'No entendí el cliente. Ejemplo:\n<code>cliente Juan Pérez 0991234567 cedula 1712345678 correo juan@mail.com</code>';
    case 'venta_sin_monto': return 'Falta el monto o los productos. Ejemplos:\n<code>venta Juan 10.55</code>\n<code>venta Juan: 2 leche 1.00, pan 0.15</code>';
    case 'item_sin_precio': return `No encontré el precio en: <b>${esc(e.item || '')}</b>\nCada producto lleva su precio al final: <code>2 leche 1.00</code>`;
    default: return 'No entendí la venta. Ejemplo: <code>venta Juan: 2 leche 1.00, pan 0.15</code>';
  }
}

// ---------- Grupo, invitaciones ----------

async function onAgregadoAGrupo(env, cm) {
  const tipo = cm.chat && cm.chat.type;
  const estado = cm.new_chat_member && cm.new_chat_member.status;
  if (!(tipo === 'group' || tipo === 'supergroup')) return;
  if (!['member', 'administrator'].includes(estado)) return;
  const ya = await env.DB.prepare('SELECT negocio_id FROM chats WHERE tg_chat_id = ?').bind(cm.chat.id).first();
  if (ya) return;
  await tg(env, 'sendMessage', {
    chat_id: cm.chat.id,
    parse_mode: 'HTML',
    text: 'Hola 👋 Para que trabaje en este grupo, el administrador del negocio debe escribir: <code>vincular</code>',
  });
}

async function vincularGrupo(ctx) {
  const { env, msg } = ctx;
  const admin = await env.DB.prepare("SELECT negocio_id FROM miembros WHERE tg_user_id = ? AND rol = 'admin' ORDER BY creado DESC LIMIT 1").bind(msg.from.id).first();
  if (!admin) return responder(ctx, 'Solo el administrador del negocio puede vincular este grupo.');
  await env.DB.prepare('INSERT OR IGNORE INTO chats (tg_chat_id, negocio_id, titulo, vinculado_por) VALUES (?, ?, ?, ?)')
    .bind(msg.chat.id, admin.negocio_id, (msg.chat.title || '').slice(0, 80), msg.from.id).run();
  const negocio = await negocioPorId(env, admin.negocio_id);
  return responder(ctx, `✅ Grupo vinculado a <b>${esc(negocio.nombre)}</b>.\nTodos los que escriban aquí podrán registrar. Escriban <b>ayuda</b> para ver ejemplos.`);
}

async function invitar(ctx) {
  if (ctx.rol !== 'admin') return responder(ctx, 'Solo el administrador puede crear invitaciones.');
  const codigo = codigoAleatorio(12);
  await ctx.env.DB.prepare("INSERT INTO invitaciones (codigo, negocio_id, rol, usos_max, expira) VALUES (?, ?, 'miembro', 1, datetime('now', '+7 days'))")
    .bind(codigo, ctx.negocio.id).run();
  const usuario = await nombreDeUsuarioBot(ctx.env);
  const enlace = usuario ? `https://t.me/${usuario}?start=${codigo}` : `/start ${codigo}`;
  return responder(ctx, `🔑 Invitación para <b>${esc(ctx.negocio.nombre)}</b> (1 persona, vale 7 días):\n${esc(enlace)}`);
}

async function unirsePorInvitacion(ctx, codigo) {
  const { env, msg } = ctx;
  const inv = await env.DB.prepare("SELECT codigo, negocio_id, rol, usos, usos_max FROM invitaciones WHERE codigo = ? AND expira > datetime('now')").bind(codigo).first();
  if (!inv || inv.usos >= inv.usos_max) return responder(ctx, 'Esta invitación no es válida o ya se usó. Pide una nueva al administrador.');
  const existente = await env.DB.prepare('SELECT rol FROM miembros WHERE negocio_id = ? AND tg_user_id = ?').bind(inv.negocio_id, msg.from.id).first();
  if (!existente) {
    await env.DB.prepare('INSERT INTO miembros (negocio_id, tg_user_id, nombre, rol) VALUES (?, ?, ?, ?)').bind(inv.negocio_id, msg.from.id, nombreDe(msg.from), inv.rol).run();
  } else if (inv.rol === 'admin' && existente.rol !== 'admin') {
    await env.DB.prepare("UPDATE miembros SET rol = 'admin' WHERE negocio_id = ? AND tg_user_id = ?").bind(inv.negocio_id, msg.from.id).run();
  }
  await env.DB.prepare('UPDATE invitaciones SET usos = usos + 1 WHERE codigo = ?').bind(codigo).run();
  const negocio = await negocioPorId(env, inv.negocio_id);
  const extra = inv.rol === 'admin'
    ? '\n\nEres <b>administrador</b>. Agrégame a tu grupo y escribe ahí <code>vincular</code>.'
    : '';
  return responder(ctx, `✅ Bienvenido(a) a <b>${esc(negocio.nombre)}</b>, ${esc(primerNombre(nombreDe(msg.from)))}.${extra}\n\nEscribe <b>ayuda</b> para ver lo que puedo hacer.`);
}

// ---------- Caja y ventas ----------

async function guardarCaja(ctx, { clase, monto }) {
  const { env, negocio, hoy } = ctx;
  const previo = await env.DB.prepare('SELECT id, monto FROM caja WHERE negocio_id = ? AND fecha = ? AND tipo = ?').bind(negocio.id, hoy, clase).first();
  let id;
  if (previo) {
    await env.DB.prepare('UPDATE caja SET monto = ?, autor = ? WHERE id = ?').bind(monto, ctx.usuario, previo.id).run();
    id = previo.id;
  } else {
    const r = await env.DB.prepare('INSERT INTO caja (negocio_id, fecha, tipo, monto, autor) VALUES (?, ?, ?, ?, ?)').bind(negocio.id, hoy, clase, monto, ctx.usuario).run();
    id = r.meta.last_row_id;
  }
  await anotar(ctx, 'caja', id, { previo: previo ? previo.monto : null });
  const nombre = clase === 'inicio' ? 'Caja inicial' : 'Cierre de caja';
  let txt = `✔ ${nombre} de hoy (${fechaCorta(hoy)}): <b>${dinero(monto)}</b>`;
  if (previo) txt += `\n(reemplaza al anterior: ${dinero(previo.monto)})`;
  if (clase === 'cierre') {
    const v = await totalesVentas(env, negocio.id, hoy, hoy);
    txt += `\nVentas registradas hoy: ${dinero(v.total)}`;
  }
  return responder(ctx, txt);
}

async function guardarVentaRapida(ctx, { monto }) {
  const { env, negocio, hoy } = ctx;
  const r = await env.DB.prepare("INSERT INTO ventas (negocio_id, fecha, monto, origen, autor) VALUES (?, ?, ?, 'rapida', ?)").bind(negocio.id, hoy, monto, ctx.usuario).run();
  await anotar(ctx, 'ventas', r.meta.last_row_id);
  const v = await totalesVentas(env, negocio.id, hoy, hoy);
  return responder(ctx, `✔ Venta guardada: <b>${dinero(monto)}</b>\nTotal de hoy: ${dinero(v.total)}`);
}

async function totalesVentas(env, negocioId, desde, hasta) {
  const r = await env.DB.prepare(
    "SELECT origen, COUNT(*) AS n, COALESCE(SUM(monto),0) AS total FROM ventas WHERE negocio_id = ? AND fecha BETWEEN ? AND ? GROUP BY origen",
  ).bind(negocioId, desde, hasta).all();
  const out = { rapida: { n: 0, total: 0 }, comprobante: { n: 0, total: 0 }, total: 0 };
  for (const row of r.results || []) { out[row.origen] = { n: row.n, total: row.total }; out.total += row.total; }
  return out;
}

async function verVentas(ctx, periodo) {
  const { env, negocio, hoy } = ctx;
  let desde = hoy;
  let hasta = hoy;
  let titulo = `VENTAS · HOY ${fechaCorta(hoy)}`;
  if (periodo === 'ayer') { desde = hasta = sumarDias(hoy, -1); titulo = `VENTAS · AYER ${fechaCorta(desde)}`; }
  if (periodo === 'semana') { desde = lunesDe(hoy); titulo = `VENTAS · SEMANA ${fechaCorta(desde)} a ${fechaCorta(hoy)}`; }
  if (periodo === 'mes') { desde = hoy.slice(0, 8) + '01'; titulo = `VENTAS · MES ${hoy.slice(5, 7)}/${hoy.slice(0, 4)}`; }
  const lineas = [titulo, ''];
  if (periodo === 'semana' || periodo === 'mes') {
    const r = await env.DB.prepare('SELECT fecha, COALESCE(SUM(monto),0) AS total FROM ventas WHERE negocio_id = ? AND fecha BETWEEN ? AND ? GROUP BY fecha ORDER BY fecha')
      .bind(negocio.id, desde, hasta).all();
    for (const row of r.results || []) lineas.push(fila(fechaCorta(row.fecha), dinero(row.total).slice(1)));
    if (!(r.results || []).length) lineas.push('Sin ventas registradas');
  } else {
    const v = await totalesVentas(env, negocio.id, desde, hasta);
    lineas.push(fila(`Ventas registradas (${v.rapida.n})`, dinero(v.rapida.total).slice(1)));
    lineas.push(fila(`Comprobantes (${v.comprobante.n})`, dinero(v.comprobante.total).slice(1)));
  }
  const v = await totalesVentas(env, negocio.id, desde, hasta);
  lineas.push('-'.repeat(30));
  lineas.push(fila('TOTAL', dinero(v.total)));
  if (periodo === 'hoy') {
    const c = await env.DB.prepare("SELECT monto FROM caja WHERE negocio_id = ? AND fecha = ? AND tipo = 'inicio'").bind(negocio.id, hoy).first();
    if (c) lineas.push(fila('Caja inicial', dinero(c.monto)));
  }
  return responder(ctx, pre(lineas));
}

// ---------- Pagos a proveedores ----------

async function guardarPago(ctx, { proveedor, monto, fecha }) {
  const { env, negocio, hoy } = ctx;
  const f = fecha || sumarDias(hoy, 1); // sin fecha = mañana
  const r = await env.DB.prepare('INSERT INTO pagos (negocio_id, proveedor, proveedor_norm, monto, fecha, autor) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(negocio.id, proveedor, normalizar(proveedor), monto, f, ctx.usuario).run();
  await anotar(ctx, 'pagos', r.meta.last_row_id);
  const cuando = f === hoy ? `hoy (${fechaCorta(f)})` : f === sumarDias(hoy, 1) ? `mañana (${fechaCorta(f)})` : `el ${fechaCorta(f)}`;
  return responder(ctx, `✔ Pago guardado: <b>${esc(proveedor)} ${dinero(monto)}</b>\nPagar ${cuando}`);
}

async function verPagos(ctx, q) {
  const { env, negocio, hoy } = ctx;
  let sql = "SELECT proveedor, monto, fecha FROM pagos WHERE negocio_id = ? AND estado = 'pendiente'";
  const args = [negocio.id];
  let titulo;
  if (q.periodo === 'hoy') { sql += ' AND fecha <= ?'; args.push(hoy); titulo = `PAGOS DE HOY · ${fechaCorta(hoy)}`; }
  else if (q.periodo === 'fecha') { sql += ' AND fecha = ?'; args.push(q.fecha); titulo = `PAGOS · ${fechaCorta(q.fecha)}`; }
  else if (q.periodo === 'semana') {
    const fin = sumarDias(lunesDe(hoy), 6);
    sql += ' AND fecha <= ?'; args.push(fin); titulo = `PAGOS HASTA EL ${fechaCorta(fin)}`;
  } else titulo = 'PAGOS PENDIENTES';
  sql += ' ORDER BY fecha, proveedor_norm';
  const r = await env.DB.prepare(sql).bind(...args).all();
  const filas = r.results || [];
  if (!filas.length) {
    return responder(ctx, q.periodo === 'hoy' ? '✅ No hay pagos pendientes para hoy.' : `✅ No hay pagos pendientes${q.periodo === 'fecha' ? ' para el ' + fechaCorta(q.fecha) : ''}.`);
  }
  const lineas = [titulo, ''];
  const agrupar = q.periodo === 'todos' || q.periodo === 'semana';
  let fechaActual = null;
  let total = 0;
  const atrasados = [];
  for (const p of filas) {
    if (agrupar && p.fecha !== fechaActual) {
      fechaActual = p.fecha;
      lineas.push(`— ${p.fecha < hoy ? 'ATRASADO ' : p.fecha === hoy ? 'HOY ' : ''}${fechaCorta(p.fecha)} —`);
    }
    const marca = !agrupar && p.fecha < hoy ? '*' : '';
    if (marca) atrasados.push(p);
    lineas.push(fila(marca + p.proveedor, dinero(p.monto).slice(1)));
    total += p.monto;
  }
  lineas.push('-'.repeat(30));
  lineas.push(fila(`TOTAL (${filas.length})`, dinero(total)));
  if (atrasados.length) lineas.push('', '* atrasado (era para antes de hoy)');
  return responder(ctx, pre(lineas) + '\nCuando pagues, escribe: <code>pagado Nombre</code>');
}

async function marcarPagado(ctx, { proveedor, monto }) {
  const { env, negocio, hoy } = ctx;
  const n = normalizar(proveedor);
  let r = await env.DB.prepare("SELECT id, proveedor, monto, fecha FROM pagos WHERE negocio_id = ? AND estado = 'pendiente' AND proveedor_norm = ? ORDER BY fecha, id")
    .bind(negocio.id, n).all();
  let lista = r.results || [];
  if (!lista.length) {
    r = await env.DB.prepare("SELECT id, proveedor, proveedor_norm, monto, fecha FROM pagos WHERE negocio_id = ? AND estado = 'pendiente' AND proveedor_norm LIKE ? ORDER BY fecha, id")
      .bind(negocio.id, n.replace(/[%_]/g, '') + '%').all();
    lista = r.results || [];
    const nombres = [...new Set(lista.map((p) => p.proveedor_norm))];
    if (nombres.length > 1) {
      return responder(ctx, `Hay varios proveedores que empiezan así: ${lista.map((p) => '<b>' + esc(p.proveedor) + '</b>').filter((v, i, a) => a.indexOf(v) === i).join(', ')}.\nEscribe el nombre completo.`);
    }
  }
  if (monto != null) lista = lista.filter((p) => p.monto === monto);
  if (!lista.length) return responder(ctx, `No encontré pagos pendientes de <b>${esc(proveedor)}</b>${monto != null ? ' por ' + dinero(monto) : ''}.\nEscribe <code>pagos</code> para ver la lista.`);
  const p = lista[0];
  await env.DB.prepare("UPDATE pagos SET estado = 'pagado', pagado_en = datetime('now'), pagado_por = ? WHERE id = ?").bind(ctx.usuario, p.id).run();
  await anotar(ctx, 'pagado', p.id);
  let txt = `✔ Pagado: <b>${esc(p.proveedor)} ${dinero(p.monto)}</b> (era para el ${fechaCorta(p.fecha)})`;
  if (lista.length > 1) txt += `\nQuedan ${lista.length - 1} pagos pendientes de ${esc(p.proveedor)}.`;
  return responder(ctx, txt);
}

// ---------- Clientes y comprobantes ----------

function avisoPrivacidad(ctx) {
  return `${ctx.origin}/p/${ctx.negocio.slug}`;
}

function botonConsentimiento(clienteId, codigo = '') {
  return { inline_keyboard: [[{ text: '✅ El cliente aceptó el aviso de privacidad', callback_data: `ok:${clienteId}${codigo ? ':' + codigo : ''}` }]] };
}

async function guardarCliente(ctx, c) {
  const { env, negocio } = ctx;
  if (c.telefono && !telefonoIntl(c.telefono)) return responder(ctx, `El teléfono <b>${esc(c.telefono)}</b> no parece válido. Ejemplo: <code>0991234567</code>`);
  if (c.telefono) {
    const dup = await env.DB.prepare('SELECT nombre FROM clientes WHERE negocio_id = ? AND telefono = ?').bind(negocio.id, c.telefono).first();
    if (dup) return responder(ctx, `Ya existe un cliente con ese teléfono: <b>${esc(dup.nombre)}</b>.`);
  }
  const r = await env.DB.prepare('INSERT INTO clientes (negocio_id, nombre, nombre_norm, telefono, cedula, correo, autor) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(negocio.id, c.nombre, normalizar(c.nombre), c.telefono, c.cedula, c.correo, ctx.usuario).run();
  const id = r.meta.last_row_id;
  await anotar(ctx, 'clientes', id);
  const datos = [
    c.telefono ? `📱 ${telefonoOculto(c.telefono)}` : null,
    c.cedula ? `🪪 ${'*'.repeat(6)}${c.cedula.slice(-4)}` : null,
    c.correo ? `✉️ ${esc(c.correo.replace(/^(.).*(@.*)$/, '$1***$2'))}` : null,
  ].filter(Boolean).join('  ');
  return responder(ctx,
    `✔ Cliente registrado: <b>${esc(c.nombre)}</b>\n${datos}\n\n` +
    `⚠️ Por ley (LOPDP), el cliente debe conocer para qué se usan sus datos. Muéstrale o envíale el aviso:\n${esc(avisoPrivacidad(ctx))}\n` +
    'Cuando acepte, toca el botón.',
    { reply_markup: botonConsentimiento(id) });
}

async function buscarCliente(env, negocioId, consulta) {
  const n = normalizar(consulta);
  let r = await env.DB.prepare('SELECT * FROM clientes WHERE negocio_id = ? AND nombre_norm = ?').bind(negocioId, n).all();
  if ((r.results || []).length) return r.results;
  r = await env.DB.prepare("SELECT * FROM clientes WHERE negocio_id = ? AND (nombre_norm LIKE ? OR nombre_norm LIKE ?) ORDER BY creado DESC LIMIT 6")
    .bind(negocioId, n.replace(/[%_]/g, '') + '%', '% ' + n.replace(/[%_]/g, '') + '%').all();
  return r.results || [];
}

function botonesEnvio(origin, codigo, cliente) {
  const fila1 = [];
  if (cliente.telefono && telefonoIntl(cliente.telefono)) fila1.push({ text: '📲 Enviar por WhatsApp', url: `${origin}/c/${codigo}/wa` });
  if (cliente.correo) fila1.push({ text: '✉️ Enviar por correo', url: `${origin}/c/${codigo}/correo` });
  const teclado = [];
  if (fila1.length) teclado.push(fila1);
  teclado.push([{ text: '🧾 Ver comprobante', url: `${origin}/c/${codigo}` }]);
  return { inline_keyboard: teclado };
}

async function crearComprobante(ctx, v) {
  const { env, negocio, hoy, origin } = ctx;
  const encontrados = await buscarCliente(env, negocio.id, v.cliente);
  if (!encontrados.length) {
    return responder(ctx, `No encontré al cliente <b>${esc(v.cliente)}</b>.\nRegístralo primero: <code>cliente ${esc(v.cliente)} 0991234567</code>`);
  }
  if (encontrados.length > 1) {
    return responder(ctx, `Hay ${encontrados.length} clientes que coinciden: ${encontrados.map((c) => '<b>' + esc(c.nombre) + '</b>').join(', ')}.\nEscribe el nombre completo.`);
  }
  const cliente = encontrados[0];
  const items = v.items.length ? v.items : [{ d: 'Compra', c: 1, p: v.total }];
  const total = items.reduce((a, it) => a + it.c * it.p, 0);
  const codigo = codigoAleatorio(16);
  const url = `${origin}/c/${codigo}`;

  let comprobanteId = null;
  let numero = null;
  for (let intento = 0; intento < 3 && !comprobanteId; intento++) {
    const sig = await env.DB.prepare('SELECT COALESCE(MAX(numero),0) + 1 AS n FROM comprobantes WHERE negocio_id = ?').bind(negocio.id).first();
    numero = sig.n;
    try {
      const r = await env.DB.prepare('INSERT INTO comprobantes (negocio_id, numero, codigo, cliente_id, items, total, fecha, autor) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(negocio.id, numero, codigo, cliente.id, JSON.stringify(items), total, hoy, ctx.usuario).run();
      comprobanteId = r.meta.last_row_id;
    } catch (e) {
      if (!String(e && e.message).includes('UNIQUE')) throw e;
    }
  }
  if (!comprobanteId) return responder(ctx, 'No pude crear el comprobante. Inténtalo otra vez.');
  await env.DB.prepare("INSERT INTO ventas (negocio_id, fecha, monto, origen, comprobante_id, autor) VALUES (?, ?, ?, 'comprobante', ?, ?)")
    .bind(negocio.id, hoy, total, comprobanteId, ctx.usuario).run();
  await anotar(ctx, 'comprobantes', comprobanteId);

  const m = await mensajeComprobante(env, { negocio, cliente, items, total, numero, fecha: hoy, url });
  await env.DB.prepare('UPDATE comprobantes SET mensaje = ? WHERE id = ?').bind(m.texto, comprobanteId).run();

  const resumen = [
    `COMPROBANTE N.º ${numeroComprobante(numero)}`,
    `Cliente: ${cliente.nombre}`,
    '',
    ...items.map((it) => fila(`${it.c > 1 ? it.c + ' x ' : ''}${it.d}`, dinero(it.c * it.p).slice(1))),
    '-'.repeat(30),
    fila('TOTAL', dinero(total)),
  ];
  let txt = '✔ Venta guardada\n' + pre(resumen);
  if (!cliente.consentimiento) {
    txt += `\n⚠️ ${esc(primerNombre(cliente.nombre))} todavía no aceptó el aviso de privacidad:\n${esc(avisoPrivacidad(ctx))}\nCuando acepte, toca el botón y te doy las opciones de envío.`;
    return responder(ctx, txt, { reply_markup: botonConsentimiento(cliente.id, codigo) });
  }
  txt += '\n¿Cómo se lo envío?';
  return responder(ctx, txt, { reply_markup: botonesEnvio(origin, codigo, cliente) });
}

async function onBoton(env, cq, origin) {
  const data = String(cq.data || '');
  const m = data.match(/^ok:(\d+)(?::([A-Za-z0-9]{16}))?$/);
  if (!m) return tg(env, 'answerCallbackQuery', { callback_query_id: cq.id });
  const cliente = await env.DB.prepare('SELECT * FROM clientes WHERE id = ?').bind(parseInt(m[1], 10)).first();
  const miembro = cliente && await env.DB.prepare('SELECT rol FROM miembros WHERE negocio_id = ? AND tg_user_id = ?').bind(cliente.negocio_id, cq.from.id).first();
  if (!cliente || !miembro) return tg(env, 'answerCallbackQuery', { callback_query_id: cq.id, text: 'No tienes permiso para esto.', show_alert: true });
  if (!cliente.consentimiento) {
    await env.DB.prepare("UPDATE clientes SET consentimiento = datetime('now'), consentimiento_por = ? WHERE id = ?").bind(cq.from.id, cliente.id).run();
  }
  await tg(env, 'answerCallbackQuery', { callback_query_id: cq.id, text: 'Consentimiento registrado ✅' });
  if (cq.message) await tg(env, 'editMessageReplyMarkup', { chat_id: cq.message.chat.id, message_id: cq.message.message_id, reply_markup: { inline_keyboard: [] } });
  const chatId = cq.message ? cq.message.chat.id : cq.from.id;
  let texto = `✅ ${esc(cliente.nombre)} aceptó el aviso de privacidad.`;
  let markup;
  if (m[2]) {
    const comp = await env.DB.prepare("SELECT codigo FROM comprobantes WHERE codigo = ? AND negocio_id = ? AND estado = 'emitido'").bind(m[2], cliente.negocio_id).first();
    if (comp) { texto += '\n¿Cómo le envío el comprobante?'; markup = botonesEnvio(origin, comp.codigo, cliente); }
  }
  return tg(env, 'sendMessage', { chat_id: chatId, text: texto, parse_mode: 'HTML', ...(markup ? { reply_markup: markup } : {}) });
}

// ---------- Deshacer ----------

async function borrarUltimo(ctx) {
  const { env, negocio } = ctx;
  const reg = await env.DB.prepare('SELECT * FROM registros WHERE negocio_id = ? AND autor = ? AND deshecho = 0 ORDER BY id DESC LIMIT 1').bind(negocio.id, ctx.usuario).first();
  if (!reg) return responder(ctx, 'No tienes registros para deshacer.');
  let detalle = '';
  const DB = env.DB;
  if (reg.tabla === 'pagos') {
    const p = await DB.prepare('SELECT proveedor, monto, fecha FROM pagos WHERE id = ?').bind(reg.fila_id).first();
    await DB.prepare('DELETE FROM pagos WHERE id = ?').bind(reg.fila_id).run();
    detalle = p ? `pago a ${esc(p.proveedor)} ${dinero(p.monto)} (${fechaCorta(p.fecha)})` : 'pago';
  } else if (reg.tabla === 'pagado') {
    const p = await DB.prepare('SELECT proveedor, monto FROM pagos WHERE id = ?').bind(reg.fila_id).first();
    await DB.prepare("UPDATE pagos SET estado = 'pendiente', pagado_en = NULL, pagado_por = NULL WHERE id = ?").bind(reg.fila_id).run();
    detalle = p ? `"pagado" de ${esc(p.proveedor)} ${dinero(p.monto)} (vuelve a pendiente)` : 'marca de pagado';
  } else if (reg.tabla === 'ventas') {
    const v = await DB.prepare('SELECT monto FROM ventas WHERE id = ?').bind(reg.fila_id).first();
    await DB.prepare('DELETE FROM ventas WHERE id = ?').bind(reg.fila_id).run();
    detalle = v ? `venta de ${dinero(v.monto)}` : 'venta';
  } else if (reg.tabla === 'caja') {
    const datos = reg.datos ? JSON.parse(reg.datos) : {};
    const c = await DB.prepare('SELECT tipo, monto FROM caja WHERE id = ?').bind(reg.fila_id).first();
    if (datos.previo != null) await DB.prepare('UPDATE caja SET monto = ? WHERE id = ?').bind(datos.previo, reg.fila_id).run();
    else await DB.prepare('DELETE FROM caja WHERE id = ?').bind(reg.fila_id).run();
    detalle = c ? `${c.tipo === 'inicio' ? 'caja inicial' : 'cierre de caja'} ${dinero(c.monto)}${datos.previo != null ? ' (vuelve a ' + dinero(datos.previo) + ')' : ''}` : 'caja';
  } else if (reg.tabla === 'clientes') {
    const usado = await DB.prepare('SELECT COUNT(*) AS n FROM comprobantes WHERE cliente_id = ?').bind(reg.fila_id).first();
    if (usado && usado.n > 0) return responder(ctx, 'Ese cliente ya tiene comprobantes; no lo borro.');
    const c = await DB.prepare('SELECT nombre FROM clientes WHERE id = ?').bind(reg.fila_id).first();
    await DB.prepare('DELETE FROM clientes WHERE id = ?').bind(reg.fila_id).run();
    detalle = c ? `cliente ${esc(c.nombre)}` : 'cliente';
  } else if (reg.tabla === 'comprobantes') {
    const c = await DB.prepare('SELECT numero, total FROM comprobantes WHERE id = ?').bind(reg.fila_id).first();
    await DB.prepare("UPDATE comprobantes SET estado = 'anulado' WHERE id = ?").bind(reg.fila_id).run();
    await DB.prepare('DELETE FROM ventas WHERE comprobante_id = ?').bind(reg.fila_id).run();
    detalle = c ? `comprobante N.º ${numeroComprobante(c.numero)} de ${dinero(c.total)} (queda ANULADO)` : 'comprobante';
  }
  await DB.prepare('UPDATE registros SET deshecho = 1 WHERE id = ?').bind(reg.id).run();
  return responder(ctx, `↩️ Borré: ${detalle}`);
}

