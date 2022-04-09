import React, { useEffect } from 'react'
import { ButtonStyle } from './styles'

export const ButtonConnection = ({ isConnected, connectionHandler, activePublicKey }) => {
  return (
    <>
      {isConnected && <ButtonStyle isSelected={isConnected} onClick={async () => { await connectionHandler(isConnected) }}>{activePublicKey}</ButtonStyle>}
      {!isConnected && <ButtonStyle isSelected={isConnected} onClick={async () => { await connectionHandler(isConnected) }}>Connect Wallet</ButtonStyle>}
    </>
  )
}
