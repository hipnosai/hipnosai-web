// Interpreta lo que la gente escribe en el grupo o en el chat privado.
// Reglas fijas (sin IA): así nunca inventa montos ni registros.

import { normalizar, parseMonto, parseFecha, correoValido } from './util.js';

const AYUDA = new Set(['ayuda', '/ayuda', '/help', 'help', 'menu', '/menu', 'comandos', '/comandos', '/start', 'que puedes hacer', 'que haces']);

const PALABRAS_PAGOS = new Set(['pago', 'pagos', 'pagar', 'proveedor', 'proveedores', 'pendiente', 'pendientes', 'deudas', 'cuentas']);

// Primeras palabras que nunca son nombre de proveedor (evita registrar charla normal del grupo).
const NO_PROVEEDOR = new Set([
  'son', 'es', 'eran', 'era', 'total', 'cuesta', 'cuestan', 'costo', 'vale', 'valen', 'precio', 'cambio', 'vuelto',
  'dame', 'deme', 'tengo', 'tienes', 'tiene', 'hay', 'quedan', 'queda', 'faltan', 'falta', 'faltaron', 'me', 'te', 'le',
  'les', 'nos', 'solo', 'mas', 'menos', 'unos', 'unas', 'como', 'cuanto', 'cuantos', 'cuanta', 'a', 'al', 'de', 'del',
  'y', 'o', 'que', 'en', 'por', 'con', 'sin', 'ya', 'si', 'no', 'ok', 'hola', 'gracias', 'llegaron', 'llego', 'compre',
  'compramos', 'trajeron', 'cobre', 'cobramos', 'venta', 'ventas', 'cliente', 'caja', 'inicio', 'cierre', 'pagado', 'pague',
  'ayuda', 'borrar', 'vincular', 'invitar', 'producto', 'precio', 'faltaba', 'debe', 'debo', 'paso', 'pase',
]);

const PERIODOS_VENTAS = {
  hoy: 'hoy', ayer: 'ayer', semana: 'semana', 'esta semana': 'semana', 'la semana': 'semana', 'de la semana': 'semana',
  mes: 'mes', 'este mes': 'mes', 'el mes': 'mes', 'del mes': 'mes',
};

