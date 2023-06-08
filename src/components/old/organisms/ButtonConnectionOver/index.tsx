import React, { useState } from 'react'
import { WalletName } from '../../../../commons';
import { ConnectionPopup } from "../../atoms";
import { PopoverButton } from "../../molecules";

export interface ButtonConnectionOverProps {
  isConnected: boolean,
  onConnect: (name: WalletName) => void,
  onDisconnect: () => void,
  accountHashString: string,
}

export const ButtonConnectionOver = ({
  isConnected,
  onConnect,
  onDisconnect,
  accountHashString = ""
}: ButtonConnectionOverProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const onToggle = () => setIsOpen(!isOpen);

  const handleCancel = () => {
    setIsOpen(false)
  }

  const handleConnection = (name: WalletName) => {
    onConnect(name)
    setIsOpen(false)
  }

  const handleDisconnect = () => {
    onDisconnect()
    setIsOpen(false)
  }

  const handleMouseLeave = () => {
    setIsOpen(false)
  }

  return (
    <>
      <ConnectionPopup isConnected={isConnected} isOpened={isOpen} onToggle={onToggle} title="Connect your wallet to CasperSwap" onClose={handleCancel} onConnect={handleConnection} />
      <PopoverButton isConnected={isConnected} isOpened={isOpen} onMouseLeave={handleMouseLeave} onToggle={onToggle} onDisconnect={handleDisconnect} accountHashString={accountHashString} />
    </>
  )
}
