import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@fontsource/epilogue";
import { Home, Swap, Pools, Tokens } from './components/pages'
import { NewLiquidity } from './components/pages/Liquidity';
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
          <Route path="pools" element={<Pools />} />
          <Route path="tokens" element={<Tokens />} />
        </Routes>
      </BrowserRouter>
    </BigContext>
  </React.StrictMode>
)
