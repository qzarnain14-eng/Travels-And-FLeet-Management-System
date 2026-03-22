import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { FleetProvider } from './context/FleetContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <FleetProvider>
      <App />
    </FleetProvider>
  </BrowserRouter>



)
