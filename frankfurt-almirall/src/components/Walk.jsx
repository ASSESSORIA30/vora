import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { media } from '../content/site.js';
import { useLang } from '../lib/i18n.js';
import { createFrameSequence } from '../lib/frameSequence.js';
import { DishMedia } from './Dish.jsx';
import { Star } from './Ornaments.jsx';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Must match the cinematic media query in styles/walk.css */
export const CINEMATIC_QUERY = '(min-width: 900px) and (min-height: 560px) and (prefers-reduced-motion: no-preference)';

/**
 * Timeline map, in % of the pinned scroll (see references/storyboard.md).
 * Camera values describe the poster-based prototype: a slow dolly-in down
 * the counter, glancing at each station, then a pull back to the wide shot.
 */
const STATIONS = [
  { from: 12, to: 31, cam: { scale: 1.5, xPercent: 7, yPercent: -6 } }, // left counter, front
  { from: 31, to: 50, cam: { scale: 1.82, xPercent: -10, yPercent: -5 } }, // wall counter, right
  { from: 50, to: 69, cam: { scale: 2.1, xPercent: 12, yPercent: 7 } }, // kitchen pass under the sign
  { from: 69, to: 86, cam: { scale: 2.45, xPercent: 0, yPercent: 1 } }, // towards the door
];
const RAIL = [0, 0.2, 0.39, 0.58, 0.76, 0.95];

export function Poster({ chapter, index }) {
  return (
    <article className="poster" data-side={index % 2 ? 'right' : 'left'} data-chapter={chapter.id} aria-labelledby={`ch-${chapter.id}`}>
      <div className="poster__frame">
        <div className="poster__mat">
          <p className="poster__station">
            <span className="poster__num">Nº {chapter.number}</span>
            <span>{chapter.station}</span>
          </p>
          <div className="poster__dish">
            <DishMedia id={chapter.id} label={`${chapter.title.join(' ')} — il·lustració`} />
          </div>
          <h2 className="poster__title" id={`ch-${chapter.id}`}>
            <span className="poster__l1">{chapter.title[0]}</span> <em className="poster__l2">{chapter.title[1]}</em>
          </h2>
          <p className="poster__line">{chapter.line}</p>
          <p className="poster__body">{chapter.body}</p>
        </div>
      </div>
    </article>
  );
}

function PosterImage({ alt }) {
  const { base, widths, width, height, lqip } = media.poster;
  const set = (ext) => widths.map((w) => `${base}-${w}.${ext} ${w}w`).join(', ');
  return (
    <picture className="walk__photo">
      <source type="image/avif" srcSet={set('avif')} sizes="100vw" />
      <source type="image/webp" srcSet={set('webp')} sizes="100vw" />
      <img
        src={`${base}-1448.jpg`}
        srcSet={set('jpg')}
        sizes="100vw"
        width={width}
        height={height}
        alt={alt}
        fetchPriority="high"
        decoding="async"
        style={{ backgroundImage: `url(${lqip})` }}
      />
    </picture>
  );
}

