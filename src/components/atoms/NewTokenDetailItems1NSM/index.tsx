import React from 'react'
import styled from 'styled-components'
const NewTokenDetailItems1Styled = styled.section`
    grid-column: 1/2;
    grid-row: 1/2;
    justify-self: center;
    cursor: pointer;
    font-family: 'MyriadPro';
    font-weight: 400;
    font-size: 1rem;
    letter-spacing: 0.02em;
    align-self: center;
`

interface NewTokenDetailItems1NSMProps {
  children: React.ReactNode
  handleClick?: () => void
}

export const NewTokenDetailItems1NSM = ({children, handleClick}: NewTokenDetailItems1NSMProps) => {
  return (
    <NewTokenDetailItems1Styled onClick={handleClick}>{children}</NewTokenDetailItems1Styled>
  )
}
