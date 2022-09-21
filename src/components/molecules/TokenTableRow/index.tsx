import React from 'react'

import { TableRow, TableData } from './styles'
import { TokenTableData } from '../TokenTableData'
import { v4 as uuidv4 } from 'uuid';

export const TokenTableRow = ({ data }) => {
    return (
        <>
            {
                data.map((row, index) => {
                    return (
                        <TableRow key={uuidv4()}>
                            <TokenTableData {...row} />
                        </TableRow>)
                })
            }
        </>
    )
}
