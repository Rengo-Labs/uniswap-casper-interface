import React, { createContext, ReactNode, useContext, useReducer } from 'react';

import {
  calculateSwapDetails,
  convertUIStringToBigNumber,
  signAndDeploySwap,
  SwapDetails,
  Token,
} from '../../commons';
import {DEADLINE, NotificationType, PLATFORM_GAS_FEE, SUPPORTED_NETWORKS} from '../../constant';
import {
  apiClient,
  casperClient,
  ConfigProviderContext,
} from '../ConfigContext';
import BigNumber from 'bignumber.js';
import { notificationStore } from '../../store/store';
import {ERROR_BLOCKCHAIN} from "../../constant/errors";
import {TokensProviderContext} from "../TokensContext";
import {WalletProviderContext} from "../WalletContext";
import {StateHashProviderContext} from "../StateHashContext";

export interface SwapContext {
  onConfirmSwapConfig: (
    amountA: number | string,
    amountB: number | string,
    slippage: number,
    gasFee: number
  ) => Promise<boolean>;
  getSwapDetails: (
    tokenA: Token,
    tokenB: Token,
    reserve0: BigNumber.Value,
    reserve1: BigNumber.Value,
    inputValue: BigNumber.Value,
    token: Token,
    slippage?: number,
    fee?: number
  ) => Promise<SwapDetails>;
}

export const SwapProviderContext = createContext<SwapContext>({} as any);

export const SwapContext = ({ children }: { children: ReactNode }) => {
  const {
    setConfirmModal,
    setLinkExplorer,
    setProgressModal,
  } = useContext(ConfigProviderContext);

  const {refresh} = useContext(StateHashProviderContext)
  const {walletState} = useContext(WalletProviderContext)
  const {firstTokenSelected, secondTokenSelected} = useContext(TokensProviderContext)
  const { updateNotification } = notificationStore();

  async function onConfirmSwapConfig(
    amountA: number | string,
    amountB: number | string,
    slippage: number,
    gasFee: number
  ): Promise<boolean> {
    updateNotification({
      type: NotificationType.Loading,
      title: 'Swapping.',
      subtitle: '',
      show: true,
      chargerBar: false
    });
    try {


      const [deployHash, deployResult] = await signAndDeploySwap(
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
      setLinkExplorer(SUPPORTED_NETWORKS.blockExplorerUrl + `/deploy/${deployHash}`);

      const result = await casperClient.waitForDeployExecution(deployHash);

      setProgressModal(false);
      setConfirmModal(true);
      updateNotification({
        type: NotificationType.Success,
        title: 'Success.',
        subtitle: '',
        show: true,
        chargerBar: true
      });
      await refresh();
      return true;
    } catch (err) {
      setProgressModal(false);
      console.log('onConfirmSwapConfig');
      updateNotification({
        type: NotificationType.Error,
        title: ERROR_BLOCKCHAIN[`${err}`] ? ERROR_BLOCKCHAIN[`${err}`].message : `${err}`,
        subtitle: '',
        show: true,
        chargerBar: true
      });
      return false;
    }
  }

  /***
   * it returns tokensToTransfer, priceImpact, minTokenBToTransfer, exchangeRateA and exchangeRateB that belong to the swap detail
   * @param tokenA first token
   * @param tokenB second token
   * @param reserve0 first token reserve in pair
   * @param reserve1 second token reserve in pair
   * @param inputValue input tokens
   * @param token input token types matching one of tokenA or tokenB
   * @param slippage decimal slippage
   * @param fee decimal fee
   *
   * @return SwapDetails
   */
  async function getSwapDetails(
    tokenA: Token,
    tokenB: Token,
    reserve0: BigNumber.Value,
    reserve1: BigNumber.Value,
    inputValue: BigNumber.Value,
    token: Token,
    slippage = 0.005,
    fee = PLATFORM_GAS_FEE
  ): Promise<SwapDetails> {
    return calculateSwapDetails(
      apiClient,
      tokenA,
      tokenB,
      reserve0,
      reserve1,
      inputValue,
      token,
      slippage
    );
  }

  return (
    <SwapProviderContext.Provider
      value={{
        onConfirmSwapConfig,
        getSwapDetails,
      }}
    >
      {children}
    </SwapProviderContext.Provider>
  );
};
