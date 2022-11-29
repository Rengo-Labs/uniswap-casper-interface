import React from 'react'
import styled from 'styled-components'
const ArrowContainerStyle = styled.div`
    padding-top:10px;
    align-self: start;
`
export const ArrowContainerJC = ({children}) => {
  return (
    <ArrowContainerStyle>{children}</ArrowContainerStyle>
  )
}
