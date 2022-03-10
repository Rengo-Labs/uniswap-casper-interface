import React from 'react'

import { TableStyled, TableData, TableRow } from './styles'
export const PoolTable = ({ headers, data }) => {
  //TODO: Split this part
  return (
    <TableStyled>
      {/*TODO: Isolate Component*/}
      <tr>
        {
          headers.map((header, index) => {
            return (<th key={index}>
              {/*TODO: Isolate Component*/}
              {header}
            </th>)
          })
        }
      </tr>
      {/*TODO: Isolate Component*/}
      {
        data.map((row, index) => {
          return (
            <TableRow key={index}>
              {Object.keys(row).map((name, index) => {
                return (
                  <TableData key={index}>
                    {/*TODO: Isolate Component*/}
                    {row[name]}
                  </TableData>
                )
              })}
            </TableRow>)
        })
      }
    </TableStyled>

  )
}
