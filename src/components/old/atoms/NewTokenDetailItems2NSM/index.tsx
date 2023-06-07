import React from 'react'
import styled from 'styled-components'
const NewTokenDetailItems2Styled = styled.img`
    grid-column: 1/2;
    grid-row: 2/3;
    align-self: center;
    margin: 15px 0;
    cursor: pointer;
`

interface NewTokenDetailItems2NSMProps {
  src: string
  handleClick?: () => void
  width?: number
  height?: number
}

export const NewTokenDetailItems2NSM = ({src, handleClick, width = 50, height = 50}: NewTokenDetailItems2NSMProps) => {
  return (
    <NewTokenDetailItems2Styled src={src} width={width} height={height} onClick={handleClick}/>
  )
}
