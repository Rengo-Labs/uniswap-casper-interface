import React, { useContext, useEffect, useState } from "react";
import { SingleColumn } from "../../../layout/SingleColumn";
import {
  MyAccountInfoTable,
  MyAccountInfoDataTypes,
  AccountTabs,
} from "rengo-ui-kit";
import { WalletProviderContext } from "../../../contexts/WalletContext";
import { TokensProviderContext } from "../../../contexts/TokensContext";
import {
  convertAllFormatsToUIFixedString,
  convertUIStringToBigNumber,
} from "../../../commons";
import { Wrapper } from "./styles";
import { useLocation } from "react-router-dom";

interface IAccountInfo {
  accountHash: string;
  liquid: string;
  publicKey: string;
  stakedAsDelegator: number;
  totalBalance: number;
  totalRewardReceived: string;
  undelegating: string;
}

interface IAccountTableInfo {
  key: string;
  type: MyAccountInfoDataTypes;
  value: string;
}

const MatchedKeys = new Map([
  ["accountHash", "Account Hash"],
  ["publicKey", "Public Key"],
  ["totalRewardReceived", "Total reward received"],
  ["stakedAsDelegator", "Delegated Participation"],
  ["totalBalance", "Total Balance"],
  ["liquid", "Liquidity"],
  ["undelegating", "In Rescue"],
]);

const csprAmounts = [
  "totalRewardReceived",
  "stakedAsDelegator",
  "totalBalance",
  "liquid",
  "undelegating",
];

export const AccountTemplate = ({ isMobile }) => {
  const location = useLocation();
  const defaultAccountTab = location?.state?.accountDefaultTab === 'transfer' ? 1 : 0
  
  const { isConnected, walletState } = useContext(WalletProviderContext);

  const { getAccountDetail } = useContext(
    TokensProviderContext
  );

  const [accountInfoData, setAccountInfoData] = useState<IAccountTableInfo[]>(
    []
  );
  const [deployData, setDeployData] = useState<any[]>([
    {
      id: 1,
      deploy_hash: "0da51...2191c",
      block_hash: "cff58...3789d",
      antiquity: "3 days ago",
      contract: "Wrapped Ether ERC-20",
      amount: "0.00003 WETH",
      cost: "2.29277 CSPR",
      price: "0.1025",
    },
    {
      id: 2,
      deploy_hash: "0da51...2191c",
      block_hash: "cff58...3789d",
      antiquity: "3 days ago",
      contract: "Wrapped Ether ERC-20",
      amount: "0.00003 WETH",
      cost: "2.29277 CSPR",
      price: "0.1025",
    },
    {
      id: 3,
      deploy_hash: "0da51...2191c",
      block_hash: "cff58...3789d",
      antiquity: "3 days ago",
      contract: "Wrapped Ether ERC-20",
      amount: "0.00003 WETH",
      cost: "3.29277 CSPR",
      price: "0.1025",
    },
  ]);
  const [transferData, setTransferData] = useState<any[]>([
    {
      id: 1,
      deploy_hash: "0da51...2191c",
      block_hash: "cff58...3789d",
      antiquity: "3 days ago",
      of: "012b3...7f525",
      for: "012b3...7f525",
      transference_id: "-",
      amount: "2.29277 CSPR",
      price: "0.1025",
    },
    {
      id: 2,
      deploy_hash: "0da51...2191c",
      block_hash: "cff58...3789d",
      antiquity: "3 days ago",
      of: "012b3...7f525",
      for: "012b3...7f525",
      transference_id: "-",
      amount: "3.29277 CSPR",
      price: "0.1025",
    },
    {
      id: 3,
      deploy_hash: "0da51...2191c",
      block_hash: "cff58...3789d",
      antiquity: "3 days ago",
      of: "012b3...7f525",
      for: "012b3...7f525",
      transference_id: "-",
      amount: "2.29277 CSPR",
      price: "0.1025",
    },
  ]);
  const formatAmount = (value: string | number) =>
    `${convertAllFormatsToUIFixedString(
      value,
      6
    )} CSPR ($${convertAllFormatsToUIFixedString(value, 2)})`;

  const buildAccountInfo = (AccountInfo: IAccountInfo) => {
    const infoTable = [];
    for (const infoKey in AccountInfo) {
      const key = MatchedKeys.get(infoKey);

      if (csprAmounts.includes(infoKey)) {
        infoTable.push({
          key,
          type: MyAccountInfoDataTypes.String,
          value: formatAmount(AccountInfo[infoKey]),
        });
      } else {
        infoTable.push({
          key,
          type: MyAccountInfoDataTypes.String,
          value: AccountInfo[infoKey],
        });
      }
    }

    setAccountInfoData(infoTable);
  };

  useEffect(() => {
    if (!isConnected) {
      return;
    }

    const fetchData = async () => {
      // const infoByTopicResponse = await getTransactionInfo(walletState.wallet);
      // console.log("infoByTopicResponse", infoByTopicResponse);
      const AccountInfoResponse = await getAccountDetail(walletState.wallet);
      buildAccountInfo(AccountInfoResponse);
    };
    fetchData();
  }, [isConnected]);

  return (
    <SingleColumn isMobile={isMobile} title="My Account">
        {accountInfoData.length > 0 && (
          <MyAccountInfoTable data={accountInfoData} />
        )}
        <br/>
        <AccountTabs deployData={deployData} transferData={transferData} />
    </SingleColumn>
  );
};
