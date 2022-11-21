import { isConnected } from 'casper-js-sdk/dist/lib/Signer'
import React from 'react'
import { ButtonConnectionOver } from '../../organisms'
import { ConnectButtonContainerCC } from '../ConnectButtonContainerCC'
import { NavBarCC } from '../NavBarCC'
import { WordMarkContainerStyledCC } from '../WordMarkContainerStyledCC'

export interface NavBarCDProps {
  isConnected: boolean,
  onConnect: (name: string) => void,
  onDisconnect: () => void,
  accountHashString: string,
  WordMarkIcon: React.ReactElement,
}

export const NavBarCD = ({
  isConnected,
  onConnect,
  onDisconnect,
  accountHashString,
  WordMarkIcon
}: NavBarCDProps) => (
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
        accountHashString={accountHashString}
      />
    </ConnectButtonContainerCC>
  </NavBarCC>
)
