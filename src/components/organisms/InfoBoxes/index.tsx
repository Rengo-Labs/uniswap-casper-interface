import React from 'react'
import { StyledInfoBoxes } from './styles'
import { InfoBox } from '../../molecules'

export const InfoBoxes = ({ InfoBoxArray }:any) => {
  return (
    <StyledInfoBoxes>
      {
                InfoBoxArray.map((Infobox:any) => {
                  return (
                    <InfoBox key={Infobox} infoBoxTitle={Infobox.infoBoxTitle} infoBoxSmall={Infobox.infoBoxSmall} />
                  )
                })
            }
    </StyledInfoBoxes>
  )
}
