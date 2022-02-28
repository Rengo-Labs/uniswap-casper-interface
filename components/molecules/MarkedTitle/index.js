import React from 'react'
import { StyledContainer,StyledTitle, StyledMarkedTitle } from './styles'

export const MarkedTitle = ({ title, markedword }) => {
    const titleBuilder = title.split(' ')

    return (
        <StyledContainer>
            {
                titleBuilder.map(word => {
                    if (word === markedword) return (<StyledMarkedTitle key={word}>{word}</StyledMarkedTitle>)
                    return (<StyledTitle key={word}>{word}</StyledTitle>)
                })
            }
        </StyledContainer>
    )
}
