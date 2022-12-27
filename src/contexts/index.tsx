import React, { ReactNode } from 'react'
import { LiquidityContext } from './LiquidityContext'
import { PoolsContext } from '../mocks/components/organisms/PoolsContext'
import { ThemeContext } from './ThemeContext'
import { TokensContext2 } from './TokenContext2'
import { TokensContext } from './TokensContext'
import { InitialContext } from './InitialContext'
import { TorusContext } from './TorusContext'
import { Toaster } from 'react-hot-toast';
import { ConfigContextWithReducer } from './ConfigContext'
import {ProgressBarContextWithReducer} from "./ProgressBarContext"
import {SwapContext} from "./SwapContext";


export const BigContext = ({ children }: { children: ReactNode }) => {

  return (
    <ThemeContext>
      <ConfigContextWithReducer>
        <SwapContext>
          <LiquidityContext>
            <ProgressBarContextWithReducer>
              <Toaster />
              <TorusContext>
                <InitialContext>
                  <TokensContext2>
                    <PoolsContext>
                      <LiquidityContext>
                        <TokensContext>
                            {children}
                        </TokensContext>
                      </LiquidityContext>
                    </PoolsContext>
                  </TokensContext2>
                </InitialContext>
              </TorusContext>
            </ProgressBarContextWithReducer>
          </LiquidityContext>
        </SwapContext>
      </ConfigContextWithReducer>
    </ThemeContext>
  )
}
