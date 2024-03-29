import React from 'react'
import styled from 'styled-components'

const LogoIconStyled = styled.nav`
    & svg {
        fill: white;
    }
`
export const LogoIconCC = ({ collapse, children, onNewIcons }) => {
  return (

    <LogoIconStyled>
      {/* TODO: remove inline css*/}
      {!collapse ? onNewIcons : <div style={{ height: 64 }}>{children}</div>}
    </LogoIconStyled>
  )
}
