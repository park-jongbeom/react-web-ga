import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import ToastContainer from './components/ui/ToastContainer'
import { ToastProvider } from './context/ToastContext'
import App from './App.tsx'

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <ToastProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <ToastContainer />
    </ToastProvider>
  </StrictMode>,
)
