import React from 'react'
import styled from 'styled-components'
import {device} from "../../../contexts/ThemeContext/themes";


const ContainerLiquidityStyles = styled.main`
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  gap: 10px;
  padding: 10px;
  color: black;
  display: grid;
  grid-template-columns: auto auto;
  align-items: start;
  
  @media ${device.tablet} {
    display: grid;
    width: auto;
  }
  @media ${device.laptop} {
    display: grid;
    width: auto;
  }
`
export const ContainerLiquidityNSM = ({children}) => {
    return (
        <ContainerLiquidityStyles>{children}</ContainerLiquidityStyles>
    )
}
