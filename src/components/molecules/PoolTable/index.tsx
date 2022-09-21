import React from 'react'

import { TableStyled } from './styles'

import { TokenTableHead } from '../TokenTableHead'
import { PoolTableRow } from '../PoolTableRow'

export const PoolTable = ({ headers, data }) => {
  //TODO: Split this part
  return (
    <TableStyled>
      <TokenTableHead headers={headers} />
      <PoolTableRow data={data} />
    </TableStyled>

  )
}
