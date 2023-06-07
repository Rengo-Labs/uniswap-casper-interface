import React from 'react'
import styled from 'styled-components'

const IconTextStyled = styled.nav<any>`
    opacity: ${props => props.collapse ? "0" : "1"};
    width: ${props => props.collapse ? "0px" : "100%"};
    transition: all 200ms ease;
    font-size: ${props => props.isTitle ? '26' : '16'}px;
    letter-spacing: 0.02em;
    font-family: 'MyriadPro';
`
export const IconTextCC = ({ collapse, iconSet, text, isTitle = false }) => {
  return (
    <>
        {iconSet}
        <IconTextStyled collapse={collapse} isTitle={isTitle}>{text}</IconTextStyled>
    </>)
}
