import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import GlobalStyles from './styles/GlobalStyles'
import { BillStateProvider } from './context/BillStateProvider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BillStateProvider>
      <GlobalStyles />
      <App />
    </BillStateProvider>
  </React.StrictMode>
)
