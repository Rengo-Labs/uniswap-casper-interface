import React, { ReactNode } from 'react'
import { SearchInputStyled } from './styles'

export const SearchInputAtom = ({ placeholder }: { placeholder?:any}) => {
    return (
        <SearchInputStyled placeholder={placeholder}></SearchInputStyled>
    )
}
