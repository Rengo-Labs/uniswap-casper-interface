import BigNumber from 'bignumber.js';
import React, {
  createContext,
  ReactNode, useContext,
  useState,
} from 'react';
import {NODE_ADDRESS, NotificationType, SUPPORTED_NETWORKS} from '../../constant';

const NETWORK_NAME = Network.CASPER_TESTNET;

import {
  APIClient,
  Client as CasperClient,
  Network,
  convertUIStringToBigNumber,
} from '../../commons';

import { signAndDeployAllowance } from '../../commons/deploys';
import { notificationStore } from '../../store/store';
import { ERROR_BLOCKCHAIN } from "../../constant/errors";
import {WalletProviderContext} from "../WalletContext";
import {StateHashProviderContext} from "../StateHashContext";

export interface ConfigContext {
  slippageToleranceSelected?: number;
  onIncreaseAllow?: (
    amount: number | string,
    contractHash: string,
    decimals?: number,
    optApproval?: string
  ) => Promise<boolean>;
  confirmModal: boolean;
  linkExplorer: string;
  progressModal: boolean;
  // To Delete
  gasPriceSelectedForSwapping?: number;
  gasPriceSelectedForLiquidity?: number;
  setLinkExplorer?: (link: string) => void;
  setProgressModal?: (visible: boolean) => void;
  setConfirmModal?: (visible: boolean) => void;
  adjustedGas?: (baseGas, symbolA, symbolB, numberHop) => number
  showSettings?: boolean
  setShowSettings?: (visible: boolean) => void
  showWalletOptions?: boolean
  setShowWalletOptions?: (visible: boolean) => void
}
export interface PairReserves {
  reserve0: BigNumber.Value
  reserve1: BigNumber.Value
}
export const ConfigProviderContext = createContext<ConfigContext>({} as any);
export const casperClient = new CasperClient(NETWORK_NAME, NODE_ADDRESS);
export const apiClient = new APIClient(casperClient);
const formatter = Intl.NumberFormat('en', { notation: 'compact' });
export const convertNumber = (number: number) => {
  return formatter.format(number);
};

export const ConfigContextWithReducer = ({
  children,
}: {
  children: ReactNode;
}) => {
  const {walletState} = useContext(WalletProviderContext)
  const {refresh} = useContext(StateHashProviderContext)

  const [progressModal, setProgressModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [linkExplorer, setLinkExplorer] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showWalletOptions, setShowWalletOptions] = useState(false);

  const { updateNotification } = notificationStore();

  const {slippageToleranceSelected } = walletState;

  async function onIncreaseAllow(
    amount: number | string,
    contractHash: string,
    decimals = 9,
    optApproval = ""
): Promise<boolean> {
    updateNotification({
      type: NotificationType.Info,
      title: 'Increasing allowance.',
      subtitle: '',
      show: true,
      isOnlyNotification: true,
      closeManually: true,
    });

    try {
      const [deployHash, deployResult] = await signAndDeployAllowance(
        casperClient,
        walletState.wallet,
        contractHash,
        convertUIStringToBigNumber(amount, decimals),
        optApproval
      );

      setProgressModal(true);
      const deployUrl = SUPPORTED_NETWORKS.blockExplorerUrl + `/deploy/${deployHash}`
      setLinkExplorer(deployUrl);

      const notificationMessage = `Your deploy is being processed, check <a href="${deployUrl}" target="_blank">here</a>`;
      updateNotification({
        type: NotificationType.Info,
        title: 'Processing...',
        subtitle: notificationMessage,
        show: true,
        isOnlyNotification: true,
        closeManually: true,
      });

      const result = await casperClient.waitForDeployExecution(deployHash);
      console.log('#### waitForDeployExecution onIncreaseAllow #####', result);

        if (result) {
            updateNotification({
              type: NotificationType.Success,
              title: 'Processed...',
              subtitle: 'Your deploy was successful',
              show: true,
              isOnlyNotification: true,
              timeToClose: 5000
            });
      }
      setProgressModal(false);
      setConfirmModal(true);
      refresh(walletState.wallet);
      return true;
    } catch (err) {
        setProgressModal(false);
      updateNotification({
        type: NotificationType.Error,
        title: ERROR_BLOCKCHAIN[`${err}`] ? ERROR_BLOCKCHAIN[`${err}`].message : `${err}`,
        subtitle: '',
        show: true,
        isOnlyNotification: true,
        timeToClose: 5000
      });
      refresh(walletState.wallet);
      return false;
    }
  }

  const adjustedGas = (baseGas, symbolA, symbolB, numberHop) => {
    const totalGas = baseGas + numberHop * walletState.gasFeeHop

    return symbolA === 'CSPR' || symbolB === 'CSPR' ? totalGas + walletState.wasmGasFee : totalGas
  }

  return (
    <ConfigProviderContext.Provider
      value={{
        slippageToleranceSelected,
        onIncreaseAllow,
        gasPriceSelectedForSwapping: walletState.gasPriceSelectedForSwapping,
        gasPriceSelectedForLiquidity: walletState.gasPriceSelectedForLiquidity,
        setLinkExplorer,
        setProgressModal,
        setConfirmModal,
        confirmModal,
        linkExplorer,
        progressModal,
        adjustedGas,
        showSettings,
        setShowSettings,
        showWalletOptions,
        setShowWalletOptions
      }}
    >
      {children}
    </ConfigProviderContext.Provider>
  );
};
