import React, { ReactNode } from 'react'
import { HeaderModalStyled } from './styles'

export const HeaderModalAtom = ({ children }: { children: ReactNode }) => {
    return (
        <HeaderModalStyled>{children}</HeaderModalStyled>
    )
}
