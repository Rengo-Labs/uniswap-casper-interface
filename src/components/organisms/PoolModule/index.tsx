import React, { useEffect } from 'react'
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  UseTableInstanceProps,
  UseGlobalFiltersInstanceProps,
  UseGlobalFiltersState, useFilters
} from 'react-table'

import {
  PoolModulesStyled, MenuTitleStyled, MenuToggleStyled, MenuStyled, PoolMenu
} from './styles'
import { POCSearch, ToggleBox } from '../../molecules'
import { POCTable } from '..'
import { ItemSelector } from "../../atoms";
import { ConfigProviderContext } from "../../../contexts/ConfigContext"
import { PairData } from '../../../reducers/PairsReducer'
import { FilterSelector } from "../../atoms/FilterSelector";

export interface PoolModuleProps {
  columns: any[],
  data: PairData[],
}

export interface TableInstance<D extends object> extends UseTableInstanceProps<D>, UseGlobalFiltersInstanceProps<D>, UseGlobalFiltersState<D> { }

export const PoolModule = ({ columns, data }: PoolModuleProps) => {
  const options = ["7 Days", "1 Day"]
  const { setStaked, setTableInstance, currentQuery, setCurrentQuery } = React.useContext(ConfigProviderContext)

  const tableInstance = useTable<PairData>({ columns, data }, useFilters, useGlobalFilter, useSortBy)
  const {
    preGlobalFilteredRows,
    setGlobalFilter,
    globalFilter,
  } = tableInstance as any as TableInstance<PairData>

  useEffect(() => {
    setTableInstance(tableInstance)
  }, [])

  return (
    <PoolModulesStyled>
      <MenuStyled>
        <MenuTitleStyled>Earn yield trading by providing liquidity</MenuTitleStyled>
        <PoolMenu>
          <MenuToggleStyled>
            <ToggleBox setStaked={setStaked} />
          </MenuToggleStyled>
          { /* <ItemSelector options={options} /> */ }
          <FilterSelector {...tableInstance} setGlobalFilter={setGlobalFilter} />
          <POCSearch preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter} setQuery={setCurrentQuery} />
        </PoolMenu>
      </MenuStyled>
      <POCTable {...tableInstance} />
    </PoolModulesStyled>
  )
}
