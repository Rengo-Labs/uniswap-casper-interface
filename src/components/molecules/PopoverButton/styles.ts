import styled from 'styled-components'
import {NewIcons} from "../../atoms";

export const PopoverContainer = styled("div")`
    position: absolute;
    width: 260px;
    margin-left: -5.2vw;
    margin-top: 1vh;
    top: 4vh;
    right: 3vh;
    z-index: 100;
`

export const ContainerList = styled("ul")`
  padding: 0;
  margin: 0;
  background-color: white;
  border: 1px solid black;
  border-radius: 10px;
  box-sizing: border-box;
  color: black;
  font-size: 0.8vw;
  z-index: 10;
  font-weight: 500;
  font-family: 'MyriadPro'
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
    font-family: 'EpilogueLight';
    font-size: 0.7vw;
`

export const ItemMenu = styled(ItemList)`
    &:hover{
        cursor: pointer;
        background-color: rgb(232, 228, 228);
    }
`

export const WalletItemList = styled(ItemList)`
    justify-content: center; 
    padding-top: 1em; 
    padding-bottom: 1em;
    padding-right: 1em;
    border-top: 0px; 
    color: #39B54A;
    font-family: 'MyriadPro';
`

export const ItemColumn = styled.div<any>`
    flex: ${props => props.flex};
    text-align: ${props => props.position};
    padding: ${props => props.padding ? props.padding : 0};
`

export const ButtonStyle = styled.button<any>`
    display: flex;
    align-items: center;
    color: ${props => props.theme.secondBackgroundColor};
    background: ${props => props.theme.thirdBackgroundColor};
    padding: .875rem 2rem;
    border-radius: 8px;
    border:none;
    overflow:hidden; 
    white-space:nowrap; 
    text-overflow: ellipsis;
    font-family: 'MyriadPro';
    gap: 4px;
    &:hover{
        cursor: pointer;
    }
    &:active{
        background-color: ${props => props.theme.secondBackgroundColor};
        color: ${props => props.theme.thirdBackgroundColor};
    }
`
