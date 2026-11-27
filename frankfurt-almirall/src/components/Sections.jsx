import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { business, isPrototype, media } from '../content/site.js';
import { useLang } from '../lib/i18n.js';
import { DishArt } from './Dish.jsx';
import { Badge, FloorBand, Star, Trim, WallBand } from './Ornaments.jsx';
import { Wordmark } from './Header.jsx';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Gentle reveal for editorial sections; skipped entirely for reduced motion. */
function useReveal(scope) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray('[data-reveal]', scope.current).forEach((el) => {
          gsap.from(el, {
            y: 48,
            autoAlpha: 0,
            duration: 1.1,
            ease: 'power3.out',
            delay: Number(el.dataset.reveal) || 0,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          });
        });
        gsap.utils.toArray('[data-parallax]', scope.current).forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: -Number(el.dataset.parallax) },
            {
              yPercent: Number(el.dataset.parallax),
              ease: 'none',
              scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope },
  );
}

export function MobileChapters() {
  const { t } = useLang();
  // Rendered for small screens and reduced motion: a normal vertical flow.
  return (
    <section className="chapters-flow" aria-label={t.carta.kicker}>
      {t.chapters.map((c) => (
        <article key={c.id} className="flow-chapter" data-chapter={c.id}>
          <div className="flow-chapter__dish" data-reveal>
            <DishArt id={c.id} />
          </div>
          <div className="flow-chapter__text" data-reveal="0.1">
            <p className="poster__station">
              <span className="poster__num">Nº {c.number}</span>
              <span>{c.station}</span>
            </p>
            <h2 className="poster__title">
              <span className="poster__l1">{c.title[0]}</span> <em className="poster__l2">{c.title[1]}</em>
            </h2>
            <p className="poster__line">{c.line}</p>
            <p className="poster__body">{c.body}</p>
          </div>
        </article>
      ))}
      <div className="flow-finale">
        <h2 className="finale-title">
          <span>{t.finale.title[0]}</span> <em>{t.finale.title[1]}</em>
        </h2>
        <p className="finale-line">{t.finale.line}</p>
      </div>
    </section>
  );
}

export function Carta() {
  const { t, lang } = useLang();
  const root = useRef(null);
  useReveal(root);
  const q = lang === 'ca' ? '' : `?lang=${lang}`;

  return (
    <section className="carta" id="carta" ref={root} aria-labelledby="carta-title">
      <Trim />
      <div className="carta__inner">
        <header className="carta__head">
          <p className="kicker kicker--light" data-reveal>
            <Star className="kicker__star" /> {t.carta.kicker}
          </p>
          <h2 className="section-title section-title--light" id="carta-title" data-reveal="0.05">
            {t.carta.title}
          </h2>
          <p className="carta__intro" data-reveal="0.1">
            {t.carta.intro}
          </p>
        </header>

        <ol className="board">
          {t.carta.categories.map((c, i) => (
            <li key={c.id} className="board__row" data-reveal={i * 0.06}>
              <span className="board__n">0{i + 1}</span>
              <span className="board__name">{c.name}</span>
              <span className="board__leader" aria-hidden="true" />
              <span className="board__note">{c.note}</span>
              <span className="board__art" aria-hidden="true">
                <DishArt id={c.id} />
              </span>
            </li>
          ))}
        </ol>

        <div className="carta__foot" data-reveal>
          {!business.showPrices ? <p className="carta__pending">{t.carta.pricesPending}</p> : null}
          <a className="btn btn--cream" href={`/carta/${q}`}>
            {t.carta.full} →
          </a>
        </div>
      </div>
    </section>
  );
}

const DETAIL_CROPS = {
  floor: '55% 96%',
  counter: '22% 72%',
  light: '50% 12%',
};

