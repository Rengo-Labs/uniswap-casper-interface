import React from 'react'
import styled from 'styled-components'
const NewTokenDetailItems2Styled = styled.img`
    grid-column: 1/2;
    grid-row: 2/3;
    align-self: center;
    margin: 15px 0;
`
export const NewTokenDetailItems2NSM = ({src, height = 50, width = 50}) => {
  return (
    <NewTokenDetailItems2Styled src={src} width={width} height={height}/>
  )
}
