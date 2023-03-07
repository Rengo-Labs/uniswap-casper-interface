import React from 'react'
import '@testing-library/jest-dom'

import {fireEvent, render} from "@testing-library/react"
import {
  StateHashContextMock,
  TestContext,
  TokenContextMock,
  WalletContextMock
} from "../../../mocks/contexts/SwapContext/index.mock"
import {TestComponent} from "../../../mocks/components/organisms/SwapModule/index.mocks"
import {SwapContext} from "../../../contexts/SwapContext"

describe('Swap Context Test',() => {
  test('Test 1 - Swap', async () => {
    const testComponent = render(
      <StateHashContextMock>
        <WalletContextMock>
          <TokenContextMock>
            <TestContext>
              <SwapContext>
                <TestComponent/>
              </SwapContext>
            </TestContext>
          </TokenContextMock>
        </WalletContextMock>
      </StateHashContextMock>
    )
    const button = await testComponent.findByTestId("key_swap")
    fireEvent.click(button)
  })

  test('Test 2 - Swap detail', async () => {
    const testComponent = render(
      <StateHashContextMock>
        <WalletContextMock>
          <TokenContextMock>
            <TestContext>
              <SwapContext>
                <TestComponent/>
              </SwapContext>
            </TestContext>
          </TokenContextMock>
        </WalletContextMock>
      </StateHashContextMock>
    )
    const button = await testComponent.findByTestId("key_swap_detail")
    fireEvent.click(button)
  })
})
