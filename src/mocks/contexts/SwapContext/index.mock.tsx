import '@testing-library/jest-dom'
import React, {ReactNode} from "react";
import {ConfigProviderContext} from "../../../contexts/ConfigContext";
import {TokensProviderContext} from "../../../contexts/TokensContext";
import {StateHashProviderContext} from "../../../contexts/StateHashContext";
import {WalletProviderContext} from "../../../contexts/WalletContext";
import {jest} from "@jest/globals";
import {PairsContextProvider} from "../../../contexts/PairsContext";

jest.mock("../../../commons/wallet/types", () => {
  return { Network: {CASPER_TESTNET: ""}, WalletName: {CASPER_SIGNER : ""} }
})
jest.mock("axios", () => {})
jest.mock('../../../store/store', () => {
  return {
    notificationStore: () => {
      return {
        updateNotification: () => {

        },
        dismissNotification: () => {

        }
      }
    }
  }
})
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

  const setConfirmModal = (v) => {}
  const setProgressModal = (v) => {}
  const setLinkExplorer = (v) => {}

  return (
    <ConfigProviderContext.Provider value={{
      setLinkExplorer,
      setProgressModal,
      setConfirmModal
    } as any}>
      {children}
    </ConfigProviderContext.Provider>
  )
}


export const TokenContextMock = ({ children }: { children: ReactNode }) => {

  return (
    <TokensProviderContext.Provider value={{
      firstTokenSelected: {} as any,
      secondTokenSelected: {} as any,
    } as any}>
      {children}
    </TokensProviderContext.Provider>
  )
}

export const PairContextMock = ({ children }: { children: ReactNode }) => {

  const findReservesBySymbols = (tokenASymbol: string,
                                 tokenBSymbol: string,
                                 overrideReserves) => {
    return {
      reserve0: 0,
      reserve1: 1
    }
  }

  return (
    <PairsContextProvider.Provider value={{
      findReservesBySymbols
    } as any}>
      {children}
    </PairsContextProvider.Provider>
  )
}

export const StateHashContextMock = ({ children }: { children: ReactNode }) => {

  return (
    <StateHashProviderContext.Provider value={{
      refresh: () => Promise<void>
    } as any}>
      {children}
    </StateHashProviderContext.Provider>
  )
}

export const WalletContextMock = ({ children }: { children: ReactNode }) => {

  return (
    <WalletProviderContext.Provider value={{
      walletState: {wallet: {} as any, mainPurse: "mainPurse"},
    } as any}>
      {children}
    </WalletProviderContext.Provider>
  )
}