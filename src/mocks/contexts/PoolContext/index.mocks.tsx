import React, {ReactNode, useState} from "react"
import {ConfigProviderContext} from "../../../contexts/ConfigContext"
import {Row} from "react-table";
import {PairData} from "../../../reducers/PairsReducer";

export const TestContext = ({ children }: { children: ReactNode }) => {

  const [isStaked, setStaked] = useState(false)
  const refreshAll = () => {}
  const setConfirmModal = (v) => {}
  const setProgressModal = (v) => {}
  const setLinkExplorer = (v) => {}
  const filter = (onlyStaked: boolean, row: Row<PairData>): any => {
    if (onlyStaked) {
      return parseFloat(row.original.balance) > 0
    }

    return row
  }

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
      refreshAll,
      setStaked,
      isStaked,
      filter
    } as any}>
      {children}
    </ConfigProviderContext.Provider>
  )
}