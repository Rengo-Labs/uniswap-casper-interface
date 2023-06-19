import React, {createContext, ReactNode, useContext, useState, useMemo, useEffect} from "react";
import {
  LIQUIDITY_GAUGE_V3_CONTRACT_HASH,
  LIQUIDITY_GAUGE_V3_PACKAGE_HASH,
  NotificationType,
  SUPPORTED_NETWORKS
} from "../../constant";
import StakingResponsibilities from '../../commons/StakingResponsibilities'
import {
  apiClient,
  casperClient,
  ConfigProviderContext,
} from '../ConfigContext';
import {WalletProviderContext} from "../WalletContext";
import {notificationStore} from "../../store/store";
import {
  convertUIStringToBigNumber,
  sleep
} from "../../commons";
import {ERROR_BLOCKCHAIN} from "../../constant/errors";
import {StateHashProviderContext} from "../StateHashContext";
import BigNumber from "bignumber.js";
interface StakingContextProps {
    onAddStake: (contractHash: string, amount: BigNumber, decimals: number) => Promise<any>,
    onRemoveStake: (contractHash: string, amount: BigNumber, decimals: number) =>  Promise<any>
    onClaimRewards: (contractHash: string) =>  Promise<any>
    onClaimCSTRewards: (contractHash: string) =>  Promise<any>
    getStakeBalance: (contractHash: string) =>  Promise<any>
}

export const StakingProviderContext = createContext<StakingContextProps>(null);

