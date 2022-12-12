import React from 'react'
import { TBody} from './styles'
import {CollapsingRow} from '../'
import { v4 as uuidv4 } from 'uuid'
import {ConfigProviderContext} from "../../../contexts/ConfigContext"
import { Row, TableBodyPropGetter, TableBodyProps } from 'react-table'
import { PairData } from '../../../reducers/PairsReducer'

export interface POCTBodyProps {
    getTableBodyProps: (propGetter?: TableBodyPropGetter<PairData>) => TableBodyProps,
    rows: Row<PairData>[],
    prepareRow: (row: Row<PairData>) => void,
}

export const POCTBody = ({ 
    getTableBodyProps, 
    rows, 
    prepareRow 
}: POCTBodyProps) => {
    const { isStaked, filter, setRemovingPopup } = React.useContext(ConfigProviderContext)

    return (
        <TBody {...getTableBodyProps()}>
            {// Loop over the table rows
                rows.map((row: Row<PairData>) => {
                    // Prepare the row for display
                    prepareRow(row)
                    return (
                        // Apply the row props
                        (!isStaked || filter(isStaked, row)) &&
                        <CollapsingRow key={uuidv4()} row={row} fullExpanded={false} onRemovingPopupListener={setRemovingPopup} />
                    )
                })
            }
        </TBody>
    )
}
