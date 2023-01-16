import React from 'react'
import 'regenerator-runtime/runtime';

import {AiOutLineSearchStyled, PoolSeachButtonStyled} from './styles'

import { PoolInputFilter } from '../../atoms'
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
            <AiOutLineSearchStyled />
            <PoolInputFilter value={value} setValue={setValue} count={count} onChange={onChange} />
        </PoolSeachButtonStyled>
    )
}
