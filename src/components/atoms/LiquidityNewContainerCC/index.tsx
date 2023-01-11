import React from 'react'
import styled from 'styled-components'

const LiquidityNewContainer = styled.div`
  display: flex;
`

const LiquiditySection = styled.section`
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  width: 100%;
  color: black;
`
export const LiquidityNewContainerCC = ({children}) => {
    return (
        <LiquidityNewContainer>
          <LiquiditySection>
            {children}
          </LiquiditySection>
        </LiquidityNewContainer>
    )
}
