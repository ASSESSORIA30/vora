# VORA — Concrete Living

Adaptación de la web editorial original a la nueva marca **VORA · Concrete Living**.

## Qué se ha conservado

- Estructura visual y ritmo editorial del proyecto original.
- Preloader animado.
- Smooth scroll con Lenis.
- Animaciones GSAP y SplitType.
- Colección horizontal con scroll en desktop.
- Numeración de secciones, tipografía serif + sans y footer de gran formato.

## Qué se ha cambiado

- Identidad completa a **VORA**.
- Tagline: **Concrete Living**.
- Nueva paleta mineral: carbón, hormigón, blanco piedra y bronce apagado.
- Nuevo logo/mark integrado en navegación, menú y preloader.
- Hero con vídeo desktop y vídeo móvil específicos.
- Colección ampliada a 7 modelos: 90, 110, 130, 150, 170, 200 y Signature.
- Mensaje comercial centrado en modelos cerrados, hormigón industrializado y vivienda completamente equipada.
- Eliminadas cifras y promesas técnicas no validadas del proyecto anterior.
- Galería sustituida por material visual VORA.
- Formulario adaptado a parcela + modelo de interés.

## Edición rápida

- Marca y ubicación: `src/config/brand.js`
- Modelos: `src/data/houses.js`
- Colores: `tailwind.config.js` y variables de `src/index.css`
- Hero: `public/media/hero/`
- Imágenes de modelos: `public/media/houses/`

## Contacto

Los datos de email/teléfono se han dejado fuera de la interfaz pública porque todavía no se han confirmado para VORA. Añádelos cuando se definan los canales de la nueva marca.

## Desarrollo

```bash
npm install
npm run dev
```

## Producción

```bash
npm run build
```

El proyecto usa Vite + React y puede desplegarse directamente en Vercel.

## V2 premium refinement

- Added cinematic full-screen model detail experience for all seven VORA models.
- Replaced placeholder artwork for VORA 110, 150 and 170 with photorealistic exterior/interior imagery.
- Reworked model cards to a wider editorial format better suited to architectural photography.
- Refined brand copy across Hero, Concept, Collection, Everything Included and Atmosphere sections.
- Expanded the visual gallery with the complete collection language.
- No new runtime dependencies were added.
