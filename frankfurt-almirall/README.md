# Frankfurt Almirall — web (prototip v0.1)

Web cinematogràfica del Frankfurt Almirall: un passeig amb scroll per la barra, de la truita de patates a l'hamburguesa. Aplicació independent dins del repositori VORA, **sense cap relació amb la web de VORA** (que viu a l'arrel).

Direcció creativa i normes: skill `frankfurt-almirall` (`.agents/skills/frankfurt-almirall/`).

## Estat

- **Previsualització privada** (`noindex`). No publicar a producció sense aprovació.
- **Tota la web és el recorregut:** el vídeo ocupa la pantalla, queda fix i avança o retrocedeix amb l'scroll (sense reproducció automàtica). Al final: «La barra t'espera», adreça i botons.
- **Moviment reduït:** els mateixos moments com a imatges fixes en un flux vertical.
- `/carta`: pàgina independent amb fotogrames reals dels plats. Preus i al·lèrgens pendents.

## Canviar el vídeo (sense reprogramar)

1. Desa el nou MP4 a `videos/` i ajusta `source` a `src/content/tour.config.js`.
2. Mira el vídeo i ajusta a `tour.config.js` els temps de les parades (`stops[].time`), el punt d'atenció de cada producte (`focus`), on va el text (`place`, `tone`), el final del tram útil (`source.end`) i la durada de l'scroll (`scrollLength`).
3. Executa la conversió:

   ```bash
   npm run video
   ```

   Genera `public/media/tour/{lg,sm}/f_XXXX.webp`, `public/media/og.jpg` i `src/content/tour.manifest.json`.
4. `npm run build` i desplega.

## Desenvolupament

```bash
cd frankfurt-almirall
npm install
npm run dev
npm run build
```

## Estructura

| Ruta | Contingut |
|---|---|
| `src/content/tour.config.js` | **Recorregut**: vídeo, tram útil, parades, textos CAT/ES, durada, enquadrament |
| `src/content/tour.manifest.json` | Generat per `npm run video` (nombre i mida dels fotogrames) |
| `src/content/site.js` | Dades del negoci (adreça), capçalera i carta |
| `scripts/build-tour.mjs` | Conversió FFmpeg → seqüències WebP (1660 px i 960 px) |
| `src/lib/tourPlayer.js` | Reproductor de canvas: càrrega progressiva i bidireccional, memòria limitada, fosa entre fotogrames, enquadrament responsive |
| `src/lib/tourTimeline.js` | Scroll → fotograma (alentiment a cada producte) i aparició dels textos |
| `src/components/Tour.jsx` | Escena, textos, final, indicador de progrés, alternativa de moviment reduït |
| `carta/index.html`, `src/MenuPage.jsx` | Ruta `/carta` |
| `videos/` | Vídeo original (no es publica: `.vercelignore`) |

## Desplegament (Vercel)

Projecte independent `frankfurt-almirall` (equip assessoria30s-projects), Root Directory `frankfurt-almirall`, Vite, sortida `dist`.
