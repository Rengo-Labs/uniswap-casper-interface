import React from 'react'

import { MarkedTitle } from '../../molecules'
import { InfoBoxes } from '../InfoBoxes'

import { HeroStyles, HeroIMGStyles } from './styles'

export const Hero = ({ HeroTitle, HeroMarkedword, InfoBoxArray,heroImage }) => {
  return (
    <HeroStyles>
      <MarkedTitle title={HeroTitle} markedword={HeroMarkedword} />
      <HeroIMGStyles src={heroImage.src} />
      <InfoBoxes InfoBoxArray={InfoBoxArray} />
    </HeroStyles>
  )
}
