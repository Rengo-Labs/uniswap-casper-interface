import React from 'react'
import styled from 'styled-components'
export const ArrowContainerStyle = styled.div`
    padding-top:10px;
    align-self: start;
`
export const ArrowContainerNSM = ({children}) => {
  return (
    <ArrowContainerStyle>{children}</ArrowContainerStyle>
  )
}
