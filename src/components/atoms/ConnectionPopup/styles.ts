import styled from "styled-components";

export const ButtonStyle = styled.button<any>`
    color: rgb(120, 100, 244);
    background-color: #70ecd4;
    padding:10px;
    width: 80%;
    border-radius: 10px;
    border:none;
    overflow:hidden; 
    white-space:nowrap; 
    text-overflow: ellipsis;
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
export const WalletContainer = styled.div`
    display: flex;
    padding: 0;
    margin: 0;
    color: black;
    font-size: 0.8vw;
    z-index: 10;
    font-weight: 500;
    justify-content: center;
    &:first-child {
        padding-top: 0.5em;
        padding-bottom: 0.5em;
    }
`

export const PopoverContainer = styled("div")`
    position: absolute;
    width: 11.5vw;
`

export const OverlayPopup = styled.div`
    visibility: hidden;
    opacity: 0;
    backdrop-filter: blur(5px);
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    transition: opacity 500ms;
    display: flex;
    justify-content: center;
`

export const PopupContainer = styled.div`
    border: 0.5px solid black;
    margin: 70px auto;
    background: #fff;
    border-radius: 20px;
    width: 30%;
    height: 32vh;
    top: 20%;
    position: relative;
    transition: all 1s ease-in-out;
    
    @media screen and (max-width: 700px) {
    .popup {
        width: 70%;
    }
}
`

export const PopupTitle = styled.div`
    border-radius: 20px 20px 0 0;
    padding: 2.5vh;
    margin-top: 0;
    background-color: ${props => props.theme.mainBackgroundColor};
    color: ${props => props.theme.secondBackgroundColor};
    font-family: EpilogueLight;
    font-size: 0.8vw;
    border-bottom: 0.5px solid black;
`

export const PopupBottom = styled.div`
    background-color: ${props => props.theme.mainBackgroundColor};
    padding: 2vh;
    color: black;
    text-align: center;
    font-size: 0.8vw;
    font-family: 'EpilogueLight';
    border-top: 0.5px solid black;
    border-radius: 0 0 20px 20px;
`

export const PopupClose = styled.span`
    position: absolute;
    top: 1.5vh;
    right: 30px;
    transition: all 200ms;
    font-size: 30px;
    font-weight: bold;
    text-decoration: none;
    color: ${props => props.theme.secondBackgroundColor};
    :hover {
        cursor: pointer;
        color: #000;
    }
`

export const PopupContent = styled.div`
    overflow: auto;
    margin-top: 2vh;
    padding: 0.5vw;
`

export const HRefLink = styled.button`
    color: ${props => props.theme.secondBackgroundColor};
    border: 0;
    background-color: transparent;
`

export const CollapsingPopup = styled.div`
    color: black;
    margin-top: 10px;
    display: flex;
    justify-content: center;
    font-family: EpilogueLight
`