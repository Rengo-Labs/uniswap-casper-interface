import { isConnected } from 'casper-js-sdk/dist/lib/Signer'
import React from 'react'
import { ButtonConnectionOver } from '../../organisms'
import { ConnectButtonContainerCC } from '../ConnectButtonContainerCC'
import { NavBarCC } from '../NavBarCC'
import { WordMarkContainerStyledCC } from '../WordMarkContainerStyledCC'

export const NavBarCD = ({
    isConnected,
    onConnect,
    onDisconnect,
    walletAddress,
    WordMarkIcon
}) => (
    <NavBarCC>
        <WordMarkContainerStyledCC>
            <a href='/'>
                {WordMarkIcon}
            </a>
        </WordMarkContainerStyledCC>
        <ConnectButtonContainerCC>
            <ButtonConnectionOver
                isConnected={isConnected}
                onConnect={onConnect}
                onDisconnect={onDisconnect}
                Account={walletAddress}
            />
        </ConnectButtonContainerCC>
    </NavBarCC>
)
