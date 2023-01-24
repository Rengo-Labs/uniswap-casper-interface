import React from 'react';
import { NewIcons } from '../../atoms'
import {
  ButtonStyle,
  ContainerList,
  ItemColumn,
  ItemList, ItemMenu,
  PopoverContainer,
  WalletItemList
} from "./styles";
import { ReactComponent as walletConnected } from "../../../assets/newIcons/walletConnectIcon.svg";
import { ReactComponent as copyIcon } from "../../../assets/newIcons/copyIcon.svg";
import { ReactComponent as recentTransactionIcon } from "../../../assets/newIcons/recentTransactionIcon.svg";
import { ReactComponent as disconnectWallet } from "../../../assets/newIcons/disconnectWalletIcon.svg";
import { notificationStore } from '../../../store/store';
import { NotificationType } from '../../../constant';

export interface PopoverButtonInterface {
  isConnected: boolean,
  isOpened: boolean,
  onToggle: () => void,
  onDisconnect: () => void,
  accountHashString: string,
}

export const PopoverButton = ({
  isConnected,
  isOpened,
  onToggle,
  onDisconnect,
  accountHashString = "",
}: PopoverButtonInterface) => {
  const end = accountHashString.length
  const start = accountHashString.length - 3
  const wallet = `${accountHashString.substring(0, 8)}...${accountHashString.substring(start, end)}`
  const walletLabel = `${accountHashString.substring(0, 8)}...${accountHashString.substring(end - 8, end)}`
  const { updateNotification } = notificationStore();

  const copyAccount = () => {
    navigator.clipboard.writeText(accountHashString)
    updateNotification({
      type: NotificationType.Info,
      title: 'Copied.',
      subtitle: '',
      show: true,
      chargerBar: true,
      timeToClose: 5
    });
  }

  const redirectToTransactionsList = () => {
    updateNotification({
      type: NotificationType.Info,
      title: 'Nothing now',
      subtitle: '',
      show: true,
      chargerBar: true
    });
  }

    return (
        <>
            {
                isConnected &&
                <ButtonStyle isSelected={isConnected} onClick={onToggle}><NewIcons Icon={walletConnected} size={30} /> {wallet}</ButtonStyle>
            }
            {
                isConnected && isOpened &&
                <PopoverContainer>
                    <ContainerList>
                        <WalletItemList>Wallet Connected</WalletItemList>
                        {/* TODO: remove inline css*/}
                        <ItemMenu style={{ justifyContent: "center", borderTop: "1px solid black" }} onClick={copyAccount}>
                            <ItemColumn position="center" flex=".75" />
                            {/* TODO: remove inline css*/}
                            <div style={{ flex: "3" }}>{walletLabel}</div>
                            {/* TODO: remove inline css*/}
                            <ItemColumn position="center" flex="1"><NewIcons Icon={copyIcon} style={{ alignSelf: "center", display: "flex", color: '#4D4D4D'}} width={40} height={40} size={40} /></ItemColumn>
                        </ItemMenu>
                        <ItemMenu onClick={redirectToTransactionsList}>
                            <ItemColumn position="center" flex="1" padding="0 0 0 1em"><NewIcons Icon={recentTransactionIcon} size={40} /></ItemColumn>
                            <ItemColumn position="left" flex="3">Recent Transactions</ItemColumn>
                        </ItemMenu>
                        {/* TODO: remove inline css*/}
                        <ItemMenu style={{ color: "red" }} onClick={onDisconnect}>
                            <ItemColumn position="center" flex="1" padding="0 0 0 1em"><NewIcons Icon={disconnectWallet} size={40} /></ItemColumn>
                            <ItemColumn position="left" flex="3">Disconnect Wallet</ItemColumn>
                        </ItemMenu>
                    </ContainerList>
                </PopoverContainer>
            }
        </>
    );
}