export function interpretar(texto, hoy) {
  const original = String(texto || '').replace(/ /g, ' ').trim();
  if (!original) return null;
  const o = original.replace(/^(\/[a-z_]+)@\w+/i, '$1'); // "/ayuda@MiBot" -> "/ayuda"
  const t = normalizar(o);
  let m;

  m = o.match(/^\/start\s+([A-Za-z0-9_-]{6,64})$/);
  if (m) return { tipo: 'start', codigo: m[1] };
  if (AYUDA.has(t)) return { tipo: 'ayuda' };
  if (t === 'vincular' || t === '/vincular' || t === 'vincular grupo') return { tipo: 'vincular' };
  if (t === 'invitar' || t === '/invitar') return { tipo: 'invitar' };
  if (/^\/?(borrar|deshacer)( (el )?ultimo)?$/.test(t)) return { tipo: 'borrar' };

  // Caja
  m = t.match(/^(?:inicio de caja|inicio caja|caja inicial|abrir caja|apertura de caja|apertura caja)\s*(?:de|con|:|=)?\s*(\S+)$/);
  if (m && parseMonto(m[1]) != null) return { tipo: 'caja', clase: 'inicio', monto: parseMonto(m[1]) };
  m = t.match(/^(?:cierre de caja|cierre caja|cerrar caja|caja final)\s*(?:de|con|:|=)?\s*(\S+)$/);
  if (m && parseMonto(m[1]) != null) return { tipo: 'caja', clase: 'cierre', monto: parseMonto(m[1]) };

  // Consultar ventas
  m = t.match(/^(?:ventas|venta|vendido|total ventas|total de ventas|cuanto vendimos)\s+(?:de la\s+|del\s+|de\s+)?(hoy|ayer|semana|esta semana|la semana|mes|este mes|el mes)$/);
  if (m) return { tipo: 'ver_ventas', periodo: PERIODOS_VENTAS[m[1]] || 'hoy' };
  if (t === 'ventas' || t === 'cuanto vendimos' || t === 'cuanto vendimos hoy') return { tipo: 'ver_ventas', periodo: 'hoy' };

  // Registrar venta rápida (sin cliente)
  m = t.match(/^(?:ventas|venta|vendi|vendimos|se vendio)\s*(?:de|:|=)?\s*(\S+)$/);
  if (m && parseMonto(m[1]) != null) return { tipo: 'venta_rapida', monto: parseMonto(m[1]) };

  // Marcar un pago como hecho
  m = o.match(/^\s*(?:pagado|pagada|pague|pagué|ya pague|ya pagué|ya se pago|ya se pagó|pagamos|ya pagamos|se pago|se pagó)\s+(?:a\s+|al\s+)?(.+)$/i);
  if (m) {
    const toks = m[1].trim().split(/\s+/);
    let monto = null;
    if (toks.length > 1 && parseMonto(toks[toks.length - 1]) != null) monto = parseMonto(toks.pop());
    const proveedor = toks.join(' ').trim();
    if (/[a-zñáéíóú]/i.test(proveedor)) return { tipo: 'pagado', proveedor, monto };
  }

  // Consultar pagos
  const q = consultaPagos(t, hoy);
  if (q) return q;

  // Registrar cliente
  m = o.match(/^\s*(?:nuevo cliente|cliente nuevo|registrar cliente|cliente)\s*:?\s+(.+)$/is);
  if (m) return parseCliente(m[1]);

  // Venta con comprobante: "venta Juan: 2 leche 1.00, pan 0.15"  o  "venta Juan 10.55"
  m = o.match(/^\s*venta\s+(?:a\s+|para\s+)?([^:]+?)\s*:\s*([\s\S]+)$/i);
  if (m) return parseVenta(m[1], m[2]);
  m = o.match(/^\s*venta\s+(?:a\s+|para\s+)?(.+?)\s+(\$?\d[\d.,]*)\s*$/i);
  if (m && /[a-zñáéíóú]/i.test(m[1]) && parseMonto(m[2]) != null) {
    return { tipo: 'venta', cliente: m[1].trim(), items: [], total: parseMonto(m[2]) };
  }
  if (/^venta\s+[a-zñáéíóú]/i.test(o)) return { tipo: 'error', motivo: 'venta_sin_monto' };

  // Pago a proveedor: "Rey Leche 15.50", "Rey Leche 15.50 hoy", "Rey Leche 15.50 para el lunes"
  return parseProveedor(o, hoy);
}

function consultaPagos(t, hoy) {
  const toks = t.split(' ');
  if (toks.length > 12) return null;
  if (!toks.some((w) => PALABRAS_PAGOS.has(w))) return null;
  if (toks.some((w) => parseMonto(w) != null)) return null;
  if (t.includes('pasado manana')) return { tipo: 'ver_pagos', periodo: 'fecha', fecha: parseFecha('pasado manana', hoy) };
  if (toks.includes('hoy')) return { tipo: 'ver_pagos', periodo: 'hoy' };
  if (toks.includes('manana')) return { tipo: 'ver_pagos', periodo: 'fecha', fecha: parseFecha('manana', hoy) };
  if (toks.includes('semana')) return { tipo: 'ver_pagos', periodo: 'semana' };
  for (const w of toks) {
    const f = /\d/.test(w) || ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'].includes(w) ? parseFecha(w, hoy) : null;
    if (f) return { tipo: 'ver_pagos', periodo: 'fecha', fecha: f };
  }
  return { tipo: 'ver_pagos', periodo: 'todos' };
}

function parseProveedor(o, hoy) {
  let s = o.replace(/^\s*(?:pagar a|pagar al|pagar|pago a|pago al|proveedor|deuda con|deuda|le debemos a|debemos a)\s+/i, '').trim();
  let toks = s.split(/\s+/);
  if (toks.length < 2 || toks.length > 10) return null;
  let fecha = null;
  for (const k of [3, 2, 1]) {
    if (toks.length <= k + 1) continue;
    const f = parseFecha(toks.slice(-k).join(' '), hoy);
    if (f) { fecha = f; toks = toks.slice(0, -k); break; }
  }
  if (toks.length > 1 && /^(para|el|la)$/i.test(toks[toks.length - 1])) toks.pop();
  const monto = parseMonto(toks[toks.length - 1]);
  if (monto == null) return null;
  toks.pop();
  const proveedor = toks.join(' ').replace(/[:=\-–]+$/, '').trim();
  if (!proveedor || !/[a-zñáéíóú]{2,}/i.test(proveedor) || proveedor.length > 60 || toks.length > 6) return null;
  if (NO_PROVEEDOR.has(normalizar(toks[0]))) return null;
  return { tipo: 'pago', proveedor: capitalizar(proveedor), monto, fecha, fechaExplicita: !!fecha };
}

