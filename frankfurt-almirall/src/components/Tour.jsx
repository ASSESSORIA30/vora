import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
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
  // The opening of the frame is at most the screen width; the video covers it.
  const { innerWidth: w, innerHeight: h } = window;
  const opening = Math.min(w * 0.96, h * 1.78);
  const drawn = Math.max(opening, (opening / Math.min(1.78, Math.max(1, w / h))) * manifest.aspect);
  const need = drawn * Math.min(window.devicePixelRatio || 1, 2);
  return need >= tour.output.largeFrom ? 'lg' : 'sm';
}

function StopText({ stop, text }) {
  return (
    <section
      className="cue"
      data-place={stop.place}
      data-tone={stop.tone}
      data-cue={stop.id}
      aria-hidden="true"
      style={stop.width ? { '--cue-w': `${stop.width * 100}cqw` } : undefined}
    >
      <h2 className="cue__name">{text.kicker}</h2>
      <p className="cue__title">{text.title}</p>
      {text.line ? <p className="cue__line">{text.line}</p> : null}
    </section>
  );
}

/** Small brass rosette for the frame corners. */
function Corner({ pos }) {
  return (
    <svg className={`frame__corner frame__corner--${pos}`} viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <radialGradient id={`brass-${pos}`} cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#f6dc9c" />
          <stop offset=".45" stopColor="#c59a4e" />
          <stop offset="1" stopColor="#6b4a1f" />
        </radialGradient>
      </defs>
      <g fill={`url(#brass-${pos})`} stroke="#3a2610" strokeWidth=".8">
        <path d="M20 3c3.2 4.6 3.2 8.6 0 12-3.2-3.4-3.2-7.4 0-12zM20 37c3.2-4.6 3.2-8.6 0-12-3.2 3.4-3.2 7.4 0 12zM3 20c4.6-3.2 8.6-3.2 12 0-3.4 3.2-7.4 3.2-12 0zM37 20c-4.6-3.2-8.6-3.2-12 0 3.4 3.2 7.4 3.2 12 0z" />
        <path d="M8 8c4.8 1 7.2 3.4 7.6 7.6C11.4 15.2 9 12.8 8 8zM32 8c-1 4.8-3.4 7.2-7.6 7.6.4-4.2 2.8-6.6 7.6-7.6zM8 32c1-4.8 3.4-7.2 7.6-7.6-.4 4.2-2.8 6.6-7.6 7.6zM32 32c-4.8-1-7.2-3.4-7.6-7.6 4.2.4 6.6 2.8 7.6 7.6z" opacity=".85" />
        <circle cx="20" cy="20" r="4.6" />
      </g>
      <circle cx="18.6" cy="18.6" r="1.4" fill="#fff4d6" opacity=".8" />
    </svg>
  );
}

/**
 * Picture-frame geometry: the opening takes the largest possible area of the
 * screen. Its shape follows the screen but never crops the 4:3 video by more
 * than 25 % per axis (aspect 1.0–1.78). On portrait screens the opening is
 * square and the copy sits on the wall below it.
 */
function layoutFrame(stage) {
  const vw = stage.clientWidth;
  const vh = stage.clientHeight;
  const hdr = parseFloat(getComputedStyle(stage).getPropertyValue('--hdr')) || 64;
  const portrait = vw / vh < 0.9;
  const mould = portrait ? 12 : Math.round(Math.min(34, Math.max(20, vw * 0.02)));
  const cove = portrait ? 3 : 6;
  const brass = portrait ? 2 : 3;
  const chrome = mould + cove + brass;
  const side = portrait ? 10 : Math.round(Math.min(44, Math.max(14, vw * 0.024)));
  const top = hdr + (portrait ? 6 : Math.round(Math.min(18, vw * 0.012)));
  const bottom = portrait ? 0 : 44;
  const aw = vw - 2 * side - 2 * chrome;
  const ah = vh - top - bottom - 2 * chrome;
  let ow;
  let oh;
  if (portrait) {
    ow = aw;
    oh = Math.min(aw, Math.max(220, vh - top - 2 * chrome - 300));
  } else {
    const aspect = Math.min(1.78, Math.max(1, aw / ah));
    ow = Math.min(aw, ah * aspect);
    oh = ow / aspect;
  }
  ow = Math.round(ow);
  oh = Math.round(oh);
  const ox = Math.round((vw - ow) / 2);
  const oy = portrait ? top + chrome : Math.round(top + chrome + (ah - oh) / 2);
  stage.dataset.layout = portrait ? 'portrait' : 'landscape';
  const set = (k, v) => stage.style.setProperty(k, `${v}px`);
  set('--ox', ox);
  set('--oy', oy);
  set('--ow', ow);
  set('--oh', oh);
  set('--mould', mould);
  set('--cove', cove);
  set('--brass', brass);
  set('--chrome', chrome);
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
          <p className="intro__kicker">{t.intro.kicker}</p>
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
            <h2 className="cue__name">{t.stops[s.id].kicker}</h2>
            <p className="cue__title">{t.stops[s.id].title}</p>
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

  // Frame geometry follows the stage size (also before any frame is loaded).
  useLayoutEffect(() => {
    const stage = root.current?.querySelector('.stage');
    if (!stage) return undefined;
    const ro = new ResizeObserver(() => layoutFrame(stage));
    ro.observe(stage);
    layoutFrame(stage);
    return () => ro.disconnect();
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
          onFirstFrame: () => setReady(true),
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
        <div className="frame" aria-hidden="true">
          <span className="frame__side frame__side--top" />
          <span className="frame__side frame__side--bottom" />
          <span className="frame__side frame__side--left" />
          <span className="frame__side frame__side--right" />
          <span className="frame__cove" />
          <span className="frame__brass" />
          {['tl', 'tr', 'bl', 'br'].map((c) => (
            <Corner key={c} pos={c} />
          ))}
        </div>

        <div className="opening">
          <img className="stage__poster" src={frameUrl('sm', 0)} alt="" fetchPriority="high" />
          <canvas className="stage__canvas" role="img" aria-label={`${t.intro.title.join(' ')} ${t.intro.line}`} />
          <div className="opening__depth" aria-hidden="true" />
          <div className="scrim" aria-hidden="true" />

          <section className="intro" aria-labelledby="intro-title">
            <p className="intro__kicker">{t.intro.kicker}</p>
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
        </div>

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
