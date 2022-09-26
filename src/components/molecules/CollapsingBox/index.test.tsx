import '@testing-library/jest-dom'
import {jest} from '@jest/globals';

jest.mock('@toruslabs/casper-embed', () => {})

import {render, renderHook, screen} from '@testing-library/react'
import {ConfigContextWithReducer, ConfigProviderContext} from '../../../contexts/ConfigContext'
import {CollapsingBox} from "./index";

describe("Test for swap details", () => {
    beforeEach(() => {
        const wrapper = ({ children }) => <ConfigContextWithReducer>{children}</ConfigContextWithReducer>
        const { result } = renderHook(() => {}, { wrapper })
    })

    test("SwapDetail extended", () => {

        const firstToken = 20
        const tokensToTransfer = 1
        const firstSymbolToken = 'WETH'
        const receivedSymbolToken = 'CSPR'
        const priceImpact = 1.40
        const slippage = 0.003
        const priceImpactLabel = 'Warning price'
        const slippageSetter = jest.fn()


        ///TODO I need to mock react context to consume an internal method to recalculate
        ///minimum received
        /*
        const collapsing = render(<CollapsingBox
            firstToken={firstToken}
            firstSymbolToken={firstSymbolToken}
            receivedSymbolToken={receivedSymbolToken}
            tokensToTransfer={tokensToTransfer}
            priceImpact={priceImpact}
            slippage={slippage}
            defaultPriceImpact={priceImpactLabel}
            slippageSetter={slippageSetter}
            fullWidth={false}
            fullExpanded={true}
            expandedEnabled={false}
            slippageEnabled={false}
        />)*/

    })
})
