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
  convertBigNumberToUIString,
  dateConverter,
  shortenString,
} from "../../../commons";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BlockchainInfo,
  TransferInfo,
} from "../../../commons/api/APIBlockchain";
import { v4 as uuid } from "uuid";
import BigNumber from "bignumber.js";

interface IAccountInfo {
  accountHash: string;
  liquid: string;
  publicKey: string;
  stakedAsDelegator: number;
  totalBalance: number;
  totalRewardReceived: string;
  undelegating: string;
}

interface IDeployInfo {
  id: string;
  deploy_hash: string;
  block_hash: string;
  antiquity: string;
  contract: string;
  contractRedirect: () => void;
  handleCopy: () => void;
  entry_point: string;
  amount: string;
  cost: string;
  price: string;
}

interface ITransferInfo {
  id: string;
  deploy_hash: string;
  block_hash: string;
  antiquity: string;
  of: string;
  for: string;
  transference_id: string;
  amount: string;
  price: string;
  handleCopy: () => void;
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
  const defaultAccountTab =
    location?.state?.accountDefaultTab === "transfer" ? 2 : 1;
  const navigate = useNavigate();

  const { isConnected, walletState } = useContext(WalletProviderContext);

  const { getAccountDetail, getTransfersDetail, getDeploysInfo } = useContext(
    TokensProviderContext
  );

  const [accountInfoData, setAccountInfoData] = useState<IAccountTableInfo[]>(
    []
  );
  const [deployData, setDeployData] = useState<IDeployInfo[]>([]);
  const [transferData, setTransferData] = useState<ITransferInfo[]>([]);
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

  const handleContactRedirect = (contractHash: string) =>
    window.open(
      `https://testnet.cspr.live/contract-package/${contractHash}`,
      "_blank"
    );

  const handleCopyToClipboard = (value: string) =>
    navigator.clipboard.writeText(value);

  const buildDeployInfo = (deployInfo: BlockchainInfo[]) => {
    if (!deployInfo) return;
    const deployInfoTable = deployInfo?.map((deployItem: BlockchainInfo) => {
      const deployInfo = {
        id: uuid(),
        deploy_hash: shortenString(deployItem?.deployHash, 5),
        block_hash: shortenString(deployItem?.blockHash, 5),
        antiquity: dateConverter(deployItem?.timestamp),
        contract: deployItem?.packageHash?.contract_name,
        contractRedirect: () =>
          handleContactRedirect(deployItem?.packageHash?.contract_package_hash),
        handleCopy: () => handleCopyToClipboard(deployItem?.deployHash),
        entry_point: deployItem?.entryPoint?.name || "WASM deploy",
        amount: `${convertBigNumberToUIString(
          new BigNumber(deployItem?.amount)
        )} ${deployItem?.packageHash?.metadata?.symbol || "CSPR"}`,
        cost: convertBigNumberToUIString(new BigNumber(deployItem?.cost)),
        price: convertAllFormatsToUIFixedString(deployItem?.currencyCost, 2),
      };
      return deployInfo;
    });
    setDeployData(deployInfoTable);
  };

  const buildTransferInfo = (transferInfo: TransferInfo[]) => {
    if (!transferInfo) return;
    const transferInfoTable = transferInfo?.map(
      (transferItem: TransferInfo) => {
        const transferInfo = {
          id: uuid(),
          deploy_hash: shortenString(transferItem?.deployHash, 5),
          block_hash: shortenString(transferItem?.blockHash, 5),
          antiquity: dateConverter(transferItem?.timestamp),
          of: shortenString(transferItem?.ofAccount, 5),
          for: shortenString(transferItem?.forAccount, 10, 9),
          transference_id: transferItem?.transferId,
          amount: convertBigNumberToUIString(
            new BigNumber(transferItem?.amountInCSPR)
          ),
          price: convertAllFormatsToUIFixedString(transferItem?.amountInUSD, 2),
          handleCopy: () => handleCopyToClipboard(transferItem?.deployHash),
        };
        return transferInfo;
      }
    );
    setTransferData(transferInfoTable);
  };

  useEffect(() => {
    if (!isConnected) {
      return;
    }

    const fetchData = async () => {
      const deployInfoResponse = await getDeploysInfo(walletState.wallet);
      buildDeployInfo(deployInfoResponse);
      const transfersInfoResponse = await getTransfersDetail(
        walletState.wallet
      );
      buildTransferInfo(transfersInfoResponse);
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
      <br />
      {deployData.length > 0 && transferData.length > 0 && (
        <AccountTabs
          deployData={deployData}
          transferData={transferData}
          tabDefault={defaultAccountTab}
        />
      )}
    </SingleColumn>
  );
};
