import React from 'react'
import Link from 'next/link'


import { AnchorStyle } from './styles'

export const Anchor = ({ isAnchor = true, to, insideMessage }) => {
    if (isAnchor) {
        return <AnchorStyle href={to}> {insideMessage}</AnchorStyle >
    }
    return (<Link href={to} passHref>
        <AnchorStyle>{insideMessage}</AnchorStyle>
    </Link>)
}
