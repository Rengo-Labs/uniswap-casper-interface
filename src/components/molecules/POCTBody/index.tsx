import React from 'react'
import { TBody} from './styles'
import {CollapsingRow} from '../CollapsingRow'
import { v4 as uuidv4 } from 'uuid'

export const POCTBody = ({ getTableBodyProps, rows, prepareRow }) => {

    return (
        <TBody {...getTableBodyProps()}>
            {// Loop over the table rows
                rows.map(row => {
                    // Prepare the row for display
                    prepareRow(row)
                    return (
                        // Apply the row props
                        <CollapsingRow key={uuidv4()} row={row} fullExpanded={false} />
                    )
                })
            }
        </TBody>
    )
}
