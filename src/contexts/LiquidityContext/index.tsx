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
    gasFee: number
  ) => Promise<boolean>;
  onRemoveLiquidity: (
    liquidity: number | string,
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
    gasFee: number
  ): Promise<boolean> {
    updateNotification({
      type: NotificationType.Loading,
      title: 'Adding liquidity.',
      subtitle: '',
      show: true,
      isOnlyNotification: true,
    });
    try {
      const [deployHash, deployResult] = await signAndDeployAddLiquidity(
        apiClient,
        casperClient,
        walletState.wallet,
        DEADLINE,
        convertUIStringToBigNumber(amountA),
        convertUIStringToBigNumber(amountB),
        firstTokenSelected,
        secondTokenSelected,
        slippage / 100,
        walletState.mainPurse,
        gasFee
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
        timeToClose: 300000
      });

      const result = await casperClient.waitForDeployExecution(deployHash);
      if (result) {
        updateNotification({
          type: NotificationType.Success,
          title: 'Processing...',
          subtitle: 'Your deploy was successful',
          show: true,
          isOnlyNotification: true,
          timeToClose: 5000
        });
      }

      await refresh();
      setProgressModal(false);
      setConfirmModal(true);

      await refresh();
      return true;
    } catch (err) {
      setProgressModal(false);
      dismissNotification();
      await refresh();
      console.log('onAddLiquidity');
      updateNotification({
        type: NotificationType.Error,
        title: ERROR_BLOCKCHAIN[`${err}`] ? ERROR_BLOCKCHAIN[`${err}`].message : `${err}`,
        subtitle: '',
        show: true,
        isOnlyNotification: true,
      });
      return false;
    }
  }

  async function onRemoveLiquidity(
    liquidity: number | string,
    tokenA: Token,
    tokenB: Token,
    amountA: number | string,
    amountB: number | string,
    slippage: number,
    gasFee: number,
    refundCSPR: boolean
  ): Promise<boolean> {
    updateNotification({
      type: NotificationType.Loading,
      title: 'Removing liquidity',
      subtitle: '',
      show: true,
      isOnlyNotification: true,
    });

    try {
      const [deployHash, deployResult] = await signAndDeployRemoveLiquidity(
        apiClient,
        casperClient,
        walletState.wallet,
        DEADLINE,
        convertUIStringToBigNumber(liquidity),
        convertUIStringToBigNumber(amountA),
        convertUIStringToBigNumber(amountB),
        tokenA,
        tokenB,
        slippage / 100,
        walletState.mainPurse,
        gasFee,
        refundCSPR
      );

      setProgressModal(true);
      setLinkExplorer(SUPPORTED_NETWORKS.blockExplorerUrl + `/deploy/${deployHash}`);

      const result = await casperClient.waitForDeployExecution(deployHash);

      console.log('#### waitForDeployExecution remove liquidity #####', result)

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

      await sleep(15000);
      await refresh();

      return true;
    } catch (err) {
      setProgressModal(false);
      //dismissNotification();
      await refresh();
      console.log('#### onRemoveLiquidity#####', err);
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
