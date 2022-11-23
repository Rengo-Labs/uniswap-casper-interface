import React from 'react'
import styled from 'styled-components'
const HeroSubtitle = styled.h2`
  font-family: EpilogueLight;
  font-size: 28px;
`
export const HeroSubtitleDD = ({children}) => {
  return (
    <HeroSubtitle>{children}</HeroSubtitle>
  )
}
