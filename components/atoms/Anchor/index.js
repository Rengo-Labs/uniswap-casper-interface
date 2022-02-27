import React from 'react'
import { AnchorStyle, LinkStyle } from './styles'

export const Anchor = ({ isAnchor = true, to, insideMessage }) => {
    if (isAnchor) {
        return <AnchorStyle href={to}> {insideMessage}</AnchorStyle >
    }
    return (<AnchorStyle href={to}> {insideMessage}</AnchorStyle >)
}
