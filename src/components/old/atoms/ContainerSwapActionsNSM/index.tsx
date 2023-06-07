import React from 'react'
import styled from 'styled-components'
import {device} from "../../../../contexts/ThemeContext/themes";

const ContainerSwapActions = styled.section`
    justify-self: end;
    box-sizing: border-box;
    width: 462px;
    border:1px solid black;
    border-radius: 20px;
    display: grid;
    flex-direction: column;
    justify-content:center;
    align-items: center;
    gap:10px;
    padding: 20px 25px;

  @media ${device.mobileS} {
    width: auto;
    padding: 0;
    border: none;
  }
  @media ${device.tablet}{
    width: 462px;
    border: 1px solid black;
    padding: 20px 25px;
  }
`
export const ContainerSwapActionsNSM = ({children}) => {
  return (
    <ContainerSwapActions>{children}</ContainerSwapActions>
  )
}
