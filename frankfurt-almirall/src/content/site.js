/**
 * Frankfurt Almirall — editable content.
 *
 * Everything the owner may need to change lives in this file.
 * Business data (address, hours, phone, prices, opening date…) is `null`
 * until the owner confirms it. Components hide anything that is `null`,
 * so nothing invented is ever rendered.
 */

export const business = {
  // Provisional: the owner has not confirmed the final name yet.
  name: 'Frankfurt Almirall',
  nameIsProvisional: true,
  address: null, // { street: '', city: '', postalCode: '', mapsUrl: '' }
  phone: null, // '+34 …'
  email: null,
  hours: null, // [{ days: { ca: 'Dl–Dv', es: 'L–V' }, time: '08:00–16:00' }]
  openingDate: null, // '2027-02-01'
  instagram: null, // 'https://instagram.com/…'
  // Prices are shown only once the owner confirms them.
  showPrices: false,
};

/** Media slots. Fill these when the Higgsfield / filmed assets are ready. */
export const media = {
  poster: {
    base: '/media/bar',
    widths: [720, 1080, 1448],
    width: 1448,
    height: 1086,
    lqip: '/media/bar-lqip.jpg',
  },
  /**
   * Scroll-driven frame sequence for the walk along the bar.
   * Example once rendered: { count: 360, path: (i) => `/media/walk/f_${String(i).padStart(4, '0')}.webp`, width: 1920, height: 1080 }
   * While `null`, the site runs the poster-based motion prototype.
   */
  walkFrames: null,
  /** Close-ups per station: { video: '/media/dish/truita.mp4', poster: '/media/dish/truita.webp' } */
  dishes: {
    truita: null,
    pernil: null,
    frankfurt: null,
    burger: null,
  },
};

