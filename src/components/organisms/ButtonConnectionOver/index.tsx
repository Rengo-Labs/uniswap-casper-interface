import React, {useState} from 'react'
import {
  ButtonStyle,
  PopoverButton,
  PopoverContainer,
  ContainerList,
  ItemList,
  ItemColumn
} from './styles'
import {lightTheme} from "../../../contexts/ThemeContext/themes";
import ConnectionPopup from "../../atoms/ConnectionPopup";
import walletConnected from "../../../assets/newIcons/walletConnectIcon.svg";
import disconnectWallet from "../../../assets/newIcons/disconnectWalletIcon.svg";
import { ReactComponent as copyIcon } from "../../../assets/newIcons/copyIcon.svg";
import { ReactComponent as recentTransactionIcon } from "../../../assets/newIcons/recentTransactionIcon.svg";
import {NewIcons} from "../../atoms/NewIcons";

export const ButtonConnectionOver = ({ isConnected, onConnect, onDisconnect, Account = "" }: any) => {
  const end = Account.length
  const start = Account.length - 8
  const wallet = `${Account.substring(0, 8)}...${Account.substring(start, end)}`
  const [isOpen, setIsOpen] = useState(false)
  const toggling = () => setIsOpen(!isOpen);

  const handleCancel = () => {
    setIsOpen(false)
  }

  const handleDisconnect = () => {
    onDisconnect()
    setIsOpen(false)
  }

  const handleConnection = () => {
    onConnect()
    setIsOpen(false)
  }

  return (
    <div>
      {
        !isConnected &&
          <PopoverButton onClick={toggling}>Connect Wallet</PopoverButton>
      }
      {
        !isConnected && <ConnectionPopup title="Connect your wallet to CasperSwap" isShown={isOpen} onClose={handleCancel} onConnect={handleConnection} />
      }
      {
        isConnected &&
          <ButtonStyle isSelected={isConnected} onClick={toggling}><NewIcons Icon={walletConnected} style={{alignSelf: "center", padding: "0", display: "flex"}} size="40px" /> {wallet}</ButtonStyle>
      }
      {
        isConnected &&  isOpen &&
          <PopoverContainer>
            <ContainerList>
              <ItemList style={{justifyContent: "center", paddingTop: "0.7em", paddingBottom: "0.7em", borderTop: "0px", color: lightTheme.secondBackgroundColor, fontFamily: "Epilogue"}}>CONNECT WALLET</ItemList>
              <ItemList style={{justifyContent: "center"}}>
                <ItemColumn position="" flex="3">{wallet}</ItemColumn>
                <ItemColumn position="" flex="1"><NewIcons Icon={copyIcon} style={{alignSelf: "center", display: "flex"}} size="40px" /></ItemColumn>
              </ItemList>
              <ItemList>
                <ItemColumn position="center" flex="1"><NewIcons Icon={recentTransactionIcon} size="40px" /></ItemColumn>
                <ItemColumn position="left" flex="3">Recent Transactions</ItemColumn>
              </ItemList>
              <ItemList style={{color: "red"}} onClick={handleDisconnect}>
                <ItemColumn position="center" flex="1"><NewIcons Icon={disconnectWallet} size="40px" /></ItemColumn>
                <ItemColumn position="left" flex="3">Disconnect Wallet</ItemColumn>
              </ItemList>
            </ContainerList>
          </PopoverContainer>
      }
    </div>
  )
}
