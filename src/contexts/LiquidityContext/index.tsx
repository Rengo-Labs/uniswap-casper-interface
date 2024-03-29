import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
} from 'react';
import {
  calculateLiquidityDetails,
  convertUIStringToBigNumber,
  LiquidityDetails,
  signAndDeployAddLiquidity,
  signAndDeployRemoveLiquidity,
  sleep,
  Token,
} from '../../commons';
import { DEADLINE, NotificationType, SUPPORTED_NETWORKS } from '../../constant';
import {
  apiClient,
  casperClient,
  ConfigProviderContext,
} from '../ConfigContext';
import BigNumber from 'bignumber.js';
import { notificationStore } from '../../store/store';
import {ERROR_BLOCKCHAIN} from "../../constant/errors";
import {TokensProviderContext} from "../TokensContext";
import {StateHashProviderContext} from "../StateHashContext";
import {WalletProviderContext} from "../WalletContext";

export interface LiquidityContext {
  onAddLiquidity: (
    amountA: number | string,
    amountB: number | string,
    slippage: number,
    gasFee: number,
    pairHash: string
  ) => Promise<boolean>;
  onRemoveLiquidity: (
    liquidity: number | string,
    liquidityDecimals: number,
    tokenA: Token,
    tokenB: Token,
    amountA: number | string,
    amountB: number | string,
    slippage: number,
    gasFee: number,
    refundCSPR: boolean
  ) => Promise<boolean>;
  getLiquidityDetails: (
    tokenA: Token,
    tokenB: Token,
    reserve0: BigNumber.Value,
    reserve1: BigNumber.Value,
    inputValue: BigNumber.Value,
    token: Token,
    slippage?: number,
    fee?: number
  ) => Promise<LiquidityDetails>;
  isRemovingPopupOpen?: boolean;
  setRemovingPopup?: any;
}

export const LiquidityProviderContext = createContext<LiquidityContext>(
  {} as any
);

export const LiquidityContext = ({ children }: { children: ReactNode }) => {
  const {
    setConfirmModal,
    setLinkExplorer,
    setProgressModal,
  } = useContext(ConfigProviderContext);

  const {walletState} = useContext(WalletProviderContext)
  const {refresh} = useContext(StateHashProviderContext)
  const {firstTokenSelected, secondTokenSelected} = useContext(TokensProviderContext)

  const [isRemovingPopupOpen, setRemovingPopup] = useState(false);
  const { updateNotification, dismissNotification } = notificationStore();

  async function onAddLiquidity(
    amountA: number | string,
    amountB: number | string,
    slippage: number,
    gasFee: number,
    pairHash: string
  ): Promise<boolean> {
    updateNotification({
      type: NotificationType.Info,
      title: 'Processing...',
      subtitle: '',
      show: true,
      isOnlyNotification: true,
      timeToClose: 5000,
      closeManually: true
    });
    try {
      const [deployHash, deployResult] = await signAndDeployAddLiquidity(
        apiClient,
        casperClient,
        walletState.wallet,
        DEADLINE,
        convertUIStringToBigNumber(amountA, firstTokenSelected.decimals),
        convertUIStringToBigNumber(amountB, secondTokenSelected.decimals),
        firstTokenSelected,
        secondTokenSelected,
        slippage / 100,
        walletState.mainPurse,
        gasFee,
        pairHash
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
        closeManually: true
      });

      const result = await casperClient.waitForDeployExecution(deployHash);
      if (result) {
        updateNotification({
          type: NotificationType.Success,
          title: 'Processed...',
          subtitle: 'Your deploy was successful',
          show: true,
          isOnlyNotification: true,
          timeToClose: 5000,
        });
      }

      await refresh();
      setProgressModal(false);
      setConfirmModal(true);

      return true;
    } catch (err) {
      setProgressModal(false);
      dismissNotification();
      await refresh();
      updateNotification({
        type: NotificationType.Error,
        title: ERROR_BLOCKCHAIN[`${err}`] ? ERROR_BLOCKCHAIN[`${err}`].message : `${err}`,
        subtitle: '',
        show: true,
        isOnlyNotification: true,
        timeToClose: 5000,
      });
      return false;
    }
  }

  async function onRemoveLiquidity(
    liquidity: number | string,
    liquidityDecimals: number,
    tokenA: Token,
    tokenB: Token,
    amountA: number | string,
    amountB: number | string,
    slippage: number,
    gasFee: number,
    refundCSPR: boolean
  ): Promise<boolean> {
    updateNotification({
      type: NotificationType.Info,
      title: 'Removing liquidity',
      subtitle: '',
      show: true,
      isOnlyNotification: true,
      closeManually: true
    });

    try {
      const [deployHash, deployResult] = await signAndDeployRemoveLiquidity(
        apiClient,
        casperClient,
        walletState.wallet,
        DEADLINE,
        convertUIStringToBigNumber(liquidity, liquidityDecimals),
        convertUIStringToBigNumber(amountA, tokenA.decimals),
        convertUIStringToBigNumber(amountB, tokenB.decimals),
        tokenA,
        tokenB,
        slippage / 100,
        walletState.mainPurse,
        gasFee,
        refundCSPR
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

      const deployUrl = SUPPORTED_NETWORKS.blockExplorerUrl + `/deploy/${deployHash}`
      setProgressModal(true);
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

      if (result) {
        updateNotification({
          type: NotificationType.Success,
          title: 'Liquidity correctly removed.',
          subtitle: '',
          show: true,
          isOnlyNotification: true,
          timeToClose: 5000
        });
      }

      setProgressModal(false);
      setConfirmModal(true);

      await sleep(2000);
      await refresh();

      return true;
    } catch (err) {
      setProgressModal(false);
      //dismissNotification();
      await refresh();
      updateNotification({
        type: NotificationType.Error,
        title: ERROR_BLOCKCHAIN[`${err}`] ? ERROR_BLOCKCHAIN[`${err}`].message : `${err}`,
        subtitle: '',
        show: true,
        isOnlyNotification: true,
        timeToClose: 5000
      });
      return false
    }
  }

  async function getLiquidityDetails(
    tokenA: Token,
    tokenB: Token,
    reserve0: BigNumber.Value,
    reserve1: BigNumber.Value,
    inputValue: BigNumber.Value,
    token: Token,
    slippage = 0.005,
    fee = 0.003
  ): Promise<LiquidityDetails> {
    return calculateLiquidityDetails(
      apiClient,
      tokenA,
      tokenB,
      reserve0,
      reserve1,
      inputValue,
      token,
      slippage,
      fee
    );
  }

  return (
    <LiquidityProviderContext.Provider
      value={{
        onAddLiquidity,
        onRemoveLiquidity,
        getLiquidityDetails,
        isRemovingPopupOpen,
        setRemovingPopup,
      }}
    >
      {children}
    </LiquidityProviderContext.Provider>
  );
};
