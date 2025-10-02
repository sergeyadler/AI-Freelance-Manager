import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { AuthenticatedApp } from './components/AuthenticatedApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  </StrictMode>,
)
