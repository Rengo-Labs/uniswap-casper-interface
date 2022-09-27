import React from 'react'
import { AiOutlineStar } from "react-icons/ai";

import { CardStyled, CardHeaderStyled } from './styles'
export const CardContainer = ({ cardTitle, children, width = "30%" }:any) => {
    return (
        <CardStyled width={width}>
            <CardHeaderStyled>
                <div style={{color: "#7864f4"}}>{cardTitle}</div>
                <AiOutlineStar />
            </CardHeaderStyled>
            {children}
        </CardStyled>
    )
}