export const copy = {
  ca: {
    meta: {
      title: 'Frankfurt Almirall — El bar de tota la vida',
      description:
        'Truita de patates, pa amb tomata i pernil, frankfurts i hamburgueses senzilles. Un bar de barri, de barra i de tota la vida.',
    },
    nav: {
      carta: 'Carta',
      local: 'El local',
      visit: "Vine a veure'ns",
      skip: 'Salta el recorregut',
      skipToContent: 'Ves al contingut',
      langLabel: 'Idioma',
      menuOpen: 'Obre el menú',
      menuClose: 'Tanca el menú',
    },
    hero: {
      kicker: 'Bar · Frankfurt',
      title: ['El bar de', 'tota la vida.'],
      lead: 'El gust de les coses ben fetes.',
      ctaMenu: 'Veure la carta',
      ctaVisit: "Vine a veure'ns",
      scrollHint: 'Fes scroll i passeja per la barra',
    },
    chapters: [
      {
        id: 'truita',
        number: '01',
        station: 'Primera parada',
        title: ['Truita de', 'patates.'],
        line: 'Com les de casa.',
        body: 'Patata, ou i paciència. Tallada a la barra, per esmorzar o quan et vingui de gust.',
      },
      {
        id: 'pernil',
        number: '02',
        station: 'Segona parada',
        title: ['Bon pa,', 'bon pernil.'],
        line: 'I tomata ben sucada.',
        body: "Pa amb tomata, un raig d'oli i pernil tallat fi. Poques coses, però ben triades.",
      },
      {
        id: 'frankfurt',
        number: '03',
        station: 'Tercera parada',
        title: ['El clàssic', 'que mai falla.'],
        line: 'Frankfurts a la planxa.',
        body: 'Pa calent, salsitxa daurada i la mostassa que tu vulguis. El de sempre, com sempre.',
      },
      {
        id: 'burger',
        number: '04',
        station: 'Quarta parada',
        title: ['Sense', 'complicacions.'],
        line: 'Amb molt de gust.',
        body: 'Hamburgueses senzilles, de les que se sostenen amb una mà. La resta, conversa de barra.',
      },
    ],
    finale: {
      title: ["La barra", "t'espera."],
      line: 'Bon pa. Bon producte. Bones ganes.',
    },
    carta: {
      kicker: 'La carta',
      title: 'Quatre coses, ben fetes.',
      intro:
        'Una carta curta per menjar bé a qualsevol hora. La carta completa, amb preus i al·lèrgens, la publicarem quan obrim.',
      categories: [
        { id: 'truita', name: 'Truita de patates', note: 'La de tota la vida.' },
        { id: 'pernil', name: 'Pa amb tomata i pernil', note: 'Bon pa, tomata i oli.' },
        { id: 'frankfurt', name: 'Frankfurts', note: 'A la planxa, amb pa calent.' },
        { id: 'burger', name: 'Hamburgueses', note: 'Senzilles i sucoses.' },
      ],
      full: 'Veure la carta',
      pricesPending: 'Preus i al·lèrgens, aviat.',
    },
    local: {
      kicker: 'El local',
      title: ['Rajola hidràulica,', 'acer i llum de globus.'],
      body: [
        "Una barra llarga d'acer, tamborets negres arrenglerats i un terra de rajola que fa estrelles. Un bar estret, de passadís, on tothom acaba parlant amb tothom.",
        'Res de decorat: el bar de barri de sempre, amb la llum càlida i les parets crema que coneixes.',
      ],
      details: [
        { id: 'floor', title: 'El terra', caption: 'Rajola hidràulica d’estrelles.' },
        { id: 'counter', title: 'La barra', caption: 'Acer raspallat i tamborets negres.' },
        { id: 'light', title: 'La llum', caption: 'Globus de vidre, llum de tarda.' },
      ],
      photoAlt:
        "Interior del bar: una barra llarga d'acer inoxidable a l'esquerra, tamborets negres a la dreta, terra de rajola hidràulica amb estrelles, parets de color crema amb rajoles blaves i cartells antics, i llums de globus al sostre.",
    },
    visit: {
      kicker: "Vine a veure'ns",
      title: ['Obrim', 'aviat.'],
      pending:
        'Estem posant a punt la barra. Adreça, horaris i data d’obertura, molt aviat per aquí.',
      addressLabel: 'Adreça',
      hoursLabel: 'Horari',
      phoneLabel: 'Telèfon',
      directions: 'Com arribar-hi',
      call: 'Truca’ns',
    },
    footer: {
      tagline: 'Bon pa. Bon producte. Bones ganes.',
      provisional: 'Nom i identitat provisionals',
      prototype: 'Prototip v0.1 · Previsualització privada',
      top: 'Torna a dalt',
    },
    menuPage: {
      title: 'Carta — Frankfurt Almirall',
      description: 'La carta del Frankfurt Almirall: truita, pa amb tomata i pernil, frankfurts i hamburgueses.',
      heading: 'La carta',
      lead: 'Carta curta, de barra. Els plats, els preus i els al·lèrgens definitius es publicaran quan obrim.',
      back: 'Tornar a l’inici',
      allergens: 'Informació d’al·lèrgens: disponible a la barra i aquí quan obrim.',
    },
  },

  es: {
    meta: {
      title: 'Frankfurt Almirall — El bar de toda la vida',
      description:
        'Tortilla de patatas, pan con tomate y jamón, frankfurts y hamburguesas sencillas. Un bar de barrio, de barra y de toda la vida.',
    },
    nav: {
      carta: 'Carta',
      local: 'El local',
      visit: 'Ven a vernos',
      skip: 'Salta el recorrido',
      skipToContent: 'Ir al contenido',
      langLabel: 'Idioma',
      menuOpen: 'Abrir el menú',
      menuClose: 'Cerrar el menú',
    },
    hero: {
      kicker: 'Bar · Frankfurt',
      title: ['El bar de', 'toda la vida.'],
      lead: 'El gusto de las cosas bien hechas.',
      ctaMenu: 'Ver la carta',
      ctaVisit: 'Ven a vernos',
      scrollHint: 'Haz scroll y pasea por la barra',
    },
    chapters: [
      {
        id: 'truita',
        number: '01',
        station: 'Primera parada',
        title: ['Tortilla de', 'patatas.'],
        line: 'Como las de casa.',
        body: 'Patata, huevo y paciencia. Cortada en la barra, para desayunar o cuando te apetezca.',
      },
      {
        id: 'pernil',
        number: '02',
        station: 'Segunda parada',
        title: ['Buen pan,', 'buen jamón.'],
        line: 'Y tomate bien restregado.',
        body: 'Pan con tomate, un chorro de aceite y jamón cortado fino. Pocas cosas, pero bien escogidas.',
      },
      {
        id: 'frankfurt',
        number: '03',
        station: 'Tercera parada',
        title: ['El clásico', 'que nunca falla.'],
        line: 'Frankfurts a la plancha.',
        body: 'Pan caliente, salchicha dorada y la mostaza que quieras. El de siempre, como siempre.',
      },
      {
        id: 'burger',
        number: '04',
        station: 'Cuarta parada',
        title: ['Sin', 'complicaciones.'],
        line: 'Con mucho gusto.',
        body: 'Hamburguesas sencillas, de las que se sostienen con una mano. El resto, charla de barra.',
      },
    ],
    finale: {
      title: ['La barra', 'te espera.'],
      line: 'Buen pan. Buen producto. Buenas ganas.',
    },
    carta: {
      kicker: 'La carta',
      title: 'Cuatro cosas, bien hechas.',
      intro:
        'Una carta corta para comer bien a cualquier hora. La carta completa, con precios y alérgenos, la publicaremos cuando abramos.',
      categories: [
        { id: 'truita', name: 'Tortilla de patatas', note: 'La de toda la vida.' },
        { id: 'pernil', name: 'Pan con tomate y jamón', note: 'Buen pan, tomate y aceite.' },
        { id: 'frankfurt', name: 'Frankfurts', note: 'A la plancha, con pan caliente.' },
        { id: 'burger', name: 'Hamburguesas', note: 'Sencillas y jugosas.' },
      ],
      full: 'Ver la carta',
      pricesPending: 'Precios y alérgenos, pronto.',
    },
    local: {
      kicker: 'El local',
      title: ['Baldosa hidráulica,', 'acero y luz de globo.'],
      body: [
        'Una barra larga de acero, taburetes negros en fila y un suelo de baldosa que dibuja estrellas. Un bar estrecho, de pasillo, donde todo el mundo acaba hablando con todo el mundo.',
        'Nada de decorado: el bar de barrio de siempre, con la luz cálida y las paredes crema que conoces.',
      ],
      details: [
        { id: 'floor', title: 'El suelo', caption: 'Baldosa hidráulica de estrellas.' },
        { id: 'counter', title: 'La barra', caption: 'Acero cepillado y taburetes negros.' },
        { id: 'light', title: 'La luz', caption: 'Globos de cristal, luz de tarde.' },
      ],
      photoAlt:
        'Interior del bar: una barra larga de acero inoxidable a la izquierda, taburetes negros a la derecha, suelo de baldosa hidráulica con estrellas, paredes de color crema con azulejos azules y carteles antiguos, y lámparas de globo en el techo.',
    },
    visit: {
      kicker: 'Ven a vernos',
      title: ['Abrimos', 'pronto.'],
      pending:
        'Estamos poniendo a punto la barra. Dirección, horarios y fecha de apertura, muy pronto por aquí.',
      addressLabel: 'Dirección',
      hoursLabel: 'Horario',
      phoneLabel: 'Teléfono',
      directions: 'Cómo llegar',
      call: 'Llámanos',
    },
    footer: {
      tagline: 'Buen pan. Buen producto. Buenas ganas.',
      provisional: 'Nombre e identidad provisionales',
      prototype: 'Prototipo v0.1 · Vista previa privada',
      top: 'Volver arriba',
    },
    menuPage: {
      title: 'Carta — Frankfurt Almirall',
      description: 'La carta del Frankfurt Almirall: tortilla, pan con tomate y jamón, frankfurts y hamburguesas.',
      heading: 'La carta',
      lead: 'Carta corta, de barra. Los platos, precios y alérgenos definitivos se publicarán cuando abramos.',
      back: 'Volver al inicio',
      allergens: 'Información de alérgenos: disponible en la barra y aquí cuando abramos.',
    },
  },
};

/**
 * Prices / allergens, keyed by category id. Owner-approved data only.
 * Example: { truita: [{ name: { ca: 'Pinxo de truita', es: 'Pincho de tortilla' }, price: 3.5, allergens: ['ou'] }] }
 */
export const menuItems = {};

export const isPrototype = true;
