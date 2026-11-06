# Hipnos AI — web

Web oficial de **Hipnos AI**: agentes de IA, chatbots y páginas web.
*Tú lo sueñas. Nosotros lo construimos con IA.*

- Publicada en Cloudflare Workers (archivos estáticos + Worker).
- Español e inglés, modo claro y oscuro.
- Contacto: [WhatsApp](https://wa.me/593983120422) · edimatus2016@gmail.com

## Estructura

```
public/        la web (HTML, CSS, JS, imágenes)
src/index.js   Worker: rutas /api/* reservadas para el chatbot
wrangler.jsonc configuración de Cloudflare
```

## Uso local

```
npm install
npm run dev
```

## Seguridad

Este repositorio es público. **Nunca** se guardan claves aquí: las claves del chatbot se guardan como secretos en Cloudflare.
