import React from 'react'
import styled from 'styled-components'
const PopularContainer = styled.div`
    padding-top: 12px;
    color:${props => props.theme.NewPurpleColor};
`
export const PopularContainerFM = ({children}) => {
  return (
    <PopularContainer>{children}</PopularContainer>
  )
}
