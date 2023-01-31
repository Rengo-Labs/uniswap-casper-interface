import React, {
  createContext,
  ReactNode,
  useContext,
  useReducer,
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
import { DEADLINE, NotificationType } from '../../constant';
import {
  apiClient,
  casperClient,
  ConfigProviderContext,
} from '../ConfigContext';
import BigNumber from 'bignumber.js';
import { notificationStore } from '../../store/store';
import {ERROR_BLOCKCHAIN} from "../../constant/errors";

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
  ) => Promise<boolean>;
  getLiquidityDetails: (
    tokenA: Token,
    tokenB: Token,
    reserve0: BigNumber.Value,
    reserve1: BigNumber.Value,
    inputValue: BigNumber.Value,
    token: Token,
    slippage: number,
    fee: number
  ) => Promise<LiquidityDetails>;
  isRemovingPopupOpen?: boolean;
  setRemovingPopup?: any;
}

export const LiquidityProviderContext = createContext<LiquidityContext>(
  {} as any
);

export const LiquidityContext = ({ children }: { children: ReactNode }) => {
  const {
    firstTokenSelected,
    secondTokenSelected,
    refreshAll,
    configState,
    setConfirmModal,
    setLinkExplorer,
    setProgressModal,
  } = useContext(ConfigProviderContext);

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
      chargerBar: false,
    });
    try {
      const [deployHash, deployResult] = await signAndDeployAddLiquidity(
        apiClient,
        casperClient,
        configState.wallet,
        DEADLINE,
        convertUIStringToBigNumber(amountA),
        convertUIStringToBigNumber(amountB),
        firstTokenSelected,
        secondTokenSelected,
        slippage / 100,
        configState.mainPurse,
        gasFee
      );

      setProgressModal(true);
      setLinkExplorer(`https://testnet.cspr.live/deploy/${deployHash}`);

      const result = await casperClient.waitForDeployExecution(deployHash);
      setProgressModal(false);
      setConfirmModal(true);

      await refreshAll();
      updateNotification({
        type: NotificationType.Success,
        title: 'Success.',
        subtitle: '',
        show: true,
        chargerBar: true,
      });
      return true;
    } catch (err) {
      setProgressModal(false);
      dismissNotification();
      await refreshAll();
      console.log('onAddLiquidity');
      updateNotification({
        type: NotificationType.Error,
        title: ERROR_BLOCKCHAIN[`${err}`] ? ERROR_BLOCKCHAIN[`${err}`].message : `${err}`,
        subtitle: '',
        show: true,
        chargerBar: true,
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
  ): Promise<boolean> {
    updateNotification({
      type: NotificationType.Loading,
      title: 'Removing liquidity',
      subtitle: '',
      show: true,
      chargerBar: false,
    });

    try {
      const [deployHash, deployResult] = await signAndDeployRemoveLiquidity(
        apiClient,
        casperClient,
        configState.wallet,
        DEADLINE,
        convertUIStringToBigNumber(liquidity),
        convertUIStringToBigNumber(amountA),
        convertUIStringToBigNumber(amountB),
        tokenA,
        tokenB,
        slippage / 100,
        configState.mainPurse,
        gasFee,
      );

      setProgressModal(true);
      setLinkExplorer(`https://testnet.cspr.live/deploy/${deployHash}`);

      const result = await casperClient.waitForDeployExecution(deployHash);
      setProgressModal(false);
      setConfirmModal(true);

      await sleep(15000);
      await refreshAll();
      updateNotification({
        type: NotificationType.Success,
        title: 'Success.',
        subtitle: '',
        show: true,
        chargerBar: true,
      });
      return true;
    } catch (err) {
      setProgressModal(false);
      dismissNotification();
      await refreshAll();
      console.log('onRemoveLiquidity');
      updateNotification({
        type: NotificationType.Error,
        title: ERROR_BLOCKCHAIN[`${err}`] ? ERROR_BLOCKCHAIN[`${err}`].message : `${err}`,
        subtitle: '',
        show: true,
        chargerBar: true,
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
