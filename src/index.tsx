import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Home, Swap, Pools, Tokens, Add } from './components/pages'
import { NewLiquidity } from './components/pages/NewLiquidity';
import { BigContext } from './contexts';
const root = ReactDOM.createRoot(
  document.getElementById('root')
);

root.render(
  <React.StrictMode>
    <BigContext>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="swap" element={<Swap />} />
          <Route path="liquidity" element={<NewLiquidity />} />
          <Route path="liquidity/add" element={<Add />} />
          <Route path="pools" element={<Pools />} />
          <Route path="tokens" element={<Tokens />} />
        </Routes>
      </BrowserRouter>
    </BigContext>
  </React.StrictMode>
)
