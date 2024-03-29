import React from 'react'
import '@testing-library/jest-dom'
import {fireEvent, render} from "@testing-library/react"

import "../../../mocks/components/organisms/LiquidityModule/functions.mock"
import {
  StateHashContextMock,
  TestContext,
  TokenContextMock,
  WalletContextMock
} from "../../../mocks/contexts/LiquidityContext/index.mocks"
import {TestComponent} from "../../../mocks/components/organisms/LiquidityModule/index.mocks"
import {LiquidityContext} from "../../../contexts/LiquidityContext"

describe('Liquidity Context Test',() => {
  test('Test 1 - remove liquidity', async () => {
    const testComponent = render(
      <WalletContextMock>
        <StateHashContextMock>
          <TokenContextMock>
            <TestContext>
              <LiquidityContext>
                <TestComponent/>
              </LiquidityContext>
            </TestContext>
          </TokenContextMock>
        </StateHashContextMock>
      </WalletContextMock>
    )
    const button = await testComponent.findByTestId("key_remove")
    fireEvent.click(button)
  })

  test('Test 2 - add liquidity', async () => {
    const testComponent = render(
      <WalletContextMock>
        <StateHashContextMock>
          <TokenContextMock>
            <TestContext>
              <LiquidityContext>
                <TestComponent/>
              </LiquidityContext>
            </TestContext>
          </TokenContextMock>
        </StateHashContextMock>
      </WalletContextMock>
    )
    const button = await testComponent.findByTestId("key_add")
    fireEvent.click(button)
  })

  test('Test 3 - liquidity detail', async () => {
    const testComponent = render(
      <WalletContextMock>
        <StateHashContextMock>
          <TokenContextMock>
            <TestContext>
              <LiquidityContext>
                <TestComponent/>
              </LiquidityContext>
            </TestContext>
          </TokenContextMock>
        </StateHashContextMock>
      </WalletContextMock>
    )
    const button = await testComponent.findByTestId("key_liquidity_detail")
    fireEvent.click(button)
  })
})
