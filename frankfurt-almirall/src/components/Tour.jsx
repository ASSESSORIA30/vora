import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { tour } from '../content/tour.config.js';
import manifest from '../content/tour.manifest.json';
import { business } from '../content/site.js';
import { useLang } from '../lib/i18n.js';
import { buildTimeline } from '../lib/tourTimeline.js';
import { createTourPlayer } from '../lib/tourPlayer.js';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const MOTION_QUERY = '(prefers-reduced-motion: no-preference)';

const pad = (i) => String(i).padStart(4, '0');
const frameUrl = (variant, i) => manifest.variants[variant].path.replace('{i}', pad(i));

const TINY_AVIF = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAAD5bWV0YQAAAAAAAAAvaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAFBpY3R1cmVIYW5kbGVyAAAAAA5waXRtAAAAAAABAAAAHmlsb2MAAAAARAAAAQABAAAAAQAAASEAAAAWAAAAKGlpbmYAAAAAAAEAAAAaaW5mZQIAAAAAAQAAYXYwMUNvbG9yAAAAAGppcHJwAAAAS2lwY28AAAAUaXNwZQAAAAAAAAACAAAAAgAAABBwaXhpAAAAAAMICAgAAAAMYXYxQ4EADAAAAAATY29scm5jbHgAAgACAAIAAAAAF2lwbWEAAAAAAAAAAQABBAECgwQAAAAebWRhdAoFGAA2wCAyDRgAAABQAAAAALATSyg=';
let avifCheck;
/** Resolves true when the browser can decode AVIF (Safari 16+, Chrome, Firefox, Edge). */
function supportsAvif() {
  avifCheck ??= new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.naturalWidth > 0);
    img.onerror = () => resolve(false);
    img.src = TINY_AVIF;
  });
  return avifCheck;
}

function pickVariant(avif) {
  const lg = manifest.variants.lg;
  if (!lg || (lg.format === 'avif' && !avif)) return 'sm';
  // Width (in device pixels) the video will actually be drawn at, as in tourPlayer's layout.
  const { innerWidth: w, innerHeight: h } = window;
  const cover = Math.max(w / lg.width, h / lg.height);
  const contain = Math.min(w / lg.width, h / lg.height);
  const drawn = lg.width * Math.min(cover, contain / tour.minVisible);
  const need = drawn * Math.min(window.devicePixelRatio || 1, 2);
  return need >= tour.output.largeFrom ? 'lg' : 'sm';
}

function StopText({ stop, text }) {
  return (
    <section className="cue" data-place={stop.place} data-tone={stop.tone} data-cue={stop.id} aria-hidden="true">
      <p className="cue__kicker">{text.kicker}</p>
      <h2 className="cue__title">{text.title}</h2>
      {text.line ? <p className="cue__line">{text.line}</p> : null}
    </section>
  );
}

function Finale({ t, id }) {
  const { address } = business;
  const { lang } = useLang();
  const q = lang === 'ca' ? '' : `?lang=${lang}`;
  return (
    <section className="finale" id={id} aria-labelledby={`${id}-title`}>
      <h2 className="finale__title" id={`${id}-title`}>
        {t.finale.title}
      </h2>
      <p className="finale__name">{t.finale.name}</p>
      <address className="finale__address">
        {address.street}, {address.postalCode ? `${address.postalCode} ` : ''}
        {address.city}
      </address>
      <div className="finale__ctas">
        <a className="btn btn--solid" href={`/carta/${q}`}>
          {t.finale.menu}
        </a>
        <a className="btn btn--line" href={address.mapsUrl} target="_blank" rel="noreferrer">
          {t.finale.directions}
        </a>
      </div>
    </section>
  );
}

/** Reduced motion / no JS: the same journey as still frames in a calm vertical flow. */
export function TourStills() {
  const { lang } = useLang();
  const t = tour.copy[lang];
  const tl = useMemo(() => buildTimeline(tour, manifest), []);
  const lgAvif = manifest.variants.lg?.format === 'avif';
  const still = (frame, alt) => (
    <picture>
      {lgAvif ? <source type="image/avif" srcSet={`${frameUrl('lg', frame)} ${manifest.variants.lg.width}w`} sizes="100vw" /> : null}
      <img
        src={frameUrl('sm', frame)}
        width={manifest.variants.sm.width}
        height={manifest.variants.sm.height}
        alt={alt}
        loading="eager"
        decoding="async"
      />
    </picture>
  );
  return (
    <div className="stills">
      <figure className="still still--intro">
        {still(0, '', true)}
        <figcaption>
          <p className="cue__kicker">{t.intro.kicker}</p>
          <h1 className="intro__title">
            {t.intro.title[0]} <span>{t.intro.title[1]}</span>
          </h1>
          <p className="intro__line">{t.intro.line}</p>
        </figcaption>
      </figure>
      {tl.stops.map((s) => (
        <figure className="still" key={s.id}>
          {still(s.frame, `${t.stops[s.id].kicker}`)}
          <figcaption>
            <p className="cue__kicker">{t.stops[s.id].kicker}</p>
            <h2 className="cue__title">{t.stops[s.id].title}</h2>
            {t.stops[s.id].line ? <p className="cue__line">{t.stops[s.id].line}</p> : null}
          </figcaption>
        </figure>
      ))}
      <Finale t={t} id="final-still" />
    </div>
  );
}

