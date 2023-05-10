import React, { useContext, useEffect, useState } from 'react'
import { SingleColumn } from '../../../layout/SingleColumn'
import { MyAccountInfoTable, MyAccountInfoDataTypes } from 'rengo-ui-kit'
import { WalletProviderContext } from '../../../contexts/WalletContext';
import { TokensProviderContext } from '../../../contexts/TokensContext';
import { convertAllFormatsToUIFixedString, convertUIStringToBigNumber } from '../../../commons';

interface IAccountInfo {
  accountHash: string
  liquid: string
  publicKey: string
  stakedAsDelegator: number
  totalBalance: number
  totalRewardReceived: string
  undelegating: string
}

interface IAccountTableInfo {
  key: string
  type: MyAccountInfoDataTypes
  value: string
}

const MatchedKeys = new Map([
  ['publicKey', 'Public Key'],
  ['accountHash', 'Account Hash'],
  ['totalRewardReceived', 'Total Rewards Received'],
  ['totalBalance', 'Total Balance'],
  ['stakedAsDelegator', 'Stake as Delegator'],
  ['liquid', 'Liquid'],
  ['undelegating', 'Undelegating'],
])

const csprAmounts = ['totalRewardReceived', 'stakedAsDelegator', 'totalBalance', 'liquid', 'undelegating' ]

export const AccountTemplate = ({isMobile}) => {
  const {
    isConnected,
    walletState
  } = useContext(WalletProviderContext);

  const {
    getAccountDetail,
    getTransactionInfo
  } = useContext(TokensProviderContext)

  const [accountInfoData, setAccountInfoData] = useState<IAccountTableInfo[]>([])
  
  const formatAmount = (value: string | number) => `${convertAllFormatsToUIFixedString(value, 6)} CSPR ($${convertAllFormatsToUIFixedString(value, 2)})`

  const buildAccountInfo = (AccountInfo: IAccountInfo) => {
    const infoTable = []
    for (const infoKey in AccountInfo) {
      const key = MatchedKeys.get(infoKey)

      if (csprAmounts.includes(infoKey)) {
        infoTable.push({
          key,
          type: MyAccountInfoDataTypes.String,
          value: formatAmount(AccountInfo[infoKey])
        })
      } else {
        infoTable.push({
          key,
          type: MyAccountInfoDataTypes.String,
          value: AccountInfo[infoKey]
        })
      }
    }

    setAccountInfoData(infoTable)
  }


  useEffect(() => {

    if (!isConnected) {
      return
    }

    const fetchData = async () => {

      const infoByTopicResponse = await getTransactionInfo(walletState.wallet)
    
      const AccountInfoResponse = await getAccountDetail(walletState.wallet);
      buildAccountInfo(AccountInfoResponse)
    }
    fetchData();
  }, [isConnected]);
  
  return (
    <SingleColumn isMobile={isMobile} title="My Account">
      {accountInfoData.length > 0 && (
        <MyAccountInfoTable data={accountInfoData}/>
      )}
    </SingleColumn>
  )
}


