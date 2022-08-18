import React from 'react'
import {AiOutlineSwap} from "react-icons/ai"
import {
    PriceImpactBox
} from './styles'


export const PriceImpactTitle = ({ priceImpactTitle, className }:any) => {

    return (
        <PriceImpactBox className={className}>
            {priceImpactTitle}
        </PriceImpactBox>
    )
}
