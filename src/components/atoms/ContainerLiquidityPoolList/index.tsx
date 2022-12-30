import React from 'react'
import styled from 'styled-components'
import {device} from "../../../contexts/ThemeContext/themes";

const ContainerLiquidityPool = styled.section`
  box-sizing: border-box;
  justify-self: start;
  padding: 10px;
  border: 1px solid black;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  gap: 10px;

  @media ${device.mobileS} {
    width: 100%;
  }

  @media ${device.mobileM} {
    width: 100%;
  }

  @media ${device.mobileL} {
    width: 100%;
  }

  @media ${device.tablet} {
    width: 462px;
  }

  @media ${device.laptop} {
    width: 462px;
  }
`
export const ContainerLiquidityPoolList = ({children}) => {
    return (
        <ContainerLiquidityPool>{children}</ContainerLiquidityPool>
    )
}
