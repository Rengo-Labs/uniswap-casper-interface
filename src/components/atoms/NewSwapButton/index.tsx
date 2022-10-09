import React from 'react'
import styled from 'styled-components'

export const ButtonStyle = styled.button`
    width: 80%;
    color: ${props => props.theme.NewPurpleColor};
    background-color: ${props => props.theme.NewAquamarineColor};
    padding:10px 0;
    border-radius: 10px;
    border:none;
    box-shadow: 0 0 1rem .2rem rgba(0,0,0,.3);
    &:hover{
        cursor: pointer;
        background-color: ${props => props.theme.NewAquamarineColor};
    }
    &:active{
        background-color: ${props => props.theme.NewAquamarineColor};
    }
    &:disabled{
        background-color: ${props => props.theme.NewAquamarineColor};
    }
`
export const NewSwapButton = ({ content, handler,disabled=false }:{content?:any, handler?:any,disabled?:boolean }) => {
  return (
    <ButtonStyle onClick={handler} disabled={disabled}>
      {content}
    </ButtonStyle>
  )
}
