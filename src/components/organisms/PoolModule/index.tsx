import React from 'react'
import { useTable, useSortBy, useGlobalFilter, TableState, UseTableInstanceProps, UseGlobalFiltersInstanceProps, UseGlobalFiltersState } from 'react-table'

import {
    PoolModulesStyled, MenuTitleStyled, MenuToggleStyled, MenuStyled, PoolMenu
} from './styles'
import { POCSearch, ToggleBox } from '../../molecules'
import { POCTable } from '..'
import { ItemSelector } from "../../atoms";
import {ConfigProviderContext} from "../../../contexts/ConfigContext"
import { PairData } from '../../../reducers/PairsReducer'

export interface PoolModuleProps {
    columns: any[],
    data: PairData[],
}

export interface TableInstance<D extends object> extends UseTableInstanceProps<D>, UseGlobalFiltersInstanceProps<D>, UseGlobalFiltersState<D> {}

export const PoolModule = ({columns, data}: PoolModuleProps) => {
    const options = ["Time basis: 1D", "Time basis: 3D", "Time basis: 7D"]
    const { setStaked} = React.useContext(ConfigProviderContext)

    const tableInstance = useTable<PairData>({columns, data}, useGlobalFilter, useSortBy)
    const {
        preGlobalFilteredRows, 
        setGlobalFilter, 
        globalFilter,
    } = tableInstance as any as TableInstance<PairData>

    return (
        <PoolModulesStyled>
            <MenuStyled>
                <MenuTitleStyled>Earn yield trading by providing liquidity</MenuTitleStyled>
                <PoolMenu>

                    <MenuToggleStyled>
                        <ToggleBox setStaked={setStaked}/>
                    </MenuToggleStyled>
                    <ItemSelector options={options}/>
                    <POCSearch preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={globalFilter}
                               setGlobalFilter={setGlobalFilter}/>
                </PoolMenu>
            </MenuStyled>
            <POCTable {...tableInstance} />
        </PoolModulesStyled>
    )
}
