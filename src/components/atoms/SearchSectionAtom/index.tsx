import React, { ReactNode } from 'react'
import { SearchSectionStyled } from './styles'

export const SearchSectionAtom = ({ children }: { children: ReactNode}) => {
  return (
    <SearchSectionStyled>{ children }</SearchSectionStyled>
  )
}
