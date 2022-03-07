import React from 'react'
import { AiOutlineStar } from "react-icons/ai";

import { CardStyled, CardHeaderStyled } from './styles'
export const CardContainer = ({ children }) => {
    return (
        <CardStyled>
            <CardHeaderStyled>
                <div>Swap</div>
                <AiOutlineStar />
            </CardHeaderStyled>
            {children}
        </CardStyled>
    )
}
