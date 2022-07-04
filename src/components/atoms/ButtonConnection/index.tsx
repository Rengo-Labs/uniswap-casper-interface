import React, { useEffect } from 'react'
import { ButtonStyle } from './styles'

export const ButtonConnection = ({ isConnected, onConnect, onDisconnect, Account = "" }) => {
  const end = Account.length
  const start = Account.length - 8
  const wallet = `${Account.substring(0, 8)}...${Account.substring(start, end)}`
  return (
    <>
      {!isConnected && <ButtonStyle isSelected={isConnected} onClick={() => { onConnect() }}>Connect Wallet</ButtonStyle>}
      {isConnected && <ButtonStyle isSelected={isConnected} onClick={() => { onDisconnect() }}>{wallet}</ButtonStyle>}
    </>
  )
}
