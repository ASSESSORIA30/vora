import { business, isPrototype } from '../content/site.js';
import { useLang } from '../lib/i18n.js';

export function Footer() {
  const { t } = useLang();
  const { address } = business;
  return (
    <footer className="ftr">
      <p className="ftr__name">Frankfurt Almirall</p>
      <p className="ftr__tagline">{t.footer.tagline}</p>
      <address className="ftr__address">
        <a href={address.mapsUrl} target="_blank" rel="noreferrer">
          {address.street}, {address.city}
        </a>
      </address>
      {isPrototype ? <p className="ftr__badge">{t.footer.prototype}</p> : null}
    </footer>
  );
}