function parseCliente(rest) {
  let s = ' ' + rest.replace(/\n/g, ' ') + ' ';
  let correo = null;
  let cedula = null;
  let telefono = null;
  let m = s.match(/(?:\b(?:correo|email|e-mail|mail)\s*:?\s*)?([^\s,;:]+@[^\s,;:]+\.[a-z]{2,})/i);
  if (m && correoValido(m[1])) { correo = m[1].toLowerCase(); s = s.replace(m[0], ' '); }
  m = s.match(/\b(?:c[eé]dula|ced|c\.\s?i\.?|ci|ruc)\s*[:.#]?\s*(\d{10}(?:\d{3})?)\b/i);
  if (m) { cedula = m[1]; s = s.replace(m[0], ' '); }
  m = s.match(/(?:\b(?:tel[eé]fono|telf|tel|cel|celular|whatsapp|wsp|n[uú]mero)\s*[:.#]?\s*)?(\+?\d[\d\s-]{7,16}\d)/i);
  if (m) {
    const digits = m[1].replace(/\D/g, '');
    if (digits.length >= 9 && digits.length <= 13) { telefono = m[1].replace(/[\s-]/g, ''); s = s.replace(m[0], ' '); }
  }
  const nombre = s.replace(/[,;:]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!/[a-zñáéíóú]{2,}/i.test(nombre) || /\d/.test(nombre) || nombre.length > 80) return { tipo: 'error', motivo: 'cliente_formato' };
  if (!telefono && !correo) return { tipo: 'error', motivo: 'cliente_sin_contacto' };
  return { tipo: 'cliente', nombre: capitalizar(nombre), telefono, cedula, correo };
}

function parseVenta(nombre, lista) {
  const cliente = nombre.trim();
  if (!/[a-zñáéíóú]/i.test(cliente)) return { tipo: 'error', motivo: 'venta_formato' };
  const soloMonto = parseMonto(lista.trim());
  if (soloMonto != null) return { tipo: 'venta', cliente, items: [], total: soloMonto };
  // "0,15" es un decimal, no un separador de productos.
  const partes = lista.replace(/(\d),(\d{1,2})(?=\D|$)/g, '$1.$2').split(/[,;\n]+/).map((p) => p.trim()).filter(Boolean);
  if (!partes.length || partes.length > 40) return { tipo: 'error', motivo: 'venta_formato' };
  const items = [];
  for (const p of partes) {
    const toks = p.split(/\s+/);
    const precio = parseMonto(toks[toks.length - 1]);
    if (precio == null) return { tipo: 'error', motivo: 'item_sin_precio', item: p };
    toks.pop();
    let desc = toks.join(' ').replace(/[:=\-–]+$/, '').trim();
    let cant = 1;
    let mm = desc.match(/^(\d{1,3})\s*(?:x\s*)?(.+)$/i);
    if (mm && /[a-zñáéíóú]/i.test(mm[2])) { cant = parseInt(mm[1], 10); desc = mm[2].trim(); }
    else {
      mm = desc.match(/^(.+?)\s+x\s*(\d{1,3})$/i);
      if (mm) { desc = mm[1].trim(); cant = parseInt(mm[2], 10); }
    }
    if (!/[a-zñáéíóú]/i.test(desc) || cant < 1) return { tipo: 'error', motivo: 'item_sin_precio', item: p };
    items.push({ d: capitalizar(desc).slice(0, 60), c: cant, p: precio });
  }
  const total = items.reduce((a, it) => a + it.c * it.p, 0);
  return { tipo: 'venta', cliente, items, total };
}

export function capitalizar(s) {
  return String(s).trim().replace(/\s+/g, ' ').split(' ')
    .map((w) => (w.length > 1 && w === w.toLowerCase() ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
}
