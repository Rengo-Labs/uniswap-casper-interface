import styled from 'styled-components'

export const PoolModulesStyled = styled.section`
    margin: 0;
    padding:20px 30px;
    border-radius: 0;
    border: 1px solid black;
    background-color: ${props => props.theme.StrongColor2};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items:center;
    gap:1rem;
`

export const MenuStyled = styled.div`
    display: flex;
    width: 100%;
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
`

export const WrapToggle = styled.div`
    display: flex;
`