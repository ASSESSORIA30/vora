# VORA · Concrete Living — Production SEO/SEM/AEO build

Web Vite + React preparada para Vercel.

## Despliegue

1. Sube este proyecto a GitHub/Vercel.
2. Framework: **Vite**.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Para el dominio actual no hace falta definir `VITE_SITE_URL`; el fallback es `https://vora-orpin-delta.vercel.app`.
6. Cuando VORA tenga dominio propio, define `VITE_SITE_URL=https://tudominio.com` en Vercel y vuelve a desplegar. Esto actualizará canonicals, sitemap, JSON-LD, Open Graph y llms.txt.

## Formulario de leads

El formulario ya no simula envíos. Usa una Vercel Function (`/api/contact`) y Resend. Configura en Vercel:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL` — remitente de un dominio verificado en Resend.
- `LEADS_EMAIL` — email interno donde quieres recibir los contactos.

El formulario envía también atribución de campañas: UTM, gclid, gbraid, wbraid y fbclid cuando existan.

## Analítica y SEM

Opcionales; no pongas valores inventados. Configura solo los que utilices:

- `VITE_GA4_ID=G-...`
- `VITE_GOOGLE_ADS_ID=AW-...`
- `VITE_META_PIXEL_ID=...`

La medición se carga únicamente tras consentimiento. Se generan eventos en `dataLayer` como:

- `select_model`
- `view_model`
- `configurator_change`
- `cta_click`
- `form_start`
- `generate_lead`

Puedes crear conversiones de Google Ads/GA4 a partir de `generate_lead`.

## SEO / AEO

El postbuild genera HTML indexable para:

- `/modelos/vora-90`
- `/modelos/vora-110`
- `/modelos/vora-130`
- `/modelos/vora-150`
- `/modelos/vora-170`
- `/modelos/vora-200`
- `/modelos/vora-signature`
- `/casas-industrializadas-hormigon`
- `/casas-hormigon-llave-en-mano`
- `/casas-modulares-premium`

Además genera:

- `sitemap.xml`
- `robots.txt`
- `llms.txt`
- canonical URLs
- Open Graph / Twitter metadata
- JSON-LD de organización, web, colección y cada vivienda
- HTML semántico de respaldo visible para crawlers que no ejecuten React

`robots.txt` permite expresamente OAI-SearchBot y OAI-AdsBot.

## IndexNow (Bing y motores compatibles)

Opcional. Define:

- `SITE_URL=https://tudominio.com`
- `INDEXNOW_KEY=tu_clave`

Haz un build con esa clave para publicar el fichero de verificación y, una vez desplegado, ejecuta:

```bash
npm run indexnow
```

## Legal

Las páginas `/legal/*` están marcadas `noindex`. Antes de activar campañas comerciales debes completar con los datos reales del titular, política de privacidad y cookies. No se han inventado datos mercantiles.

## Planos

Los planos son conceptuales y comerciales. La web muestra expresamente:

> Distribución orientativa sujeta a adaptación técnica, urbanística y estructural.

## Nota

La web no publica costes internos ni datos del fabricante. El posicionamiento público es VORA · Concrete Living.
