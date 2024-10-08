import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Dapp from './Dapp.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Dapp />
  </StrictMode>,
)
