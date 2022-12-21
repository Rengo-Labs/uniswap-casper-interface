import React, {ReactNode, useContext} from 'react'
import '@testing-library/jest-dom'

import {fireEvent, render} from "@testing-library/react"
import {ConfigProviderContext} from "../ConfigContext";
import {SwapContext, SwapProviderContext} from "./index"

jest.mock("../../commons/wallet/types", () => {
  return { Network: {CASPER_TESTNET: ""}, WalletName: {CASPER_SIGNER : ""} }
})
jest.mock("axios", () => {})
jest.mock("@toruslabs/casper-embed", () => {})
jest.mock('../../commons/wallet/Client')
jest.mock("../../commons/utils/index")
jest.mock("../../commons/deploys/swap", () => {
  return {signAndDeploySwap: (apiClient, casperClient, wallet, deadline,
                                      amountADesired, amountBDesired, tokenA, tokenB,
                                      slippage, mainPurse, gasFee) => {
      return ["hash liquidity", {} as any]
    }
  }
})
jest.mock("../../commons/calculations/swapDetails", () => {
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

const TestContext = ({ children }: { children: ReactNode }) => {

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

const TestComponent = () => {
  const { onConfirmSwapConfig, getSwapDetails } = useContext(SwapProviderContext)

  const checkSwapDetail = async () => {
    const {
      tokensToTransfer,
      exchangeRateA,
      exchangeRateB,
    } = await getSwapDetails({symbol: "TK1"} as any, {symbol: "TK2"} as any, 100, {symbol: "TK1"} as any, 0.005, 0.003)
    console.log("checkAddLiquidity", tokensToTransfer, exchangeRateA, exchangeRateB)
  }
  const checkSwapper = async () => {
    const result = await onConfirmSwapConfig(2000.00, 1000.00, 0.5, 0.003)
    console.log("checkAddLiquidity", result)
  }

  return (
    <div>
      <button data-testid="key_swap" onClick={checkSwapper}>Swap</button>
      <button data-testid="key_swap_detail" onClick={checkSwapDetail}>Swap Detail</button>
    </div>
  )
}

describe('Swap Context Test',() => {
  test('Test 1 - Swap', async () => {
    const testComponent = render(<TestContext><SwapContext><TestComponent/></SwapContext></TestContext>)
    const button = await testComponent.findByTestId("key_swap")
    fireEvent.click(button)
  })

  test('Test 2 - Swap detail', async () => {
    const testComponent = render(<SwapContext><TestComponent/></SwapContext>)
    const button = await testComponent.findByTestId("key_swap_detail")
    fireEvent.click(button)
  })
})
