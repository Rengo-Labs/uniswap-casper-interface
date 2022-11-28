import styled from 'styled-components'

export const PopoverContainer = styled("div")`
    position: absolute;
    width: 260px;
    margin-left: -5.2vw;
    margin-top: 1vh;
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
    padding-top: 0.7em; 
    padding-bottom: 0.7em;
    padding-right: 1em;
    border-top: 0px; 
    color: ${props => props.theme.secondBackgroundColor};
    font-family: Epilogue;
`

export const ItemColumn = styled.div<any>`
    flex: ${props => props.flex}
    text-align: ${props => props.position}
`

export const ButtonStyle = styled.button<any>`
    display: flex;
    align-items: center;
    color: ${props => props.theme.secondBackgroundColor};
    background: ${props => props.theme.thirdBackgroundColor};
    padding:0px;
    width: 230px;
    height: 46px;
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