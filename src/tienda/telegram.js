// Llamadas a la API de bots de Telegram (oficial y gratuita).
// El token es un SECRETO de Cloudflare (TELEGRAM_BOT_TOKEN); nunca va en el código.

import { sha256Hex } from './util.js';

let usuarioBot = null;

export async function tg(env, metodo, datos) {
  const base = (env.TG_API_BASE || 'https://api.telegram.org').replace(/\/+$/, '');
  try {
    const r = await fetch(`${base}/bot${env.TELEGRAM_BOT_TOKEN}/${metodo}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(datos || {}),
    });
    let data = null;
    try { data = await r.json(); } catch { /* respuesta no JSON */ }
    if (!r.ok || !data || !data.ok) console.warn('tg_fail', metodo, r.status, data && data.description);
    return data;
  } catch (e) {
    console.warn('tg_error', metodo, e && e.name);
    return null;
  }
}

// Clave que Telegram manda en cada aviso al webhook. Se deriva del token: no hace falta otro secreto.
export async function secretoWebhook(env) {
  return (await sha256Hex('hipnos-tg-webhook:' + env.TELEGRAM_BOT_TOKEN)).slice(0, 48);
}

export async function nombreDeUsuarioBot(env) {
  if (usuarioBot) return usuarioBot;
  const r = await tg(env, 'getMe', {});
  usuarioBot = (r && r.result && r.result.username) || null;
  return usuarioBot;
}
