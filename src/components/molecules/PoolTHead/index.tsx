import React from 'react'

import { TRow } from '../../atoms'

import { THeadStyled } from './styles'
import { v4 as uuidv4 } from 'uuid';


export const PoolTHead = ({ headers }) => {
  return (
    <TRow>
      {headers.map(header => {
        return <THeadStyled key={uuidv4()}>{header}</THeadStyled>
      })}
    </TRow>
  )
}
