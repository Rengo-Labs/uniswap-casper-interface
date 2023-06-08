import styled from "styled-components";

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

export const LPContainer = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid black;
    border-radius: 20px;
    background-color: white;
    margin-left: 23px;
    margin-right: 23px;
    margin-bottom: 10px;
    height: 30px;
    padding: 15px 5px;
`

export const PriceContainer = styled.div<any>`
    display: flex;
    flex-direction: row;
    border: 0px solid black;
    border-radius: 20px;
    background-color: white;
    margin-left: 23px;
    margin-right: 23px;
    margin-bottom: ${props => props.bottom};
    height: 36px;
    padding: 10px 5px;
    font-family: 'EpilogueLight';
`

export const PriceLabel = styled.div`
    flex: 1;
    align-self: center;
    font-size: 13px;
    color: ${props => props.theme.NewPurpleColor}
    text-align: center;
`

export const PriceTokenLabel = styled.div`
    flex: 4;
    font-size: 15px;
`

export const PriceRowLabel = styled.div`
    flex: 4;
    font-size: 15px;
    padding: 2px;
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
    width: 100%;
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

export const TColumn1 = styled.div`
    flex: 1;
    display: flex;
`

export const TColumn3 = styled.div`
    flex: 3;
`
export const TColumn1Right = styled.div`
    flex: 1;
    align-self: center;
    font-size: 17px;
    color: ${props => props.theme.NewPurpleColor}
`

export const SymbolContainer = styled.div`
    flex: 3;
    display: flex;
    flex-direction: row;
    align-self: center;
    text-align: left;
    font-size: 13px;
`

export const TokenSymbol = styled.div`
    padding: 2px;
`

export const TokenName = styled.div`
    padding: 2px;
    color: grey;
    font-size: 11px;
    align-self: end;
`

export const SymbolSubTitle = styled.div`
    flex: 3;
    align-self: center;
    text-align: left;
    color: grey;
    font-family: 'EpilogueLight';
    font-size: 11px;
    padding: 2px 0 0 0;
`
export const SwapIconImageStyled = styled.img`
    border-radius: 50%;
`
export const SwapIconImageStyledRelative = styled.img`
    border-radius: 50%;
    position: relative; 
    left: -10px;
`