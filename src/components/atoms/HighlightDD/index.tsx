import React from 'react'
import styled from 'styled-components'
const Highlight = styled.span`
  color: ${props => props.theme.NewAquamarineColor}
`
export const HighlightDD = ({children}) => {
  return (
    <Highlight>{children}</Highlight>
  )
}
