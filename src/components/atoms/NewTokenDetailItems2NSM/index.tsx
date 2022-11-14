import React from 'react'
import styled from 'styled-components'
const NewTokenDetailItems2Styled = styled.img`
    grid-column: 1/2;
    grid-row: 2/3;
    align-self: center;
`
export const NewTokenDetailItems2NSM = ({src}) => {
  return (
    <NewTokenDetailItems2Styled src={src.logoURI} width="50" height="50" />
  )
}
