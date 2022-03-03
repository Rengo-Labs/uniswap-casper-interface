import React from 'react'
import { StyledInfoBox, StyledInfoBoxTitle, StyledInfoBoxSmall } from './styles'

export const InfoBox = ({ infoBoxTitle, infoBoxSmall }) => {
  return (
    <StyledInfoBox>
      <StyledInfoBoxTitle>{infoBoxTitle}</StyledInfoBoxTitle>
      <StyledInfoBoxSmall>{infoBoxSmall}</StyledInfoBoxSmall>
    </StyledInfoBox>
  )
}
