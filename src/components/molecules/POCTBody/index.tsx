import React, {useContext, useEffect, useState} from 'react'
import { TBody} from './styles'
import {CollapsingRow} from '../'
import { v4 as uuidv4 } from 'uuid'
import {ConfigProviderContext} from "../../../contexts/ConfigContext"
import { Row, TableBodyPropGetter, TableBodyProps } from 'react-table'
import { PairData } from '../../../reducers/PairsReducer'
import {LiquidityProviderContext} from "../../../contexts/LiquidityContext";

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
    const { isStaked, filter, isMobile, filterDataReload, mapExpandedRows, setMapExpandedRows } = React.useContext(ConfigProviderContext)
    const {setRemovingPopup} = useContext(LiquidityProviderContext)

    const handlerClick = (tokenPair, isExpanded) => {
        mapExpandedRows[tokenPair] = isExpanded
        setMapExpandedRows(mapExpandedRows)
    }

    return (
        <TBody {...getTableBodyProps()}>
            {// Loop over the table rows
                rows.map((row: Row<PairData>) => {
                    // Prepare the row for display
                    prepareRow(row)

                    const r = (!isStaked || (filter(isStaked, row))) && filterDataReload(row);

                    return r && <CollapsingRow key={uuidv4()} row={row} fullExpanded={mapExpandedRows[row.original.name]} onRemovingPopupListener={setRemovingPopup} isMobile={isMobile} onClick={handlerClick} />
                })
            }
        </TBody>
    )
}
