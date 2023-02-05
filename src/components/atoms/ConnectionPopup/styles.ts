import styled from "styled-components";
import {device} from "../../../contexts/ThemeContext/themes";

export const WalletContainer = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: 16px;
  
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
    border: 2px solid ${(props) => props.theme.SecondBlackColor};
    background: ${(props) => props.theme.PrimaryColor};
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-self: center;
    max-width: 400px;

    @media ${device.mobileS} {
        width: 90%;
    }
`;

export const PopupTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start ;
    padding: 12px 12px 12px 20px;
    color: ${(props) => props.theme.NewPurpleColor};
    font-family: "MyriadPro";
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 32px;
    letter-spacing: 0.02em;
    border-bottom: 1px solid ${(props) => props.theme.SecondBlackColor};
`;

export const PopupBottom = styled.div`
    text-align: center;
    padding: 12px;
    font-family: "MyriadPro";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 32px;
    letter-spacing: 0.02em;
    border-top: 1px solid ${(props) => props.theme.SecondBlackColor};
`;

export const PopupClose = styled.span`
    :hover {
        cursor: pointer;
    }
`
export const PopupContent = styled.div`
    padding: 16px;
`

export const HRefLink = styled.button`
    color: ${props => props.theme.secondBackgroundColor};
    border: 0;
    background-color: transparent;
    cursor: pointer;
`
export const PopoverButtonStyled= styled.div`
    display: flex;
    align-items: center; 
    border-radius: 8px;
    font-family: 'MyriadPro';
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
        width: auto;
        font-size: 16px;
        line-height: 32px;
        padding: .875rem 2rem;
    }
`

export const DisclaimerContent = styled.div`
    color: ${(props) => props.theme.SecondBlackColor};
    margin: 8px 0;
    padding: 0 16px 16px 16px;
    text-align: center;
    font-family: "MyriadPro";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 16px;
    letter-spacing: 0.02em;

    @media ${device.mobileS} {
        font-size: 16px;
    }
    @media ${device.tablet} {
        font-size: 16px;
    }
    @media ${device.laptop} {
        font-size: 16px;
    }
`;

export const WalletSelectionImageStyled = styled.img`
    width: 32px;
    height: 32px;
    border-radius: 50%;
`

export const ButtonText = styled.h2`
    color: ${(props) => props.theme.SecondBlackColor};
    font-family: "MyriadPro";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 32px;
    letter-spacing: 0.02em;
    margin-left: 8px;
`;

export const TFlex1 = styled.div`
    flex: 1;
`