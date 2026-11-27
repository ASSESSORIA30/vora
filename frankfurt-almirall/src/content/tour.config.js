/**
 * Frankfurt Almirall — configuració del recorregut cinematogràfic.
 *
 * ÚNIC fitxer per canviar el vídeo, les parades, els textos i la durada.
 * Per substituir el vídeo:
 *   1. Desa el nou MP4 (p. ex. videos/recorregut.mp4) i ajusta `source`.
 *   2. Ajusta els temps de `stops` (segons del vídeo original) i `source.end`.
 *   3. Executa `npm run video` → regenera els fotogrames i `tour.manifest.json`.
 * No cal tocar cap component.
 */

export const tour = {
  /** Vídeo d'origen i tram útil (segons). Després de `end` la càmera retrocedeix: no s'utilitza. */
  source: {
    file: 'videos/recorregut.mp4',
    start: 2.5, // fotograma 60: ja dins del local, a prop de la barra i del primer plat
    end: 16.33, // fotograma 392: millor enquadrament de l'hamburguesa (a partir del 397 la càmera recula)
  },

  /**
   * Conversió (scripts/build-tour.mjs). Dues sèries independents:
   *  - lg (escriptori): resolució nativa, AVIF 4:4:4 (sense pèrdua de color als rètols vermells).
   *    `crf`: més baix = més qualitat (14 ≈ quasi transparent respecte al vídeo font).
   *  - sm (mòbil): WebP, compatible amb tots els navegadors; també és la reserva si no hi ha AVIF.
   * `sharpen`: realç suau només de la luminància (unsharp 5×5). 0 = cap. >0,6 crea halos.
   */
  output: {
    dir: 'public/media/tour',
    variants: [
      { name: 'lg', width: 1660, format: 'avif', crf: 14, sharpen: 0.45 },
      { name: 'sm', width: 1080, format: 'webp', quality: 86, sharpen: 0.35 },
    ],
    /** Amplada dibuixada (px de dispositiu) a partir de la qual es fa servir `lg`. */
    largeFrom: 1100,
  },

  /** Durada del recorregut, en alçades de pantalla d'scroll. */
  scrollLength: 9.5,

  /** Suavitzat del moviment (0–1, per fotograma a 60 fps). Més baix = més inèrcia; més alt = més directe. */
  smoothing: 0.2,

  /** Alentiment al voltant de cada producte: amplada de la zona (s del vídeo). */
  dwellWidth: 0.95,

  /**
   * Proporció mínima del vídeo que ha de quedar visible en cada eix.
   * En pantalles molt panoràmiques o verticals, el vídeo no es retalla més d'això:
   * l'espai sobrant s'omple amb una extensió difuminada del mateix fotograma.
   */
  minVisible: 0.75,

  /** En pantalles verticals, posició vertical del vídeo (0 = a dalt, 1 = a baix). El text va a sota. */
  bandAnchor: 0.36,

  /** Inici (segons) i punt d'atenció (x, y normalitzats sobre el vídeo). */
  intro: { until: 1.4, focus: [0.5, 0.5], place: 'bottom-left', tone: 'light' },

  /**
   * Parades. `time`: moment (s) on el producte es veu millor. `focus`: centre del producte
   * (0–1) perquè l'enquadrament responsive no el retalli. `place`: on va el text a
   * l'escriptori (top-left | top-right | bottom-left | bottom-right). `tone`: color del text
   * segons el fons (light = text crema, dark = text fosc). `dwell`: quant s'alenteix l'scroll.
   */
  stops: [
    { id: 'truita', time: 6.25, focus: [0.42, 0.56], place: 'top-left', tone: 'light', dwell: 0.9 },
    { id: 'pernil', time: 9.45, focus: [0.55, 0.52], place: 'top-right', tone: 'dark', dwell: 0.9 },
    { id: 'frankfurt', time: 13.2, focus: [0.53, 0.55], place: 'top-left', tone: 'light', dwell: 0.9 },
    { id: 'burger', time: 16.0, focus: [0.55, 0.5], place: 'top-right', tone: 'dark', dwell: 0.8 },
  ],

  /** Final: apareix sobre l'últim tram, sense sortir de l'escena. */
  finale: { from: 16.7, focus: [0.55, 0.45], hold: 1.6 },

  /** Durada (s del vídeo) de l'entrada i sortida de cada text al voltant de la seva parada. */
  textWindow: { before: 1.1, after: 0.9 },

  copy: {
    ca: {
      intro: { kicker: 'Lleida · Bar de barri', title: ['Frankfurt', 'Almirall.'], line: 'El bar de tota la vida.', hint: 'Fes scroll per entrar' },
      stops: {
        truita: { kicker: 'Truita, vermut i olives', title: 'Com les de casa.' },
        pernil: { kicker: 'Entrepà de pernil i cervesa', title: 'Bon pa. Bon pernil.', line: 'Tomata ben sucada.' },
        frankfurt: { kicker: 'Frankfurt', title: 'El clàssic que mai falla.' },
        burger: { kicker: 'Hamburguesa', title: 'Sense complicacions.', line: 'Amb molt de gust.' },
      },
      finale: { title: "La barra t'espera.", name: 'Frankfurt Almirall', menu: 'Veure la carta', directions: 'Com arribar-hi' },
      progress: 'Recorregut per la barra',
    },
    es: {
      intro: { kicker: 'Lleida · Bar de barrio', title: ['Frankfurt', 'Almirall.'], line: 'El bar de toda la vida.', hint: 'Haz scroll para entrar' },
      stops: {
        truita: { kicker: 'Tortilla, vermut y aceitunas', title: 'Como las de casa.' },
        pernil: { kicker: 'Bocadillo de jamón y cerveza', title: 'Buen pan. Buen jamón.', line: 'Tomate bien restregado.' },
        frankfurt: { kicker: 'Frankfurt', title: 'El clásico que nunca falla.' },
        burger: { kicker: 'Hamburguesa', title: 'Sin complicaciones.', line: 'Con mucho gusto.' },
      },
      finale: { title: 'La barra te espera.', name: 'Frankfurt Almirall', menu: 'Ver la carta', directions: 'Cómo llegar' },
      progress: 'Recorrido por la barra',
    },
  },
};
