import React, {createContext, ReactNode, useContext, useReducer} from 'react'

import { initialStateWallet, reducerWallet } from '../../reducers/WalletReducers'
import toast from "react-hot-toast";
import {calculateSwapDetails, convertUIStringToBigNumber, signAndDeploySwap, SwapDetails, Token} from "../../commons";
import {DEADLINE} from "../../constant";
import {apiClient, casperClient, ConfigProviderContext} from "../ConfigContext";
import BigNumber from "bignumber.js";

export interface SwapContext {
    onConfirmSwapConfig: (amountA: number | string, amountB: number | string, slippage: number, gasFee: number) => Promise<boolean>,
    getSwapDetails: (tokenA: Token, tokenB: Token, inputValue: BigNumber.Value, token: Token, slippage: number, fee: number) => Promise<SwapDetails>,
    swapState: any,
    swapDispatch: any
}

export const SwapProviderContext = createContext<SwapContext>({} as any)

export const SwapContext = ({ children }: { children: ReactNode }) => {
    const {
        firstTokenSelected,
        secondTokenSelected,
        refreshAll,
        configState,
        setConfirmModal,
        setLinkExplorer,
        setProgressModal
    } = useContext(ConfigProviderContext)

    const [state, dispatch] = useReducer(reducerWallet, initialStateWallet)

    async function onConfirmSwapConfig(amountA: number | string, amountB: number | string, slippage: number, gasFee: number): Promise<boolean> {
        const loadingToast = toast.loading("Swapping.")

        try {

            const [deployHash, deployResult] = await signAndDeploySwap(
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
            );

            setProgressModal(true)
            setLinkExplorer(`https://testnet.cspr.live/deploy/${deployHash}`)

            const result = await casperClient.waitForDeployExecution(deployHash)

            setProgressModal(false)
            setConfirmModal(true)

            toast.dismiss(loadingToast)
            await refreshAll()
            return true
        } catch (err) {
            setProgressModal(false)
            toast.dismiss(loadingToast)
            console.log("onConfirmSwapConfig")
            toast.error(`${err}`)
            await refreshAll()
            return false
        }
    }

    /***
     * it returns tokensToTransfer, priceImpact, minTokenBToTransfer, exchangeRateA and exchangeRateB that belong to the swap detail
     * @param tokenA first token
     * @param tokenB second token
     * @param inputValue input tokens
     * @param token input token types matching one of tokenA or tokenB
     * @param slippage decimal slippage
     * @param fee decimal fee
     *
     * @return SwapDetails
     */
    async function getSwapDetails(tokenA: Token, tokenB: Token, inputValue: BigNumber.Value, token: Token, slippage = 0.005, fee = 0.003): Promise<SwapDetails> {
        return calculateSwapDetails(apiClient, tokenA, tokenB, inputValue, token, slippage, fee)
    }

    return (
        <SwapProviderContext.Provider value={{
            swapState: state,
            swapDispatch: dispatch,
            onConfirmSwapConfig,
            getSwapDetails
        }}>
            {children}
        </SwapProviderContext.Provider>
    )
}
