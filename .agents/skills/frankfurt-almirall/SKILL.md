---
name: frankfurt-almirall
description: Design, implement and review the cinematic vintage Frankfurt Almirall restaurant website from the supplied interior reference. Apply to brand direction, landing pages, scroll-driven bar walkthroughs, food photography, restaurant menus, responsive UX, copy, local discovery, accessibility and web performance. Use whenever creating or modifying this project's frontend or visual storytelling. The name is provisional until the owner confirms it.
---

# Frankfurt Almirall — creative and implementation direction

## Start here
- Inspect `assets/bar-reference.jpg` as the primary interior and atmosphere reference, then read `references/storyboard.md` before designing the home page or its scroll sequence.
- Inspect the existing repository and installed skills first. Preserve the existing stack if one exists; for a new site prefer Next.js, TypeScript, CSS and GSAP ScrollTrigger. Apply official frontend-design and GSAP skills when available; use Playwright or equivalent browser testing for QA.
- Treat business name, address, hours, phone, prices, menu names, availability, opening date, suppliers and reservation policy as unconfirmed unless explicitly supplied by the owner. Keep all such values in one editable content file. Do not publish invented details, fake reviews, or unverified claims.

## Visual identity
- Build a warm, understated Catalan neighborhood frankfurt: cream walls, brushed stainless steel, black seating, hydraulic-pattern floor, deep green trim, burgundy/red lettering, aged ochre accents and warm globe lighting. Derive motifs and colors from the reference rather than adding unrelated retro diner elements.
- Suggested palette (creative defaults, not sampled brand specifications): cream #F4E8D4, burgundy #7F2928, bottle green #1F3930, charcoal #252321, ochre #C69A56, steel #A6A5A0.
- Use a distinctive condensed display face inspired by traditional shop signs, such as Barlow Condensed or Oswald; pair with a restrained readable serif or sans such as Source Serif 4 or DM Sans. Use licensed fonts, ideally self-hosted. Design a typographic wordmark if no logo exists; clearly mark it as provisional.
- Use editorial layouts, large photos, subtle paper grain and vintage sign-inspired details; avoid American diner imagery, neon, generic burger-chain branding, excessive cards, rounded dashboard UI, stock-photo clichés and indiscriminate effects.
- Use Catalan as the default copy draft, with Spanish as an optional alternate language. Write short, conversational, appetizing copy. Avoid claims like local or organic unless confirmed.

## Cinematic experience
- Treat the bar as the narrative spine, with visual continuity through four food stations: potato omelette, quality ham with tomato-rubbed bread and olive oil, frankfurts, simple burgers. These are categories, not an invented full menu.
- Prefer a coherent filmed or generated camera dolly shot, driven by scroll through a canvas frame sequence or a tested video implementation. A single reference photo cannot supply accurate unseen geometry: use it as a look reference, not as proof of a genuine 3D walkthrough. If only that image exists, implement an intentional poster-based motion prototype with modest parallax and clearly label it as a prototype internally. Do not fake a finished continuous journey using disconnected photos.
- The scroll must be reversible, smooth and user controlled; never trap scrolling. Keep text and CTA in HTML rather than in frames or canvas. Offer immediate access to the menu and practical information even before the cinematic sequence finishes.
- On mobile and reduced-motion, prioritize legibility, loading and a normal vertical flow. Preserve a compelling poster and editorial sections without requiring a large frame sequence. Do not autoplay audio.
- Use a single high-impact scroll timeline rather than unrelated effects; make food closeups the focal points. Provide honest fallbacks if video assets are missing or playback fails.

## Implementation and content
- Organize content, animation logic, responsive layouts and optimized assets separately. Prefer transform/opacity animation; cap device pixel ratio on canvas; prefetch nearby frames, not all media upfront; release obsolete frames; render on progress changes. Use optimized WebP/AVIF stills and appropriate web video sources.
- Keep a lightweight header with Carta, El local, and Vine a veure'ns; add accessible menu and directions CTAs once real contact details exist. Put menu categories in crawlable HTML. Show prices only once confirmed. Display allergen information from owner-approved data, not guesses.
- Build a static or mostly static site unless a genuine business feature needs backend services. Keep admin/content editing simple and avoid adding a database, payment, booking service or account login without a specific requirement.
- Include descriptive page titles, Open Graph metadata, descriptive alt text, semantic HTML, keyboard navigation, sufficient contrast, and restaurant structured data only for verified fields. Add cookie consent only when the actual integrations require it; avoid needless trackers.

## Verify before handoff
- Run build, type check and lint where applicable. Test at 375/390px mobile, tablet and desktop widths; use real browser screenshots, check scroll continuity and reverse scrolling, menu navigation, direct links, media failure and reduced-motion behavior. Verify no horizontal overflow, blank frames, unreadable copy, broken links or major console errors.
- Inspect first paint and mobile loading; optimize imagery and defer nonessential media. Aim for LCP <=2.5s, CLS <=0.1 and INP <=200ms under representative conditions; report measured results rather than claiming guarantees.
- Report what was implemented, which assets are still placeholders, what business data is missing, and any test failures. Do not deploy or publish unapproved placeholder content without the owner's instruction.
