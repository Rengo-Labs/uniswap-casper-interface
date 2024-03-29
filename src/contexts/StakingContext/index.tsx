import React, {createContext, ReactNode, useContext, useState} from "react";
import {NotificationType, SUPPORTED_NETWORKS} from "../../constant";
import StakingResponsibilities from '../../commons/StakingResponsibilities'
import {casperClient, ConfigProviderContext,} from '../ConfigContext';
import {WalletProviderContext} from "../WalletContext";
import {notificationStore} from "../../store/store";
import {stakeNotificationStore} from "../../store/store";
import {convertUIStringToBigNumber, convertBigNumberToUIString,  sleep} from "../../commons";
import {ERROR_BLOCKCHAIN} from "../../constant/errors";
import {StateHashProviderContext} from "../StateHashContext";
import BigNumber from "bignumber.js";
import {TokensProviderContext} from "../TokensContext";
interface StakingContextProps {
    onAddStake: (networkGasFeeStake: number, contractHash: string, amount: BigNumber, decimals: number) => Promise<any>,
    onRemoveStake: (networkGasFeeStake: number, contractHash: string, amount: BigNumber, decimals: number, rewardSymbol: string) =>  Promise<any>
    onClaimRewards: (gasFee, contractHash: string) =>  Promise<any>
    onClaimCSTRewards: (gasFee, contractHash: string) =>  Promise<any>
    getStakeBalance: (contractHash: string) =>  Promise<any>
    onGetStakeRewards: (accountHash: string, deployHash: string) =>  Promise<any>,
    showRewardNotification: (newBalance, retryCounter: number) => Promise<void>,
    rewardToken: string,
    setRewardToken: (rewardToken: string) => void,
    setRewardAmount: (rewardAmount: number) => void
}

export const StakingProviderContext = createContext<StakingContextProps>(null);

