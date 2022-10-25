import React from 'react'
import {AiFillQuestionCircle} from "react-icons/ai"
import {RouterContainer, RouterRow, RouterColumnLeft, RouterColumnRight} from './styles'

export const RouterBox = ({ tokenASymbol, tokenBSymbol }:any) => {
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
