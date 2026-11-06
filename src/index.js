// Hipnos AI — Worker de la web base.
// Paso 1: sirve la web (carpeta public/). Las rutas /api/* quedan reservadas para el chatbot (paso 2).
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ error: 'not_found' }), {
        status: 404,
        headers: { 'content-type': 'application/json; charset=utf-8' },
      });
    }
    return env.ASSETS.fetch(request);
  },
};
