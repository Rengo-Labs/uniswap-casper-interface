import React, { ReactNode } from 'react'

import { HeroStyles } from './styles'

export const Hero = ({ children }:{children:ReactNode}) => {
  return (
    <HeroStyles>
      { children }
    </HeroStyles>
  )
}
