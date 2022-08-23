import React from 'react'
import {
    PriceImpactBox
} from './styles'

export const PriceImpactTitle = ({ priceImpactTitle, style, className }:any) => {

    return (
        <PriceImpactBox style={style} className={className}>
            {priceImpactTitle}
        </PriceImpactBox>
    )
}
