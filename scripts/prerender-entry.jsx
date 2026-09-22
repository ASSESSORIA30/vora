import { renderToStaticMarkup } from 'react-dom/server'
import { HomePage, NotFound } from '../src/App.jsx'
import ModelPage from '../src/pages/ModelPage.jsx'
import SearchLanding from '../src/pages/SearchLanding.jsx'
import LegalPage from '../src/pages/LegalPage.jsx'
import GuidePage, { GuideIndexPage } from '../src/pages/GuidePage.jsx'

export function renderHome() {
  return renderToStaticMarkup(<HomePage/>)
}

export function renderModel(model) {
  return renderToStaticMarkup(<ModelPage model={model}/>)
}

export function renderLanding(slug) {
  return renderToStaticMarkup(<SearchLanding slug={slug}/>)
}

export function renderLegal(type) {
  return renderToStaticMarkup(<LegalPage type={type}/>)
}

export function renderGuideIndex() {
  return renderToStaticMarkup(<GuideIndexPage/>)
}

export function renderGuide(slug) {
  return renderToStaticMarkup(<GuidePage slug={slug}/>)
}

export function renderNotFound() {
  return renderToStaticMarkup(<NotFound/>)
}
