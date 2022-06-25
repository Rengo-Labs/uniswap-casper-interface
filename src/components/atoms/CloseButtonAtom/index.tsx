import React, { ReactNode } from 'react'
import { CloseButtonStyled } from './styles'

export const CloseButtonAtom = ({ children, onClick }: { children: ReactNode, onClick: () => void }) => {
    return (
        <CloseButtonStyled onClick={()=>onClick()}>{children}</CloseButtonStyled>
    )
}
