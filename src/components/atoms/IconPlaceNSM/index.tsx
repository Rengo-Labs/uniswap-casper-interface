import React from 'react'
import styled from 'styled-components'

const IconPlaceStyle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
`

export const IconPlaceNSM = ({children}) => {
  return (
    <IconPlaceStyle>{children}</IconPlaceStyle>
  )
}
