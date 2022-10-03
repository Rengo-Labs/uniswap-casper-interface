import styled from 'styled-components'

export const PoolModulesStyled = styled.section`
    margin: 0;
    padding:20px 30px;
    border-radius: 0 0 20px 20px;
    border-top-color: black;
    border-top-style: solid;
    border-top-width: 0.5px;
    background-color: ${props => props.theme.mainBackgroundColor};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items:center;
`

export const MenuStyled = styled.div`
    display: flex;
    width: 98%;
    padding: .6rem .7rem
`

export const MenuSearchStyled = styled.div`
    flex: 1;
    align-self: center;
`

export const MenuToggleStyled = styled.div`
    flex: 1;
    align-self: center;
`

export const MenuFilterStyled = styled.div`
    flex: 1;
    align-self: center;
`

export const MenuTitleStyled = styled.div`
    flex: 3;
    align-self: center;
    color: grey;
    margin-left: 3%;
    font-family: 'EpilogueLight'; 
    font-size: 1em;
`

export const WrapToggle = styled.div`
    display: flex;
`