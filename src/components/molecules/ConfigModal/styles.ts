import styled, { css } from "styled-components";
type ConfigModalType = {
    openModal?: boolean | boolean;
}

export const ModalStyled = styled.section<Partial<ConfigModalType>>`
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: ${props => props.openModal ? 'flex' : 'none'};
    justify-content:flex-end;
`
export const ContainerStyled = styled.section<Partial<ConfigModalType>>`
    position: fixed;
    width: 30%;
    height: 100%;
    background-color: ${props => props.theme.StrongColor3};
    display: grid;
    place-items: center;
`

export const ContentStyled = styled.section<Partial<ConfigModalType>>`
    box-sizing: border-box;
    width: 95%;
    height: 95%;
    background-color: ${props => props.theme.StrongColor2};
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content:flex-start;
    align-items: center;
`
export const HeaderStyled = styled.header`
    width: 90%;
    margin-top:10px;
    padding: .5rem;
    border-radius: 10px;
    background-color: ${props => props.theme.StrongColor3};
    display: flex;
    gap:10px;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
`

export const ButtonStyle = styled.button<any>`
    color: ${props => props.theme.StrongColor};
    background-color: ${props => props.theme.TertiaryColor};
    padding:10px;
    width: 100%;
    border-radius: 10px;
    border:none;
    box-shadow: 0 0 1rem .2rem rgba(0,0,0,.3);
    &:hover{
        cursor: pointer;
    }
    &:active{
        background-color: ${props => props.theme.TertiaryColor2};
    }

    ${props => props.isSelected && `
    color: red;
    background: white;
    `}
`
export const ButtonCloseStyle = styled.button`
    color: ${props => props.theme.StrongColor};
    background-color: ${props => props.theme.TertiaryColor};
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
        background-color: ${props => props.theme.TertiaryColor2};
    }
`

export const MainStyled = styled.main`
    width: 90%;
    margin-top:10px;
    padding: .5rem;
    border-radius: 10px;
    background-color: ${props => props.theme.StrongColor3};
`

export const PillowStyled = styled.div`
    margin-top:10px;
    padding: .5rem;
    border-radius: 10px;
    background-color: ${props => props.theme.StrongColor2};
    display: flex;
    gap: 10px;
    justify-content: space-evenly;
`
export const WalletSelectionStyled = styled.div<any>`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: .3rem .5rem;
    gap: 10px;
    background-color: ${props => props.theme.StrongColor5};
    border-radius: 10px;
    &:hover{
        cursor: pointer;
    }
    &:active{
        background-color: ${props => props.theme.StrongColor3};
    }
    
    ${props => props.isSelected && `
    color: red;
    background: white;
    `}
`
export const WalletSelectionImageStyled = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;
`


