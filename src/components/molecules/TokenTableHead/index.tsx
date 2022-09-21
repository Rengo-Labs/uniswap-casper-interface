import React from 'react'

import { TableHeadStyled } from './styles'
import { v4 as uuidv4 } from 'uuid';

export const TokenTableHead = ({ headers }) => {
    return (
        <tr>
            {
                headers.map((header, index) => {
                    return (
                        <TableHeadStyled key={uuidv4()}>
                            {/*TODO: Isolate Component*/}
                            {header}
                        </TableHeadStyled>)
                })
            }
        </tr>
    )
}
