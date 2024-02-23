import BigNumber from 'bignumber.js';
import React, {
  createContext,
  ReactNode, useContext,
  useState,
} from 'react';
import {
  GAS_FEE_FOR_CST_CLAIM, GAS_FEE_FOR_GAUGE_CLAIM,
  NODE_ADDRESS,
  NotificationType,
  ROUTER_PACKAGE_HASH,
  SUPPORTED_NETWORKS
} from '../../constant';

import {networkName} from '../../constant/bootEnvironmet'
const NETWORK_NAME = networkName

import {
  APIClient,
  Client as CasperClient,
  convertUIStringToBigNumber, sleep,
} from '../../commons';

import { signAndDeployAllowance } from '../../commons/deploys';
import { notificationStore } from '../../store/store';
import { ERROR_BLOCKCHAIN } from "../../constant/errors";
import {WalletProviderContext} from "../WalletContext";
import {StateHashProviderContext} from "../StateHashContext";
import {PairsContextProvider} from "../PairsContext";
import {PairActions} from "../../reducers/PairsReducer";
import {TokensProviderContext} from "../TokensContext";
import store from "store2";

export interface ConfigContext {
  slippageToleranceSelected?: number;
  onIncreaseAllow?: (
    amount: number | string,
    contractHash: string,
    decimals?: number,
    optApproval?: string,
    gaugeSpender?: string,
    name?: string,
    isPairContract?: boolean,
    isGauge?: boolean
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
  gasFeeCST?: number
  gasFeeETH?: number
  setGasFeeCST?: (value) => void
  setGasFeeETH?: (value) => void
}
export interface PairReserves {
  reserve0: BigNumber.Value
  reserve1: BigNumber.Value
  decimals0: BigNumber.Value
  decimals1: BigNumber.Value
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
  const {reloadGaugeAllowances} = useContext(PairsContextProvider)
  const {reloadTokenAllowances} = useContext(TokensProviderContext)

  const [progressModal, setProgressModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [linkExplorer, setLinkExplorer] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [gasFeeCST, setGasFeeCST] = useState(store.get('handleCSTNetworkGasFee') ?? GAS_FEE_FOR_CST_CLAIM);
  const [gasFeeETH, setGasFeeETH] = useState(store.get('handleETHNetworkGasFee') ?? GAS_FEE_FOR_GAUGE_CLAIM);

  const { updateNotification } = notificationStore();

  const {slippageToleranceSelected } = walletState;

  async function onIncreaseAllow(
    amount: number | string,
    contractHash: string,
    decimals = 9,
    optApproval = "",
    gaugeSpender = null,
    name = null,
    isPairContract = false,
    isGauge = false
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
        optApproval,
        gaugeSpender
      )
      if (!deployHash) {
        setProgressModal(false)
        updateNotification({
          type: NotificationType.Error,
          title: 'Transaction was cancelled',
          subtitle: '',
          show: true,
          timeToClose: 3000,
          isOnlyNotification: true
        });
        return false
      }

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

      await refresh(walletState.wallet)
      if (result) {
        await sleep(2000)
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
      return false;
    }
  }

  const reloadAllowances = async (name, decimals, contractHash, gaugeSpender, isPairContract, isGauge): Promise<void> => {
    if (isPairContract) {
      await reloadGaugeAllowances(walletState.wallet, name, decimals, contractHash,
        isGauge ? gaugeSpender : ROUTER_PACKAGE_HASH,
        isGauge ? PairActions.ADD_GAUGE_ALLOWANCE_TO_PAIR : PairActions.ADD_ALLOWANCE_TO_PAIR)
    } else {
      await reloadTokenAllowances(walletState.wallet, name, decimals, contractHash)
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
        setShowWalletOptions,
        gasFeeCST,
        gasFeeETH,
        setGasFeeCST,
        setGasFeeETH
      }}
    >
      {children}
    </ConfigProviderContext.Provider>
  );
};
