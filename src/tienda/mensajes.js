// Mensaje personalizado que acompaña al comprobante (WhatsApp y correo).
// Los productos, montos y el enlace los pone SIEMPRE el sistema desde la base de datos.
// La IA (si hay llave configurada) solo redacta el saludo y la despedida, y se descarta si mete números o enlaces.

import { providersFrom, cascade } from '../ia.js';
import { dinero, fechaLarga, primerNombre } from './util.js';

const MAX_LINEAS = 10;

export function numeroComprobante(n) {
  return String(n).padStart(6, '0');
}

export function lineasProductos(items) {
  const out = items.slice(0, MAX_LINEAS).map((it) => `• ${it.c > 1 ? it.c + ' x ' : ''}${it.d} — ${dinero(it.c * it.p)}`);
  if (items.length > MAX_LINEAS) out.push(`• … y ${items.length - MAX_LINEAS} productos más (ver comprobante)`);
  return out;
}

function saludoFijo(nombre) {
  return `Hola ${nombre}, es un gusto saludarte. 😊`;
}

function cierreFijo() {
  return 'En nuestras redes siempre encontrarás promociones, y puedes escribirnos cuando lo necesites. ¡Gracias por preferirnos!';
}

async function textosIA(env, { nombre, negocio, productos }) {
  const providers = providersFrom(env);
  if (!providers.length) return null;
  const r = await cascade(providers, [
    {
      role: 'system',
      content: 'Redactas mensajes cortos y cálidos de una tienda de barrio en Ecuador para sus clientes. Español neutro y respetuoso (tú). ' +
        'Devuelve SOLO un JSON: {"saludo": "...", "cierre": "..."}. saludo: 1 frase que salude al cliente por su nombre. ' +
        'cierre: 1 o 2 frases que agradezcan la compra e inviten a ver las promociones en las redes del negocio y a escribir cuando necesite. ' +
        'Máximo 35 palabras cada uno. Prohibido escribir números, precios, fechas, enlaces o inventar promociones concretas.',
    },
    { role: 'user', content: JSON.stringify({ cliente: nombre, negocio, productos: productos.slice(0, 8) }) },
  ], 300);
  if (!r.text) return null;
  try {
    const j = JSON.parse(r.text.replace(/^```(?:json)?\s*|\s*```$/g, ''));
    const ok = (s) => typeof s === 'string' && s.trim().length > 3 && s.length < 260 && !/\d|https?:|www\.|@/i.test(s);
    if (ok(j.saludo) && ok(j.cierre)) return { saludo: j.saludo.trim(), cierre: j.cierre.trim(), via: r.via };
  } catch { /* respuesta no válida: se usa el texto fijo */ }
  return null;
}

export async function mensajeComprobante(env, { negocio, cliente, items, total, numero, fecha, url }) {
  const nombre = primerNombre(cliente.nombre);
  const ia = await textosIA(env, { nombre, negocio: negocio.nombre, productos: items.map((i) => i.d) }).catch(() => null);
  const lineas = [
    ia ? ia.saludo : saludoFijo(nombre),
    `Gracias por tu compra en ${negocio.nombre}.`,
    '',
    `🧾 Comprobante N.º ${numeroComprobante(numero)} · ${fechaLarga(fecha)}`,
    ...lineasProductos(items),
    `Total: ${dinero(total)}`,
    '',
    `Puedes verlo aquí: ${url}`,
    '',
    ia ? ia.cierre : cierreFijo(),
  ];
  if (negocio.redes) lineas.push(negocio.redes);
  return { texto: lineas.join('\n'), via: ia ? ia.via : 'fijo' };
}
