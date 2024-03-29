import styled from 'styled-components'
export const NavBarMobileContainerStyled = styled.nav`
    background-color: ${props => props.theme.NewPurpleColor};
    position: relative;
    height: 70px;
    width: 100%;
    z-index: 10;
`

export const NavBarMobileMenuStyled = styled.nav`
    position: absolute;
    display: block;
    left: 50%;
    top: 0%;
    -webkit-transform: translate(-50%,10px);
    -ms-transform: translate(-50%,10px);
    transform: translate(-50%,10px);
    background-color: ${props => props.theme.NewPurpleColor};
  
  & svg > path {
    fill: white
  }
`

export const Container = styled.div`
    background-color: red;
    height: 100%;
    `
