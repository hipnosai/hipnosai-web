// Utilidades del bot de tiendas: texto, montos, fechas (hora de Ecuador), teléfonos, códigos.

const OFFSET_MS = 5 * 60 * 60 * 1000; // Ecuador continental: UTC-5, sin horario de verano.
const DIAS = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
const DIAS_CORTOS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];

export function normalizar(s) {
  return String(s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

export function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// "15.50", "15,50", "$15.5", "15" -> 1550 (centavos). Devuelve null si no es un monto.
export function parseMonto(tok) {
  const t = String(tok || '').trim().replace(/^\$\s*/, '').replace(/\$$/, '');
  if (!/^\d{1,7}([.,]\d{1,2})?$/.test(t)) return null;
  const [ent, dec = ''] = t.replace(',', '.').split('.');
  const cents = parseInt(ent, 10) * 100 + parseInt((dec + '00').slice(0, 2), 10);
  return Number.isFinite(cents) && cents > 0 ? cents : null;
}

export function dinero(cents) {
  const neg = cents < 0;
  const v = Math.abs(Math.round(cents));
  const s = Math.floor(v / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + String(v % 100).padStart(2, '0');
  return (neg ? '-$' : '$') + s;
}

export function hoyISO(now = Date.now()) {
  return new Date(now - OFFSET_MS).toISOString().slice(0, 10);
}

export function sumarDias(iso, n) {
  const d = new Date(iso + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function diaSemana(iso) {
  return new Date(iso + 'T12:00:00Z').getUTCDay();
}

export function fechaCorta(iso) {
  const [y, m, d] = iso.split('-');
  return `${DIAS_CORTOS[diaSemana(iso)]} ${d}/${m}`;
}

export function fechaLarga(iso) {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

// Interpreta palabras de fecha: hoy, mañana, pasado mañana, lunes..domingo, 20/11, 20-11, 20/11/2026.
// Recibe el texto ya normalizado. Devuelve 'YYYY-MM-DD' o null.
export function parseFecha(t, hoy) {
  let s = normalizar(t).replace(/^(para|el|la|pagar|pago)\s+/, '').replace(/^(el|la)\s+/, '').trim();
  if (!s) return null;
  if (s === 'hoy') return hoy;
  if (s === 'manana') return sumarDias(hoy, 1);
  if (s === 'pasado manana' || s === 'pasado') return sumarDias(hoy, 2);
  const idx = DIAS.indexOf(s);
  if (idx >= 0) {
    let diff = (idx - diaSemana(hoy) + 7) % 7;
    if (diff === 0) diff = 7; // "lunes" dicho un lunes = el próximo lunes
    return sumarDias(hoy, diff);
  }
  const m = s.match(/^(\d{1,2})[\/\-.](\d{1,2})(?:[\/\-.](\d{2,4}))?$/);
  if (m) {
    const d = parseInt(m[1], 10);
    const mo = parseInt(m[2], 10);
    let y = m[3] ? parseInt(m[3], 10) : parseInt(hoy.slice(0, 4), 10);
    if (y < 100) y += 2000;
    if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
    let iso = `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const check = new Date(iso + 'T12:00:00Z');
    if (check.getUTCMonth() + 1 !== mo) return null;
    // Sin año y la fecha ya pasó hace más de 2 meses: se entiende el próximo año.
    if (!m[3] && iso < sumarDias(hoy, -60)) iso = `${y + 1}${iso.slice(4)}`;
    return iso;
  }
  return null;
}

export function lunesDe(iso) {
  const dow = diaSemana(iso);
  return sumarDias(iso, -((dow + 6) % 7));
}

// Teléfono a formato internacional para WhatsApp (solo dígitos). Ecuador por defecto.
export function telefonoIntl(raw) {
  if (!raw) return null;
  const plus = String(raw).trim().startsWith('+');
  const d = String(raw).replace(/\D/g, '');
  if (d.startsWith('593') && (d.length === 12 || d.length === 11)) return d;
  if (d.startsWith('0') && (d.length === 10 || d.length === 9)) return '593' + d.slice(1);
  if (d.length === 9 && d.startsWith('9')) return '593' + d;
  if (plus && d.length >= 8 && d.length <= 15) return d;
  return null;
}

export function telefonoOculto(raw) {
  const d = String(raw || '').replace(/\D/g, '');
  if (d.length < 6) return '***';
  return d.slice(0, 3) + '****' + d.slice(-3);
}

const ALFABETO = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
export function codigoAleatorio(n = 16) {
  const bytes = new Uint8Array(n);
  crypto.getRandomValues(bytes);
  let out = '';
  for (const b of bytes) out += ALFABETO[b % ALFABETO.length];
  return out;
}

export function correoValido(s) {
  return /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[a-z]{2,}$/i.test(String(s || ''));
}

export async function sha256Hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function primerNombre(nombre) {
  const p = String(nombre || '').trim().split(/\s+/)[0] || '';
  return p ? p[0].toUpperCase() + p.slice(1) : '';
}

// Ajusta un texto a un ancho fijo para tablas en monoespaciado.
export function fila(izq, der, ancho = 30) {
  izq = String(izq);
  der = String(der);
  const max = ancho - der.length - 1;
  if (izq.length > max) izq = izq.slice(0, Math.max(1, max - 1)) + '…';
  return izq + ' '.repeat(Math.max(1, ancho - izq.length - der.length)) + der;
}
