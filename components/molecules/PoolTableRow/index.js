import React from 'react'

import { TableRow } from './styles'
import { PoolTableData } from '../PoolTableData'
export const PoolTableRow = ({ data }) => {
    return (
        <>
            {
                data.map((row, index) => {
                    return (
                        <TableRow key={index}>
                            <PoolTableData {...row} />
                        </TableRow>)
                })
            }
        </>
    )
}
