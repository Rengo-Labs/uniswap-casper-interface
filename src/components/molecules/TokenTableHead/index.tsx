import React from 'react'

import { TableHeadStyled } from './styles'

export const TokenTableHead = ({ headers }) => {
    return (
        <tr>
            {
                headers.map((header, index) => {
                    return (
                        <TableHeadStyled key={index}>
                            {/*TODO: Isolate Component*/}
                            {header}
                        </TableHeadStyled>)
                })
            }
        </tr>
    )
}
