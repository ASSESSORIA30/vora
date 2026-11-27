import { LangContext, useLangState } from './lib/i18n.js';
import { business, menuItems } from './content/site.js';
import { Header } from './components/Header.jsx';
import { Footer } from './components/Sections.jsx';
import { DishArt } from './components/Dish.jsx';
import { Star, Trim } from './components/Ornaments.jsx';

const fmt = (n, lang) => new Intl.NumberFormat(lang === 'ca' ? 'ca-ES' : 'es-ES', { style: 'currency', currency: 'EUR' }).format(n);

export default function MenuPage() {
  const state = useLangState('menuPage');
  const { t, lang } = state;
  const q = lang === 'ca' ? '' : `?lang=${lang}`;

  return (
    <LangContext.Provider value={state}>
      <div id="top" />
      <Header base="/" />
      <main id="contingut" className="menu-page">
        <header className="menu-page__head">
          <p className="kicker kicker--light">
            <Star className="kicker__star" /> {business.name}
          </p>
          <h1 className="menu-page__title">{t.menuPage.heading}</h1>
          <p className="menu-page__lead">{t.menuPage.lead}</p>
        </header>
        <Trim />
        <div className="menu-page__list">
          {t.carta.categories.map((c, i) => {
            const items = menuItems[c.id] ?? [];
            return (
              <section key={c.id} className="menu-cat" aria-labelledby={`cat-${c.id}`}>
                <div className="menu-cat__art" aria-hidden="true">
                  <DishArt id={c.id} />
                </div>
                <div>
                  <p className="menu-cat__n">0{i + 1}</p>
                  <h2 className="menu-cat__name" id={`cat-${c.id}`}>
                    {c.name}
                  </h2>
                  <p className="menu-cat__note">{c.note}</p>
                  {items.length ? (
                    <ul className="menu-cat__items">
                      {items.map((it) => (
                        <li key={it.name.ca}>
                          <span>{it.name[lang]}</span>
                          <span className="board__leader" aria-hidden="true" />
                          {business.showPrices && it.price != null ? <span>{fmt(it.price, lang)}</span> : null}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </section>
            );
          })}
        </div>
        <p className="menu-page__allergens">{t.menuPage.allergens}</p>
        <p className="menu-page__back">
          <a className="btn btn--cream" href={`/${q}`}>
            ← {t.menuPage.back}
          </a>
        </p>
      </main>
      <Footer />
    </LangContext.Provider>
  );
}
