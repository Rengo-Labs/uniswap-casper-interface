import React from 'react'
import styled from "styled-components";

export const ButtonCloseStyle = styled.button`
    color: ${props => props.theme.NewPurpleColor};
    background-color: ${props => props.theme.NewAquamarineColor};
    border-radius: 10px;
    border:none;
    padding:8px;
    font-size: 1.5rem;
    box-shadow: 0 0 1rem .2rem rgba(0,0,0,.3);
    display: grid;
    place-items: center;
    &:hover{
        cursor: pointer;
    }
    &:active{
        background-color: ${props => props.theme.NewAquamarineColor};
    }
`
export const NewButtonClose = ({ onClickHandler, children }) => {
  return (
    <ButtonCloseStyle onClick={() => { onClickHandler() }}>
      {children}
    </ButtonCloseStyle>
  )
}
