import React from 'react'
import styled from 'styled-components'

const IconTextStyled = styled.nav<any>`
    opacity: ${props => props.collapse ? "0" : "1"};
    width: ${props => props.collapse ? "0px" : "100%"};
    transition: all 200ms ease;
    font-size: 18px;
    letter-spacing: 4.68px;
`
export const IconTextCC = ({ collapse, iconSet, text }) => {
  return (
    <>
        {iconSet}
        <IconTextStyled collapse={collapse}>{text}</IconTextStyled>
    </>)
}
