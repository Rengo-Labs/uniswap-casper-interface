import React from 'react'
import { AiOutlineStar } from "react-icons/ai";

import { CardStyled, CardHeaderStyled } from './styles'
export const CardContainer = ({ cardTitle, children, width = "30%", gridColumn= "1/11", gridRow="2" }:any) => {
    return (
        <CardStyled width={width} gridColumn={gridColumn} gridRow={gridRow}>
            <CardHeaderStyled>
                <div style={{color: "#7864f4"}}>{cardTitle}</div>
                <AiOutlineStar />
            </CardHeaderStyled>
            {children}
        </CardStyled>
    )
}
