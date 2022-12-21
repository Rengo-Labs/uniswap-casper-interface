import React, {ReactNode, useContext} from 'react'
import '@testing-library/jest-dom'
import {LiquidityContext, LiquidityProviderContext} from "./index"
import {fireEvent, render} from "@testing-library/react"
import {ConfigProviderContext} from "../ConfigContext";

jest.mock("../../commons/wallet/types", () => {
  return { Network: {CASPER_TESTNET: ""}, WalletName: {CASPER_SIGNER : ""} }
})
jest.mock("axios", () => {})
jest.mock("@toruslabs/casper-embed", () => {})
jest.mock('../../commons/wallet/Client')
jest.mock("../../commons/utils/index")
jest.mock("../../commons/deploys/addLiquidity", () => {
  return {signAndDeployAddLiquidity: (apiClient, casperClient, wallet, deadline,
                                      amountADesired, amountBDesired, tokenA, tokenB,
                                      slippage, mainPurse, gasFee) => {
      return ["hash liquidity", {} as any]
    }
  }
})
jest.mock("../../commons/deploys/removeLiquidity", () => {
  return {signAndDeployRemoveLiquidity: (apiClient, casperClient,
                                         wallet, deadline, liquidity, amountADesired,
                                         amountBDesired, tokenA, tokenB, slippage) => {
      return ["hash remove", {} as any]
    }
  }
})
jest.mock("../../commons/calculations/liquidityDetails", () => {
  return {calculateLiquidityDetails: (apiClient, tokenA, tokenB, inputValue, token, slippage, fee) => {
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
  const { getLiquidityDetails, onRemoveLiquidity, onAddLiquidity } = useContext(LiquidityProviderContext)

  const checkLiquidityDetail = async () => {
    const {
      tokensToTransfer,
      exchangeRateA,
      exchangeRateB,
      firstReserve,
      secondReserve
    } = await getLiquidityDetails({symbol: "TK1"} as any, {symbol: "TK2"} as any, 100, {symbol: "TK1"} as any, 0.005, 0.003)
    console.log("checkAddLiquidity", tokensToTransfer, exchangeRateA, exchangeRateB, firstReserve, secondReserve)
  }
  const checkAddLiquidity = async () => {
    const result = await onAddLiquidity(2000.00, 1000.00, 0.5, 0.003)
    console.log("checkAddLiquidity", result)
  }
  const checkRemoveLiquidity = async () => {
    const result = await onRemoveLiquidity(100, {symbol: "TK1"} as any, {symbol: "TK2"} as any, 100, 200, 0.5)
    console.log("checkRemoveLiquidity", result)
  }

  return (
    <div>
      <button data-testid="key_remove" onClick={checkRemoveLiquidity}>Remove Liquidity</button>
      <button data-testid="key_add" onClick={checkAddLiquidity}>Add Liquidity</button>
      <button data-testid="key_liquidity_detail" onClick={checkLiquidityDetail}>Liquidity Detail</button>
    </div>
  )
}

describe('Liquidity Context Test',() => {
  test('Test 1 - remove liquidity', async () => {
    const testComponent = render(<TestContext><LiquidityContext><TestComponent/></LiquidityContext></TestContext>)
    const button = await testComponent.findByTestId("key_remove")
    fireEvent.click(button)
  })

  test('Test 2 - add liquidity', async () => {
    const testComponent = render(<TestContext><LiquidityContext><TestComponent/></LiquidityContext></TestContext>)
    const button = await testComponent.findByTestId("key_add")
    fireEvent.click(button)
  })

  test('Test 3 - liquidity detail', async () => {
    const testComponent = render(<LiquidityContext><TestComponent/></LiquidityContext>)
    const button = await testComponent.findByTestId("key_liquidity_detail")
    fireEvent.click(button)
  })
})
