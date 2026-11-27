import { useEffect, useState } from 'react';
import { LANGS, useLang } from '../lib/i18n.js';
import { Star } from './Ornaments.jsx';

export function Wordmark({ compact = false }) {
  return (
    <span className={`wordmark ${compact ? 'wordmark--compact' : ''}`}>
      <span className="wordmark__top">Frankfurt</span>
      <span className="wordmark__bottom">Almirall</span>
    </span>
  );
}

export function Header({ base = '' }) {
  const { lang, t, setLang } = useLang();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    document.body.classList.add('menu-open');
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('menu-open');
    };
  }, [open]);

  const q = lang === 'ca' ? '' : `?lang=${lang}`;
  const links = [
    { href: `/carta/${q}`, label: t.nav.carta },
    { href: `${base}${q}#el-local`, label: t.nav.local },
    { href: `${base}${q}#vine`, label: t.nav.visit },
  ];

  return (
    <header className="site-header">
      <a className="skip-link" href="#contingut">
        {t.nav.skipToContent}
      </a>
      <div className="lightbox">
        <a className="lightbox__brand" href={`/${q}`} aria-label="Frankfurt Almirall — inici">
          <Star className="lightbox__star" />
          <Wordmark compact />
        </a>

        <nav className="site-nav" aria-label="Principal">
          <ul>
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lang" role="group" aria-label={t.nav.langLabel}>
          {LANGS.map((l) => (
            <button key={l} type="button" aria-pressed={l === lang} onClick={() => setLang(l)}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? t.nav.menuClose : t.nav.menuOpen}</span>
          <span className="menu-toggle__bars" aria-hidden="true" />
        </button>
      </div>

      <div id="mobile-menu" className="mobile-menu" data-open={open} hidden={!open}>
        <ul>
          {links.map((l, i) => (
            <li key={l.href} style={{ '--i': i }}>
              <a href={l.href} onClick={() => setOpen(false)}>
                <span className="mobile-menu__n">0{i + 1}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
