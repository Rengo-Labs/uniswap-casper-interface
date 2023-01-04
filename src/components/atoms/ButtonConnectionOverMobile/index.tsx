import React, {useState} from "react";
import {WalletName} from "../../../commons";
import {PopoverButton} from "../../molecules";
import {ConnectionPopupMobile} from "../ConnectionPopupMobile";


export const ButtonConnectionOverMobile = (  { isConnected,
                                            onConnect,
                                            onDisconnect,
                                            accountHashString = ""}) => {
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

    return (
        <>
            <ConnectionPopupMobile isConnected={isConnected} isOpened={isOpen} onToggle={onToggle} title="Connect your wallet to CasperSwap" onClose={handleCancel} onConnect={handleConnection} />
            {/*<PopoverButton isConnected={isConnected} isOpened={isOpen} onToggle={onToggle} onDisconnect={handleDisconnect} accountHashString={accountHashString} />*/}
        </>
    )
}
