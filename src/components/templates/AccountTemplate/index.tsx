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
  ['accountHash', 'Account Hash'],
  ['publicKey', 'Public Key'],
  ['totalRewardReceived', 'Total reward received'],
  ['stakedAsDelegator', 'Delegated Participation'],
  ['totalBalance', 'Total Balance'],
  ['liquid', 'Liquidity'],
  ['undelegating', 'In Rescue'],
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

    infoTable.push({
      key: 'Raw Data',
      type: MyAccountInfoDataTypes.Link,
      value: "<a href='https://testnet.cspr.live/deploy/6dfb274ff76ae9775d8d6436cb7ec7b9a9fb2f9d0ba0bebf95ba9ecd12d07140/' target='_blank'>Show Raw Data</a>"
    })

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