export const StakingContext = ({children}: { children: ReactNode }) => {
  // TODO include other dependencies
  const {
    setConfirmModal,
    setLinkExplorer,
    setProgressModal,
  } = useContext(ConfigProviderContext)

  const {walletState} = useContext(WalletProviderContext)
  const {refresh} = useContext(StateHashProviderContext)
  const { updateNotification, dismissNotification } = notificationStore()

  async function onAddStake(contractHash: string, amount: BigNumber, decimals: number): Promise<boolean> {
    updateNotification({
      type: NotificationType.Info,
      title: 'Add Stake',
      subtitle: '',
      show: true,
      isOnlyNotification: true,
      closeManually: true
    })

    try {
      const [deployHash, deployResult] = await StakingResponsibilities({casperClient, wallet: walletState.wallet}).onAddStake(
        contractHash,
        convertUIStringToBigNumber(amount, decimals)
      )

      const deployUrl = SUPPORTED_NETWORKS.blockExplorerUrl + `/deploy/${deployHash}`
      setProgressModal(true)
      setLinkExplorer(deployUrl)

      const notificationMessage = `Your deploy is being processed, check <a href="${deployUrl}" target="_blank">here</a>`
      updateNotification({
        type: NotificationType.Info,
        title: 'Processing...',
        subtitle: notificationMessage,
        show: true,
        isOnlyNotification: true,
        closeManually: true,
      })

      const result = await casperClient.waitForDeployExecution(deployHash)

      if (result) {
        updateNotification({
          type: NotificationType.Success,
          title: 'Stake correctly added.',
          subtitle: '',
          show: true,
          isOnlyNotification: true,
          timeToClose: 5000
        })
      }

      setProgressModal(false)
      setConfirmModal(true)

      await sleep(3000)
      await refresh()

      return true
    } catch (err) {
      setProgressModal(false)
      await refresh()
      updateNotification({
        type: NotificationType.Error,
        title: ERROR_BLOCKCHAIN[`${err}`] ? ERROR_BLOCKCHAIN[`${err}`].message : `${err}`,
        subtitle: '',
        show: true,
        isOnlyNotification: true,
        timeToClose: 5000
      })
      return false
    }
  }

  async function onRemoveStake(contractHash: string, amount: BigNumber, decimals: number): Promise<boolean> {
    updateNotification({
      type: NotificationType.Info,
      title: 'Removing Stake',
      subtitle: '',
      show: true,
      isOnlyNotification: true,
      closeManually: true
    })

    try {
      const [deployHash, deployResult] = await StakingResponsibilities({casperClient, wallet: walletState.wallet}).onRemoveStake(
        contractHash,
        convertUIStringToBigNumber(amount, decimals)
      )

      const deployUrl = SUPPORTED_NETWORKS.blockExplorerUrl + `/deploy/${deployHash}`
      setProgressModal(true);
      setLinkExplorer(deployUrl)

      const notificationMessage = `Your deploy is being processed, check <a href="${deployUrl}" target="_blank">here</a>`;
      updateNotification({
        type: NotificationType.Info,
        title: 'Processing...',
        subtitle: notificationMessage,
        show: true,
        isOnlyNotification: true,
        closeManually: true,
      })

      const result = await casperClient.waitForDeployExecution(deployHash)

      if (result) {
        updateNotification({
          type: NotificationType.Success,
          title: 'Stake correctly removed.',
          subtitle: '',
          show: true,
          isOnlyNotification: true,
          timeToClose: 5000
        })
      }

      setProgressModal(false)
      setConfirmModal(true)

      await sleep(3000)
      await refresh()

      return true
    } catch (err) {
      setProgressModal(false)
      await refresh()
      updateNotification({
        type: NotificationType.Error,
        title: ERROR_BLOCKCHAIN[`${err}`] ? ERROR_BLOCKCHAIN[`${err}`].message : `${err}`,
        subtitle: '',
        show: true,
        isOnlyNotification: true,
        timeToClose: 5000
      })
      return false
    }
  }

  async function onClaimRewards(contractHash: string): Promise<boolean> {
    updateNotification({
      type: NotificationType.Info,
      title: 'Claim profit',
      subtitle: '',
      show: true,
      isOnlyNotification: true,
      closeManually: true
    })

    try {
      const [deployHash, deployResult] = await StakingResponsibilities({casperClient, wallet: walletState.wallet})
        .onClaimRewards(contractHash)

      const deployUrl = SUPPORTED_NETWORKS.blockExplorerUrl + `/deploy/${deployHash}`
      setProgressModal(true);
      setLinkExplorer(deployUrl)

      const notificationMessage = `Your deploy is being processed, check <a href="${deployUrl}" target="_blank">here</a>`;
      updateNotification({
        type: NotificationType.Info,
        title: 'Processing...',
        subtitle: notificationMessage,
        show: true,
        isOnlyNotification: true,
        closeManually: true,
      })

      const result = await casperClient.waitForDeployExecution(deployHash)

      if (result) {
        updateNotification({
          type: NotificationType.Success,
          title: 'Profit correctly claimed.',
          subtitle: '',
          show: true,
          isOnlyNotification: true,
          timeToClose: 5000
        })
      }

      setProgressModal(false)
      setConfirmModal(true)

      await sleep(3000)
      await refresh()

      return true
    } catch (err) {
      setProgressModal(false)
      await refresh()
      updateNotification({
        type: NotificationType.Error,
        title: ERROR_BLOCKCHAIN[`${err}`] ? ERROR_BLOCKCHAIN[`${err}`].message : `${err}`,
        subtitle: '',
        show: true,
        isOnlyNotification: true,
        timeToClose: 5000
      })
      return false
    }
  }

  async function onClaimCSTRewards(contractHash: string): Promise<boolean> {
    updateNotification({
      type: NotificationType.Info,
      title: 'Claim profit',
      subtitle: '',
      show: true,
      isOnlyNotification: true,
      closeManually: true
    })

    try {
      const [deployHash, deployResult] = await StakingResponsibilities({casperClient, wallet: walletState.wallet})
        .onClaimCSTRewards(contractHash)

      const deployUrl = SUPPORTED_NETWORKS.blockExplorerUrl + `/deploy/${deployHash}`
      setProgressModal(true);
      setLinkExplorer(deployUrl)

      const notificationMessage = `Your deploy is being processed, check <a href="${deployUrl}" target="_blank">here</a>`;
      updateNotification({
        type: NotificationType.Info,
        title: 'Processing...',
        subtitle: notificationMessage,
        show: true,
        isOnlyNotification: true,
        closeManually: true,
      })

      const result = await casperClient.waitForDeployExecution(deployHash)

      if (result) {
        updateNotification({
          type: NotificationType.Success,
          title: 'CST profit correctly claimed.',
          subtitle: '',
          show: true,
          isOnlyNotification: true,
          timeToClose: 5000
        })
      }

      setProgressModal(false)
      setConfirmModal(true)

      await sleep(3000)
      await refresh()

      return true
    } catch (err) {
      setProgressModal(false)
      await refresh()
      updateNotification({
        type: NotificationType.Error,
        title: ERROR_BLOCKCHAIN[`${err}`] ? ERROR_BLOCKCHAIN[`${err}`].message : `${err}`,
        subtitle: '',
        show: true,
        isOnlyNotification: true,
        timeToClose: 5000
      })
      return false
    }
  }

  const getStakeBalance = async (contractHash: string) => {
    try {
      const balance = await StakingResponsibilities({casperClient, wallet: walletState.wallet})
        .getBalance(contractHash)
      return convertUIStringToBigNumber(balance, 9)
    } catch (e) {
      updateNotification({
        type: NotificationType.Error,
        title: "There's no stake balance to remove",
        subtitle: '',
        show: true,
        isOnlyNotification: true,
        timeToClose: 5000
      })
      console.error("Error getting stake balance for contract", contractHash)
      return '0'
    }
  }


    return (
        <StakingProviderContext.Provider value={{
          onAddStake,
          onRemoveStake,
          onClaimRewards,
          getStakeBalance,
          onClaimCSTRewards
        }}>
            {children}
        </StakingProviderContext.Provider>
    )
}
