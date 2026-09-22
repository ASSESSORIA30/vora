import { HOUSES } from './houses.js'

export const HOME_SEO = {
  title: 'VORA Concrete Living | Casas industrializadas de hormigón',
  description: 'Viviendas industrializadas de hormigón, completamente equipadas y preparadas para vivir. Compara los siete modelos VORA y configura tu selección.',
}

const COMMON_FAQS = {
  distribution: {
    question: '¿La distribución se puede modificar?',
    answer: 'VORA trabaja con modelos cerrados y optimizados. Se prevén opciones concretas de acabado o equipamiento, pero no rediseños importantes de distribución.',
  },
  furniture: {
    question: '¿La casa se entrega amueblada?',
    answer: 'Sí. La propuesta ready to live contempla mobiliario principal, cocina, electrodomésticos, iluminación, baños, climatización y otros elementos definidos para cada modelo.',
  },
  plot: {
    question: '¿Necesito tener parcela?',
    answer: 'No para informarte. Si ya tienes parcela, podemos estudiar antes el encaje técnico y urbanístico del modelo que te interesa.',
  },
  plans: {
    question: '¿Los planos son definitivos?',
    answer: 'Los planos comerciales son conceptuales y se adaptan técnicamente a la parcela, normativa y solución estructural definitiva.',
  },
}

export const LANDING_PAGES = {
  'casas-industrializadas-hormigon': {
    eyebrow: 'ARQUITECTURA INDUSTRIALIZADA',
    title: 'Casas industrializadas de hormigón, sin empezar de cero.',
    lead: 'VORA convierte la vivienda industrializada en un producto de arquitectura: modelos ya resueltos, fabricación controlada, equipamiento completo y adaptación técnica a tu parcela.',
    seoTitle: 'Casas industrializadas de hormigón | VORA',
    seoDescription: 'Conoce la colección VORA de viviendas industrializadas de hormigón: modelos resueltos, equipamiento completo y adaptación técnica a la parcela.',
    bullets: ['Arquitectura contemporánea en hormigón','7 modelos de 3 a 5 dormitorios','Distribuciones cerradas y optimizadas','Equipamiento completo ready to live'],
    query: 'casas industrializadas de hormigón',
    image: '/media/houses/model-03-exterior.webp',
    imageAlt: 'VORA 130, vivienda industrializada de hormigón',
    valueTitle: 'Arquitectura ya resuelta. Adaptación centrada en tu parcela.',
    valueParagraphs: [
      'Los modelos cerrados concentran las decisiones de arquitectura, distribución y equipamiento en una colección definida.',
      'La adaptación se centra en la implantación y en los condicionantes técnicos, urbanísticos y estructurales de la parcela.',
    ],
    featuredIds: ['vora-90','vora-130','vora-170'],
    faqs: [COMMON_FAQS.distribution, COMMON_FAQS.plot, COMMON_FAQS.plans],
  },
  'casas-hormigon-llave-en-mano': {
    eyebrow: 'MÁS QUE LLAVE EN MANO',
    title: 'Una casa de hormigón terminada, equipada y lista para vivir.',
    lead: 'No coordinas industriales ni compras el mobiliario después. VORA integra arquitectura, acabados, cocina, electrodomésticos, mobiliario, iluminación y climatización dentro de una misma propuesta.',
    seoTitle: 'Casas de hormigón llave en mano y equipadas | VORA',
    seoDescription: 'Descubre cómo VORA integra arquitectura, acabados, cocina, mobiliario, iluminación y climatización en una propuesta ready to live.',
    bullets: ['Cocina y electrodomésticos','Salón y dormitorios amueblados','Baños, iluminación y climatización','Un recorrido desde parcela hasta llaves'],
    query: 'casas de hormigón llave en mano',
    image: '/media/houses/model-06-exterior.webp',
    imageAlt: 'VORA 200, casa de hormigón equipada',
    valueTitle: 'Una entrega coordinada dentro de una misma propuesta.',
    valueParagraphs: [
      'Cocina, electrodomésticos, mobiliario principal, iluminación, baños y climatización forman parte de la propuesta VORA.',
      'El recorrido parte de un modelo ya definido y continúa con su adaptación técnica a la parcela.',
    ],
    featuredIds: ['vora-110','vora-150','vora-200'],
    faqs: [COMMON_FAQS.furniture, COMMON_FAQS.plot, COMMON_FAQS.distribution],
  },
  'casas-modulares-premium': {
    eyebrow: 'CONCRETE LIVING',
    title: 'Casas modulares premium con lenguaje de arquitectura contemporánea.',
    lead: 'Una colección de viviendas industrializadas pensada para quien busca diseño, precisión, confort y una experiencia más clara que una obra planteada desde cero.',
    seoTitle: 'Casas modulares premium de hormigón | VORA',
    seoDescription: 'Explora los modelos VORA de arquitectura contemporánea, con lenguaje material coherente, opciones de acabado contenidas y equipamiento completo.',
    bullets: ['Diseño mediterráneo contemporáneo','Hormigón, piedra, madera y grandes ventanales','Opciones de acabado contenidas','Piscina o garaje cuando el modelo lo indica'],
    query: 'casas modulares premium',
    image: '/media/houses/model-07-exterior.webp',
    imageAlt: 'VORA Signature, arquitectura modular contemporánea',
    valueTitle: 'Una colección coherente, con decisiones contenidas.',
    valueParagraphs: [
      'Hormigón, piedra, madera, vidrio y luz natural construyen un lenguaje común a toda la colección.',
      'La personalización se concentra en opciones de ambiente interior y paquete exterior ya planteadas por VORA.',
    ],
    featuredIds: ['vora-150','vora-200','vora-signature'],
    faqs: [
      COMMON_FAQS.distribution,
      { question: '¿Qué modelos indican piscina o garaje?', answer: 'VORA 170 y VORA 200 indican piscina; VORA 200 indica garaje doble. VORA Signature indica piscina y garaje.' },
      COMMON_FAQS.plans,
    ],
  },
}

