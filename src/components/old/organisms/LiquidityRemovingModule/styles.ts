import styled from "styled-components";

interface OverlayParam {
    isOpened: boolean
}

export const OverlayPopup = styled.div<any>`
    visibility: ${props => props.isOpened ? 'visible' : 'hidden'};
    opacity: ${props => props.isOpened ? '1' : '0'};
    z-index: 2;
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
    border: 1px solid black;
    border-radius: 20px;
    width: 462px;
    top: 20%;
    position: relative;
    transition: all 1s ease-in-out;
    background-color: ${props => props.theme.mainBackgroundColor};
    @media screen and (max-width: 700px) {
    .popup {
        width: 70%;
    }
}
`

export const PopupTitle = styled.div`
    border-radius: 20px 20px 0 0;
    text-align: left;
    padding: 30px 10px 10px 56px;
    margin-top: 0;
    background-color: ${props => props.theme.mainBackgroundColor};
    color: ${props => props.theme.secondBackgroundColor};
    font-family: EpilogueLight;
    font-size: 18px;
`

export const PopupBottom = styled.div`
    color: black;
    text-align: center;
    font-family: 'EpilogueLight';
    display: flex;
    justify-content: center;
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
    padding: 0.5vw;
`

export const ButtonHalfMaxContainer = styled.div`
    display: grid;
    flex: 1;
    align-self: center;
    gap:10px;
    height: 55px;
    border-left: 2px solid ${props => props.theme.secondBackgroundColor};
    padding-left: 10px;
`

export const ButtonHalfMax = styled.div<any>`
    background-color: ${props => props.theme.NewPurpleColor};
    color: ${props => props.theme.mainBackgroundColor};
    border-radius: 4px;
    cursor: pointer;
    width: 42px;
    height: 23px;
    display: flex;
    font-size: 11px;
    justify-content: center;
    align-items: center;
`

export const LPContainer = styled.div`
    display: flex;
    border: 1px solid black;
    border-radius: 20px;
    background-color: white;
    width: 342px;
    margin-left: 23px;
    margin-right: 23px;
    margin-bottom: 18px;
    height: 56px;
    padding: 15px 25px;
`

export const LPDetail = styled.div`
    flex: 1;
`

export const LPTitleDetail = styled.div`
    font-size: 9px;
    text-align: left;
    padding-left: 1px;
`

export const LPLabelDetail = styled.div`
    font-size: 13px;
    height: 41px;
    display: flex;
    align-items: center;
`

export const InputContainer = styled.div`
    flex: 1; 
    display: flex; 
    flex-direction: column;
`

export const BalanceStyled = styled.div`
    flex: .5;
    font-size: 10px;
    align-self: flex-end;
`

export const InputStyled = styled.input`
    text-align: end;
    box-sizing: border-box;
    background-color: transparent;
    color: ${props => props.theme.secondBackgroundColor};
    border-style:none;
    font-family: 'EpilogueLight'; 
    font-size: 17px;
    width:100%;
    &::placeholder{
        color: gray;
        background-color: transparent;
    }
    &:focus{
        outline: none;
    }
`

export const InputAmountStyled = styled.div`
    flex: 2;
    align-self: flex-end;
    align-items: center;
    display: flex;
    color: ${props => props.theme.secondBackgroundColor};
`

export const USDLabelStyled = styled.div`
    flex: .5; 
    font-size: 10px; 
    align-self: flex-end;
`

export const RemoveButtonContainer = styled.div`
    display: flex;
    justify-content: center;
`