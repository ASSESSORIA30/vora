import { useEffect, useState } from 'react';
import { business } from '../content/site.js';
import { LANGS, useLang } from '../lib/i18n.js';

const LANG_LABEL = { ca: 'CAT', es: 'ES' };

export function Header({ onSkip, variant = 'tour' }) {
  const { lang, t, setLang } = useLang();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const q = lang === 'ca' ? '' : `?lang=${lang}`;
  const skip = onSkip
    ? (e) => {
        e.preventDefault();
        setOpen(false);
        onSkip();
      }
    : undefined;

  const links = (
    <>
      <a href={`/carta/${q}`}>{t.nav.carta}</a>
      <a href={business.address.mapsUrl} target="_blank" rel="noreferrer">
        {t.nav.directions}
      </a>
      {onSkip ? (
        <a href="#final" onClick={skip} className="hdr__skip">
          {t.nav.skip} <span aria-hidden="true">↓</span>
        </a>
      ) : null}
    </>
  );

  return (
    <header className={`hdr hdr--${variant}`}>
      <a className="skip-link" href="#contingut">
        {t.nav.skipToContent}
      </a>
      <a className="hdr__brand" href={`/${q}`} aria-label={t.nav.home}>
        <span className="hdr__name">Frankfurt</span>
        <span className="hdr__name hdr__name--sub">Almirall</span>
      </a>

      <nav className="hdr__nav" aria-label="Principal">
        {links}
      </nav>

      <div className="hdr__lang" role="group" aria-label={t.nav.langLabel}>
        {LANGS.map((l) => (
          <button key={l} type="button" aria-pressed={l === lang} onClick={() => setLang(l)}>
            {LANG_LABEL[l]}
          </button>
        ))}
      </div>

      <button type="button" className="hdr__toggle" aria-expanded={open} aria-controls="hdr-sheet" onClick={() => setOpen((v) => !v)}>
        <span className="sr-only">Menú</span>
        <span aria-hidden="true" className="hdr__toggle-bars" />
      </button>

      <nav id="hdr-sheet" className="hdr__sheet" hidden={!open} aria-label="Menú">
        {links}
      </nav>
    </header>
  );
}
