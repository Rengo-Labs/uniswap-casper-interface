import React from 'react'

import { TableStyled, TableData, TableRow } from './styles'

import { TokenTableHead } from '../TokenTableHead'
import { TokenTableRow } from '../TokenTableRow'

export const TokenTable = ({ headers, data }) => {
  //TODO: Split this part
  return (
    <TableStyled>
      <TokenTableHead headers={headers} />
      <TokenTableRow data={data} />
    </TableStyled>

  )
}
