import React from 'react'

import { MarkedTitle } from '../../molecules'
import { InfoBoxes } from '../InfoBoxes'

import { HeroStyles, HeroIMGStyles } from './styles'

export const Hero = ({ HeroTitle, HeroMarkedword, InfoBoxArray }) => {
    const url = 'https://via.placeholder.com/350'
    return (
        <HeroStyles>
            <MarkedTitle title={HeroTitle} markedword={HeroMarkedword} />
            <HeroIMGStyles src={url} />
            <InfoBoxes InfoBoxArray={InfoBoxArray} />
        </HeroStyles>
    )
}
