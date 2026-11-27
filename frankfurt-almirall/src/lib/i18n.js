import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { copy } from '../content/site.js';

const LANGS = ['ca', 'es'];
const STORAGE_KEY = 'fa-lang';

function initialLang() {
  if (typeof window === 'undefined') return 'ca';
  const param = new URLSearchParams(window.location.search).get('lang');
  if (LANGS.includes(param)) return param;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (LANGS.includes(saved)) return saved;
  } catch {
    /* storage unavailable */
  }
  return 'ca';
}

export const LangContext = createContext({ lang: 'ca', t: copy.ca, setLang: () => {} });

export function useLangState(metaKey = 'meta') {
  const [lang, setLangRaw] = useState(initialLang);
  const t = copy[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    const meta = metaKey === 'menuPage' ? t.menuPage : t.meta;
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
  }, [lang, t, metaKey]);

  const setLang = useCallback((next) => {
    if (!LANGS.includes(next)) return;
    setLangRaw(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    const url = new URL(window.location.href);
    if (next === 'ca') url.searchParams.delete('lang');
    else url.searchParams.set('lang', next);
    window.history.replaceState(null, '', url);
  }, []);

  return { lang, t, setLang };
}

export const useLang = () => useContext(LangContext);
export { LANGS };
