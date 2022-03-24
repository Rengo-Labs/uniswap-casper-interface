import React from 'react'

import { TRow } from '../../atoms'

import { THeadStyled } from './styles'
export const PoolTHead = ({ headers }) => {
  return (
    <TRow>
      {headers.map(header => {
        return <THeadStyled>{header}</THeadStyled>
      })}
    </TRow>
  )
}
