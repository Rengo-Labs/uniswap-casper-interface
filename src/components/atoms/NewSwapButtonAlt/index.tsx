import React from 'react'
import styled from 'styled-components'

export const ButtonStyle = styled.button`
    box-sizing: border-box;
    width: 80%;
    color: ${props => props.theme.NewPurpleColor};
    background-color: ${props => props.theme.NewAquamarineColor};
    padding:10px 0;
    border-radius: 10px;
    border:none;
    height: "57px";
    width: "100%";
    &:hover{
        cursor: pointer;
        background-color: ${props => props.theme.NewAquamarineColor};
    }
    &:active{
        background-color: ${props => props.theme.NewAquamarineColor};
    }
    &:disabled{
        cursor: not-allowed;
        background: #CCCCCC 0% 0% no-repeat padding-box;
        border-radius: 12px;
        color: #999999;
    }
`
export const NewSwapButtonAlt = ({ content, handler, disabled = false, style = {} }: { content?: any, handler?: any, disabled?: boolean, style?: any }) => {
  return (
    <ButtonStyle style={style} onClick={handler} disabled={disabled}>
      {content}
    </ButtonStyle>
  )
}
