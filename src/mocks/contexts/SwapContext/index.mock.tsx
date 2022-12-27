import '@testing-library/jest-dom'
import React, {ReactNode} from "react";
import {ConfigProviderContext} from "../../../contexts/ConfigContext";

jest.mock("../../../commons/wallet/types", () => {
  return { Network: {CASPER_TESTNET: ""}, WalletName: {CASPER_SIGNER : ""} }
})
jest.mock("axios", () => {})
jest.mock("@toruslabs/casper-embed", () => {})
jest.mock('../../../commons/wallet/Client')
jest.mock("../../../commons/utils/index")
jest.mock("../../../commons/deploys/swap", () => {
  return {signAndDeploySwap: (apiClient, casperClient, wallet, deadline,
                              amountADesired, amountBDesired, tokenA, tokenB,
                              slippage, mainPurse, gasFee) => {
      return ["hash liquidity", {} as any]
    }
  }
})
jest.mock("../../../commons/calculations/swapDetails", () => {
  return {calculateSwapDetails: (apiClient, tokenA, tokenB, inputValue, token, slippage, fee) => {
      return {
        tokensToTransfer: '400',
        exchangeRateA: 20,
        exchangeRateB: 10,
        firstReserve: 1000,
        secondReserve: 2000
      }
    }
  }
})

export const TestContext = ({ children }: { children: ReactNode }) => {

  const refreshAll = () => {}
  const setConfirmModal = (v) => {}
  const setProgressModal = (v) => {}
  const setLinkExplorer = (v) => {}

  return (
    <ConfigProviderContext.Provider value={{
      firstTokenSelected: {} as any,
      secondTokenSelected: {} as any,
      configState: {wallet: {} as any, mainPurse: "mainPurse"},
      setLinkExplorer,
      setProgressModal,
      setConfirmModal,
      refreshAll
    } as any}>
      {children}
    </ConfigProviderContext.Provider>
  )
}