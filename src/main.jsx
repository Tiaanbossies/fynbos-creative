import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
/**
 * Stylesheet order is load-bearing and must stay above the App import.
 *
 * Component CSS is pulled in transitively by App, so importing App first put
 * every component stylesheet AHEAD of base.css in the bundle — meaning any
 * component rule that merely tied base.css on specificity silently lost to
 * it. Base layer first, components after, so components can override.
 */
import './styles/tokens.css'
import './styles/base.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
