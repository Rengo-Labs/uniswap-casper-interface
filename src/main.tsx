import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Home } from './components/pages/Home'
import { BrowserRouter, Routes, Route } from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="swap" element={<App />} />
        <Route path="liquidity" element={<App />} />
        <Route path="pools" element={<App />} />
        <Route path="tokens" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
