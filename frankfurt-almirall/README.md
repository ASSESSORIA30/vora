# Frankfurt Almirall — web (prototip v0.1)

Web cinematogràfica del Frankfurt Almirall: un passeig amb scroll per la barra, de la truita de patates a l'hamburguesa. Aplicació independent dins del repositori VORA, **sense cap relació amb la web de VORA** (que viu a l'arrel).

Direcció creativa i normes: skill `frankfurt-almirall` (`.agents/skills/frankfurt-almirall/`).

## Estat

- **Prototip privat.** Porta `noindex` i una etiqueta "Prototip v0.1". No publicar a producció sense l'aprovació de la propietat.
- **Recorregut:** prototip amb la foto de referència i una càmera simulada (dolly-in, aturades, retorn al pla general). No és un recorregut 3D real. Quan arribi el vídeo de Higgsfield o el rodatge, s'activa el seqüenciador de fotogrames (vegeu `docs/higgsfield-prompts.md`).
- **Plats:** il·lustracions en plats d'esmalt, en lloc de fotos. Es substitueixen omplint `media.dishes`.
- **Dades de negoci pendents:** nom definitiu, adreça, horaris, telèfon, data d'obertura, preus, al·lèrgens. Tot és `null` a `src/content/site.js` i la web ho amaga fins que s'ompli.

## Desenvolupament

```bash
cd frankfurt-almirall
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/
npm run preview  # http://localhost:4173
npm run media    # regenera les imatges optimitzades a partir de la foto de la skill
```

## Estructura

| Ruta | Contingut |
|---|---|
| `src/content/site.js` | **Tot el contingut editable** (català/castellà, dades de negoci, mitjans) |
| `src/components/Walk.jsx` | Recorregut amb GSAP ScrollTrigger (cronologia, càmera, targetes, carril) |
| `src/lib/frameSequence.js` | Seqüenciador de canvas per al vídeo final (càrrega per finestra, DPR limitat) |
| `src/components/Dish.jsx` | Il·lustracions dels plats / vídeos quan existeixin |
| `src/components/Ornaments.jsx` | Rajola hidràulica, rajola de paret, sanefa verda, segell |
| `src/styles/` | Estils (base, recorregut, seccions, pàgina de carta) |
| `carta/index.html` | Ruta ràpida i estàtica de la carta (`/carta`) |
| `docs/higgsfield-prompts.md` | Prompts audiovisuals i procés d'integració |

## Comportament

- **Escriptori (≥ 900 px, sense moviment reduït):** secció fixada de 6 pantalles d'scroll, reversible, amb accés immediat a la carta ("Salta el recorregut", capçalera, CTA).
- **Mòbil i moviment reduït:** flux vertical normal (portada + quatre parades + final), sense secció fixada.
- Idioma: català per defecte, castellà amb el selector o `?lang=es`.

## Desplegament (Vercel)

Projecte separat amb **Root Directory = `frankfurt-almirall`**, framework Vite, sortida `dist`. `vercel.json` hi afegeix capçaleres de memòria cau i `X-Robots-Tag: noindex`.
