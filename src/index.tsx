import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "@fontsource/epilogue";
import { Swap, Liquidity, Pools, Tokens, Balance } from './components/pages'
import { Home as HomeOld, Swap as SwapOld, Pools as PoolOld, Tokens as TokensOld } from './components/old/pages'
import { NewLiquidity } from './components/old/pages/Liquidity';
import { BigContext } from './contexts';
import { Account } from './components/pages/Account';
const root = ReactDOM.createRoot(
  document.getElementById('root')
);

root.render(
  <React.StrictMode>
    <BigContext>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/" element={<Navigate to="/swap" replace/>} />
          <Route path="swap" element={<Swap />} />
          <Route path="liquidity" element={<Liquidity />} />
          <Route path="pools" element={<Pools />} />
          <Route path="tokens" element={<Tokens />} />
          <Route path="balance" element={<Balance />} />
          <Route path="account" element={<Account />} />
          {/* old pages */}
          <Route path="/old" element={<Navigate to="/old/swap" replace/>} />
          <Route path="/old/swap" element={<SwapOld />} />
          <Route path="/old/liquidity" element={<NewLiquidity />} />
          <Route path="/old/pools" element={<PoolOld />} />
          <Route path="/old/tokens" element={<TokensOld />} />
        </Routes>
      </BrowserRouter>
    </BigContext>
  </React.StrictMode>
)
