import React from 'react'
import { CardStyled, CardHeaderStyled } from './styles'
export const CardContainer = () => {
    return (
        <CardStyled>
            <CardHeaderStyled>
                <div>legend</div>
                <div>icon</div>
            </CardHeaderStyled>
            <div>body</div>
        </CardStyled>
    )
}
