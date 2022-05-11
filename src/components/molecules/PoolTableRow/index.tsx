import React from 'react'

import { TableRow } from './styles'
import { PoolTableData } from '../PoolTableData'
import { v4 as uuidv4 } from 'uuid';

export const PoolTableRow = ({ data }) => {
    return (
        <>
            {
                data.map((row, index) => {
                    return (
                        <TableRow key={uuidv4()}>
                            <PoolTableData {...row} />
                        </TableRow>)
                })
            }
        </>
    )
}
