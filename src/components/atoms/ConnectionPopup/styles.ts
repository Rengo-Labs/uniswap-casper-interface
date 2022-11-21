import styled from "styled-components";

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

interface OverlayParam {
    isOpened: boolean
}

export const OverlayPopup = styled.div<OverlayParam>`
    visibility: ${props => props.isOpened ? "visible" : "hidden"};
    visibility: ${props => props.isOpened ? "visible" : "hidden"};
    opacity: ${props => props.isOpened ? "1" : "0"};
    z-index: 10;
    backdrop-filter: blur(5px);
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
`

export const PopupContainer = styled.div`
    border: 1px solid black;
    background: #fff;
    border-radius: 20px;
    width: 608px;
    height: 232px;
    display: flex;
    flex-direction: column;
    align-self: center;
`

export const PopupTitle = styled.div`
    border-radius: 20px 20px 0 0;
    display: flex;
    align-items: center;
    height: 30px;
    padding: 10px;
    margin-top: 0;
    background-color: ${props => props.theme.mainBackgroundColor};
    color: ${props => props.theme.secondBackgroundColor};
    font-family: EpilogueLight;
    font-size: 19px;
    border-bottom: .5px solid black;
`

export const PopupBottom = styled.div`
    background-color: ${props => props.theme.mainBackgroundColor};
    height: 30px;
    padding: 10px;
    color: black;
    text-align: center;
    font-size: 16px;
    font-family: 'EpilogueLight';
    border-top: .5px solid black;
    border-radius: 0 0 20px 20px;
    display: flex;
`

export const PopupClose = styled.span`
    text-align: end;
    flex: 0.5;
    font-size: 30px;
    font-weight: bold;
    margin-right: 15px;
    text-decoration: none;
    color: ${props => props.theme.secondBackgroundColor};
    :hover {
        cursor: pointer;
    }
`

export const PopupContent = styled.div`
    padding: 10px;
    margin: 0;
    border-radius: 0;
    height: 132px;
`

export const HRefLink = styled.button`
    color: ${props => props.theme.secondBackgroundColor};
    border: 0;
    background-color: transparent;
`

export const CollapsingPopup = styled.div`
    color: black;
    margin-top: 25px;
    display: flex;
    justify-content: center;
    font-family: EpilogueLight
`

export const PopoverButtonStyled= styled.div`
    display: flex;
    align-items: center; 
    height: 5vh; 
    border-radius: 8px;
    width: 8vw;
    font-weight: 500;
    font-size: 0.8vw;
    justify-content: center;
    color: ${props => props.theme.secondBackgroundColor};
    background: ${props => props.theme.thirdBackgroundColor};
    &:hover{
        cursor: pointer;
    }
    &:active{
        background-color: ${props => props.theme.secondBackgroundColor};
        color: ${props => props.theme.thirdBackgroundColor};
    }
`

export const DisclaimerContent = styled.div`
    color: black;
    padding: 5px;
    text-align: center;
    font-family: EpilogueLight;
    margin-bottom: 1.5vh;
    font-size: 0.8vw;
`