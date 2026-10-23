import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import '@fontsource-variable/inter-tight'
import '@fontsource-variable/jetbrains-mono'
import './styles.css'
import './anim-gate.css'
import App from './App.jsx'

const app = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
const root = document.getElementById('root')
// Pages are pre-rendered at build time: hydrate when markup exists, otherwise (dev server) render fresh.
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
