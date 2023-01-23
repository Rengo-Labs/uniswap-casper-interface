import React from 'react'
import 'regenerator-runtime/runtime';

import {IconStyled, PoolSeachButtonStyled} from './styles'

import {useAsyncDebounce} from 'react-table'
import {PoolInputFilter} from "../atoms";
import {PairData} from "../../reducers/PairsReducer";
import {TableInstance} from "../organisms/PoolModule";

export const POCSearch3 = ({ tableInstance }) => {

    const {
      preGlobalFilteredRows,
      setGlobalFilter,
      globalFilter,
    } = tableInstance as any as TableInstance<PairData>

    const count = preGlobalFilteredRows ? preGlobalFilteredRows.length : 0;
    const [value, setValue] = React.useState(globalFilter)
    const onChange = useAsyncDebounce(value => {
        setGlobalFilter(value || "")
    }, 300)

    return (
        <PoolSeachButtonStyled>
            <IconStyled />
            <PoolInputFilter value={value} setValue={setValue} count={count} onChange={onChange} />
        </PoolSeachButtonStyled>
    )
}
