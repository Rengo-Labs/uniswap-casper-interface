import React from 'react'

import { TDataStyled } from './styles'
export const PoolTData = ({ name, liquidity, volume24h, volume7d, fees24h, anualFeesLiquidity }) => {
  return (
    <>
      <TDataStyled >{name}</TDataStyled>
      <TDataStyled >{liquidity}</TDataStyled>
      <TDataStyled >{volume24h}</TDataStyled>
      <TDataStyled >{volume7d}</TDataStyled>
      <TDataStyled >{fees24h}</TDataStyled>
      <TDataStyled >{anualFeesLiquidity}</TDataStyled>
    </>
  )
}
