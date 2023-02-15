import React, {ReactNode} from 'react'
import {LiquidityContext} from './LiquidityContext'
import {PoolsContext} from '../mocks/components/organisms/PoolsContext'
import {ThemeContext} from './ThemeContext'
import {TokensContext2} from './TokenContext2'
import {TokensContext} from './TokensContext'
import {InitialContext} from './InitialContext'
import {TorusContext} from './TorusContext'
import {ConfigContextWithReducer} from './ConfigContext'
import {ProgressBarContextWithReducer} from "./ProgressBarContext"
import {SwapContext} from "./SwapContext";
import {NotificationSystem} from '../components/organisms'
import {PopupsContainer} from '../components/PopupsContainer'
import {StateHashProvideContext} from './StateHashContext'
import {PairsContext} from "./PairsContext";

export const BigContext = ({children}: { children: ReactNode }) => {

    return (
        <ThemeContext>
            <ConfigContextWithReducer>
                <PairsContext>
                    <StateHashProvideContext>
                        <SwapContext>
                            <LiquidityContext>
                                <ProgressBarContextWithReducer>
                                    <NotificationSystem/>
                                    <TorusContext>
                                        <InitialContext>
                                            <TokensContext2>
                                                <LiquidityContext>
                                                    <TokensContext>
                                                        {children}
                                                    </TokensContext>
                                                </LiquidityContext>
                                            </TokensContext2>
                                        </InitialContext>
                                    </TorusContext>
                                </ProgressBarContextWithReducer>
                            </LiquidityContext>
                        </SwapContext>
                        <PopupsContainer/>
                    </StateHashProvideContext>
                </PairsContext>
            </ConfigContextWithReducer>
        </ThemeContext>
    )
}
