# Prompts audiovisuals per a Higgsfield — Frankfurt Almirall

Material per generar el recorregut per la barra i els primers plans gastronòmics que substituiran el prototip actual (foto fixa amb moviment simulat i plats il·lustrats).

> **Important:** les imatges generades són **conceptuals de preobertura**. No s'han de presentar com a fotografies documentals del local acabat ni del menjar real. Quan hi hagi rodatge real, el substituirà.

---

## 0. Criteris comuns (enganxa'ls a tots els prompts)

**Referència visual obligatòria:** `.agents/skills/frankfurt-almirall/assets/bar-reference.jpg`, pujada com a *start frame* o *image reference*.

**Bloc d'estil** (afegeix-lo al final de cada prompt):

```
Style: warm, understated cinematic realism, 35mm film look, subtle grain, natural warm tungsten light from frosted glass globe lamps, cream walls, brushed stainless steel counters, black round leather stools, Catalan hydraulic cement tile floor with brown eight-point compass stars, blue-and-ochre wall tiles under a thin bottle-green tile trim, framed vintage posters. Muted palette: cream, burgundy, bottle green, ochre, steel. Shallow depth of field, gentle highlights on steel, no people, no text changes.
```

**Bloc negatiu** (camp *negative prompt*, o al final com a "Avoid"):

```
Avoid: neon, American diner, chrome jukebox, red-and-white checkered floor, people, hands, faces, fast camera, shaky handheld, whip pans, warped or melting stools, changing tile pattern, extra rooms, extra doors, distorted lettering, invented signage, logos, watermarks, oversaturated colors, plastic-looking food, unrealistic portions, steam clouds, smoke, cartoon look.
```

**Especificacions tècniques**

| Paràmetre | Valor |
|---|---|
| Relació d'aspecte | 16:9 (escriptori). Opcional 9:16 només per a xarxes; la web mòbil no fa servir el seqüenciador |
| Resolució | 1080p mínim; 4K si hi ha opció, però es reduirà a ~1920 px |
| Durada per pla | 5 s (o 8–10 s si el model ho permet sense deformacions) |
| Moviment | Lent, estable, dolly cap endavant, sense rotacions brusques |
| FPS | 24 |
| Àudio | Cap (la web no reprodueix so) |

**Continuïtat entre plans:** genera cada pla del recorregut fent servir **l'últim fotograma del pla anterior com a start frame** del següent. Mantén el mateix model, la mateixa llavor (*seed*) si es pot, i el mateix bloc d'estil.

---

## 1. Recorregut per la barra (seqüència principal)

Objectiu: un *dolly shot* continu d'uns 20–25 s des de l'entrada fins al fons, amb quatre aturades on la càmera s'acosta a cada plat. Es genera en 6 plans encadenats.

Moviment de càmera recomanat a Higgsfield: **Dolly In** / **Push In** (intensitat baixa). Per al pla 6, **Dolly Out** / **Pull Out**.

### Pla 1 — Obertura (0–12 %)
*Start frame:* `bar-reference.jpg`

```
Slow cinematic dolly-in along a long, narrow Catalan neighborhood bar, eye level at 1.4 m, camera centered in the aisle between a stainless steel counter on the left and a wall counter with black stools on the right. The frosted globe lamps glow warmly, reflections slide softly along the brushed steel. The street door at the end stays open with daylight. Calm, quiet morning atmosphere before opening. Steady, smooth motion, no cuts.
```

### Pla 2 — Truita de patates (12–31 %)
*Start frame:* últim fotograma del pla 1

```
The camera continues its slow dolly forward and gently drifts left and slightly down towards the stainless steel counter, where a freshly cut Spanish potato omelette (truita de patates) rests on a simple white plate, one wedge cut out showing soft golden layers of potato. Warm globe light falls on the omelette, steel reflections behind it softly out of focus. The camera eases to a near stop at counter height, the omelette becomes the focal point. Same bar, same lighting, same tiles.
```

### Pla 3 — Pa amb tomata i pernil (31–50 %)
*Start frame:* últim fotograma del pla 2

```
The camera pulls gently away from the left counter and glides to the right, along the wall counter with black stools. On the steel ledge sits a rustic sandwich of crusty country bread rubbed with ripe tomato, a thin drizzle of olive oil and finely sliced cured ham. The camera slows down and settles at counter height in a warm close-up, blue-and-ochre wall tiles softly blurred behind. Same bar, consistent geometry, steady movement.
```

### Pla 4 — Frankfurts (50–69 %)
*Start frame:* últim fotograma del pla 3

```
The camera moves back to the center aisle and tilts slightly up towards the kitchen pass under the illuminated sign on the left. On the flat-top griddle behind the counter, two frankfurters sizzle gently with light browning, next to soft warm buns; a small jar of mustard on the counter. Subtle, realistic heat shimmer, no heavy smoke. The camera eases to a stop facing the griddle. Same lighting, same steel surfaces.
```

### Pla 5 — Hamburguesa (69–86 %)
*Start frame:* últim fotograma del pla 4

```
The camera continues forward down the aisle towards the open street door, then lowers to counter level where a simple burger sits on a plate: soft toasted bun with sesame seeds, a single juicy patty, melted cheese, a little lettuce. Honest, real-food texture, not styled for advertising. The camera settles in a close-up with the bright doorway softly glowing in the background bokeh.
```

