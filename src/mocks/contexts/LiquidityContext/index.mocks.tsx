import React, {ReactNode} from "react"
import {ConfigProviderContext} from "../../../contexts/ConfigContext"

export const TestContext = ({ children }: { children: ReactNode }) => {

  const refreshAll = () => {}
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
      firstTokenSelected: {} as any,
      secondTokenSelected: {} as any,
      configState: {wallet: {} as any, mainPurse: "mainPurse"},
      onIncreaseAllow,
      getContractHashAgainstPackageHash,
      slippageToleranceSelected,
      setConfirmModal,
      setProgressModal,
      setLinkExplorer,
      refreshAll
    } as any}>
      {children}
    </ConfigProviderContext.Provider>
  )
}