export const GUIDE_INDEX_SEO = {
  title: 'Guías sobre vivienda industrializada | VORA',
  description: 'Criterios claros para comparar modelos VORA, preparar una configuración y explicar la situación de tu parcela antes de contactar.',
}

export const GUIDE_PAGES = {
  'elegir-modelo-vivienda-industrializada': {
    eyebrow: 'ELEGIR MODELO',
    title: 'Cómo elegir un modelo de vivienda industrializada.',
    lead: 'Una decisión ordenada empieza por la capacidad, continúa con la distribución y termina con las opciones que realmente están disponibles.',
    seoTitle: 'Cómo elegir un modelo de vivienda industrializada | VORA',
    seoDescription: 'Compara dormitorios, baños, distribución y características confirmadas para identificar qué modelos VORA encajan con tus criterios.',
    image: '/media/houses/model-04-exterior.webp',
    imageAlt: 'VORA 150, modelo de vivienda industrializada',
    sections: [
      { title: 'Empieza por la capacidad que necesitas.', paragraphs: ['La colección VORA reúne modelos de tres, cuatro y cinco dormitorios. Filtrar por dormitorios y baños permite descartar opciones sin entrar todavía en acabados o preferencias visuales.', 'La denominación comercial identifica cada modelo. Las decisiones deben apoyarse en la capacidad y la distribución publicadas, sin reinterpretar esa denominación como una superficie técnica.'] },
      { title: 'Lee la distribución estancia por estancia.', paragraphs: ['Cada ficha relaciona las estancias con su plano conceptual. El objetivo es comprobar cómo se organizan dormitorios, zonas comunes y espacios complementarios.', 'Los planos comerciales son orientativos. La implantación definitiva depende de la adaptación técnica, urbanística y estructural del proyecto.'] },
      { title: 'Compara solo características confirmadas.', paragraphs: ['El comparador indica porche, garaje, piscina, despacho o vestidor únicamente cuando constan en la fuente canónica del modelo.', 'Si una característica es imprescindible, úsala como criterio de exclusión antes de configurar.'] },
      { title: 'Configura antes de compartir el proyecto.', paragraphs: ['Después de escoger un modelo puedes seleccionar el ambiente interior y el paquete exterior disponible. El resumen pasa al formulario para que no tengas que repetir decisiones.', 'La consulta puede enviarse aunque todavía no dispongas de parcela.'] },
    ],
    relatedModelIds: ['vora-90', 'vora-150', 'vora-200'],
    primaryCta: { label: 'Encontrar modelos compatibles', href: '/#model-finder' },
    secondaryCta: { label: 'Comparar modelos', href: '/#compare' },
  },
  'terreno-vivienda-industrializada': {
    eyebrow: 'TERRENO',
    title: 'Terreno y vivienda industrializada: cómo empezar.',
    lead: 'Tener parcela ayuda a estudiar el encaje del modelo, pero no es necesario para comparar la colección o preparar una primera consulta.',
    seoTitle: 'Terreno para una vivienda industrializada: cómo empezar | VORA',
    seoDescription: 'Descubre qué puedes decidir antes de tener parcela y cómo trasladar a VORA el punto de partida real de tu proyecto.',
    image: '/media/houses/model-03-exterior.webp',
    imageAlt: 'VORA 130 implantada en un entorno exterior',
    sections: [
      { title: 'Puedes empezar sin parcela.', paragraphs: ['La colección, las fichas, los planos conceptuales y el configurador están disponibles antes de disponer de terreno.', 'El formulario permite indicar si ya tienes parcela, la estás buscando, todavía no la tienes o no sabes si es apta.'] },
      { title: 'Si ya tienes terreno, explica el punto de partida.', paragraphs: ['VORA puede valorar el encaje inicial del modelo que te interesa cuando ya existe una parcela.', 'La web no sustituye el estudio técnico: la implantación se revisa según los condicionantes técnicos, urbanísticos y estructurales de cada proyecto.'] },
      { title: 'Prepara las decisiones que sí conoces.', paragraphs: ['Antes de contactar puedes seleccionar modelo, ambiente interior y paquete exterior, además de indicar la provincia y la situación del terreno.', 'Estas selecciones se conservan al llegar al formulario y se incluyen en la solicitud.'] },
      { title: 'Deja abiertas las respuestas que requieren estudio.', paragraphs: ['Los planos de la web son conceptuales y la información pública no determina por sí sola si una parcela es apta.', 'La consulta inicial sirve para compartir la selección y permitir que VORA revise la información disponible.'] },
    ],
    relatedModelIds: ['vora-110', 'vora-130', 'vora-170'],
    primaryCta: { label: 'Explicar mi situación', href: '/?source=seo-guide#contact' },
    secondaryCta: { label: 'Ver los modelos', href: '/#models' },
  },
}

export const INDEXABLE_PATHS = [
  '/',
  ...HOUSES.map(({id}) => `/modelos/${id}`),
  ...Object.keys(LANDING_PAGES).map((slug) => `/${slug}`),
  '/guias',
  ...Object.keys(GUIDE_PAGES).map((slug) => `/guias/${slug}`),
]

export function modelSeo(model) {
  return {
    title: `VORA ${model.name} | Casa industrializada de hormigón`,
    description: `${model.description} ${model.bedrooms} dormitorios, ${model.bathrooms} baños y equipamiento ready to live.`,
  }
}
