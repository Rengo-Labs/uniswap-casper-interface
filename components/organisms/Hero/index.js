import React from 'react'
import { MarkedTitle } from '../../molecules'
import { InfoBoxes } from '../InfoBoxes'
export const Hero = ({HeroTitle,HeroMarkedword,InfoBoxArray}) => {
    return (
        <div>
            <MarkedTitle title={HeroTitle} markedword={HeroMarkedword} />
            <div></div>
            <InfoBoxes InfoBoxArray={InfoBoxArray}/>
        </div>
    )
}
