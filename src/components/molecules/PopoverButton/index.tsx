import React from 'react';
import {NewIcons} from '../../atoms'
import {
    ButtonStyle,
    ContainerList,
    ItemColumn,
    ItemList, ItemMenu,
    PopoverContainer,
    WalletItemList
} from "./styles";
import toast from "react-hot-toast";
import {ReactComponent as walletConnected} from "../../../assets/newIcons/walletConnectIcon.svg";
import {ReactComponent as copyIcon} from "../../../assets/newIcons/copyIcon.svg";
import {ReactComponent as recentTransactionIcon} from "../../../assets/newIcons/recentTransactionIcon.svg";
import {ReactComponent as disconnectWallet} from "../../../assets/newIcons/disconnectWalletIcon.svg";

export const PopoverButton = ({ isConnected, isOpened, toggling, onDisconnect, account = "" }: any)  => {
    const end = account.length
    const start = account.length - 3
    const wallet = `${account.substring(0, 8)}...${account.substring(start, end)}`
    const walletLabel = `${account.substring(0, 8)}...${account.substring(end - 8, end)}`

    const copyAccount = () => {
        navigator.clipboard.writeText(account)
        toast('copied')
    }

    const redirectToTransactionsList = () => {
        toast('Nothing now')
    }

    return (
        <>
            {
                isConnected &&
                <ButtonStyle isSelected={isConnected} onClick={toggling}><NewIcons Icon={walletConnected} style={{alignSelf: "center", padding: "0", display: "flex"}} size="40px" /> {wallet}</ButtonStyle>
            }
            {
                isConnected &&  isOpened &&
                <PopoverContainer>
                    <ContainerList>
                        <WalletItemList>CONNECT WALLET</WalletItemList>
                        <ItemMenu style={{justifyContent: "center", borderTop: "1px solid black"}} onClick={copyAccount}>
                            <ItemColumn position="center" flex=".75"/>
                            <div style={{flex: "3"}}>{walletLabel}</div>
                            <ItemColumn position="center" flex="1"><NewIcons Icon={copyIcon} style={{alignSelf: "center", display: "flex"}} size="40px" /></ItemColumn>
                        </ItemMenu>
                        <ItemMenu onClick={redirectToTransactionsList}>
                            <ItemColumn position="center" flex="1"><NewIcons Icon={recentTransactionIcon} size="40px" /></ItemColumn>
                            <ItemColumn position="left" flex="3">Recent Transactions</ItemColumn>
                        </ItemMenu>
                        <ItemMenu style={{color: "red"}} onClick={onDisconnect}>
                            <ItemColumn position="center" flex="1"><NewIcons Icon={disconnectWallet} size="40px" /></ItemColumn>
                            <ItemColumn position="left" flex="3">Disconnect Wallet</ItemColumn>
                        </ItemMenu>
                    </ContainerList>
                </PopoverContainer>
            }
        </>
    );
}
