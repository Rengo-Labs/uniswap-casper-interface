import React from 'react'
import { useTable, useSortBy, useGlobalFilter } from 'react-table'

import { PoolModulesStyled } from './styles'
import { POCSearch2 } from '../../molecules'
import { TokensProviderContext2 } from '../../../contexts/TokenContext2'
import { POCTable2 } from '../../organisms'

export const TokensModule = () => {
    const { columns, data } = React.useContext(TokensProviderContext2)
    const tableInstance = useTable({ columns, data }, useGlobalFilter, useSortBy)
    const { preGlobalFilteredRows, setGlobalFilter, state } = tableInstance
    return (
        <PoolModulesStyled>
            <POCSearch2 preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={state.globalFilter} setGlobalFilter={setGlobalFilter} />
            <POCTable2 {...tableInstance} />
        </PoolModulesStyled>
    )
}
