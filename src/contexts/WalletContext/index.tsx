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

const NETWORK_NAME = Network.CASPER_TESTNET;

import {
  CasperSignerWallet,
  TorusWallet,
  Network,
  Wallet,
  convertUIStringToBigNumber,
  log,
  WalletName, Client as CasperClient, ONE_BILLION_E,
} from '../../commons';

import { ConfigState } from '../../reducers/ConfigReducers';
import { notificationStore } from '../../store/store';
import {CasperWallet} from "../../commons/wallet/CasperWallet";
import { MetamaskSnapWallet } from '../../commons/wallet/MetamaskSnap';
import useConnectionPopUp from "../../hooks/useConnectionPopUp";
export const casperClient = new CasperClient(NETWORK_NAME, NODE_ADDRESS);

type MaybeWallet = Wallet | undefined;

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


  const [requestConnectWallet, setRequestConnectWallet] = useState(0);

  let debounceConnect = false;

  /**
   * return value for connect()
   */
  type ConnectReturn = {
    // wallet
    wallet?: Wallet;
    // balance of wallet
    balance: BigNumber;
    // main purse of wallet's address
    mainPurse: string;
    // wallet accountHashString
    walletAddress: string;
    // was the connection successful?
    isConnected: boolean;
  };

  /**
   * Connect to the currently selected wallet
   *
   * @param name name of wallet to connect
   *
   * @returns wallet, balance, mainPurse, and walletAddress
   */
  async function connect(
    name: WalletName = WalletName.NONE,
    amount
  ): Promise<ConnectReturn> {
    if (debounceConnect) {
      return {
        wallet: state.wallet,
        mainPurse: state.mainPurse,
        walletAddress: state.wallet?.accountHashString ?? '',
        balance: convertUIStringToBigNumber(amount, ONE_BILLION_E),
        isConnected: state.wallet?.isConnected ?? false,
      };
    }

    debounceConnect = true;
    let w: MaybeWallet;

    switch (name) {
      case WalletName.METAMASK_FLASK:
        try {
          if (state.wallet?.isConnected) {
            await state.wallet.disconnect();
          }

          w = new MetamaskSnapWallet(NETWORK_NAME);
          await w.connect();
        } catch (e) {
          debounceConnect = false;
          throw e;
        }

        if (!w?.publicKey) {
          debounceConnect = false;
          throw new Error('metamask error');
        }
        break;
      case WalletName.CASPER_SIGNER:
        try {
          if (state.wallet?.isConnected) {
            await state.wallet.disconnect();
          }

          w = new CasperSignerWallet(NETWORK_NAME);
          await w.connect();
        } catch (e) {
          debounceConnect = false;
          throw e;
        }

        if (!w?.publicKey) {
          debounceConnect = false;
          throw new Error('casper signer error');
        }
        break;
      case WalletName.TORUS:
        try {
          if (state.wallet?.isConnected) {
            await state.wallet.disconnect();
          }

          w = new TorusWallet(NETWORK_NAME);
          await w.connect();
        } catch (e) {
          debounceConnect = false;
          throw e;
        }

        if (!w?.publicKey) {
          debounceConnect = false;
          throw new Error('torus wallet error');
        }
        break;
      case WalletName.CASPER_WALLET:

        if (state.wallet?.isConnected) {
          await state.wallet.disconnect();
        }
        w = new CasperWallet(NETWORK_NAME)
        await w.connect()
        break
      default:
        setShowConnectionPopup(true);
        return {
          mainPurse: '',
          walletAddress: '',
          balance: convertUIStringToBigNumber(amount, ONE_BILLION_E),
          isConnected: false,
        };
    }

    try {
      const { balance, mainPurse } = await getStatus(w);

      debounceConnect = false;

      return {
        wallet: w,
        balance,
        mainPurse,
        walletAddress: w.accountHashString,
        isConnected: w.isConnected,
      };
    } catch {
      updateNotification({
        type: NotificationType.Error,
        title: 'No main purse detected',
        subtitle: 'Add CSPR to the wallet before proceeding.',
        show: true,
        isOnlyNotification: true
      });

      debounceConnect = false;

      return {
        wallet: w,
        balance: new BigNumber(0),
        mainPurse,
        walletAddress: w.accountHashString,
        isConnected: w.isConnected,
      };
    }

  }

  const onConnectWallet = async (
    name: WalletName = WalletName.NONE,
    ignoreError = false
  ): Promise<void> => {
    if (state.wallet?.isConnected) {
      return;
    }

    if (debounceConnect) {
      return;
    }

    try {
      updateNotification({
        type: NotificationType.Loading,
        title: 'Connecting to your wallet...',
        subtitle: '',
        show: true,
        isOnlyNotification: true,
        timeToClose: 5000,
      });

      const ret = await connect(name, new BigNumber(0));

      if (!ret.isConnected) {
        return;
      }

      dispatch({
        type: ConfigActions.SELECT_MAIN_PURSE,
        payload: { mainPurse: ret.mainPurse },
      });
      dispatch({
        type: ConfigActions.CONNECT_WALLET,
        payload: { wallet: ret.wallet },
      });

      //await refresh(ret.wallet);
      updateNotification({
        type: NotificationType.Success,
        title: 'Connected',
        subtitle: '',
        show: true,
        timeToClose: 5000,
        isOnlyNotification: true
      });
    } catch (err) {
      log.error(`onConnectWallet error: ${err}`);
      dismissNotification();
      if (ignoreError) {
        return
      }

      if (err.message.includes('make sure you have the Signer installed')) {
        updateNotification({
          type: NotificationType.Error,
          title: 'This wallet is not installed.',
          subtitle: '',
          show: true,
          isOnlyNotification: true
        })
        return;
      }

      if (err.message === 'main purse does not exist') {
        updateNotification({
          type: NotificationType.Error,
          title: 'Main purse does not exist, send CSPR to your wallet first',
          subtitle: '',
          show: true,
          isOnlyNotification: true
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
          isOnlyNotification: true
        })
        return
      }

      if (err.message.includes('Please install the Casper')){
        console.log('err', err.message)
        updateNotification({
          type: NotificationType.Error,
          title: 'This wallet is not installed.',
          subtitle: err.message,
          show: true,
          isOnlyNotification: true
        })
        return;
      }

      updateNotification({
        type: NotificationType.Error,
        title: 'Ooops we have an error',
        subtitle: '',
        show: true,
        isOnlyNotification: true
      });
    }
  }

  const { isConnected, mainPurse } = state;

  useEffect(() => {
    const fn = async () => {
      //refresh()
    };

    fn().catch((e) => log.error(`UPDATE_TOKENS error": ${e}`));
  }, []);

  useEffect(() => {
    window.addEventListener('signer:connected', (msg) => {
      console.log('signer:connected', msg);
    });
    window.addEventListener('signer:disconnected', (msg) => {
      console.log('signer:disconnected', msg);
      //onDisconnectWallet()
    });
    window.addEventListener('signer:tabUpdated', (msg) => {
      //console.log('signer:tabUpdated', msg);
      //onConnectConfig()
    });
    window.addEventListener('signer:activeKeyChanged', async (msg) => {
      console.log('signer:activeKeyChanged', msg);
      setRequestConnectWallet(Math.random() * 1 ** 9);
    });
    window.addEventListener('signer:locked', (msg) => {
      console.log('signer:locked', msg);
    });
    window.addEventListener('signer:unlocked', (msg) => {
      //console.log('signer:unlocked', msg);
      //onConnectConfig()
    });

    window.addEventListener('signer:initialState', (msg) => {
      //console.log('signer:initialState', msg);
      //connect()
    });
  }, []);

  useEffect(() => {
    const fn = async () => {
      //console.log('wat', state)
      if (state?.wallet) {
        await state.wallet.getActiveKey();
        dispatch({
          type: ConfigActions.CONNECT_WALLET,
          payload: { wallet: state.wallet },
        });
        //refresh(state.wallet);
      }
    };

    fn();
  }, [requestConnectWallet]);

  async function onDisconnectWallet(): Promise<void> {
    try {
      if (state.wallet) {
        await state.wallet.disconnect();

        dispatch({ type: ConfigActions.DISCONNECT_WALLET, payload: {} }),
          updateNotification({
            type: NotificationType.Success,
            title: 'Your wallet is disconnected',
            subtitle: '',
            show: true,
            timeToClose: 5000,
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
      {children}
    </WalletProviderContext.Provider>
  );
};
