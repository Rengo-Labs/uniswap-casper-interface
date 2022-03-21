import React from 'react'
import { useTable, useSortBy } from 'react-table'
import { PoolModulesStyled } from './styles'
import { PoolSearch, PoolTable } from '../../molecules'
import { PoolsProviderContext } from '../../../contexts/PoolsContext'
import { POCTable } from '../../organisms'
export const PoolModule = () => {
    const { columns, data } = React.useContext(PoolsProviderContext)
    const tableInstance = useTable({ columns, data }, useSortBy)
    return (
        <PoolModulesStyled>
            <PoolSearch />
            <POCTable {...tableInstance} />
        </PoolModulesStyled>
    )
}
