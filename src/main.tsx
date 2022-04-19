import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Home, Swap, Pools, Tokens, Liquidity } from './components/pages'
import { BigContext } from './contexts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BigContext>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="swap" element={<Swap />} />
          <Route path="liquidity" element={<Liquidity />} />
          <Route path="pools" element={<Pools />} />
          <Route path="tokens" element={<Tokens />} />
        </Routes>
      </BrowserRouter>
    </BigContext>
  </React.StrictMode>
)
