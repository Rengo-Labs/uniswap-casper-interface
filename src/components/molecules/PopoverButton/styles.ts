import styled from 'styled-components'

export const PopoverContainer = styled("div")`
    position: absolute;
    width: 11.5vw;
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

export const WalletItemList = styled(ItemList)`
    justify-content: center; 
    padding-top: 0.7em; 
    padding-bottom: 0.7em;
    padding-right: 1em;
    border-top: 0px; 
    color: ${props => props.theme.secondBackgroundColor};
    font-family: Epilogue;
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
        background-color: ${props => props.theme.secondBackgroundColor};
        color: ${props => props.theme.thirdBackgroundColor};
    }
`