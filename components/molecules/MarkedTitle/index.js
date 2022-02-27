import React from 'react'
import { StyledContainer,StyledTitle, StyledMarkedTitle } from './styles'

export const MarkedTitle = ({ title, markedword }) => {
    const titleBuilder = title.split(' ')

    return (
        <StyledContainer>
            {
                titleBuilder.map(word => {
                    if (word === markedword) return (<StyledMarkedTitle>{word}</StyledMarkedTitle>)
                    return (<StyledTitle>{word}</StyledTitle>)
                })
            }
        </StyledContainer>
    )
}
