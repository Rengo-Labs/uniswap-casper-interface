import '@testing-library/jest-dom'
import { render, fireEvent } from '@testing-library/react'
import "../../../../mocks/components/organisms/LiquidityRemovingPopupModule/index.mock"
import {StateHashContextMock, TestContext} from "../../../../mocks/contexts/LiquidityContext/index.mocks"
import { LiquidityRemovingWithInputRangeModule } from "../../../../components/old/organisms/LiquidityRemovingWithInputRangeModule"
import { act } from 'react-dom/test-utils'

import React from "react";
import { LiquidityContext } from "../../../../contexts/LiquidityContext";

describe('Liquidity removing popup', () => {
  test('Test 1 - it approves token amount', async () => {

    const component = render(
      <TestContext>
        <LiquidityContext>
          <LiquidityRemovingWithInputRangeModule
            isConnected={true}
            openedPopup={false}
            firstSymbol="WETH"
            firstName="Ether"
            firstLiquidity="110"
            firstPrice="10.00"
            firstIcon={null}
            firstHash="hash-token1"
            secondSymbol="WCSPR"
            secondName="Casper"
            secondLiquidity="200"
            secondPrice="2.00"
            secondIcon={null}
            secondHash="hash-token2"
            contractHash="hash-pairId"
            packageHash="hash-pairId"
            liquidity={'100'}
            allowance={'10'}
            decimals={9}
          />
        </LiquidityContext>
      </TestContext>
    )

    const popupButton = await component.findByTestId("liq_popup")
    fireEvent.click(popupButton)

    const liqInput = await component.findByTestId("input_range")
    fireEvent.change(liqInput, { target: { value: '50' } })

    const labelUSD = await component.findByTestId("liq_pair")
    expect(labelUSD).toHaveTextContent("50.00000000")

    const approveAmount = await component.findByTestId("liq_enable")

    await act(async () => fireEvent.click(approveAmount))
  })

  test('Test 2 - it removes half liquidity pair', async () => {
    const component = render(
      <StateHashContextMock>
        <TestContext>
          <LiquidityContext>
            <LiquidityRemovingWithInputRangeModule
              isConnected={true}
              openedPopup={false}
              firstSymbol="WETH"
              firstName="Ether"
              firstLiquidity="110"
              firstPrice="10.00"
              firstIcon={null}
              firstHash="hash-token1"
              secondSymbol="WCSPR"
              secondName="Casper"
              secondLiquidity="200"
              secondPrice="2.00"
              secondIcon={null}
              secondHash="hash-token2"
              contractHash="hash-pairId"
              packageHash="hash-pairId"
              liquidity={'10'}
              allowance={'10'}
              decimals={9}
            />
          </LiquidityContext>
        </TestContext>
      </StateHashContextMock>
    )

    const popupButton = await component.findByTestId("liq_popup")
    fireEvent.click(popupButton)

    const liqInput = await component.findByTestId("input_range")
    fireEvent.change(liqInput, { target: { value: '50' } })

    const labelUSD = await component.findByTestId("liq_pair")
    expect(labelUSD).toHaveTextContent("5.00000000")

    const removeAmount = await component.findByTestId("liq_remove")
    await act(async () => fireEvent.click(removeAmount))
  })
})
