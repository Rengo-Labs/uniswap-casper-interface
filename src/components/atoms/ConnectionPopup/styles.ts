import styled from "styled-components";
import {device} from "../../../contexts/ThemeContext/themes";

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
  
    @media ${device.mobileS} {
      font-size: 12px;
    }
  
    @media ${device.tablet} {
      font-size: 12px;
    }
  
    @media ${device.laptop} {
      font-size: 0.8vw;
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
      width: 608px;
    }
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
    font-family: 'EpilogueLight';
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
export const PopoverButtonStyled= styled.div`
    display: flex;
    align-items: center; 
    border-radius: 8px;
    font-family: 'MyriadProd';
    justify-content: center;
    color: ${props => props.theme.secondBackgroundColor};
    background: ${props => props.theme.thirdBackgroundColor};
    gap: 4px;
    &:hover{
        cursor: pointer;
    }
    &:active{
        background-color: ${props => props.theme.secondBackgroundColor};
        color: ${props => props.theme.thirdBackgroundColor};
    }

    @media ${device.mobileS} {
        width: 100px;
        font-size: 12px;
    }
    @media ${device.tablet} {
        font-size: 16px;
        line-height: 32px;
        padding: .875rem 2rem;
    }
`

export const DisclaimerContent = styled.div`
    color: black;
    padding: 5px;
    text-align: center;
    font-family: 'EpilogueLight';
    margin-bottom: 1.5vh;
    font-size: 0.8vw;
  
    @media ${device.mobileS} {
      font-size: 12px;
    }
    @media ${device.tablet} {
      font-size: 12px;
    }
    @media ${device.laptop} {
      font-size: 0.8vw;
    }
`

export const WalletSelectionImageStyled = styled.img`
    width: 36px;
    height: 36px;
    border-radius: 50%;
`

export const ButtonText = styled.h2`
  font-family: 'EpilogueLight';
`

export const TFlex1 = styled.div`
    flex: 1;
`