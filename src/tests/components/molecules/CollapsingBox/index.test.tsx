import '@testing-library/jest-dom'

import {render, fireEvent} from '@testing-library/react'
import {CollapsingBox} from "../../../../components/molecules/CollapsingBox";
import {jest} from "@jest/globals";
jest.mock('axios', () => {})
jest.mock('@toruslabs/casper-embed', () => {})

describe("Test for swap details", () => {

    test("Test 1 - Changing right column when I expand/click the swap detail box", async () => {

        const firstToken = 20
        const tokensToTransfer = 1
        const firstSymbolToken = 'WETH'
        const receivedSymbolToken = 'CSPR'
        const priceImpact = 1.40
        const slippage = 0.003
        const priceImpactLabel = 'Warning price'
        const slippageSetter = jest.fn()

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
            expandedEnabled={true}
            slippageEnabled={false}
        />)

        const labelChangedBefore = await collapsing.getByTestId("collapsing_column_right_id")
        expect(labelChangedBefore).toHaveTextContent("1.4 %");
        const button = await collapsing.findByTestId("collapsing_id")
        fireEvent.click(button)

        const labelChanged = await collapsing.getByTestId("collapsing_column_right_id")
        expect(labelChanged).toHaveTextContent("10 CSPR");
    })

    test("Test 2 - Changing slippage to 5%", async () => {

        const firstToken = 200
        const tokensToTransfer = 10
        const firstSymbolToken = 'WETH'
        const receivedSymbolToken = 'CSPR'
        const priceImpact = 1.40
        let slippage: any = 0.003
        const priceImpactLabel = 'Warning price'
        const slippageSetter = jest.fn((value) => {
            slippage = value
        })

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
            expandedEnabled={true}
            slippageEnabled={true}
        />)

        const labelChangedBefore = await collapsing.getByTestId("collapsing_min_received")
        expect(labelChangedBefore).toHaveTextContent("9.9997000");

        const button = await collapsing.findByTestId("collapsing_id")
        fireEvent.click(button)

        const input = await collapsing.getByPlaceholderText("%")
        fireEvent.change(input, { target: { value: 5.00 } });

        collapsing.rerender(<CollapsingBox
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
            expandedEnabled={true}
            slippageEnabled={true}
        />)

        const labelChanged = await collapsing.getByTestId("collapsing_min_received")
        expect(labelChanged).toHaveTextContent("9.50000000");
    })
})
