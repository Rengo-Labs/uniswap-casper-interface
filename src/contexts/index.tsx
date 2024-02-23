import React, { ReactNode } from 'react'
import { LiquidityContext } from './LiquidityContext'
import { ThemeContext } from './ThemeContext'
import { TokensContext2 } from './TokenContext2'
import { TokensContext } from './TokensContext'
import { InitialContext } from './InitialContext'
import { TorusContext } from './TorusContext'
import { ConfigContextWithReducer } from './ConfigContext'
import { ProgressBarContextWithReducer } from "./ProgressBarContext"
import { SwapContext } from "./SwapContext";
import { NotificationSystem } from '../components/organisms/NotificationSystem'
import { PopupsContainer } from '../components/organisms/PopupsContainer'
import { StateHashContext } from './StateHashContext'
import { PairsContext } from "./PairsContext";
import { PoolContext } from "./PoolContext";
import { WalletContext } from "./WalletContext";
import { UiProvider } from 'rengo-ui-kit';
import { LoadingProvider } from "./LoaderContext";
import { StakingContext } from "./StakingContext";

import { CsprClickInitOptions } from '@make-software/csprclick-core-client';
import { ClickProvider } from '@make-software/csprclick-ui';
import { CONTENT_MODE } from '@make-software/csprclick-core-types';
import {casperNode, networkName} from "../constant/bootEnvironmet";

const clickOptions: CsprClickInitOptions = {
  appName: 'CSPR.app',
  contentMode: CONTENT_MODE.IFRAME,
  providers: ['casper-wallet', 'ledger', 'torus-wallet', 'casperdash', 'metamask-snap', 'casper-signer'],
  appId: 'csprclick-template',
  chainName: networkName,
  casperNode: casperNode
};

export const BigContext = ({ children }: { children: ReactNode }) => {
  
  return (
    <UiProvider>
      <ThemeContext>
        <ClickProvider options={clickOptions}>
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
                              <NotificationSystem />
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
                      <PopupsContainer />
                    </ConfigContextWithReducer>
                  </StateHashContext>
                </WalletContext>
              </PoolContext>
            </PairsContext>
          </TokensContext>
        </ClickProvider>
      </ThemeContext>
    </UiProvider>
  )
}
