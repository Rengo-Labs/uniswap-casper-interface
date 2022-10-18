import '@testing-library/jest-dom'
import {BrowserRouter as Router} from 'react-router-dom';
import {render, fireEvent} from '@testing-library/react'
import {LiquidityRemovingModule} from "./index";

import {jest} from "@jest/globals";
jest.mock('axios', () => {})
jest.mock('@toruslabs/casper-embed', () => {})

describe('Liquidity removing popup', () => {
    test('Test 1 - ', async () => {

        const onClose = jest.fn(() => {
        })
        const onRemove = jest.fn(() => {
        })
        const setAmount = jest.fn(() => {

        })

        //liq_popup | liq_half | liq_max | liq_input | liq_remove

        const component = render(
            <LiquidityRemovingModule isConnected={true}
                                     onClose={onClose}
                                     onRemove={onRemove}
                                     tokenLP={{amount: 1000, name: "TK1-TK2"}}
                                     lpBalance={2000}
                                     setAmount={setAmount}>
            </LiquidityRemovingModule>
        )

        const popupButton = await component.findByTestId("liq_popup")
        fireEvent.click(popupButton)

        const liqInput = await component.findByTestId("liq_input")
        fireEvent.click(liqInput)

        const removeButton = await component.findByTestId("liq_remove")
        fireEvent.click(removeButton)

    })
})