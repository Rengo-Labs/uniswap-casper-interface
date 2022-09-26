import React from 'react'
import { useTable, useSortBy, useGlobalFilter } from 'react-table'

import "react-toggle/style.css"
import { PoolModulesStyled, MenuSearchStyled, MenuFilterStyled, MenuTitleStyled, MenuToggleStyled, MenuStyled, ToggleStyled, ToggleTitle, WrapToggle } from './styles'
import { POCSearch } from '../../molecules'
import { PoolsProviderContext } from '../../../contexts/PoolsContext'
import { POCTable } from '..'

export const PoolModule = () => {
    const { columns, data } = React.useContext(PoolsProviderContext)
    const tableInstance = useTable({ columns, data }, useGlobalFilter, useSortBy)
    const { preGlobalFilteredRows, setGlobalFilter, state }:any = tableInstance

    const handleTofuChange = () => {
    }

    return (
        <PoolModulesStyled>
            <MenuStyled>
                <MenuTitleStyled>Earn yield trading by providing liquidity</MenuTitleStyled>
                <MenuToggleStyled>
                    <WrapToggle>
                        <ToggleTitle>Show staked</ToggleTitle>
                        <ToggleStyled
                            defaultChecked={false}
                            icons={false}
                            onChange={handleTofuChange} />
                    </WrapToggle>
                </MenuToggleStyled>
                <MenuFilterStyled>Filter</MenuFilterStyled>
                <MenuSearchStyled><POCSearch preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={state.globalFilter} setGlobalFilter={setGlobalFilter} /></MenuSearchStyled>
            </MenuStyled>
            <POCTable {...tableInstance} />
        </PoolModulesStyled>
    )
}
