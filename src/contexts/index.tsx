import React, { ReactNode, useState } from 'react'
import { LiquidityContext } from './LiquidityContext'
import { PoolsContext } from './PoolsContext'
import { ThemeContext } from './ThemeContext'
import { TokensContext2 } from './TokenContext2'
import { TokensContext } from './TokensContext'
import { InitialContext } from './InitialContext'
import { TorusContext } from './TorusContext'
import { SwapContext } from './SwapContext'
import { NotificationContext } from './NotificationContext'
import { Toaster } from 'react-hot-toast';
import { ConfigContextWithReducer } from './ConfigContext'
import {ProgressBarReducer} from "./ProgressBarContext";

export const BigContext = ({ children }: { children: ReactNode }) => {

    return (
        <ThemeContext>
            <ConfigContextWithReducer>
                <SwapContext>
                    <LiquidityContext>
                        <Toaster />
                        <TorusContext>
                            <InitialContext>
                                <TokensContext2>
                                    <PoolsContext>
                                        <TokensContext>
                                            <ProgressBarReducer>
                                                {children}
                                            </ProgressBarReducer>
                                        </TokensContext>
                                    </PoolsContext>
                                </TokensContext2>
                            </InitialContext>
                        </TorusContext>
                    </LiquidityContext>
                </SwapContext>
            </ConfigContextWithReducer>
        </ThemeContext>
    )
}
