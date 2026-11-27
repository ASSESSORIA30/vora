import { useRef, useSyncExternalStore } from 'react';
import { LangContext, useLangState } from './lib/i18n.js';
import { Header } from './components/Header.jsx';
import { MOTION_QUERY, Tour, TourStills } from './components/Tour.jsx';

const subscribe = (cb) => {
  const mq = window.matchMedia(MOTION_QUERY);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};
const getMotion = () => window.matchMedia(MOTION_QUERY).matches;

export default function App() {
  const lang = useLangState('meta');
  const motion = useSyncExternalStore(subscribe, getMotion, () => true);
  const skipRef = useRef(null);
  const skip = () => {
    if (skipRef.current) skipRef.current();
    else document.getElementById('final-still')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <LangContext.Provider value={lang}>
      <Header onSkip={skip} />
      <main id="contingut">{motion ? <Tour skipRef={skipRef} /> : <TourStills />}</main>
    </LangContext.Provider>
  );
}
