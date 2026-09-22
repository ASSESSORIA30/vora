export const SCOPE_STATUS_LABELS = {
  included: 'Incluido',
  optional: 'Opcional',
  excluded: 'No incluido',
  'project-dependent': 'Depende del proyecto',
}

export const CONFIRMED_SCOPE_ITEMS = [
  { id: 'kitchen', name: 'Cocina', detail: 'Mobiliario, encimera y electrodomésticos.', status: 'included' },
  { id: 'living', name: 'Salón', detail: 'Mobiliario principal.', status: 'included' },
  { id: 'bedrooms', name: 'Dormitorios', detail: 'Mobiliario esencial, armarios e iluminación.', status: 'included' },
  { id: 'bathrooms', name: 'Baños', detail: 'Baños terminados.', status: 'included' },
  { id: 'comfort', name: 'Confort', detail: 'Climatización e iluminación.', status: 'included' },
  { id: 'installations', name: 'Instalaciones', detail: 'Integradas en la propuesta VORA.', status: 'included' },
]

export const CONFIRMED_PROCESS_STEPS = [
  { id: 'choose', title: 'Elige tu VORA', description: 'Compara los siete modelos y revisa su distribución, dormitorios y características.' },
  { id: 'configure', title: 'Configura la propuesta', description: 'Selecciona el ambiente interior y las opciones exteriores disponibles para el modelo.' },
  { id: 'share', title: 'Cuéntanos tu punto de partida', description: 'Indica el modelo que te interesa y si ya tienes parcela, la estás buscando o aún no la tienes.' },
  { id: 'review', title: 'Revisamos la información', description: 'VORA estudia la selección y, si ya existe parcela, su encaje inicial.' },
  { id: 'adapt', title: 'Adaptación técnica', description: 'El modelo se adapta a los condicionantes técnicos, urbanísticos y estructurales del proyecto.' },
  { id: 'deliver', title: 'Casa preparada para vivir', description: 'La propuesta culmina en una vivienda terminada, equipada y amueblada según la especificación elegida.' },
]

export const COMMERCIAL_FAQS = [
  {
    id: 'plot-needed',
    topic: 'Terreno',
    question: '¿Necesito tener parcela para contactar?',
    answer: 'No. Puedes explicar en qué punto estás aunque todavía no tengas parcela. Si ya dispones de una, VORA puede valorar el encaje inicial del modelo que te interesa.',
  },
  {
    id: 'plot-fit',
    topic: 'Terreno',
    question: '¿Cómo sé si un modelo encaja en mi parcela?',
    answer: 'La implantación se estudia según los condicionantes técnicos, urbanísticos y estructurales de la parcela. El formulario permite indicar que ya tienes terreno o que todavía no sabes si es apto.',
  },
  {
    id: 'personalization',
    topic: 'Personalización',
    question: '¿Qué puedo personalizar?',
    answer: 'La web permite escoger un modelo, un ambiente interior y las opciones exteriores disponibles. VORA trabaja con distribuciones ya resueltas y no plantea rediseños importantes de distribución.',
  },
  {
    id: 'included',
    topic: 'Equipamiento',
    question: '¿Qué integra la propuesta ready to live?',
    answer: 'La información actual confirma cocina y electrodomésticos, mobiliario principal, armarios, baños terminados, iluminación, climatización e instalaciones. El alcance concreto se define para la propuesta elegida.',
  },
  {
    id: 'plans',
    topic: 'Proyecto',
    question: '¿Los planos de la web son definitivos?',
    answer: 'No. Son planos conceptuales y la distribución se adapta técnicamente a la parcela, la normativa y la solución estructural definitiva.',
  },
  {
    id: 'after-contact',
    topic: 'Siguiente paso',
    question: '¿Qué ocurre después de enviar el formulario?',
    answer: 'VORA revisa el modelo, la configuración y la información que hayas facilitado para orientar el siguiente paso.',
  },
]
