import React from 'react'
import styled from 'styled-components'
const IconPlaceStyle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`
export const IconPlaceJC = ({children}) => {
  return (
    <IconPlaceStyle>{children}</IconPlaceStyle>
  )
}
