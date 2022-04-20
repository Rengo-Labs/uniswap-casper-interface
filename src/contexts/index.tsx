import React, { ReactNode } from 'react'
import { LiquidityContext } from './LiquidityContext'
import { PoolsContext } from './PoolsContext'
import { ThemeContext } from './ThemeContext'
import { TokensContext2 } from './TokenContext2'
import { TokensContext } from './TokensContext'
import { InitialContext } from './InitialContext'
import { TorusContext } from './TorusContext'

export const BigContext = ({ children }: { children: ReactNode }) => {
    return (
        <TorusContext>
            <InitialContext>
                <ThemeContext>
                    <TokensContext2>
                        <PoolsContext>
                            <LiquidityContext>
                                <TokensContext>
                                    {children}
                                </TokensContext>
                            </LiquidityContext>
                        </PoolsContext>
                    </TokensContext2>
                </ThemeContext>
            </InitialContext>
        </TorusContext>
    )
}
