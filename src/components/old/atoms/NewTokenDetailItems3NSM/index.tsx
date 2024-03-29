import React from 'react'
import styled from 'styled-components'
const NewTokenDetailItems3Styled = styled.section`
    grid-column: 1/2;
    grid-row: 3/4;
    justify-self: center;
    cursor: pointer;
    font-family: 'MyriadPro';
    font-weight: 400;
    font-size: 16px;
    letter-spacing: 0.02em;
    line-height: 32px;
    color: ${(props) => props.theme.NewBlackColor};
`

interface NewTokenDetailItems3NSMProps {
  children: React.ReactNode
  handleClick?: () => void
}

export const NewTokenDetailItems3NSM = ({children, handleClick}: NewTokenDetailItems3NSMProps) => {
  return (
    <NewTokenDetailItems3Styled onClick={handleClick}>{children}</NewTokenDetailItems3Styled>
  )
}
