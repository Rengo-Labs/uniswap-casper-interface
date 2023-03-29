import BigNumber from 'bignumber.js';
import React, {
  createContext,
  ReactNode, useContext,
  useState,
} from 'react';
import { NODE_ADDRESS, NotificationType } from '../../constant';

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
    contractHash: string
  ) => Promise<boolean>;
  confirmModal: boolean;
  linkExplorer: string;
  progressModal: boolean;
  // To Delete
  gasPriceSelectedForSwapping?: number;
  gasPriceSelectedForLiquidity?: number;
  gasFeeHop?: number,
  setLinkExplorer?: (link: string) => void;
  setProgressModal?: (visible: boolean) => void;
  setConfirmModal?: (visible: boolean) => void;
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
  const { updateNotification } = notificationStore();

  const {slippageToleranceSelected } = walletState;

  async function onIncreaseAllow(
    amount: number | string,
    contractHash: string
  ): Promise<boolean> {
    updateNotification({
      type: NotificationType.Loading,
      title: 'Increasing allowance.',
      subtitle: '',
      show: true,
      chargerBar: false
    });

    try {
      const [deployHash, deployResult] = await signAndDeployAllowance(
        casperClient,
        walletState.wallet,
        contractHash,
        convertUIStringToBigNumber(amount)
      );

      setProgressModal(true);
      setLinkExplorer(`https://testnet.cspr.live/deploy/${deployHash}`);

      const result = await casperClient.waitForDeployExecution(deployHash);
      setProgressModal(false);
      setConfirmModal(true);
      updateNotification({
        type: NotificationType.Success,
        title: 'Success',
        subtitle: '',
        show: true,
        chargerBar: true
      });
      refresh(walletState.wallet);
      return true;
    } catch (err) {
      setProgressModal(false);
      updateNotification({
        type: NotificationType.Error,
        title: ERROR_BLOCKCHAIN[`${err}`] ? ERROR_BLOCKCHAIN[`${err}`].message : `${err}`,
        subtitle: '',
        show: true,
        chargerBar: true
      });
      refresh(walletState.wallet);
      return false;
    }
  }

  return (
    <ConfigProviderContext.Provider
      value={{
        slippageToleranceSelected,
        onIncreaseAllow,
        gasPriceSelectedForSwapping: walletState.gasPriceSelectedForSwapping,
        gasPriceSelectedForLiquidity: walletState.gasPriceSelectedForLiquidity,
        gasFeeHop: walletState.gasFeeHop,
        setLinkExplorer,
        setProgressModal,
        setConfirmModal,
        confirmModal,
        linkExplorer,
        progressModal,
      }}
    >
      {children}
    </ConfigProviderContext.Provider>
  );
};
