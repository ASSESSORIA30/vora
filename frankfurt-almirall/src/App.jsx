import { LangContext, useLangState } from './lib/i18n.js';
import { Header } from './components/Header.jsx';
import { Walk } from './components/Walk.jsx';
import { Carta, Footer, Local, MobileChapters, Visit } from './components/Sections.jsx';

export default function App() {
  const lang = useLangState('meta');
  return (
    <LangContext.Provider value={lang}>
      <div id="top" />
      <Header />
      <main id="contingut">
        <Walk />
        <MobileChapters />
        <Carta />
        <Local />
        <Visit />
      </main>
      <Footer />
    </LangContext.Provider>
  );
}
