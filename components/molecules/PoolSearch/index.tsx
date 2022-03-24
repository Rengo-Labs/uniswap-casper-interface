import React from 'react'

import { PoolSeachButtonStyled } from './styles'

import { PoolInputFilter } from '../../atoms'
import { AiOutlineSearch } from "react-icons/ai";
export const PoolSearch = () => {
    return (
        <PoolSeachButtonStyled>
            <AiOutlineSearch />
            <PoolInputFilter />
        </PoolSeachButtonStyled>
    )
}
