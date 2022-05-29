import React, { ReactNode } from 'react'
import { SwapHeaderStyled } from './styles'

export const SwapHeaderAtom = ({ children }: { children: ReactNode }) => {
    return (
        <SwapHeaderStyled>{children}</SwapHeaderStyled>
    )
}
