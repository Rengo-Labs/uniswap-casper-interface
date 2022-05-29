import React from 'react'
import 'regenerator-runtime/runtime';

import { PoolSeachButtonStyled } from './styles'

import { PoolInputFilter } from '../../atoms'
import { AiOutlineSearch } from "react-icons/ai";
import { useAsyncDebounce } from 'react-table'

export const POCSearch2 = ({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) => {

    const count = preGlobalFilteredRows.length;
    const [value, setValue] = React.useState(globalFilter)
    const onChange = useAsyncDebounce(value => {
        setGlobalFilter(value || "")
    }, 300)

    return (
        <PoolSeachButtonStyled>
            <AiOutlineSearch />
            <PoolInputFilter value={value} setValue={setValue} count={count} onChange={onChange} />
        </PoolSeachButtonStyled>
    )
}
