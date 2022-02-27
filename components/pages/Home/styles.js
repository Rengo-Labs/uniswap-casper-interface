import styled from 'styled-components'

export const Container = styled.section`
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(42,58,217,1) 50%,rgba(51,84,251,1) 100%);
    display: grid;
    grid-template: auto 1fr auto / 1fr;
    color: white;
`

export const NavBarArea = styled.section``

export const NavBarContainer = styled.section`
    width:80%;
    margin: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
`

export const NavBarBrand = styled.section`
    display:flex;
    padding:10px;
    gap:10px;
    justify-content: center;
    align-items: center;
    color: white;
`
export const NavBarConnect = styled.section``

export const MainArea = styled.section`
    margin: auto;
`

export const FooterArea = styled.footer``
export const FooterContainer = styled.footer`
    width:80%;
    margin: auto;
    padding:10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`
export const FooterBox = styled.footer`
    width: 20%;
    padding: 10px;
    height: 200px;
    background-color: rgba(45,36,237,1);
    border-radius:10px;
`