import '@testing-library/jest-dom'
import {render, fireEvent} from '@testing-library/react'
import {LiquidityRemovingModule} from "./index";

import {jest} from "@jest/globals";
import {ConfigContextWithReducer} from '../../../contexts/ConfigContext'

jest.mock('axios', () => {})
jest.mock('@toruslabs/casper-embed', () => {})

describe('Liquidity removing popup', () => {
    test('Test 1 - it updates lp price', async () => {
        //liq_popup | liq_half | liq_max | liq_input | liq_enable | liq_remove

        const component = render(
            <ConfigContextWithReducer>
                <LiquidityRemovingModule isConnected={true}
                                         openedPopup={false}
                                         firstSymbol="WETH"
                                         firstLiquidity={'110'}
                                         firstHash="hash-token1"
                                         secondSymbol="WCSPR"
                                         secondLiquidity={'200'}
                                         secondHash="hash-token2"
                                         liquidityId="hash-pairId"
                                         liquidity={'10'}
                                         liquidityUSD={'15'}
                />
            </ConfigContextWithReducer>
        )

        const popupButton = await component.findByTestId("liq_popup")
        fireEvent.click(popupButton)

        const liqInput = await component.findByTestId("liq_input")
        fireEvent.change(liqInput, { target: { value: '3' } })

        const labelUSD = await component.findByTestId("liq_usd")
        expect(labelUSD).toHaveTextContent("$ 4.50")

    })
})