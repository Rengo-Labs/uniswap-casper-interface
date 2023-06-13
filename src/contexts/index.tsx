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
import {LoadingProvider} from "./LoaderContext";
import {StakingContext} from "./StakingContext";

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
                                            <StakingContext>
                                                <ProgressBarContextWithReducer>
                                                    <NotificationSystem/>
                                                    <TorusContext>
                                                        <InitialContext>
                                                            <TokensContext2>
                                                                <LiquidityContext>
                                                                    <LoadingProvider>
                                                                        {children}
                                                                    </LoadingProvider>
                                                                </LiquidityContext>
                                                            </TokensContext2>
                                                        </InitialContext>
                                                    </TorusContext>
                                                </ProgressBarContextWithReducer>
                                            </StakingContext>
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
