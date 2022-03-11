import React from 'react'

import { TableStyled, TableData, TableHead, TableRow } from './styles'
export const PoolTable = ({ headers, data }) => {
  //TODO: Split this part
  return (
    <TableStyled>
      {/*TODO: Isolate Component*/}
      <tr>
        {
          headers.map((header, index) => {
            return (
              <TableHead key={index}>
                {/*TODO: Isolate Component*/}
                {header}
              </TableHead>)
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
