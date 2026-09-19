import { useEffect, useState } from 'react'
import SmoothScroll from './components/SmoothScroll'
import Preloader from './components/Preloader'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import About from './components/About'
import Models from './components/Models'
import Process from './components/Process'
import Benefits from './components/Benefits'
import Gallery from './components/Gallery'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'

function App() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Lock scroll during preloader
    if (!loaded) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [loaded])

  return (
    <>
      <Preloader onComplete={() => setLoaded(true)} />
      <CustomCursor />
      {loaded && (
        <SmoothScroll>
          <Navbar />
          <main>
            <Hero />
            <Marquee />
            <About />
            <Models />
            <Process />
            <Benefits />
            <Gallery />
            <Contact />
          </main>
          <Footer />
        </SmoothScroll>
      )}
    </>
  )
}

export default App