export function Local() {
  const { t } = useLang();
  const root = useRef(null);
  useReveal(root);
  const { base, widths } = media.poster;
  const set = (ext) => widths.map((w) => `${base}-${w}.${ext} ${w}w`).join(', ');

  return (
    <section className="local" id="el-local" ref={root} aria-labelledby="local-title">
      <WallBand className="local__tiles" />
      <Trim />
      <div className="local__inner">
        <div className="local__grid">
          <figure className="local__photo" data-reveal>
            <div className="local__photo-frame">
              <picture data-parallax="6">
                <source type="image/avif" srcSet={set('avif')} sizes="(min-width: 900px) 58vw, 100vw" />
                <source type="image/webp" srcSet={set('webp')} sizes="(min-width: 900px) 58vw, 100vw" />
                <img src={`${base}-1080.jpg`} alt={t.local.photoAlt} width="1448" height="1086" loading="lazy" decoding="async" />
              </picture>
            </div>
          </figure>

          <div className="local__text">
            <p className="kicker" data-reveal>
              <Star className="kicker__star" /> {t.local.kicker}
            </p>
            <h2 className="section-title" id="local-title" data-reveal="0.05">
              <span>{t.local.title[0]}</span> <em>{t.local.title[1]}</em>
            </h2>
            {t.local.body.map((p, i) => (
              <p className="local__body" key={i} data-reveal={0.1 + i * 0.05}>
                {p}
              </p>
            ))}
          </div>
        </div>

        <ul className="details">
          {t.local.details.map((d, i) => (
            <li key={d.id} className="detail" data-reveal={i * 0.08}>
              <div className="detail__crop">
                <img
                  src={`${base}-1080.webp`}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: DETAIL_CROPS[d.id], transformOrigin: DETAIL_CROPS[d.id] }}
                />
              </div>
              <p className="detail__n">0{i + 1}</p>
              <h3 className="detail__title">{d.title}</h3>
              <p className="detail__caption">{d.caption}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Visit() {
  const { t, lang } = useLang();
  const root = useRef(null);
  useReveal(root);
  const { address, hours, phone } = business;
  const hasInfo = Boolean(address || hours || phone);

  return (
    <section className="visit" id="vine" ref={root} aria-labelledby="visit-title">
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} className="marquee__group">
              {Array.from({ length: 4 }).map((__, i) => (
                <span key={i}>
                  {t.footer.tagline} <Star className="marquee__star" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <div className="visit__inner">
        <Badge className="visit__badge" text={`${t.footer.tagline} · `} />
        <p className="kicker kicker--light" data-reveal>
          <Star className="kicker__star" /> {t.visit.kicker}
        </p>
        <h2 className="visit__title" id="visit-title" data-reveal="0.05">
          <span>{t.visit.title[0]}</span> <em>{t.visit.title[1]}</em>
        </h2>

        {hasInfo ? (
          <dl className="visit__info" data-reveal="0.1">
            {address ? (
              <div>
                <dt>{t.visit.addressLabel}</dt>
                <dd>
                  {address.street}
                  <br />
                  {address.postalCode} {address.city}
                </dd>
              </div>
            ) : null}
            {hours ? (
              <div>
                <dt>{t.visit.hoursLabel}</dt>
                <dd>
                  {hours.map((h) => (
                    <span key={h.time + h.days.ca} className="visit__hours">
                      {h.days[lang]} · {h.time}
                    </span>
                  ))}
                </dd>
              </div>
            ) : null}
            {phone ? (
              <div>
                <dt>{t.visit.phoneLabel}</dt>
                <dd>
                  <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
                </dd>
              </div>
            ) : null}
          </dl>
        ) : (
          <p className="visit__pending" data-reveal="0.1">
            {t.visit.pending}
          </p>
        )}

        {address?.mapsUrl ? (
          <div className="cta-row" data-reveal="0.15">
            <a className="btn btn--cream" href={address.mapsUrl} target="_blank" rel="noreferrer">
              {t.visit.directions} →
            </a>
          </div>
        ) : null}
      </div>
      <FloorBand className="visit__floor" />
    </section>
  );
}

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <Wordmark />
        <p className="site-footer__tagline">{t.footer.tagline}</p>
        <div className="site-footer__meta">
          {business.nameIsProvisional ? <p>{t.footer.provisional}</p> : null}
          {isPrototype ? <p className="badge">{t.footer.prototype}</p> : null}
          <a href="#top">{t.footer.top} ↑</a>
        </div>
      </div>
    </footer>
  );
}
