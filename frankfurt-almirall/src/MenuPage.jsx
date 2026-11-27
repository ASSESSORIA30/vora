import { LangContext, useLangState } from './lib/i18n.js';
import { business, menuItems } from './content/site.js';
import { tour } from './content/tour.config.js';
import manifest from './content/tour.manifest.json';
import { buildTimeline } from './lib/tourTimeline.js';
import { Header } from './components/Header.jsx';
import { Footer } from './components/Footer.jsx';

const fmt = (n, lang) => new Intl.NumberFormat(lang === 'ca' ? 'ca-ES' : 'es-ES', { style: 'currency', currency: 'EUR' }).format(n);
const timeline = buildTimeline(tour, manifest);
const frameSrc = (variant, frame) => manifest.variants[variant].path.replace('{i}', String(frame).padStart(4, '0'));

export default function MenuPage() {
  const state = useLangState('menuPage');
  const { t, lang } = state;
  const q = lang === 'ca' ? '' : `?lang=${lang}`;

  return (
    <LangContext.Provider value={state}>
      <Header variant="page" />
      <main id="contingut" className="menu">
        <header className="menu__head">
          <p className="menu__kicker">Frankfurt Almirall · {business.address.city}</p>
          <h1 className="menu__title">{t.menuPage.heading}</h1>
          <p className="menu__lead">{t.menuPage.lead}</p>
        </header>

        <ol className="menu__list">
          {t.carta.categories.map((c, i) => {
            const stop = timeline.stops.find((s) => s.id === c.id);
            const items = menuItems[c.id] ?? [];
            return (
              <li key={c.id} className="dish">
                {stop ? (
                  <div className="dish__photo">
                    <img
                      src={frameSrc('sm', stop.frame)}
                      alt=""
                      width={manifest.variants.sm.width}
                      height={manifest.variants.sm.height}
                      loading={i < 2 ? 'eager' : 'lazy'}
                      decoding="async"
                      style={{ objectPosition: `${stop.focus[0] * 100}% ${stop.focus[1] * 100}%` }}
                    />
                  </div>
                ) : null}
                <div className="dish__text">
                  <p className="dish__n">0{i + 1}</p>
                  <h2 className="dish__name">{c.name}</h2>
                  <p className="dish__note">{c.note}</p>
                  {items.length ? (
                    <ul className="dish__items">
                      {items.map((it) => (
                        <li key={it.name.ca}>
                          <span>{it.name[lang]}</span>
                          <span className="dish__leader" aria-hidden="true" />
                          {business.showPrices && it.price != null ? <span>{fmt(it.price, lang)}</span> : null}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>

        <div className="menu__foot">
          <p className="menu__pending">{business.showPrices ? t.menuPage.allergens : t.carta.pricesPending}</p>
          <a className="btn btn--solid" href={`/${q}`}>
            ← {t.menuPage.back}
          </a>
        </div>
      </main>
      <Footer />
    </LangContext.Provider>
  );
}
