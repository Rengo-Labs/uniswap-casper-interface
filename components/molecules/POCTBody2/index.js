import React from 'react'
import { TBodyStyled,TRowStyled } from './styles'

export const POCTBody2 = ({ getTableBodyProps, rows, prepareRow }) => {
    return (
        <TBodyStyled {...getTableBodyProps()}>
            {// Loop over the table rows
                rows.map(row => {
                    // Prepare the row for display
                    prepareRow(row)
                    return (
                        // Apply the row props
                        <TRowStyled {...row.getRowProps()}>
                            {// Loop over the rows cells
                                row.cells.map(cell => {
                                    // Apply the cell props
                                    return (
                                        <td {...cell.getCellProps()}>
                                            {// Render the cell contents
                                                cell.render('Cell')}
                                        </td>
                                    )
                                })}
                        </TRowStyled>
                    )
                })}
        </TBodyStyled>
    )
}
