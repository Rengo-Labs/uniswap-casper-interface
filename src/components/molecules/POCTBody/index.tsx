import React from 'react'
import { TBody} from './styles'
import {CollapsingRow} from '../'
import { v4 as uuidv4 } from 'uuid'
import {PoolsProviderContext} from "../../../contexts/PoolsContext";

export const POCTBody = ({ getTableBodyProps, rows, prepareRow }) => {

    const { isStaked, filter } = React.useContext(PoolsProviderContext)

    return (
        <TBody {...getTableBodyProps()}>
            {// Loop over the table rows
                rows.map(row => {
                    // Prepare the row for display
                    prepareRow(row)
                    return (
                        // Apply the row props
                        (!isStaked || filter(isStaked, row)) &&
                        <CollapsingRow key={uuidv4()} row={row} fullExpanded={false} />
                    )
                })
            }
        </TBody>
    )
}
