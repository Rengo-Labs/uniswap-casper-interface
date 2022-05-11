import React from 'react'
import { StyledInfoBoxes } from './styles'
import { InfoBox } from '../../molecules'
import { v4 as uuidv4 } from 'uuid';

export const InfoBoxes = ({ InfoBoxArray }:any) => {
  return (
    <StyledInfoBoxes>
      {
                InfoBoxArray.map((Infobox:any) => {
                  return (
                    <InfoBox key={uuidv4()} infoBoxTitle={Infobox.infoBoxTitle} infoBoxSmall={Infobox.infoBoxSmall} />
                  )
                })
            }
    </StyledInfoBoxes>
  )
}
