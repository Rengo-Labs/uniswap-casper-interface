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
import { PairData } from '../../../reducers/PairsReducer'
import { FilterSelector } from "../../atoms/FilterSelector";
import {PoolProviderContext} from "../../../contexts/PoolContext";

export interface PoolModuleProps {
  columns: any[],
  data: PairData[],
}

export interface TableInstance<D extends object> extends UseTableInstanceProps<D>, UseGlobalFiltersInstanceProps<D>, UseGlobalFiltersState<D> { }

export const PoolModule = ({ columns, data }: PoolModuleProps) => {
  const { setStaked, setTableInstance, setCurrentQuery } = React.useContext(PoolProviderContext)

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
