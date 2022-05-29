import React from 'react'
import { StyledContainer, StyledTitle, StyledMarkedTitle } from './styles'
import { v4 as uuidv4 } from 'uuid';

interface MarkedTittleInterfaceProp { title: string, markedword: string }

export const MarkedTitle = ({ title, markedword }: MarkedTittleInterfaceProp) => {
  const titleBuilder = title.split(' ')

  return (
    <StyledContainer>
      {
        titleBuilder.map(word => {
          if (word === markedword) return (<StyledMarkedTitle key={word}>{word}</StyledMarkedTitle>)
          return (<StyledTitle key={uuidv4()}>{word}</StyledTitle>)
        })
      }
    </StyledContainer>
  )
}
