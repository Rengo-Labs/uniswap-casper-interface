import React from 'react'
import { useTable, useSortBy, useGlobalFilter } from 'react-table'


import { PoolModulesStyled } from './styles'
import { POCSearch } from '../../molecules'
import { PoolsProviderContext } from '../../../contexts/PoolsContext'
import { POCTable } from '../../organisms'

export const PoolModule = () => {
    const { columns, data } = React.useContext(PoolsProviderContext)
    const tableInstance = useTable({ columns, data }, useGlobalFilter, useSortBy)
    const { preGlobalFilteredRows, setGlobalFilter, state } = tableInstance
    return (
        <PoolModulesStyled>
            <POCSearch preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={state.globalFilter} setGlobalFilter={setGlobalFilter} />
            <POCTable {...tableInstance} />
        </PoolModulesStyled>
    )
}
