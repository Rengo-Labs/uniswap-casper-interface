import React, {ReactNode} from 'react'
import {LiquidityContext} from './LiquidityContext'
import {ThemeContext} from './ThemeContext'
import {TokensContext2} from './TokenContext2'
import {TokensContext} from './TokensContext'
import {InitialContext} from './InitialContext'
import {TorusContext} from './TorusContext'
import {ConfigContextWithReducer} from './ConfigContext'
import {ProgressBarContextWithReducer} from "./ProgressBarContext"
import {SwapContext} from "./SwapContext";
import {NotificationSystem} from '../components/organisms/NotificationSystem'
import {PopupsContainer} from '../components/organisms/PopupsContainer'
import {StateHashContext} from './StateHashContext'
import {PairsContext} from "./PairsContext";
import {PoolContext} from "./PoolContext";
import {WalletContext} from "./WalletContext";
import {UiProvider} from 'rengo-ui-kit';
export const BigContext = ({children}: { children: ReactNode }) => {
    return (
        <UiProvider>
            <TokensContext>
                <PairsContext>
                    <PoolContext>
                        <WalletContext>
                            <StateHashContext>
                                <ConfigContextWithReducer>
                                    <SwapContext>
                                        <LiquidityContext>
                                            <ProgressBarContextWithReducer>
                                                <NotificationSystem/>
                                                <TorusContext>
                                                    <InitialContext>
                                                        <TokensContext2>
                                                            <LiquidityContext>
                                                                {children}
                                                            </LiquidityContext>
                                                        </TokensContext2>
                                                    </InitialContext>
                                                </TorusContext>
                                            </ProgressBarContextWithReducer>
                                        </LiquidityContext>
                                    </SwapContext>
                                    <PopupsContainer/>
                                </ConfigContextWithReducer>
                            </StateHashContext>
                        </WalletContext>
                    </PoolContext>
                </PairsContext>
            </TokensContext>
        </UiProvider>
    )
}
