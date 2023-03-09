import React, {ReactNode} from "react"
import {ConfigProviderContext} from "../../../contexts/ConfigContext"
import {TokensProviderContext} from "../../../contexts/TokensContext"
import {StateHashProviderContext} from "../../../contexts/StateHashContext";
import {WalletProviderContext} from "../../../contexts/WalletContext";
import {PairsContextProvider} from "../../../contexts/PairsContext";

export const TestContext = ({ children }: { children: ReactNode }) => {

  const setConfirmModal = (v) => {}
  const setProgressModal = (v) => {}
  const setLinkExplorer = (v) => {}

  const slippageToleranceSelected = 0.05;
  const onIncreaseAllow = () => {
    console.log("onIncreaseAllow - OK")
    return true
  }
  const getContractHashAgainstPackageHash = () => {
    return "hash-contract"
  }

  return (
    <ConfigProviderContext.Provider value={{
      onIncreaseAllow,
      getContractHashAgainstPackageHash,
      slippageToleranceSelected,
      setConfirmModal,
      setProgressModal,
      setLinkExplorer
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