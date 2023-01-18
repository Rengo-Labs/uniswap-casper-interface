import React from 'react'
import 'regenerator-runtime/runtime';

import { PoolSeachButtonStyled } from './styles'


import { AiOutlineSearch } from "react-icons/ai";
import {useAsyncDebounce, useGlobalFilter, useSortBy, useTable} from 'react-table'
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
            {/* TODO: remove inline css*/}
            <AiOutlineSearch style={{ backgroundColor: "#D9D9D9", color: "#999999", borderRadius: "45%", padding: "0.2em", height: "1em", width: "1.2em"}} />
            <PoolInputFilter value={value} setValue={setValue} count={count} onChange={onChange} />
        </PoolSeachButtonStyled>
    )
}