export function Tour({ skipRef }) {
  const { lang } = useLang();
  const t = tour.copy[lang];
  const root = useRef(null);
  const tl = useMemo(() => buildTimeline(tour, manifest), []);
  const [ready, setReady] = useState(false);
  const [variant, setVariant] = useState(null);

  useEffect(() => {
    let alive = true;
    supportsAvif().then((avif) => alive && setVariant(pickVariant(avif)));
    return () => {
      alive = false;
    };
  }, []);

  const scrollToProgress = useCallback((p) => {
    const st = ScrollTrigger.getById('tour');
    if (!st) return;
    window.scrollTo({ top: Math.round(st.start + (st.end - st.start) * p), behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (skipRef) skipRef.current = () => scrollToProgress(1);
  }, [skipRef, scrollToProgress]);

  useGSAP(
    () => {
      if (!variant) return undefined;
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERY, () => {
        const el = root.current;
        const q = gsap.utils.selector(el);
        const canvas = q('canvas')[0];
        const cues = tl.stops.map((s) => q(`[data-cue="${s.id}"]`)[0]);
        const intro = q('.intro')[0];
        const finale = q('.finale')[0];
        const scrim = q('.scrim')[0];
        const bar = q('.progress__fill')[0];
        const ticks = q('.progress__tick');

        const v = manifest.variants[variant];
        const player = createTourPlayer(canvas, {
          count: tl.count,
          src: (i) => frameUrl(variant, i),
          width: v.width,
          height: v.height,
          focusAt: tl.focusAt,
          minVisible: tour.minVisible,
          bandAnchor: tour.bandAnchor,
          onFirstFrame: () => setReady(true),
          onLayout: ({ band, top, bottom }) => {
            el.dataset.band = band ? 'true' : 'false';
            el.style.setProperty('--band-top', `${top}px`);
            el.style.setProperty('--band-bottom', `${bottom}px`);
          },
        });

        let target = 0;
        let shown = 0;
        const setVis = (node, o) => {
          node.style.setProperty('--o', o.toFixed(3));
          node.style.visibility = o > 0.001 ? 'visible' : 'hidden';
        };

        const st = ScrollTrigger.create({
          id: 'tour',
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            target = tl.frameAt(self.progress);
          },
        });
        target = tl.frameAt(st.progress);
        shown = target;

        const tick = () => {
          const diff = target - shown;
          shown = Math.abs(diff) < 0.02 ? target : shown + diff * (1 - (1 - tour.smoothing) ** Math.min(4, gsap.ticker.deltaRatio()));
          player.setFrame(Math.min(shown, tl.last));
          setVis(intro, tl.introOpacity(shown));
          tl.stops.forEach((s, i) => setVis(cues[i], tl.stopOpacity(s, shown)));
          const fo = tl.finaleOpacity(shown);
          setVis(finale, fo);
          finale.inert = fo < 0.5;
          scrim.style.opacity = Math.max(tl.introOpacity(shown), fo).toFixed(3);
          const p = tl.progressAt(shown);
          bar.style.transform = `scaleX(${p.toFixed(4)})`;
          let active = -1;
          tl.stops.forEach((s, i) => {
            if (shown >= s.frame - 12) active = i;
          });
          ticks.forEach((b, i) => b.toggleAttribute('data-on', i <= active));
        };
        gsap.ticker.add(tick);
        tick();
        // Hook for automated tests (Playwright) — read-only.
        window.__tour = {
          frame: () => shown,
          target: () => target,
          scrollFor: (p) => st.start + (st.end - st.start) * p,
          stops: tl.stops.map((s) => ({ id: s.id, frame: s.frame, p: tl.progressAt(s.frame) })),
          finaleP: tl.progressAt(tl.finaleFrame),
          stats: player.stats,
          variant,
        };

        return () => {
          gsap.ticker.remove(tick);
          st.kill();
          player.destroy();
        };
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [variant, tl] },
  );


  return (
    <div className="tour" ref={root} style={{ '--len': tour.scrollLength }} data-ready={ready}>
      <div className="stage">
        <img className="stage__poster" src={frameUrl('sm', 0)} alt="" fetchPriority="high" />
        <canvas className="stage__canvas" role="img" aria-label={`${t.intro.title.join(' ')} ${t.intro.line}`} />
        <div className="scrim" aria-hidden="true" />

        <section className="intro" aria-labelledby="intro-title">
          <p className="cue__kicker">{t.intro.kicker}</p>
          <h1 className="intro__title" id="intro-title">
            {t.intro.title[0]} <span>{t.intro.title[1]}</span>
          </h1>
          <p className="intro__line">{t.intro.line}</p>
          <p className="intro__hint" aria-hidden="true">
            <span className="intro__hint-line" />
            {t.intro.hint}
          </p>
        </section>

        {tl.stops.map((s) => (
          <StopText key={s.id} stop={s} text={t.stops[s.id]} />
        ))}

        <Finale t={t} id="final" />

        <nav className="progress" aria-label={t.progress}>
          <span className="progress__track" aria-hidden="true">
            <span className="progress__fill" />
          </span>
          {tl.stops.map((s) => (
            <button
              key={s.id}
              type="button"
              className="progress__tick"
              style={{ left: `${(tl.progressAt(s.frame) * 100).toFixed(2)}%` }}
              aria-label={t.stops[s.id].kicker}
              onClick={() => scrollToProgress(tl.progressAt(s.frame))}
            >
              <span className="progress__label">{t.stops[s.id].kicker}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* All copy also lives here in plain HTML for screen readers and crawlers. */}
      <div className="sr-only">
        {tl.stops.map((s) => (
          <p key={s.id}>
            {t.stops[s.id].kicker}. {t.stops[s.id].title} {t.stops[s.id].line ?? ''}
          </p>
        ))}
      </div>
    </div>
  );
}
