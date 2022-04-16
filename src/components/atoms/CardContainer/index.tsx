import React from 'react'
import { AiOutlineStar } from "react-icons/ai";

import { CardStyled, CardHeaderStyled } from './styles'
export const CardContainer = ({ cardTitle, children, width = "30%" }) => {
    return (
        <CardStyled width={width}>
            <CardHeaderStyled>
                <div>{cardTitle}</div>
                <AiOutlineStar />
            </CardHeaderStyled>
            {children}
        </CardStyled>
    )
}
