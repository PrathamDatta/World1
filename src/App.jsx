import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'

import About from './pages/About.jsx'
import Services from './pages/Services.jsx'
import Industries from './pages/Industries.jsx'
import Industry from './pages/Industry.jsx'
import CaseStudies from './pages/CaseStudies.jsx'
import CaseStudy from './pages/CaseStudy.jsx'
import Insights from './pages/Insights.jsx'
import Post from './pages/Post.jsx'
import Careers from './pages/Careers.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'

function ScrollReset() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <ScrollReset />
      <Nav />
      <main id="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/industries" element={<Industries />} />
            <Route path="/industries/:slug" element={<Industry />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/case-studies/:slug" element={<CaseStudy />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/insights/:slug" element={<Post />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
      </main>
      <Footer />
    </>
  )
}
