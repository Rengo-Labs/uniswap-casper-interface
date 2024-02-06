import BigNumber from 'bignumber.js';
import React, {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from 'react';
import {NODE_ADDRESS, NotificationType} from '../../constant';

import {
  initialConfigState,
  ConfigReducer,
  ConfigActions,
} from '../../reducers';

import {networkName} from '../../constant/bootEnvironmet'
const NETWORK_NAME = networkName

import {
  Wallet,
  log,
  WalletName, Client as CasperClient
} from '../../commons';

import { ConfigState } from '../../reducers/ConfigReducers';
import { notificationStore } from '../../store/store';
import useConnectionPopUp from "../../hooks/useConnectionPopUp";
import {ClickUI, ThemeModeType, TopBarSettings, useClickRef} from '@make-software/csprclick-ui';
import {ClickWallet} from "../../commons/wallet/ClickWallet";
import store from "store2";

export const casperClient = new CasperClient(NETWORK_NAME, NODE_ADDRESS);

export interface WalletContextProps {
  onConnectWallet?: (name?: WalletName, ignoreError?: boolean) => Promise<void>;
  onDisconnectWallet?: () => Promise<void>;
  walletState?: ConfigState;
  isConnected?: boolean;
  setShowConnectionPopup: (show: boolean) => void;
  showConnectionPopup: boolean;
}

export const WalletProviderContext = createContext<WalletContextProps>({} as any);

/**
 * Return type for GetStatus
 */
export type StatusResponseType = {
  // network token balance of the account
  balance: BigNumber;
  // uref of the main purse
  mainPurse: string;
};

/**
 * Get the balance and main purse of the wallet
 *
 * @param wallet Wallet whose account is being used
 * @returns the balance and make purse uref
 */
export async function getStatus(wallet: Wallet): Promise<StatusResponseType> {
  const balance = await casperClient.getBalance(wallet);
  const mainPurse = await casperClient.getMainPurse(wallet);

  return { balance, mainPurse };
}

export const WalletContext = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, dispatch] = useReducer(ConfigReducer, initialConfigState);

  const { updateNotification, dismissNotification } = notificationStore();
  const {showConnectionPopup, setShowConnectionPopup} = useConnectionPopUp();

  const [requestConnectWallet, setRequestConnectWallet] = useState("");
  const clickRef = useClickRef()

  const onConnectWallet = async (
    name: WalletName = WalletName.NONE,
    ignoreError = false
  ): Promise<void> => {

    if (isConnected) {
      return;
    }

    try {
      clickRef.signIn()
    } catch (err) {
      log.error(`onConnectWallet error: ${err}`);
      if (ignoreError) {
        return
      }

      if (err.message.includes('make sure you have the Signer installed')) {
        updateNotification({
          type: NotificationType.Error,
          title: 'This wallet is not installed.',
          subtitle: '',
          show: true,
          isOnlyNotification: true,
          timeToClose: 5000,
        })
        return;
      }

      if (err.message === 'main purse does not exist') {
        updateNotification({
          type: NotificationType.Error,
          title: 'Main purse does not exist, send CSPR to your wallet first',
          subtitle: '',
          show: true,
          isOnlyNotification: true,
          timeToClose: 5000,
        })
        return
      }
      // TODO: Casper Wallet is locked
      if (err.message === 'Wallet is locked.') {
        updateNotification({
          type: NotificationType.Error,
          title: 'Wallet is locked',
          subtitle: 'Please unlock your wallet first',
          show: true,
          isOnlyNotification: true,
          timeToClose: 5000,
        })
        return
      }

      if (err.message.includes('Please install the Casper')){
        updateNotification({
          type: NotificationType.Error,
          title: 'This wallet is not installed.',
          subtitle: err.message,
          show: true,
          isOnlyNotification: true,
          timeToClose: 5000,
        })
        return;
      }

      updateNotification({
        type: NotificationType.Error,
        title: 'Ooops we have an error',
        subtitle: '',
        show: true,
        isOnlyNotification: true,
        timeToClose: 5000,
      });
    }
  }

  const { isConnected } = state;

  useEffect(() => {
    clickRef?.on('csprclick:signed_in', async (evt) => {
      store.set("wallet_provider", evt.account.provider)
      store.set("cw-pubk", evt.account.public_key)

      const w = new ClickWallet(NETWORK_NAME)
      w.setClickRef(clickRef)
      w.connect()
      dispatch({
        type: ConfigActions.CONNECT_WALLET,
        payload: {
          wallet: w,
          mainPurse: requestConnectWallet,
          walletAddress: w.accountHashString ?? '',
          isConnected: true
        }
      })

      console.log("csprclick:signed_in", evt);
    });

    clickRef?.on('csprclick:disconnected', async (evt) => {
      store.remove("wallet_provider")
      store.remove("cw-pubk")
      setRequestConnectWallet("")
      console.log("csprclick:disconnected", evt);
    });
  }, [clickRef?.on]);

  useEffect(() => {
    const fn = async () => {
      console.log('wat', state)
      if (state?.wallet) {
        state.wallet.setClickRef(clickRef)
        await state.wallet.getActiveKey()
        dispatch({
          type: ConfigActions.CONNECT_WALLET,
          payload: { wallet: state.wallet, clickRef },
        });
        //refresh(state.wallet);
      }
    };

    fn();
  }, [requestConnectWallet]);

  async function onDisconnectWallet(): Promise<void> {
    try {
      if (state.wallet) {
        clickRef.signOut();

        dispatch({ type: ConfigActions.DISCONNECT_WALLET, payload: {} })
        updateNotification({
          type: NotificationType.Success,
          title: 'Your wallet is disconnected',
          subtitle: '',
          show: true,
          timeToClose: 3000,
          isOnlyNotification: true
        });
      }
    } catch (error) {
      updateNotification({
        type: NotificationType.Error,
        title: 'Error disconnecting wallet',
        subtitle: '',
        show: true,
        timeToClose: 6000,
        isOnlyNotification: true
      });
    }
  }
  const [themeMode, setThemeMode] = useState<ThemeModeType>(ThemeModeType.light);

  const topBarSettings: TopBarSettings = {
    onThemeSwitch: () => {setThemeMode(themeMode === ThemeModeType.light ? ThemeModeType.dark : ThemeModeType.light)},
  };

  return (
    <WalletProviderContext.Provider
      value={{
        onConnectWallet,
        onDisconnectWallet,
        walletState: state,
        isConnected,
        setShowConnectionPopup,
        showConnectionPopup
      }}
    >
      <div id={"app-click"} style={{}}>
        <ClickUI
          themeMode={themeMode}
          rootAppElement={"#app-click"}
          show1ClickModal={false}
          topBarSettings={topBarSettings}
        />
      </div>
      {children}
    </WalletProviderContext.Provider>
  );
};
