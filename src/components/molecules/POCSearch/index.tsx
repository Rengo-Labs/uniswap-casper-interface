import React, {useEffect} from 'react'
import 'regenerator-runtime/runtime';

import {AiOutLineSearchStyled, PoolSeachButtonStyled} from './styles'

import { PoolInputFilter } from '../../atoms'
import { useAsyncDebounce } from 'react-table'

export const POCSearch = ({ preGlobalFilteredRows, globalFilter, setGlobalFilter, setQuery }) => {

    const count = preGlobalFilteredRows.length;
    const [value, setValue] = React.useState(globalFilter)
    const onChange = useAsyncDebounce(value => {
        setGlobalFilter(value || "")
    }, 0)

    const updateFilter = (v) => {
        setQuery(v)
        onChange(v)
    }

    return (
        <PoolSeachButtonStyled>
            <AiOutLineSearchStyled />
            <PoolInputFilter value={value} setValue={setValue} count={count} onChange={updateFilter} />
        </PoolSeachButtonStyled>
    )
}
