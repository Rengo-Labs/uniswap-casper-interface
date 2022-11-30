import React from 'react'
import {AiFillQuestionCircle} from "react-icons/ai"
import {RouterContainer, RouterRow, RouterColumnLeft, RouterColumnRight} from './styles'

interface RouterBoxProps {
    tokenASymbol:string,
    tokenBSymbol:string
}

export const RouterBox = ({ tokenASymbol, tokenBSymbol }:RouterBoxProps) => {
    return (
        <>
            {
                false &&
                <RouterRow>
                    <RouterColumnLeft>Swap router</RouterColumnLeft>
                    <RouterColumnRight><AiFillQuestionCircle/></RouterColumnRight>
                </RouterRow>
            }
            <RouterRow>
                <RouterColumnLeft>Route</RouterColumnLeft>
                <RouterColumnRight>{tokenASymbol} {` > `} {tokenBSymbol}</RouterColumnRight>
            </RouterRow>
        </>
    )
}
