import React from 'react'

import { TableRow, TableData } from './styles'
import { TokenTableData } from '../TokenTableData'
export const TokenTableRow = ({ data }) => {
    return (
        <>
            {
                data.map((row, index) => {
                    return (
                        <TableRow key={index}>
                            <TokenTableData {...row} />
                        </TableRow>)
                })
            }
        </>
    )
}
