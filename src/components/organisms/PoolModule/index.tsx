import React from 'react'
import { useTable, useSortBy, useGlobalFilter } from 'react-table'

import {
    PoolModulesStyled, MenuTitleStyled, MenuToggleStyled, MenuStyled
} from './styles'
import { POCSearch, ToggleBox } from '../../molecules'
import { PoolsProviderContext } from '../../../contexts/PoolsContext'
import { POCTable } from '..'
import { ItemSelector } from "../../atoms";

export const PoolModule = ({columns, data}) => {
    const options = ["Time basis: 1D", "Time basis: 3D", "Time basis: 7D"];
    const { setStaked} = React.useContext(PoolsProviderContext)

    const tableInstance = useTable({columns, data}, useGlobalFilter, useSortBy)
    const {preGlobalFilteredRows, setGlobalFilter, state}: any = tableInstance

    console.log(data)

    return (
        <PoolModulesStyled>
            <MenuStyled>
                <MenuTitleStyled>Earn yield trading by providing liquidity</MenuTitleStyled>
                <MenuToggleStyled>
                    <ToggleBox setStaked={setStaked}/>
                </MenuToggleStyled>
                <ItemSelector options={options}/>
                <POCSearch preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={state.globalFilter}
                           setGlobalFilter={setGlobalFilter}/>
            </MenuStyled>
            <POCTable {...tableInstance} />
        </PoolModulesStyled>
    )
}
