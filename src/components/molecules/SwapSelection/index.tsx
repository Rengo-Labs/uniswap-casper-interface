import React, { ReactNode } from 'react'

import { SwapContainer } from '../../atoms'


export const SwapSelection = ({ children }: { children: ReactNode }) => {
    return (
        <SwapContainer>
            {children}
        </SwapContainer>
    )
}
