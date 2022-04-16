import React from 'react'
import { StyledInfoBoxes } from './styles'
import { InfoBox } from '../../molecules'

export const InfoBoxes = ({ InfoBoxArray }) => {
  return (
    <StyledInfoBoxes>
      {
                InfoBoxArray.map((Infobox,index) => {
                  return (
                    <InfoBox key={index} infoBoxTitle={Infobox.infoBoxTitle} infoBoxSmall={Infobox.infoBoxSmall} />
                  )
                })
            }
    </StyledInfoBoxes>
  )
}
