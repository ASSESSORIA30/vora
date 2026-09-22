// "size" is retained as a legacy presentation label. Its semantic meaning is pending validation,
// so surfaces.built remains null until the source data is confirmed.
const HOUSE_DATA = [
  {
    "id": "vora-90",
    "code": "V—01",
    "name": "90",
    "size": "90 m²",
    "bedrooms": 3,
    "bathrooms": 2,
    "floors": 1,
    "tag": "Compact",
    "image": "/media/houses/model-01-exterior.webp",
    "interior": "/media/houses/model-01-interior.webp",
    "statement": "Todo lo esencial. Nada de más.",
    "description": "Una casa compacta con proporciones generosas, tres dormitorios y una relación directa entre salón, porche y jardín.",
    "narrative": "VORA 90 concentra la idea de la colección en su expresión más contenida: recorridos cortos, luz natural y una zona de día abierta que hace que cada metro trabaje más.",
    "features": [
      "3 dormitorios",
      "2 baños",
      "Suite principal",
      "Lavadero técnico",
      "Porche exterior",
      "Una planta"
    ],
    "idealFor": "Parejas, familias pequeñas y segunda residencia.",
    "dimensions": "10,8 × 9,4 m aprox.",
    "slug": "vora-90",
    "seoTitle": "VORA 90 | Casa industrializada de hormigón 90 m²",
    "seoDescription": "Descubre VORA 90: vivienda industrializada de hormigón de 90 m², 3 dormitorios y 2 baños, completamente equipada y preparada para vivir.",
    "surfaces": {
      "built": null,
      "useful": 78,
      "porch": 18,
      "garage": null,
      "terrace": null,
      "pool": null
    },
    "validationStatus": "verified",
    "rooms": [
      {
        "id": "salon-comedor-cocina",
        "name": "Salón-comedor-cocina",
        "area": 32.8,
        "type": "room",
        "listed": true
      },
      {
        "id": "suite-principal",
        "name": "Suite principal",
        "area": 12.1,
        "type": "suite",
        "listed": true,
        "planLabel": "Suite"
      },
      {
        "id": "bano-suite",
        "name": "Baño suite",
        "area": 3.8,
        "type": "bath",
        "listed": true
      },
      {
        "id": "dormitorio-2",
        "name": "Dormitorio 2",
        "area": 9.4,
        "type": "bedroom",
        "listed": true
      },
      {
        "id": "dormitorio-3",
        "name": "Dormitorio 3",
        "area": 9.2,
        "type": "bedroom",
        "listed": true
      },
      {
        "id": "bano-general",
        "name": "Baño general",
        "area": 4.2,
        "type": "bath",
        "listed": true,
        "planLabel": "Baño"
      },
      {
        "id": "lavadero-tecnico",
        "name": "Lavadero / técnico",
        "area": 3.3,
        "type": "laundry",
        "listed": true,
        "planLabel": "Lavadero"
      },
      {
        "id": "distribucion-y-armarios",
        "name": "Distribución y armarios",
        "area": 3.2,
        "type": "hall",
        "listed": true,
        "planLabel": "Entrada"
      },
      {
        "id": "salon-comedor",
        "name": "Salón · comedor",
        "area": 21.5,
        "type": "living",
        "listed": false
      },
      {
        "id": "cocina",
        "name": "Cocina",
        "area": 11.3,
        "type": "kitchen",
        "listed": false
      }
    ],
    "plan": {
      "widthM": 10.8,
      "depthM": 9.4,
      "rooms": [
        {
          "roomId": "salon-comedor",
          "x": 3,
          "y": 4,
          "w": 43,
          "h": 47,
          "window": "bottom",
          "door": "right"
        },
        {
          "roomId": "cocina",
          "x": 3,
          "y": 51,
          "w": 43,
          "h": 31,
          "window": "bottom",
          "door": "right"
        },
        {
          "roomId": "dormitorio-2",
          "x": 46,
          "y": 4,
          "w": 25,
          "h": 28,
          "window": "top",
          "door": "bottom"
        },
        {
          "roomId": "dormitorio-3",
          "x": 71,
          "y": 4,
          "w": 26,
          "h": 28,
          "window": "top",
          "door": "bottom"
        },
        {
          "roomId": "bano-general",
          "x": 46,
          "y": 32,
          "w": 18,
          "h": 20,
          "door": "bottom"
        },
        {
          "roomId": "lavadero-tecnico",
          "x": 64,
          "y": 32,
          "w": 17,
          "h": 20,
          "door": "bottom"
        },
        {
          "roomId": "bano-suite",
          "x": 81,
          "y": 32,
          "w": 16,
          "h": 20,
          "door": "bottom"
        },
        {
          "roomId": "suite-principal",
          "x": 46,
          "y": 52,
          "w": 51,
          "h": 30,
          "window": "bottom",
          "door": "left"
        },
        {
          "roomId": "distribucion-y-armarios",
          "x": 46,
          "y": 82,
          "w": 20,
          "h": 14,
          "door": "bottom"
        }
      ]
    }
  },
  {
    "id": "vora-110",
    "code": "V—02",
    "name": "110",
    "size": "110 m²",
    "bedrooms": 3,
    "bathrooms": 2,
    "floors": 1,
    "tag": "Balance",
    "image": "/media/houses/model-02-exterior.webp",
    "interior": "/media/houses/model-02-interior.webp",
    "statement": "Equilibrio, sin concesiones.",
    "description": "Más espacio para la vida diaria, con las zonas de día y noche claramente separadas y una cocina pensada para vivirla.",
    "narrative": "VORA 110 aporta independencia entre las áreas de descanso y convivencia sin perder continuidad. El salón, la cocina y el porche forman un único paisaje doméstico.",
    "features": [
      "3 dormitorios",
      "2 baños",
      "Suite principal",
      "Despensa",
      "Lavadero",
      "Porche"
    ],
    "idealFor": "Familias que buscan una vivienda principal cómoda y contenida.",
    "dimensions": "13,2 × 9,3 m aprox.",
    "slug": "vora-110",
    "seoTitle": "VORA 110 | Casa industrializada de hormigón 110 m²",
    "seoDescription": "Descubre VORA 110: vivienda industrializada de hormigón de 110 m², 3 dormitorios y 2 baños, completamente equipada y preparada para vivir.",
    "surfaces": {
      "built": null,
      "useful": 95,
      "porch": 24,
      "garage": null,
      "terrace": null,
      "pool": null
    },
    "validationStatus": "pending",
    "rooms": [
      {
        "id": "salon-comedor-cocina",
        "name": "Salón-comedor-cocina",
        "area": 37.2,
        "type": "room",
        "listed": true
      },
      {
        "id": "suite-principal",
        "name": "Suite principal",
        "area": 13.5,
        "type": "suite",
        "listed": true,
        "planLabel": "Suite"
      },
      {
        "id": "bano-suite",
        "name": "Baño suite",
        "area": 4.4,
        "type": "bath",
        "listed": true
      },
      {
        "id": "dormitorio-2",
        "name": "Dormitorio 2",
        "area": 10.2,
        "type": "bedroom",
        "listed": true
      },
      {
        "id": "dormitorio-3",
        "name": "Dormitorio 3",
        "area": 10,
        "type": "bedroom",
        "listed": true
      },
      {
        "id": "bano-general",
        "name": "Baño general",
        "area": 4.8,
        "type": "bath",
        "listed": true,
        "planLabel": "Baño"
      },
      {
        "id": "lavadero",
        "name": "Lavadero",
        "area": 4.1,
        "type": "laundry",
        "listed": true
      },
      {
        "id": "despensa",
        "name": "Despensa",
        "area": 2.7,
        "type": "pantry",
        "listed": true
      },
      {
        "id": "distribucion",
        "name": "Distribución",
        "area": 8.1,
        "type": "room",
        "listed": true
      },
      {
        "id": "salon-comedor",
        "name": "Salón · comedor",
        "area": 24.2,
        "type": "living",
        "listed": false
      },
      {
        "id": "cocina",
        "name": "Cocina",
        "area": 13,
        "type": "kitchen",
        "listed": false
      },
      {
        "id": "entrada",
        "name": "Entrada",
        "area": 6.1,
        "type": "hall",
        "listed": false
      }
    ],
    "plan": {
      "widthM": 13.2,
      "depthM": 9.3,
      "rooms": [
        {
          "roomId": "salon-comedor",
          "x": 3,
          "y": 4,
          "w": 37,
          "h": 53,
          "window": "bottom",
          "door": "right"
        },
        {
          "roomId": "cocina",
          "x": 3,
          "y": 57,
          "w": 37,
          "h": 25,
          "window": "bottom",
          "door": "right"
        },
        {
          "roomId": "despensa",
          "x": 3,
          "y": 82,
          "w": 15,
          "h": 14,
          "door": "right"
        },
        {
          "roomId": "lavadero",
          "x": 18,
          "y": 82,
          "w": 22,
          "h": 14,
          "door": "right"
        },
        {
          "roomId": "entrada",
          "x": 40,
          "y": 40,
          "w": 16,
          "h": 18,
          "door": "bottom"
        },
        {
          "roomId": "dormitorio-2",
          "x": 56,
          "y": 4,
          "w": 20,
          "h": 30,
          "window": "top",
          "door": "bottom"
        },
        {
          "roomId": "dormitorio-3",
          "x": 76,
          "y": 4,
          "w": 21,
          "h": 30,
          "window": "top",
          "door": "bottom"
        },
        {
          "roomId": "bano-general",
          "x": 56,
          "y": 34,
          "w": 20,
          "h": 20,
          "door": "bottom"
        },
        {
          "roomId": "bano-suite",
          "x": 76,
          "y": 34,
          "w": 21,
          "h": 20,
          "door": "bottom"
        },
        {
          "roomId": "suite-principal",
          "x": 56,
          "y": 54,
          "w": 41,
          "h": 42,
          "window": "bottom",
          "door": "left"
        }
      ]
    }
  },
  {
    "id": "vora-130",
    "code": "V—03",
    "name": "130",
    "size": "130 m²",
    "bedrooms": 4,
    "bathrooms": 2,
    "floors": 1,
    "tag": "Family",
    "image": "/media/houses/model-03-exterior.webp",
    "interior": "/media/houses/model-03-interior.webp",
    "statement": "La medida de una gran vida familiar.",
    "description": "Cuatro dormitorios, gran espacio central y un porche pensado para convertirse en una estancia más durante buena parte del año.",
    "narrative": "VORA 130 resuelve la vida familiar con cuatro dormitorios, una gran pieza de día y una secuencia clara entre entrada, cocina, comedor, salón y exterior. Más espacio donde importa y muy pocos metros dedicados solo a circular.",
    "features": [
      "4 dormitorios",
      "2 baños",
      "Suite principal",
      "Vestidor",
      "Despensa",
      "Gran porche"
    ],
    "idealFor": "Familias que quieren cuatro habitaciones sin irse a una casa excesiva.",
    "dimensions": "15,2 × 9,6 m aprox.",
    "slug": "vora-130",
    "seoTitle": "VORA 130 | Casa industrializada de hormigón 130 m²",
    "seoDescription": "Descubre VORA 130: vivienda industrializada de hormigón de 130 m², 4 dormitorios y 2 baños, completamente equipada y preparada para vivir.",
    "surfaces": {
      "built": null,
      "useful": 112,
      "porch": 30,
      "garage": null,
      "terrace": null,
      "pool": null
    },
    "validationStatus": "verified",
    "rooms": [
      {
        "id": "salon-comedor-cocina",
        "name": "Salón-comedor-cocina",
        "area": 44.1,
        "type": "room",
        "listed": true
      },
      {
        "id": "suite-principal",
        "name": "Suite principal",
        "area": 13.8,
        "type": "suite",
        "listed": true,
        "planLabel": "Suite"
      },
      {
        "id": "vestidor",
        "name": "Vestidor",
        "area": 3.6,
        "type": "closet",
        "listed": true
      },
      {
        "id": "bano-suite",
        "name": "Baño suite",
        "area": 4.6,
        "type": "bath",
        "listed": true
      },
      {
        "id": "dormitorio-2",
        "name": "Dormitorio 2",
        "area": 10.2,
        "type": "bedroom",
        "listed": true
      },
      {
        "id": "dormitorio-3",
        "name": "Dormitorio 3",
        "area": 10.1,
        "type": "bedroom",
        "listed": true
      },
      {
        "id": "dormitorio-4",
        "name": "Dormitorio 4",
        "area": 9.8,
        "type": "bedroom",
        "listed": true
      },
      {
        "id": "bano-general",
        "name": "Baño general",
        "area": 5.1,
        "type": "bath",
        "listed": true,
        "planLabel": "Baño"
      },
      {
        "id": "lavadero",
        "name": "Lavadero",
        "area": 4.4,
        "type": "laundry",
        "listed": true
      },
      {
        "id": "despensa",
        "name": "Despensa",
        "area": 2.8,
        "type": "pantry",
        "listed": true
      },
      {
        "id": "distribucion-y-entrada",
        "name": "Distribución y entrada",
        "area": 3.5,
        "type": "hall",
        "listed": true,
        "planLabel": "Entrada"
      },
      {
        "id": "salon-comedor",
        "name": "Salón · comedor",
        "area": 28.6,
        "type": "living",
        "listed": false
      },
      {
        "id": "cocina",
        "name": "Cocina",
        "area": 15.5,
        "type": "kitchen",
        "listed": false
      }
    ],
    "plan": {
      "widthM": 15.2,
      "depthM": 9.6,
      "rooms": [
        {
          "roomId": "salon-comedor",
          "x": 3,
          "y": 4,
          "w": 34,
          "h": 54,
          "window": "bottom",
          "door": "right"
        },
        {
          "roomId": "cocina",
          "x": 3,
          "y": 58,
          "w": 34,
          "h": 24,
          "window": "bottom",
          "door": "right"
        },
        {
          "roomId": "despensa",
          "x": 3,
          "y": 82,
          "w": 14,
          "h": 14,
          "door": "right"
        },
        {
          "roomId": "lavadero",
          "x": 17,
          "y": 82,
          "w": 20,
          "h": 14,
          "door": "right"
        },
        {
          "roomId": "dormitorio-2",
          "x": 37,
          "y": 4,
          "w": 19,
          "h": 29,
          "window": "top",
          "door": "bottom"
        },
        {
          "roomId": "dormitorio-3",
          "x": 56,
          "y": 4,
          "w": 19,
          "h": 29,
          "window": "top",
          "door": "bottom"
        },
        {
          "roomId": "dormitorio-4",
          "x": 75,
          "y": 4,
          "w": 22,
          "h": 29,
          "window": "top",
          "door": "bottom"
        },
        {
          "roomId": "bano-general",
          "x": 37,
          "y": 33,
          "w": 19,
          "h": 20,
          "door": "bottom"
        },
        {
          "roomId": "distribucion-y-entrada",
          "x": 56,
          "y": 33,
          "w": 19,
          "h": 20,
          "door": "bottom"
        },
        {
          "roomId": "bano-suite",
          "x": 75,
          "y": 33,
          "w": 22,
          "h": 20,
          "door": "bottom"
        },
        {
          "roomId": "vestidor",
          "x": 37,
          "y": 53,
          "w": 17,
          "h": 18,
          "door": "right"
        },
        {
          "roomId": "suite-principal",
          "x": 54,
          "y": 53,
          "w": 43,
          "h": 43,
          "window": "bottom",
          "door": "left"
        }
      ]
    }
  },
  {
    "id": "vora-150",
    "code": "V—04",
    "name": "150",
    "size": "150 m²",
    "bedrooms": 4,
    "bathrooms": 3,
    "floors": 1,
    "tag": "Residence",
    "image": "/media/houses/model-04-exterior.webp",
    "interior": "/media/houses/model-04-interior.webp",
    "statement": "Más arquitectura. Más calma.",
    "description": "Una residencia de una planta con suite principal, tres baños y una zona de día de gran formato abierta al jardín.",
    "narrative": "VORA 150 marca la entrada en la gama claramente premium: estancias más amplias, mayor privacidad y una arquitectura horizontal que se prolonga hacia el porche.",
    "features": [
      "4 dormitorios",
      "3 baños",
      "Suite + vestidor",
      "Lavadero",
      "Despensa",
      "Preparada para piscina"
    ],
    "idealFor": "Quien busca una vivienda definitiva con más privacidad y presencia.",
    "dimensions": "16,6 × 10,2 m aprox.",
    "slug": "vora-150",
    "seoTitle": "VORA 150 | Casa industrializada de hormigón 150 m²",
    "seoDescription": "Descubre VORA 150: vivienda industrializada de hormigón de 150 m², 4 dormitorios y 3 baños, completamente equipada y preparada para vivir.",
    "surfaces": {
      "built": null,
      "useful": 129,
      "porch": 36,
      "garage": null,
      "terrace": null,
      "pool": null
    },
    "validationStatus": "verified",
    "rooms": [
      {
        "id": "salon-comedor-cocina",
        "name": "Salón-comedor-cocina",
        "area": 49.2,
        "type": "room",
        "listed": true
      },
      {
        "id": "suite-principal",
        "name": "Suite principal",
        "area": 15.2,
        "type": "suite",
        "listed": true
      },
      {
        "id": "vestidor",
        "name": "Vestidor",
        "area": 5.2,
        "type": "closet",
        "listed": true
      },
      {
        "id": "bano-suite",
        "name": "Baño suite",
        "area": 5.4,
        "type": "bath",
        "listed": true
      },
      {
        "id": "suite-secundaria",
        "name": "Suite secundaria",
        "area": 11.7,
        "type": "suite",
        "listed": true,
        "planLabel": "Suite 2"
      },
      {
        "id": "bano-suite-2",
        "name": "Baño suite 2",
        "area": 4.2,
        "type": "bath",
        "listed": true
      },
      {
        "id": "dormitorio-3",
        "name": "Dormitorio 3",
        "area": 10.4,
        "type": "bedroom",
        "listed": true
      },
      {
        "id": "dormitorio-4",
        "name": "Dormitorio 4",
        "area": 10.2,
        "type": "bedroom",
        "listed": true
      },
      {
        "id": "bano-general",
        "name": "Baño general",
        "area": 5,
        "type": "bath",
        "listed": true,
        "planLabel": "Baño"
      },
      {
        "id": "lavadero",
        "name": "Lavadero",
        "area": 4.8,
        "type": "laundry",
        "listed": true
      },
      {
        "id": "despensa",
        "name": "Despensa",
        "area": 3.1,
        "type": "pantry",
        "listed": true
      },
      {
        "id": "distribucion",
        "name": "Distribución",
        "area": 4.6,
        "type": "hall",
        "listed": true,
        "planLabel": "Entrada"
      },
      {
        "id": "salon-comedor",
        "name": "Salón · comedor",
        "area": 31.4,
        "type": "living",
        "listed": false
      },
      {
        "id": "cocina",
        "name": "Cocina",
        "area": 17.8,
        "type": "kitchen",
        "listed": false
      }
    ],
    "plan": {
      "widthM": 16.6,
      "depthM": 10.2,
      "rooms": [
        {
          "roomId": "salon-comedor",
          "x": 3,
          "y": 4,
          "w": 34,
          "h": 52,
          "window": "bottom",
          "door": "right"
        },
        {
          "roomId": "cocina",
          "x": 3,
          "y": 56,
          "w": 34,
          "h": 26,
          "window": "bottom",
          "door": "right"
        },
        {
          "roomId": "despensa",
          "x": 3,
          "y": 82,
          "w": 15,
          "h": 14,
          "door": "right"
        },
        {
          "roomId": "lavadero",
          "x": 18,
          "y": 82,
          "w": 19,
          "h": 14,
          "door": "right"
        },
        {
          "roomId": "dormitorio-3",
          "x": 37,
          "y": 4,
          "w": 18,
          "h": 28,
          "window": "top",
          "door": "bottom"
        },
        {
          "roomId": "dormitorio-4",
          "x": 55,
          "y": 4,
          "w": 18,
          "h": 28,
          "window": "top",
          "door": "bottom"
        },
        {
          "roomId": "suite-secundaria",
          "x": 73,
          "y": 4,
          "w": 24,
          "h": 28,
          "window": "top",
          "door": "bottom"
        },
        {
          "roomId": "bano-general",
          "x": 37,
          "y": 32,
          "w": 18,
          "h": 20,
          "door": "bottom"
        },
        {
          "roomId": "bano-suite-2",
          "x": 55,
          "y": 32,
          "w": 18,
          "h": 20,
          "door": "bottom"
        },
        {
          "roomId": "distribucion",
          "x": 73,
          "y": 32,
          "w": 24,
          "h": 20,
          "door": "bottom"
        },
        {
          "roomId": "vestidor",
          "x": 37,
          "y": 52,
          "w": 17,
          "h": 20,
          "door": "right"
        },
        {
          "roomId": "bano-suite",
          "x": 37,
          "y": 72,
          "w": 17,
          "h": 24,
          "door": "right"
        },
        {
          "roomId": "suite-principal",
          "x": 54,
          "y": 52,
          "w": 43,
          "h": 44,
          "window": "bottom",
          "door": "left"
        }
      ]
    }
  },
  {
    "id": "vora-170",
    "code": "V—05",
    "name": "170",
    "size": "170 m²",
    "bedrooms": 4,
    "bathrooms": 3,
    "floors": 1,
    "tag": "Courtyard",
    "image": "/media/houses/model-05-exterior.webp",
    "interior": "/media/houses/model-05-interior.webp",
    "statement": "La vida sucede dentro y fuera.",
    "description": "Un modelo más abierto al paisaje, con despacho, porche de gran formato, piscina integrada y espacio para dos coches.",
    "narrative": "VORA 170 convierte el exterior en parte activa de la casa. La piscina, el porche y la zona de día se leen como una sola composición, pensada para vivir alrededor del jardín.",
    "features": [
      "4 dormitorios",
      "3 baños",
      "Despacho",
      "Vestidor",
      "Piscina",
      "2 coches"
    ],
    "idealFor": "Familias que quieren más vida exterior y un espacio de trabajo propio.",
    "dimensions": "18,2 × 11,0 m aprox.",
    "slug": "vora-170",
    "seoTitle": "VORA 170 | Casa industrializada de hormigón 170 m²",
    "seoDescription": "Descubre VORA 170: vivienda industrializada de hormigón de 170 m², 4 dormitorios y 3 baños, completamente equipada y preparada para vivir.",
    "surfaces": {
      "built": null,
      "useful": 148,
      "porch": 48,
      "garage": null,
      "terrace": null,
      "pool": null
    },
    "validationStatus": "pending",
    "rooms": [
      {
        "id": "salon-comedor-cocina",
        "name": "Salón-comedor-cocina",
        "area": 53.2,
        "type": "room",
        "listed": true
      },
      {
        "id": "suite-principal",
        "name": "Suite principal",
        "area": 16.4,
        "type": "suite",
        "listed": true
      },
      {
        "id": "vestidor",
        "name": "Vestidor",
        "area": 5.8,
        "type": "closet",
        "listed": true
      },
      {
        "id": "bano-suite",
        "name": "Baño suite",
        "area": 5.8,
        "type": "bath",
        "listed": true
      },
      {
        "id": "dormitorio-2",
        "name": "Dormitorio 2",
        "area": 11,
        "type": "bedroom",
        "listed": true
      },
      {
        "id": "dormitorio-3",
        "name": "Dormitorio 3",
        "area": 10.8,
        "type": "bedroom",
        "listed": true
      },
      {
        "id": "dormitorio-4",
        "name": "Dormitorio 4",
        "area": 10.6,
        "type": "bedroom",
        "listed": true
      },
      {
        "id": "bano-2",
        "name": "Baño 2",
        "area": 4.8,
        "type": "bath",
        "listed": true
      },
      {
        "id": "bano-3",
        "name": "Baño 3",
        "area": 4.6,
        "type": "bath",
        "listed": true
      },
      {
        "id": "despacho",
        "name": "Despacho",
        "area": 8.4,
        "type": "office",
        "listed": true
      },
      {
        "id": "lavadero",
        "name": "Lavadero",
        "area": 5.2,
        "type": "laundry",
        "listed": true
      },
      {
        "id": "despensa",
        "name": "Despensa",
        "area": 3.4,
        "type": "pantry",
        "listed": true
      },
      {
        "id": "distribucion",
        "name": "Distribución",
        "area": 7,
        "type": "hall",
        "listed": true,
        "planLabel": "Entrada"
      },
      {
        "id": "salon-comedor",
        "name": "Salón · comedor",
        "area": 34.4,
        "type": "living",
        "listed": false
      },
      {
        "id": "cocina",
        "name": "Cocina",
        "area": 18.8,
        "type": "kitchen",
        "listed": false
      }
    ],
    "plan": {
      "widthM": 18.2,
      "depthM": 11,
      "rooms": [
        {
          "roomId": "salon-comedor",
          "x": 3,
          "y": 4,
          "w": 34,
          "h": 49,
          "window": "bottom",
          "door": "right"
        },
        {
          "roomId": "cocina",
          "x": 3,
          "y": 53,
          "w": 34,
          "h": 25,
          "window": "bottom",
          "door": "right"
        },
        {
          "roomId": "despensa",
          "x": 3,
          "y": 78,
          "w": 13,
          "h": 18,
          "door": "right"
        },
        {
          "roomId": "lavadero",
          "x": 16,
          "y": 78,
          "w": 21,
          "h": 18,
          "door": "right"
        },
        {
          "roomId": "despacho",
          "x": 37,
          "y": 4,
          "w": 16,
          "h": 26,
          "window": "top",
          "door": "bottom"
        },
        {
          "roomId": "dormitorio-2",
          "x": 53,
          "y": 4,
          "w": 15,
          "h": 26,
          "window": "top",
          "door": "bottom"
        },
        {
          "roomId": "dormitorio-3",
          "x": 68,
          "y": 4,
          "w": 15,
          "h": 26,
          "window": "top",
          "door": "bottom"
        },
        {
          "roomId": "dormitorio-4",
          "x": 83,
          "y": 4,
          "w": 14,
          "h": 26,
          "window": "top",
          "door": "bottom"
        },
        {
          "roomId": "bano-2",
          "x": 37,
          "y": 30,
          "w": 16,
          "h": 18,
          "door": "bottom"
        },
        {
          "roomId": "bano-3",
          "x": 53,
          "y": 30,
          "w": 15,
          "h": 18,
          "door": "bottom"
        },
        {
          "roomId": "distribucion",
          "x": 68,
          "y": 30,
          "w": 29,
          "h": 18,
          "door": "bottom"
        },
        {
          "roomId": "vestidor",
          "x": 37,
          "y": 48,
          "w": 17,
          "h": 20,
          "door": "right"
        },
        {
          "roomId": "bano-suite",
          "x": 37,
          "y": 68,
          "w": 17,
          "h": 28,
          "door": "right"
        },
        {
          "roomId": "suite-principal",
          "x": 54,
          "y": 48,
          "w": 43,
          "h": 48,
          "window": "bottom",
          "door": "left"
        }
      ]
    }
  },
  {
    "id": "vora-200",
    "code": "V—06",
    "name": "200",
    "size": "200 m²",
    "bedrooms": 4,
    "bathrooms": 3,
    "floors": 1,
    "tag": "Villa",
    "image": "/media/houses/model-06-exterior.webp",
    "interior": "/media/houses/model-06-interior.webp",
    "statement": "Arquitectura alrededor del jardín.",
    "description": "Una villa en L con cocina de gran isla, despacho, garaje doble, piscina y una suite principal concebida como refugio.",
    "narrative": "VORA 200 trabaja la casa como una secuencia de volúmenes alrededor de un jardín protegido. Más que sumar metros, los ordena para crear privacidad, perspectivas y una relación constante con el exterior.",
    "features": [
      "4 dormitorios",
      "3 baños",
      "Suite premium",
      "Despacho",
      "Piscina",
      "Garaje doble"
    ],
    "idealFor": "Quien busca una villa contemporánea completa en una sola planta.",
    "dimensions": "18,8 × 14,4 m aprox. (planta en L)",
    "slug": "vora-200",
    "seoTitle": "VORA 200 | Casa industrializada de hormigón 200 m²",
    "seoDescription": "Descubre VORA 200: vivienda industrializada de hormigón de 200 m², 4 dormitorios y 3 baños, completamente equipada y preparada para vivir.",
    "surfaces": {
      "built": null,
      "useful": 174,
      "porch": 55,
      "garage": null,
      "terrace": null,
      "pool": null
    },
    "validationStatus": "pending",
    "rooms": [
      {
        "id": "salon",
        "name": "Salón",
        "area": 28,
        "type": "living",
        "listed": true
      },
      {
        "id": "comedor",
        "name": "Comedor",
        "area": 15.4,
        "type": "living",
        "listed": true
      },
      {
        "id": "cocina",
        "name": "Cocina",
        "area": 18.2,
        "type": "kitchen",
        "listed": true
      },
      {
        "id": "suite-principal",
        "name": "Suite principal",
        "area": 18.3,
        "type": "suite",
        "listed": true
      },
      {
        "id": "vestidor",
        "name": "Vestidor",
        "area": 7.2,
        "type": "closet",
        "listed": true
      },
      {
        "id": "bano-suite",
        "name": "Baño suite",
        "area": 6.4,
        "type": "bath",
        "listed": true
      },
      {
        "id": "dormitorio-2",
        "name": "Dormitorio 2",
        "area": 11.4,
        "type": "bedroom",
        "listed": true
      },
      {
        "id": "dormitorio-3",
        "name": "Dormitorio 3",
        "area": 11.2,
        "type": "bedroom",
        "listed": true
      },
      {
        "id": "dormitorio-4",
        "name": "Dormitorio 4",
        "area": 11,
        "type": "bedroom",
        "listed": true
      },
      {
        "id": "bano-2",
        "name": "Baño 2",
        "area": 5.2,
        "type": "bath",
        "listed": true
      },
      {
        "id": "bano-3",
        "name": "Baño 3",
        "area": 5,
        "type": "bath",
        "listed": true
      },
      {
        "id": "despacho",
        "name": "Despacho",
        "area": 9.5,
        "type": "office",
        "listed": true
      },
      {
        "id": "lavadero",
        "name": "Lavadero",
        "area": 6,
        "type": "laundry",
        "listed": true
      },
      {
        "id": "despensa",
        "name": "Despensa",
        "area": 4,
        "type": "pantry",
        "listed": true
      },
      {
        "id": "zona-tecnica",
        "name": "Zona técnica",
        "area": 4.8,
        "type": "technical",
        "listed": true,
        "planLabel": "Técnico"
      },
      {
        "id": "distribucion",
        "name": "Distribución",
        "area": 12.4,
        "type": "room",
        "listed": true
      },
      {
        "id": "entrada",
        "name": "Entrada",
        "area": 7,
        "type": "hall",
        "listed": false
      }
    ],
    "plan": {
      "widthM": 18.8,
      "depthM": 14.4,
      "rooms": [
        {
          "roomId": "salon",
          "x": 3,
          "y": 4,
          "w": 31,
          "h": 33,
          "window": "bottom",
          "door": "right"
        },
        {
          "roomId": "comedor",
          "x": 3,
          "y": 37,
          "w": 31,
          "h": 19,
          "window": "bottom",
          "door": "right"
        },
        {
          "roomId": "cocina",
          "x": 3,
          "y": 56,
          "w": 31,
          "h": 22,
          "window": "bottom",
          "door": "right"
        },
        {
          "roomId": "despensa",
          "x": 3,
          "y": 78,
          "w": 14,
          "h": 18,
          "door": "right"
        },
        {
          "roomId": "lavadero",
          "x": 17,
          "y": 78,
          "w": 17,
          "h": 18,
          "door": "right"
        },
        {
          "roomId": "despacho",
          "x": 34,
          "y": 4,
          "w": 17,
          "h": 25,
          "window": "top",
          "door": "bottom"
        },
        {
          "roomId": "bano-2",
          "x": 34,
          "y": 29,
          "w": 17,
          "h": 16,
          "door": "bottom"
        },
        {
          "roomId": "entrada",
          "x": 34,
          "y": 45,
          "w": 17,
          "h": 17,
          "door": "bottom"
        },
        {
          "roomId": "zona-tecnica",
          "x": 34,
          "y": 62,
          "w": 17,
          "h": 18,
          "door": "bottom"
        },
        {
          "roomId": "dormitorio-2",
          "x": 51,
          "y": 4,
          "w": 15,
          "h": 25,
          "window": "top",
          "door": "bottom"
        },
        {
          "roomId": "dormitorio-3",
          "x": 66,
          "y": 4,
          "w": 15,
          "h": 25,
          "window": "top",
          "door": "bottom"
        },
        {
          "roomId": "dormitorio-4",
          "x": 81,
          "y": 4,
          "w": 16,
          "h": 25,
          "window": "top",
          "door": "bottom"
        },
        {
          "roomId": "bano-3",
          "x": 51,
          "y": 29,
          "w": 15,
          "h": 16,
          "door": "bottom"
        },
        {
          "roomId": "vestidor",
          "x": 66,
          "y": 29,
          "w": 15,
          "h": 16,
          "door": "bottom"
        },
        {
          "roomId": "bano-suite",
          "x": 81,
          "y": 29,
          "w": 16,
          "h": 16,
          "door": "bottom"
        },
        {
          "roomId": "suite-principal",
          "x": 51,
          "y": 45,
          "w": 46,
          "h": 35,
          "window": "right",
          "door": "left"
        }
      ]
    }
  },
  {
    "id": "vora-signature",
    "code": "V—07",
    "name": "Signature",
    "size": "245 m²",
    "bedrooms": 5,
    "bathrooms": 4,
    "floors": 1,
    "tag": "Signature",
    "image": "/media/houses/model-07-exterior.webp",
    "interior": "/media/houses/model-07-interior.webp",
    "statement": "La expresión más completa de VORA.",
    "description": "Grandes porches, suite principal, espacio polivalente, piscina y garaje doble en la pieza más aspiracional de la colección.",
    "narrative": "Signature lleva el lenguaje VORA a su máxima escala: grandes planos de hormigón, espacios conectados, proporciones más generosas y una forma de habitar donde interior, terraza y paisaje dejan de ser piezas separadas.",
    "features": [
      "5 dormitorios",
      "4 baños",
      "Gran suite",
      "Despacho",
      "Espacio polivalente",
      "Piscina + garaje"
    ],
    "idealFor": "Quien quiere la experiencia VORA sin compromisos.",
    "dimensions": "22,5 × 15,4 m aprox. (composición en U)",
    "slug": "vora-signature",
    "seoTitle": "VORA Signature | Casa industrializada de hormigón 245 m²",
    "seoDescription": "Descubre VORA Signature: vivienda industrializada de hormigón de 245 m², 5 dormitorios y 4 baños, completamente equipada y preparada para vivir.",
    "surfaces": {
      "built": null,
      "useful": 208,
      "porch": 78,
      "garage": null,
      "terrace": null,
      "pool": null
    },
    "validationStatus": "pending",
    "rooms": [
      {
        "id": "salon",
        "name": "Salón",
        "area": 34,
        "type": "living",
        "listed": true
      },
      {
        "id": "comedor",
        "name": "Comedor",
        "area": 18,
        "type": "living",
        "listed": true
      },
      {
        "id": "cocina",
        "name": "Cocina",
        "area": 21,
        "type": "kitchen",
        "listed": true
      },
      {
        "id": "suite-principal",
        "name": "Suite principal",
        "area": 22,
        "type": "suite",
        "listed": true
      },
      {
        "id": "vestidor",
        "name": "Vestidor",
        "area": 9.2,
        "type": "closet",
        "listed": true
      },
      {
        "id": "bano-principal",
        "name": "Baño principal",
        "area": 8.5,
        "type": "bath",
        "listed": true
      },
      {
        "id": "dormitorio-2",
        "name": "Dormitorio 2",
        "area": 12.4,
        "type": "bedroom",
        "listed": true
      },
      {
        "id": "dormitorio-3",
        "name": "Dormitorio 3",
        "area": 12.2,
        "type": "bedroom",
        "listed": true
      },
      {
        "id": "dormitorio-4",
        "name": "Dormitorio 4",
        "area": 12,
        "type": "bedroom",
        "listed": true
      },
      {
        "id": "dormitorio-5",
        "name": "Dormitorio 5",
        "area": 11.8,
        "type": "bedroom",
        "listed": true
      },
      {
        "id": "bano-2",
        "name": "Baño 2",
        "area": 5.4,
        "type": "bath",
        "listed": true
      },
      {
        "id": "bano-3",
        "name": "Baño 3",
        "area": 5.2,
        "type": "bath",
        "listed": true
      },
      {
        "id": "bano-4",
        "name": "Baño 4",
        "area": 5,
        "type": "bath",
        "listed": true
      },
      {
        "id": "despacho",
        "name": "Despacho",
        "area": 10.4,
        "type": "office",
        "listed": true
      },
      {
        "id": "gimnasio-polivalente",
        "name": "Gimnasio / polivalente",
        "area": 13.5,
        "type": "gym",
        "listed": true,
        "planLabel": "Gimnasio"
      },
      {
        "id": "lavadero",
        "name": "Lavadero",
        "area": 6.5,
        "type": "laundry",
        "listed": true
      },
      {
        "id": "despensa",
        "name": "Despensa",
        "area": 4.5,
        "type": "pantry",
        "listed": true
      },
      {
        "id": "cuarto-tecnico",
        "name": "Cuarto técnico",
        "area": 5.4,
        "type": "technical",
        "listed": true,
        "planLabel": "Técnico"
      },
      {
        "id": "distribucion",
        "name": "Distribución",
        "area": 16,
        "type": "room",
        "listed": true
      },
      {
        "id": "entrada",
        "name": "Entrada",
        "area": 8,
        "type": "hall",
        "listed": false
      }
    ],
    "plan": {
      "widthM": 22.5,
      "depthM": 15.4,
      "rooms": [
        {
          "roomId": "salon",
          "x": 3,
          "y": 4,
          "w": 28,
          "h": 33,
          "window": "bottom",
          "door": "right"
        },
        {
          "roomId": "comedor",
          "x": 3,
          "y": 37,
          "w": 28,
          "h": 19,
          "window": "bottom",
          "door": "right"
        },
        {
          "roomId": "cocina",
          "x": 3,
          "y": 56,
          "w": 28,
          "h": 22,
          "window": "bottom",
          "door": "right"
        },
        {
          "roomId": "despensa",
          "x": 3,
          "y": 78,
          "w": 13,
          "h": 18,
          "door": "right"
        },
        {
          "roomId": "lavadero",
          "x": 16,
          "y": 78,
          "w": 15,
          "h": 18,
          "door": "right"
        },
        {
          "roomId": "despacho",
          "x": 31,
          "y": 4,
          "w": 15,
          "h": 24,
          "window": "top",
          "door": "bottom"
        },
        {
          "roomId": "gimnasio-polivalente",
          "x": 31,
          "y": 28,
          "w": 15,
          "h": 26,
          "window": "left",
          "door": "bottom"
        },
        {
          "roomId": "cuarto-tecnico",
          "x": 31,
          "y": 54,
          "w": 15,
          "h": 18,
          "door": "bottom"
        },
        {
          "roomId": "entrada",
          "x": 31,
          "y": 72,
          "w": 15,
          "h": 24,
          "door": "bottom"
        },
        {
          "roomId": "dormitorio-2",
          "x": 46,
          "y": 4,
          "w": 13,
          "h": 26,
          "window": "top",
          "door": "bottom"
        },
        {
          "roomId": "dormitorio-3",
          "x": 59,
          "y": 4,
          "w": 13,
          "h": 26,
          "window": "top",
          "door": "bottom"
        },
        {
          "roomId": "dormitorio-4",
          "x": 72,
          "y": 4,
          "w": 12,
          "h": 26,
          "window": "top",
          "door": "bottom"
        },
        {
          "roomId": "dormitorio-5",
          "x": 84,
          "y": 4,
          "w": 13,
          "h": 26,
          "window": "top",
          "door": "bottom"
        },
        {
          "roomId": "bano-2",
          "x": 46,
          "y": 30,
          "w": 13,
          "h": 18,
          "door": "bottom"
        },
        {
          "roomId": "bano-3",
          "x": 59,
          "y": 30,
          "w": 13,
          "h": 18,
          "door": "bottom"
        },
        {
          "roomId": "bano-4",
          "x": 72,
          "y": 30,
          "w": 12,
          "h": 18,
          "door": "bottom"
        },
        {
          "roomId": "vestidor",
          "x": 84,
          "y": 30,
          "w": 13,
          "h": 18,
          "door": "bottom"
        },
        {
          "roomId": "bano-principal",
          "x": 46,
          "y": 48,
          "w": 18,
          "h": 20,
          "door": "right"
        },
        {
          "roomId": "suite-principal",
          "x": 64,
          "y": 48,
          "w": 33,
          "h": 48,
          "window": "right",
          "door": "left"
        }
      ]
    }
  }
]

const withLegacySurfaceAliases = (house) => Object.defineProperties(house, {
  usableSurface: { enumerable: false, get: () => house.surfaces.useful },
  porchSurface: { enumerable: false, get: () => house.surfaces.porch },
})

export const HOUSES = HOUSE_DATA.map(withLegacySurfaceAliases)

export const getHouseById = (id) => HOUSES.find((house) => house.id === id)

export const getListedRooms = (house) => house.rooms.filter((room) => room.listed)

export const getPlanRooms = (house) => {
  const roomsById = new Map(house.rooms.map((room) => [room.id, room]))
  return house.plan.rooms.map((geometry) => {
    const room = roomsById.get(geometry.roomId)
    if (!room) throw new Error(`Unknown roomId "${geometry.roomId}" in ${house.id}`)
    return {
      ...geometry,
      name: room.planLabel || room.name,
      area: room.area,
      type: room.type,
    }
  })
}
