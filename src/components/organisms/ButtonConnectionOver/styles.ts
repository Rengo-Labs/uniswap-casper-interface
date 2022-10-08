import styled from "styled-components";

export const PopoverButton = styled("div")`
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
`

export const PopoverContainer = styled("div")`
    position: absolute;
    width: 11.5vw;
`

export const WalletContainer = styled.div`
    padding: 0;
    margin: 0;
    background-color: ${props => props.theme.mainBackgroundColor};
    border: 0.5px solid black;
    border-radius: 10px;
    box-sizing: border-box;
    color: black;
    font-size: 0.8vw;
    z-index: 10;
    font-weight: 500;
    &:first-child {
        padding-top: 0.2em;
        padding-bottom: 0em;
    }
`

export const ContainerList = styled("ul")`
  padding: 0;
  margin: 0;
  background-color: white;
  border: 0.5px solid black;
  border-radius: 10px;
  box-sizing: border-box;
  color: black;
  font-size: 0.8vw;
  z-index: 10;
  font-weight: 500;
  &:first-child {
    padding-top: 0.2em;
    padding-bottom: 0em;
  }
`

export const ItemList = styled("li")`
    display: flex;
    justify-content: left;
    align-items: center;
    list-style: none;
    text-align: center;
    padding-top: 0em;
    padding-bottom: 0em;
    padding-left: 1em;
    font-family: 'EpilogueLight';
    font-size: 0.7vw;
    border-top: 0.5px solid black;
`

interface ItemColumnImp {
    flex: string;
    position: string;
}

export const ItemColumn = styled.div<ItemColumnImp>`
    flex: ${props => props.flex}
    text-align: ${props => props.position}
`

export const ButtonStyle = styled.button<any>`
    display: flex;
    align-items: center;
    color: ${props => props.theme.secondBackgroundColor};
    background: ${props => props.theme.thirdBackgroundColor};
    padding:0px;
    width: 65%;
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
`

export const DisclaimerContent = styled.div`
    color: black;
    padding: 5px;
    text-align: center;
    font-family: EpilogueLight;
    margin-bottom: 1.5vh;
    font-size: 0.8vw;
`

export const BoldText = styled.strong`
    font-family: EpilogueBold;
`