export const StakingContext = ({children}: { children: ReactNode }) => {
  // TODO include other dependencies
  const {
    setConfirmModal,
    setLinkExplorer,
    setProgressModal,
  } = useContext(ConfigProviderContext)

  const {tokenState} = useContext(TokensProviderContext)


  const {walletState} = useContext(WalletProviderContext)
  const {refresh} = useContext(StateHashProviderContext)
  const { updateNotification, dismissNotification } = notificationStore()
  const { updateStakeNotification } = stakeNotificationStore()
  const [rewardToken, setRewardToken] = useState('')
  const [rewardAmount, setRewardAmount] = useState(0.00)

  async function onAddStake(networkGasFeeStake: number, contractHash: string, amount: BigNumber, decimals: number): Promise<boolean> {
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
        networkGasFeeStake,
        contractHash,
        convertUIStringToBigNumber(amount, decimals)
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
          title: 'Stake Successfully Added.',
          subtitle: '',
          show: true,
          isOnlyNotification: true,
          timeToClose: 5000
        })
      }

      setProgressModal(false)
      setConfirmModal(true)

      await sleep(2000)
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

  async function onRemoveStake(networkGasFee: number, contractHash: string, amount: BigNumber, decimals: number, rewardSymbol: string): Promise<boolean> {
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
        networkGasFee,
        contractHash,
        convertUIStringToBigNumber(amount, decimals)
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
          title: 'Stake Successfully Removed.',
          subtitle: '',
          show: true,
          isOnlyNotification: true,
          timeToClose: 5000
        })
      }

      setProgressModal(false)
      setConfirmModal(true)

      await sleep(2000)
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

  async function onClaimRewards(gasFee, contractHash: string): Promise<boolean> {
    updateNotification({
      type: NotificationType.Info,
      title: 'Claim Rewards',
      subtitle: '',
      show: true,
      isOnlyNotification: true,
      closeManually: true
    })

    try {
      const [deployHash, deployResult] = await StakingResponsibilities({casperClient, wallet: walletState.wallet})
        .onClaimRewards(gasFee, contractHash)
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
/*
      if (result) {
        const stakeAmountResult = await StakingResponsibilities({casperClient, wallet: walletState.wallet}).getStakeRewards(walletState.wallet.accountHashString, deployHash)

        if(stakeAmountResult.length === 0) {
          updateNotification({
            type: NotificationType.Success,
            title: 'You don\'t have any rewards to be claimed.',
            subtitle: '',
            show: true,
            isOnlyNotification: true,
            timeToClose: 5000
          })
        } else {
          dismissNotification()
          const token = tokenState.tokens[stakeAmountResult[0].symbol]
          if (token == null ) {
            updateNotification({
              type: NotificationType.Success,
              title: 'The claimed token does not exist.',
              subtitle: '',
              show: true,
              isOnlyNotification: true,
              timeToClose: 5000
            })
          } else {

            updateStakeNotification({
              show: true,
              data: {
                amount: convertBigNumberToUIString(stakeAmountResult[0].amount, stakeAmountResult[0].decimals),
                tokenImage: token.logoURI,
                tokenName: token.name,
                symbol: token.symbol
              }
            })
          }
        }
      }*/

      setProgressModal(false)
      setConfirmModal(true)

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

  async function onClaimCSTRewards(gasFee, contractHash: string): Promise<boolean> {
    updateNotification({
      type: NotificationType.Info,
      title: 'Claim Rewards',
      subtitle: '',
      show: true,
      isOnlyNotification: true,
      closeManually: true
    })

    try {
      const [deployHash, deployResult] = await StakingResponsibilities({casperClient, wallet: walletState.wallet})
        .onClaimCSTRewards(gasFee, contractHash)
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
/*
      if (result) {
        const stakeAmountResult = await StakingResponsibilities({casperClient, wallet: walletState.wallet}).getStakeRewards(walletState.wallet.accountHashString, deployHash)

        if(stakeAmountResult.length === 0) {
          updateNotification({
            type: NotificationType.Success,
            title: 'You don\'t have any rewards to be claimed.',
            subtitle: '',
            show: true,
            isOnlyNotification: true,
            timeToClose: 5000
          })
        } else {
          dismissNotification()
          const token = tokenState.tokens[stakeAmountResult[0].symbol]
          if (token == null ) {
            updateNotification({
              type: NotificationType.Success,
              title: 'The claimed token does not exist.',
              subtitle: '',
              show: true,
              isOnlyNotification: true,
              timeToClose: 5000
            })
          } else {
            updateStakeNotification({
              show: true,
              data: {
                amount: convertBigNumberToUIString(BigNumber(stakeAmountResult[0].amount), stakeAmountResult[0].decimals),
                tokenImage: token.logoURI,
                tokenName: token.name,
                symbol: token.symbol
              }
            })
          }
        }
      }
*/
      setProgressModal(false)
      setConfirmModal(true)

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

  const onGetStakeRewards = async (accountHash: string, deployHash: string) => {
    try {
      return await StakingResponsibilities({casperClient, wallet: walletState.wallet})
          .getStakeRewards(accountHash, deployHash)
    } catch (e) {
      console.error("Error getting stake rewards", e)
    }
  }

  const showRewardNotification = async (newBalance, retryCounter: number) => {

    const claimedReward = BigNumber(newBalance).minus(BigNumber(rewardAmount))
    if(retryCounter >= 10 && claimedReward.toNumber() == 0) {
      updateNotification({
        type: NotificationType.Success,
        title: 'You don\'t have any rewards to be claimed.',
        subtitle: '',
        show: true,
        isOnlyNotification: true,
        timeToClose: 5000
      })
    } else {
      dismissNotification()
      const token = tokenState.tokens[rewardToken]
      if (token == null ) {
        updateNotification({
          type: NotificationType.Success,
          title: 'The claimed token does not exist.',
          subtitle: '',
          show: true,
          isOnlyNotification: true,
          timeToClose: 5000
        })
      } else {

        updateStakeNotification({
          show: true,
          data: {
            amount: BigNumber(claimedReward).toString(),
            tokenImage: token.logoURI,
            tokenName: token.name,
            symbol: token.symbol
          }
        })
      }
    }
  }

  return (
      <StakingProviderContext.Provider value={{
        onAddStake,
        onRemoveStake,
        onClaimRewards,
        getStakeBalance,
        onClaimCSTRewards,
        onGetStakeRewards,
        showRewardNotification,
        rewardToken,
        setRewardToken,
        setRewardAmount
      }}>
          {children}
      </StakingProviderContext.Provider>
  )
}