export function Walk() {
  const { t } = useLang();
  const root = useRef(null);
  const frames = media.walkFrames;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(CINEMATIC_QUERY, () => {
        const q = gsap.utils.selector(root);
        // With a real frame sequence the footage moves itself; the simulated
        // camera only drives the poster-based prototype.
        const camera = frames ? { scale: 1, xPercent: 0, yPercent: 0 } : q('.walk__camera')[0];
        const posters = q('.poster');
        const railFill = q('.walk__rail-fill')[0];
        const railStops = q('.walk__rail button');

        let sequence = null;
        if (frames) sequence = createFrameSequence(q('canvas')[0], frames);

        gsap.set(posters, { autoAlpha: 0 });
        gsap.set(q('.walk__finale'), { autoAlpha: 0 });
        if (!frames) gsap.set(camera, { scale: 1.06, transformOrigin: '51% 46%' });

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            pin: q('.walk__pin')[0],
            start: 'top top',
            end: () => `+=${window.innerHeight * 6}`,
            scrub: 0.9,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate(self) {
              const p = self.progress;
              railFill.style.transform = `scaleY(${p})`;
              sequence?.setProgress(p);
              let active = 0;
              RAIL.forEach((stop, i) => {
                if (p >= stop - 0.02) active = i;
              });
              railStops.forEach((b, i) => b.toggleAttribute('aria-current', i === active));
            },
          },
        });

        // Opening: slight push, hero copy leaves.
        tl.to(camera, { scale: 1.18, duration: 12, ease: 'power1.in' }, 0)
          .to(q('.walk__hero-copy'), { autoAlpha: 0, yPercent: -18, duration: 6, ease: 'power2.in' }, 5)
          .to(q('.walk__hint'), { autoAlpha: 0, duration: 3 }, 2)
          .to(q('.walk__bars'), { '--bar': '7.5vh', duration: 5, ease: 'power2.out' }, 9)
          .to(q('.walk__vignette'), { opacity: 0.9, duration: 8 }, 8);

        STATIONS.forEach((s, i) => {
          const len = s.to - s.from;
          const poster = posters[i];
          const frame = poster.querySelector('.poster__frame');
          tl.to(camera, { ...s.cam, duration: len * 0.85, ease: 'power2.inOut' }, s.from - (i === 0 ? 0 : 2))
            .set(poster, { autoAlpha: 1 }, s.from + 1.5)
            .fromTo(
              frame,
              { autoAlpha: 0, y: 90, rotate: i % 2 ? 2.5 : -2.5, clipPath: 'inset(100% 0% 0% 0%)' },
              { autoAlpha: 1, y: 0, rotate: i % 2 ? 0.8 : -0.8, clipPath: 'inset(0% 0% 0% 0%)', duration: 4.5, ease: 'power3.out' },
              s.from + 1.5,
            )
            .fromTo(
              poster.querySelector('.poster__dish'),
              { scale: 0.72, rotate: -35 },
              { scale: 1, rotate: 0, duration: 6, ease: 'back.out(1.4)' },
              s.from + 2.5,
            )
            .fromTo(
              poster.querySelectorAll('.poster__title > *, .poster__line, .poster__body'),
              { autoAlpha: 0, y: 24 },
              { autoAlpha: 1, y: 0, stagger: 0.7, duration: 3, ease: 'power2.out' },
              s.from + 3.5,
            )
            .to(frame, { autoAlpha: 0, y: -70, rotate: 0, duration: 3.5, ease: 'power2.in' }, s.to - 3.5)
            .set(poster, { autoAlpha: 0 }, s.to)
            .fromTo(q('.walk__glow'), { opacity: 0.35 }, { opacity: 0.85, duration: len / 2, yoyo: true, repeat: 1, ease: 'sine.inOut' }, s.from);
        });

        // Finale: the camera pulls back to the wide shot, lights warm up.
        tl.to(camera, { scale: 1.04, xPercent: 0, yPercent: 0, duration: 12, ease: 'power2.inOut' }, 86)
          .to(q('.walk__bars'), { '--bar': '0vh', duration: 6, ease: 'power2.inOut' }, 87)
          .to(q('.walk__vignette'), { opacity: 0.55, duration: 6 }, 87)
          .to(q('.walk__glow'), { opacity: 1, duration: 8 }, 88)
          .fromTo(q('.walk__finale'), { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 6, ease: 'power3.out' }, 91)
          .to({}, { duration: 3 }, 97);

        // Rail navigation: jump to a chapter while keeping native scrolling.
        const st = tl.scrollTrigger;
        const handlers = railStops.map((b, i) => {
          const h = () => {
            const y = st.start + (st.end - st.start) * RAIL[i];
            window.scrollTo({ top: Math.ceil(y), behavior: 'smooth' });
          };
          b.addEventListener('click', h);
          return h;
        });

        return () => {
          railStops.forEach((b, i) => b.removeEventListener('click', handlers[i]));
          sequence?.destroy();
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const railLabels = [t.hero.title.join(' '), ...t.chapters.map((c) => c.title.join(' ')), t.finale.title.join(' ')];

  return (
    <section className="walk" ref={root} id="recorregut" aria-label={t.hero.scrollHint}>
      <div className="walk__pin">
        <div className="walk__stage">
          <div className="walk__camera">{frames ? <canvas className="walk__canvas" aria-hidden="true" /> : <PosterImage alt={t.local.photoAlt} />}</div>
          <div className="walk__glow" aria-hidden="true" />
          <div className="walk__vignette" aria-hidden="true" />
          <div className="walk__grain" aria-hidden="true" />
          <div className="walk__bars" aria-hidden="true" />
        </div>

        <div className="walk__hero">
          <div className="walk__hero-copy">
            <p className="kicker kicker--light">
              <Star className="kicker__star" /> {t.hero.kicker}
            </p>
            <h1 className="hero-title">
              <span className="hero-title__l1">{t.hero.title[0]}</span>
              <em className="hero-title__l2">{t.hero.title[1]}</em>
            </h1>
            <p className="hero-lead">{t.hero.lead}</p>
            <div className="cta-row">
              <a className="btn btn--sign" href="#carta">
                {t.hero.ctaMenu}
              </a>
              <a className="btn btn--ghost" href="#vine">
                {t.hero.ctaVisit}
              </a>
            </div>
          </div>
          <p className="walk__hint" aria-hidden="true">
            <span className="walk__hint-line" />
            {t.hero.scrollHint}
          </p>
        </div>

        <div className="walk__chapters">
          {t.chapters.map((c, i) => (
            <Poster key={c.id} chapter={c} index={i} />
          ))}
        </div>

        <div className="walk__finale">
          <h2 className="finale-title">
            <span>{t.finale.title[0]}</span> <em>{t.finale.title[1]}</em>
          </h2>
          <p className="finale-line">{t.finale.line}</p>
          <div className="cta-row cta-row--center">
            <a className="btn btn--sign" href="#carta">
              {t.hero.ctaMenu}
            </a>
            <a className="btn btn--ghost" href="#vine">
              {t.hero.ctaVisit}
            </a>
          </div>
        </div>

        <nav className="walk__rail" aria-label={t.hero.scrollHint}>
          <span className="walk__rail-track" aria-hidden="true">
            <span className="walk__rail-fill" />
          </span>
          <ol>
            {railLabels.map((label, i) => (
              <li key={label}>
                <button type="button" aria-label={label}>
                  <Star className="walk__rail-star" />
                  <span className="walk__rail-label">{label}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <a className="walk__skip" href="#carta">
          {t.nav.skip} ↓
        </a>
      </div>
    </section>
  );
}
