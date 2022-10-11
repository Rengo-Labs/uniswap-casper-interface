import React, {useState} from 'react'
import {ConnectionPopup} from "../../atoms";
import {PopoverButton} from "../../molecules";

export const ButtonConnectionOver = ({ isConnected, onConnect, onDisconnect, Account = "" }: any) => {
    const [isOpen, setIsOpen] = useState(false)
    const toggling = () => setIsOpen(!isOpen);

    const handleCancel = () => {
        setIsOpen(false)
    }

    const handleConnection = () => {
        onConnect()
        setIsOpen(false)
    }

    const handleDisconnect = () => {
        onDisconnect()
        setIsOpen(false)
    }

    return (
        <div>
            <ConnectionPopup isConnected={isConnected} isOpened={isOpen} toggling={toggling} title="Connect your wallet to CasperSwap" onClose={handleCancel} onConnect={handleConnection} />
            <PopoverButton isConnected={isConnected} isOpened={isOpen} toggling={toggling}  onDisconnect={handleDisconnect} account={Account}/>
        </div>
    )
}