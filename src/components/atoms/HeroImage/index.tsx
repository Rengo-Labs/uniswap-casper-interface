import React from 'react'

import { HeroIMGStyles } from './styles'

interface HeroImageInterfaceProps { heroImage: string }

export const HeroImage = ({ heroImage }: HeroImageInterfaceProps) => {
    return (
        <HeroIMGStyles src={heroImage} />
    )
}
