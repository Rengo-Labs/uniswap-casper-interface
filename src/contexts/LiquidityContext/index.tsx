import React, {createContext, ReactNode, useContext, useReducer, useState} from 'react'
import toast from "react-hot-toast";
import {
  calculateLiquidityDetails,
  convertUIStringToBigNumber,
  LiquidityDetails,
  signAndDeployAddLiquidity,
  signAndDeployRemoveLiquidity,
  sleep,
  Token
} from "../../commons";
import {DEADLINE} from "../../constant";
import {apiClient, casperClient, ConfigProviderContext} from "../ConfigContext";
import BigNumber from "bignumber.js";
import {ERROR_BLOCKCHAIN} from "../../constant/erros";

export interface LiquidityContext {
  onAddLiquidity: (amountA: number | string, amountB: number | string, slippage: number, gasFee: number) => Promise<boolean>,
  onRemoveLiquidity: (liquidity: number | string, tokenA: Token, tokenB: Token, amountA: number | string, amountB: number | string, slippage: number) => Promise<boolean>,
  getLiquidityDetails: (tokenA: Token, tokenB: Token, inputValue: BigNumber.Value, token: Token, slippage: number, fee: number) => Promise<LiquidityDetails>,
  isRemovingPopupOpen?: boolean,
  setRemovingPopup?: any
}

export const LiquidityProviderContext = createContext<LiquidityContext>({} as any)

export const LiquidityContext = ({ children }:{children:ReactNode}) => {
  const {
    firstTokenSelected,
    secondTokenSelected,
    refreshAll,
    configState,
    setConfirmModal,
    setLinkExplorer,
    setProgressModal
  } = useContext(ConfigProviderContext)

  const [isRemovingPopupOpen, setRemovingPopup] = useState(false)

  async function onAddLiquidity(amountA: number | string, amountB: number | string, slippage: number, gasFee: number): Promise<boolean> {
    const loadingToast = toast.loading("Adding liquidity.")
    try {
      const [deployHash, deployResult] = await signAndDeployAddLiquidity(
          apiClient,
          casperClient,
          configState.wallet,
          DEADLINE,
          convertUIStringToBigNumber(amountA),
          convertUIStringToBigNumber(amountB),
          firstTokenSelected,
          secondTokenSelected,
          slippage / 100,
          configState.mainPurse,
          gasFee
      )

      setProgressModal(true)
      setLinkExplorer(`https://testnet.cspr.live/deploy/${deployHash}`)

      const result = await casperClient.waitForDeployExecution(deployHash)
      setProgressModal(false)
      setConfirmModal(true)

      await sleep(15000)
      await refreshAll()
      toast.dismiss(loadingToast)
      toast.success("Success.")
      return true
    } catch (err) {
      setProgressModal(false)
      toast.dismiss(loadingToast)
      await refreshAll()
      console.log("onAddLiquidity", err)
      toast.error(ERROR_BLOCKCHAIN[err.message].message || err)
      return false
    }
  }

  async function onRemoveLiquidity(liquidity: number | string, tokenA: Token, tokenB: Token, amountA: number | string, amountB: number | string, slippage: number): Promise<boolean> {
    const loadingToast = toast.loading("Removing liquidity.")
    
    try {
      const [deployHash, deployResult] = await signAndDeployRemoveLiquidity(
          apiClient,
          casperClient,
          configState.wallet,
          DEADLINE,
          convertUIStringToBigNumber(liquidity),
          convertUIStringToBigNumber(amountA),
          convertUIStringToBigNumber(amountB),
          tokenA,
          tokenB,
          slippage / 100,
      )

      setProgressModal(true)
      setLinkExplorer(`https://testnet.cspr.live/deploy/${deployHash}`)

      const result = await casperClient.waitForDeployExecution(deployHash)
      setProgressModal(false)
      setConfirmModal(true)

      await sleep(15000)
      await refreshAll()
      toast.dismiss(loadingToast)
      toast.success("Success.")
      return true
    } catch (err) {
      setProgressModal(false)
      toast.dismiss(loadingToast)
      await refreshAll()
      console.log("onRemoveLiquidity", err)
      toast.error(ERROR_BLOCKCHAIN[err].message || err)
      return false
    }
  }

  async function getLiquidityDetails(tokenA: Token, tokenB: Token, inputValue: BigNumber.Value, token: Token, slippage = 0.005, fee = 0.003): Promise<LiquidityDetails> {
    return calculateLiquidityDetails(apiClient, tokenA, tokenB, inputValue, token, slippage, fee)
  }

  return (
    <LiquidityProviderContext.Provider value={{
      onAddLiquidity,
      onRemoveLiquidity,
      getLiquidityDetails,
      isRemovingPopupOpen,
      setRemovingPopup
    }}>
      {children}
    </LiquidityProviderContext.Provider>
  )
}
