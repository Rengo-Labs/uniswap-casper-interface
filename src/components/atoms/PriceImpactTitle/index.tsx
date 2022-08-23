import React from 'react'
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
