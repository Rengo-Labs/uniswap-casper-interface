import React from 'react';
import {NewIcons} from '../../atoms'
import {
    ButtonStyle,
    ContainerList,
    ItemColumn,
    ItemList,
    PopoverContainer,
    WalletItemList
} from "./styles";
import {ReactComponent as walletConnected} from "../../../assets/newIcons/walletConnectIcon.svg";
import {ReactComponent as copyIcon} from "../../../assets/newIcons/copyIcon.svg";
import {ReactComponent as recentTransactionIcon} from "../../../assets/newIcons/recentTransactionIcon.svg";
import {ReactComponent as disconnectWallet} from "../../../assets/newIcons/disconnectWalletIcon.svg";

export const PopoverButton = ({ isConnected, isOpened, toggling, onDisconnect, account = "" }: any)  => {
    const end = account.length
    const start = account.length - 8
    const wallet = `${account.substring(0, 8)}...${account.substring(start, end)}`

    const copyAccount = () => {
        navigator.clipboard.writeText(account)
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
                        <ItemList style={{justifyContent: "center"}} onClick={copyAccount}>
                            <ItemColumn position="" flex="3">{wallet}</ItemColumn>
                            <ItemColumn position="" flex="1"><NewIcons Icon={copyIcon} style={{alignSelf: "center", display: "flex"}} size="40px" /></ItemColumn>
                        </ItemList>
                        <ItemList>
                            <ItemColumn position="center" flex="1"><NewIcons Icon={recentTransactionIcon} size="40px" /></ItemColumn>
                            <ItemColumn position="left" flex="3">Recent Transactions</ItemColumn>
                        </ItemList>
                        <ItemList style={{color: "red"}} onClick={onDisconnect}>
                            <ItemColumn position="center" flex="1"><NewIcons Icon={disconnectWallet} size="40px" /></ItemColumn>
                            <ItemColumn position="left" flex="3">Disconnect Wallet</ItemColumn>
                        </ItemList>
                    </ContainerList>
                </PopoverContainer>
            }
        </>
    );
}
