import '@testing-library/jest-dom'
import {render, fireEvent} from '@testing-library/react'
import {LiquidityRemovingModule} from "../../../../components/organisms/LiquidityRemovingModule";

import {jest} from "@jest/globals";
import {TestContext} from "../../../../mocks/contexts/LiquidityContext/index.mocks";
import {LiquidityContext} from "../../../../contexts/LiquidityContext";
jest.mock('../../../../store/store', () => {
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
jest.mock('axios', () => {})
jest.mock('@toruslabs/casper-embed', () => {})

describe('Liquidity removing popup', () => {

    test('Test 1 - it updates lp price', async () => {
        const component = render(
          <TestContext>
              <LiquidityContext>
                <LiquidityRemovingModule isConnected={true}
                                         openedPopup={false}
                                         firstSymbol="WETH"
                                         firstLiquidity={'110'}
                                         firstHash="hash-token1"
                                         secondSymbol="WCSPR"
                                         secondLiquidity={'200'}
                                         secondHash="hash-token2"
                                         contractHash="hash-pairId"
                                         packageHash="hash-pairId"
                                         liquidity={'10'}
                                         allowance={'10'}
                                         liquidityUSD={'15'}
                />
              </LiquidityContext>
            </TestContext>
        )

        const popupButton = await component.findByTestId("liq_popup")
        fireEvent.click(popupButton)

        const liqInput = await component.findByTestId("liq_input")
        fireEvent.change(liqInput, { target: { value: '3' } })

        const labelUSD = await component.findByTestId("liq_usd")
        expect(labelUSD).toHaveTextContent("$ 4.50")

    })
})