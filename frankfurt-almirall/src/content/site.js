/**
 * Frankfurt Almirall — dades del negoci i textos generals (capçalera, carta, metadades).
 * El recorregut cinematogràfic es configura a `tour.config.js`.
 *
 * Les dades que el propietari encara no ha confirmat són `null` i no es mostren.
 */

const street = 'Carrer de Valentí Almirall, 16';
const city = 'Lleida';

export const business = {
  name: 'Frankfurt Almirall',
  address: {
    street,
    city,
    postalCode: null,
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${street}, ${city}`)}`,
  },
  phone: null,
  hours: null, // [{ days: { ca: 'Dl–Dv', es: 'L–V' }, time: '08:00–16:00' }]
  showPrices: false, // els preus només es mostren quan estiguin confirmats
};

export const copy = {
  ca: {
    meta: {
      title: 'Frankfurt Almirall — El bar de tota la vida · Lleida',
      description:
        'Truita, vermut i olives, entrepà de pernil, frankfurts i hamburgueses. Un bar de barra i de tota la vida al carrer de Valentí Almirall, 16, de Lleida.',
    },
    nav: {
      carta: 'Carta',
      directions: 'Com arribar-hi',
      skip: 'Salta el recorregut',
      skipToContent: 'Ves al contingut',
      langLabel: 'Idioma',
      home: 'Frankfurt Almirall — inici',
    },
    carta: {
      categories: [
        { id: 'truita', name: 'Truita de patates', note: 'Amb vermut i olives, com les de casa.' },
        { id: 'pernil', name: 'Entrepà de pernil', note: 'Bon pa, tomata ben sucada i una canya.' },
        { id: 'frankfurt', name: 'Frankfurts', note: 'A la planxa, amb pa calent. El clàssic.' },
        { id: 'burger', name: 'Hamburgueses', note: 'Sense complicacions. Amb molt de gust.' },
      ],
      pricesPending: 'Preus i al·lèrgens, aviat.',
    },
    footer: {
      tagline: 'Bon pa. Bon producte. Bones ganes.',
      prototype: 'Previsualització privada',
    },
    menuPage: {
      title: 'Carta — Frankfurt Almirall',
      description: 'La carta del Frankfurt Almirall: truita, entrepà de pernil, frankfurts i hamburgueses. Carrer de Valentí Almirall, 16, Lleida.',
      heading: 'La carta',
      lead: 'Carta curta, de barra. Els plats, els preus i els al·lèrgens definitius es publicaran molt aviat.',
      back: 'Tornar a la barra',
      allergens: 'Informació d’al·lèrgens: disponible a la barra.',
    },
  },

  es: {
    meta: {
      title: 'Frankfurt Almirall — El bar de toda la vida · Lleida',
      description:
        'Tortilla, vermut y aceitunas, bocadillo de jamón, frankfurts y hamburguesas. Un bar de barra y de toda la vida en la calle Valentí Almirall, 16, de Lleida.',
    },
    nav: {
      carta: 'Carta',
      directions: 'Cómo llegar',
      skip: 'Salta el recorrido',
      skipToContent: 'Ir al contenido',
      langLabel: 'Idioma',
      home: 'Frankfurt Almirall — inicio',
    },
    carta: {
      categories: [
        { id: 'truita', name: 'Tortilla de patatas', note: 'Con vermut y aceitunas, como las de casa.' },
        { id: 'pernil', name: 'Bocadillo de jamón', note: 'Buen pan, tomate bien restregado y una caña.' },
        { id: 'frankfurt', name: 'Frankfurts', note: 'A la plancha, con pan caliente. El clásico.' },
        { id: 'burger', name: 'Hamburguesas', note: 'Sin complicaciones. Con mucho gusto.' },
      ],
      pricesPending: 'Precios y alérgenos, pronto.',
    },
    footer: {
      tagline: 'Buen pan. Buen producto. Buenas ganas.',
      prototype: 'Vista previa privada',
    },
    menuPage: {
      title: 'Carta — Frankfurt Almirall',
      description: 'La carta del Frankfurt Almirall: tortilla, bocadillo de jamón, frankfurts y hamburguesas. Calle Valentí Almirall, 16, Lleida.',
      heading: 'La carta',
      lead: 'Carta corta, de barra. Los platos, precios y alérgenos definitivos se publicarán muy pronto.',
      back: 'Volver a la barra',
      allergens: 'Información de alérgenos: disponible en la barra.',
    },
  },
};

/**
 * Plats, preus i al·lèrgens per categoria. Només dades aprovades pel propietari.
 * Ex.: { truita: [{ name: { ca: 'Pinxo de truita', es: 'Pincho de tortilla' }, price: 3.5 }] }
 */
export const menuItems = {};

export const isPrototype = true;
