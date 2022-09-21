import React from 'react'
import { TBodyStyled,TRowStyled } from './styles'
import { v4 as uuidv4 } from 'uuid';

export const POCTBody2 = ({ getTableBodyProps, rows, prepareRow }) => {
    return (
        <TBodyStyled {...getTableBodyProps()}>
            {// Loop over the table rows
                rows.map(row => {
                    // Prepare the row for display
                    prepareRow(row)
                    return (
                        // Apply the row props
                        <TRowStyled {...row.getRowProps()} key={uuidv4()}>
                            {// Loop over the rows cells
                                row.cells.map(cell => {
                                    // Apply the cell props
                                    return (
                                        <td {...cell.getCellProps()} key={uuidv4()}>
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
