import React, { useContext, useEffect, useState } from 'react'
import { TBody } from './styles'
import { CollapsingRow } from '../'
import { v4 as uuidv4 } from 'uuid'
import { ConfigProviderContext } from "../../../contexts/ConfigContext"
import { Row, TableBodyPropGetter, TableBodyProps } from 'react-table'
import { PairData } from '../../../reducers/PairsReducer'
import { LiquidityProviderContext } from "../../../contexts/LiquidityContext";
import { AnimatePresence, motion } from 'framer-motion'
import store from "store2";

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
  const { isStaked, filter, isMobile, filterDataReload, mapExpandedRows, setMapExpandedRows, changeRowPriority } = React.useContext(ConfigProviderContext)
  const { setRemovingPopup } = useContext(LiquidityProviderContext)

  const handlerClick = (tokenPair, isExpanded) => {
    mapExpandedRows[tokenPair] = isExpanded
    setMapExpandedRows(mapExpandedRows)
  }

  const sortByPriority = (rows) => {

    rows.sort((row1: Row<PairData>, row2: Row<PairData>) => {
      return store.get(row1.original.name) ? -1 : 1
    })

    return rows
  }

  const spring = React.useMemo(
    () => ({
      type: 'spring',
      damping: 50,
      stiffness: 100,
    }),
    []
  )

  return (
    <TBody {...getTableBodyProps()}>
      <AnimatePresence>
        {// Loop over the table rows

          sortByPriority(rows).map((row: Row<PairData>) => {
            // Prepare the row for display
            prepareRow(row)

            const r = (!isStaked || (filter(isStaked, row))) && filterDataReload(row);

            return r && <motion.div
              key={row.original.name}
              {...row.getRowProps({
                layoutTransition: spring,
                exit: { opacity: 0, maxHeight: 0 },
              } as any)}
            >
              <CollapsingRow
                row={row}
                fullExpanded={mapExpandedRows[row.original.name]}
                onRemovingPopupListener={setRemovingPopup}
                isMobile={isMobile}
                priority={row.original.checked}
                onClick={handlerClick}
                onAssignPriority={changeRowPriority}
              />
            </motion.div>
          })
        }
      </AnimatePresence>
    </TBody>
  )
}
