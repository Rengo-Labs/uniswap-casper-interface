import React from 'react'
import {AiFillQuestionCircle} from "react-icons/ai"
import {RouterContainer, RouterRow, RouterColumnLeft, RouterColumnRight} from './styles'

interface RouterBoxProps {
    tokenASymbol:string,
    tokenBSymbol:string,
    pairPath?: any[]
}

export const RouterBox = ({ tokenASymbol, tokenBSymbol, pairPath }:RouterBoxProps) => {
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
                {pairPath && pairPath.length > 0 ?
                    <RouterColumnRight>{pairPath.map((item, index) => index === pairPath.length -1 ? (`${item}`) : (`${item} >`))}</RouterColumnRight> :
                    <RouterColumnRight>{tokenASymbol} {` > `} {tokenBSymbol}</RouterColumnRight>}
            </RouterRow>
        </>
    )
}
