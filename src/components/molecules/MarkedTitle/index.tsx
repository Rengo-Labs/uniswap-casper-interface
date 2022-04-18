import React from 'react'
import { StyledContainer, StyledTitle, StyledMarkedTitle } from './styles'

interface MarkedTittleInterfaceProp { title: string, markedword: string }

export const MarkedTitle = ({ title, markedword }: MarkedTittleInterfaceProp) => {
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
