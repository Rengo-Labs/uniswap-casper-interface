import React, { useEffect } from 'react'
import { ButtonStyle } from './styles'

export const ButtonConnection = ({ isConnected, onConnect, onDisconnect,Account="" }) => {
  const end = Account.length
  const start = Account.length - 15
  return (
    <>
      {!isConnected && <ButtonStyle isSelected={isConnected} onClick={() => { onConnect() }}>Connect Wallet</ButtonStyle> }
      {isConnected && <ButtonStyle isSelected={isConnected} onClick={() => { onDisconnect() }}>{"..." + Account.substring(start,end)}</ButtonStyle> }
    </>
  )
}