### Pla 6 — La barra t'espera (86–100 %)
*Start frame:* últim fotograma del pla 5. *End frame (si l'eina ho permet):* `bar-reference.jpg`

```
The camera slowly pulls back and rises to eye level, revealing the whole long bar again: stainless counter, rows of black stools, star-patterned tile floor, warm globe lamps, framed vintage posters. The light becomes slightly warmer, evening-like. Calm final wide shot, the bar empty and waiting. Very smooth, ends almost still.
```

### Alternativa en un sol pla (si el model accepta 10–15 s)

```
One continuous, very slow cinematic dolly shot through a long, narrow Catalan neighborhood bar, from the entrance to the open street door. The camera glides between a brushed stainless steel counter on the left and a wall counter with black stools on the right, pausing briefly at four plates on the counters: a cut potato omelette, tomato-rubbed bread with olive oil and cured ham, frankfurters on a griddle, and a simple burger. Warm frosted globe lamps, cream walls, hydraulic tile floor with eight-point stars, blue-and-ochre wall tiles, framed vintage posters. Steady, quiet, no people.
```

---

## 2. Primers plans gastronòmics (bucles curts)

Bucles de 4–6 s per a les targetes de cada parada i per a la secció de carta. Primer genera una **imatge fixa** (Higgsfield Soul o el model d'imatge que facis servir) i després anima-la amb *image-to-video* amb moviment molt subtil.

Moviment recomanat: **Static** o **Slow Push In** (intensitat mínima). Han de poder fer bucle: demana que el primer i l'últim fotograma siguin gairebé iguals.

Format: **1:1** (les targetes són circulars a la web) i opcionalment 4:5.

### 2.1 Truita de patates

*Imatge:*
```
Overhead three-quarter close-up of a homemade Spanish potato omelette (truita de patates) on a plain white ceramic plate resting on a brushed stainless steel bar counter, one wedge cut and slightly pulled out showing tender golden potato layers and a just-set center. Warm tungsten light from a globe lamp above, soft reflections on the steel, cream wall and blue-ochre tiles blurred in the background. Natural, appetizing, not over-styled. 35mm film look, fine grain.
```
*Vídeo:*
```
Barely perceptible slow push-in on the omelette, light shifting softly across the steel counter, tiny glint on the plate rim. Seamless loop, no steam, no hands.
```

### 2.2 Pa amb tomata i pernil

*Imatge:*
```
Close-up of a Catalan pa amb tomata sandwich: crusty country bread, toasted, rubbed with ripe red tomato, a glossy drizzle of extra virgin olive oil, and thin folds of cured ham on top. Served on a small white plate on a brushed steel wall counter, blue-and-ochre hydraulic wall tiles softly out of focus behind. Warm light, honest everyday bar food, realistic portion. 35mm film look.
```
*Vídeo:*
```
Slow, subtle push-in; a single drop of olive oil glistens and slides gently on the bread surface. Calm, seamless loop, no hands.
```

### 2.3 Frankfurts

*Imatge:*
```
Close-up of two frankfurters on a flat-top griddle with light, even browning and fine grill marks, beside two soft warm buns, a small glass jar of mustard on the steel counter in the foreground. Bar kitchen pass with stainless steel, warm globe light, very shallow depth of field. Realistic, everyday, no heavy smoke. 35mm film look.
```
*Vídeo:*
```
Gentle sizzle movement on the sausages, faint heat shimmer above the griddle, camera nearly static with a slow push-in. Seamless loop.
```

### 2.4 Hamburguesa senzilla

*Imatge:*
```
Close-up of a simple, honest burger on a white plate on a brushed steel bar counter: soft toasted sesame bun, one juicy beef patty, melted cheese slightly dripping, a little lettuce. Realistic size, not advertising-styled. Background: bright open doorway and black stools softly blurred, warm globe light. 35mm film look, fine grain.
```
*Vídeo:*
```
Very slow push-in, melted cheese settling slightly, soft light moving on the bun. Seamless loop, no hands, no smoke.
```

---

## 3. Plans auxiliars opcionals

- **Pòster de capçalera (still):** el mateix enquadrament de `bar-reference.jpg` a hora daurada, llums encesos, sense gent. Útil com a *poster* del vídeo i per a Open Graph.
- **Detalls de material (loops de 3 s):** reflex lliscant sobre l'acer; llum que parpelleja suaument dins un globus; pla zenital del terra d'estrelles amb un raig de sol que avança.

---

## 4. Lliurament i integració a la web

1. Exporta cada pla en **MP4 H.264**, 1920×1080, 24 fps, sense àudio. Desa'ls a `frankfurt-almirall/media-src/` (no es publica).
2. Uneix els plans del recorregut i extreu els fotogrames en WebP:

   ```bash
   ffmpeg -i walk.mp4 -vf "fps=15,scale=1600:-2" -c:v libwebp -quality 72 public/media/walk/f_%04d.webp
   ```

   Amb ~22 s a 15 fps surten ~330 fotogrames (~40–70 kB cadascun). Prova també 1280 px d'amplada si el pes total és alt.
3. Configura `media.walkFrames` a `src/content/site.js`:

   ```js
   walkFrames: {
     count: 330,
     path: (i) => `/media/walk/f_${String(i + 1).padStart(4, '0')}.webp`,
     width: 1600,
     height: 900,
   },
   ```

   El component canvia automàticament del prototip amb foto fixa al seqüenciador de canvas: carrega només els fotogrames propers i allibera els llunyans, i limita el DPR.
4. Per als primers plans, exporta MP4 de 720×720 (H.264, `-crf 26`, sense àudio) i un pòster WebP, i omple `media.dishes` (p. ex. `truita: { video: '/media/dish/truita.mp4', poster: '/media/dish/truita.webp' }`).
5. Revisa la cronologia: si els plats cauen en un altre punt del vídeo, ajusta els percentatges `STATIONS` de `src/components/Walk.jsx` perquè les targetes coincideixin amb el plat que es veu.
