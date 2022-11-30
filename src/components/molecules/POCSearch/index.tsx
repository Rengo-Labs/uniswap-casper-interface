import React from 'react'
import 'regenerator-runtime/runtime';

import { PoolSeachButtonStyled } from './styles'

import { PoolInputFilter } from '../../atoms'
import { AiOutlineSearch } from "react-icons/ai";
import { useAsyncDebounce } from 'react-table'

export const POCSearch = ({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) => {

    const count = preGlobalFilteredRows.length;
    const [value, setValue] = React.useState(globalFilter)
    const onChange = useAsyncDebounce(value => {
        setGlobalFilter(value || "")
    }, 300)

    return (
        <PoolSeachButtonStyled>
            {/* TODO: remove inline css*/}
            <AiOutlineSearch style={{ backgroundColor: "white", color: "rgb(120,100,244)", borderRadius: "45%", padding: "0.2em", height: "1em", width: "1.2em"}} />
            <PoolInputFilter value={value} setValue={setValue} count={count} onChange={onChange} />
        </PoolSeachButtonStyled>
    )
}
