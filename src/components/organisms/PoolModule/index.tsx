import React, {useState} from 'react'
import { useTable, useSortBy, useGlobalFilter } from 'react-table'

import { PoolModulesStyled, MenuSearchStyled, MenuFilterStyled,
    MenuTitleStyled, MenuToggleStyled, MenuStyled
} from './styles'
import { POCSearch, ToggleBox } from '../../molecules'
import { PoolsProviderContext } from '../../../contexts/PoolsContext'
import { POCTable } from '..'
import { ItemSelector } from "../../atoms/ItemSelector";

export const PoolModule = () => {
    const options = ["Time basis: 1D", "Time basis: 3D", "Time basis: 7D"];

    const { columns, data, setStaked } = React.useContext(PoolsProviderContext)

    const tableInstance = useTable({ columns, data }, useGlobalFilter, useSortBy)
    const { preGlobalFilteredRows, setGlobalFilter, state }:any = tableInstance

    //TODO Context for toggle box and Selector
    return (
        <PoolModulesStyled>
            <MenuStyled>
                <MenuTitleStyled>Earn yield trading by providing liquidity</MenuTitleStyled>
                <MenuToggleStyled>
                    <ToggleBox setStaked={setStaked} />
                </MenuToggleStyled>
                <MenuFilterStyled>
                    <ItemSelector options={options} />
                </MenuFilterStyled>
                <MenuSearchStyled><POCSearch preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={state.globalFilter} setGlobalFilter={setGlobalFilter} /></MenuSearchStyled>
            </MenuStyled>
            <POCTable {...tableInstance} />
        </PoolModulesStyled>
    )
}
