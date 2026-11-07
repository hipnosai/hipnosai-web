// Hipnos AI — proveedores de IA en cascada (compartido por el chat de la web y el bot de tiendas).
// Las claves NUNCA van en el código: son secretos de Cloudflare.

const TIMEOUT_MS = 20000;

// Orden de la cascada por defecto (se puede cambiar en wrangler.jsonc -> vars.AI_CASCADE).
export const DEFAULT_CASCADE = [
  { name: 'groq-gpt-oss-120b', base: 'https://api.groq.com/openai/v1', model: 'openai/gpt-oss-120b', keys: ['GROQ_API_KEY', 'AI_API_KEY'], reasoning: 'low' },
  { name: 'groq-gpt-oss-20b', base: 'https://api.groq.com/openai/v1', model: 'openai/gpt-oss-20b', keys: ['GROQ_API_KEY', 'AI_API_KEY'], reasoning: 'low' },
  { name: 'cerebras-gpt-oss-120b', base: 'https://api.cerebras.ai/v1', model: 'gpt-oss-120b', keys: ['CEREBRAS_API_KEY'] },
  { name: 'github-gpt-4.1-mini', base: 'https://models.github.ai/inference', model: 'openai/gpt-4.1-mini', keys: ['GITHUB_MODELS_TOKEN'], tokenParam: 'max_tokens' },
  { name: 'groq-llama-3.1-8b', base: 'https://api.groq.com/openai/v1', model: 'llama-3.1-8b-instant', keys: ['GROQ_API_KEY', 'AI_API_KEY'] },
];

export function providersFrom(env) {
  let cfg = env.AI_CASCADE;
  if (typeof cfg === 'string') {
    try { cfg = JSON.parse(cfg); } catch { cfg = null; }
  }
  const list = (cfg && Array.isArray(cfg.providers) && cfg.providers.length && cfg.providers) || DEFAULT_CASCADE;
  return list
    .map((p) => ({ ...p, key: (p.keys || []).map((k) => env[k]).find(Boolean) }))
    .filter((p) => p.key && p.base && p.model);
}

// Prueba cada proveedor en orden. Si uno falla (caído, sin cupo, clave mala, respuesta vacía), pasa al siguiente.
export async function cascade(providers, messages, maxTokens) {
  let allRateLimited = true;
  for (const p of providers) {
    const payload = { model: p.model, messages, temperature: 0.4 };
    payload[p.tokenParam || 'max_completion_tokens'] = maxTokens;
    if (p.reasoning) payload.reasoning_effort = p.reasoning;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      const r = await fetch(p.base.replace(/\/+$/, '') + '/chat/completions', {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: 'Bearer ' + p.key },
        body: JSON.stringify(payload),
        signal: ctrl.signal,
      });
      if (!r.ok) {
        if (r.status !== 429) allRateLimited = false;
        console.warn('cascade_fail', p.name, r.status); // solo el estado, nunca el contenido
        continue;
      }
      const data = await r.json();
      const text = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
      if (text && String(text).trim()) return { text: String(text).trim(), via: p.name };
      allRateLimited = false;
      console.warn('cascade_empty', p.name);
    } catch (e) {
      allRateLimited = false;
      console.warn('cascade_error', p.name, e && e.name);
    } finally {
      clearTimeout(timer);
    }
  }
  return { error: allRateLimited ? 'rate_limited' : 'all_providers_failed' };
}
