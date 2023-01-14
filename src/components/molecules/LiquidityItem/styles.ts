import styled from 'styled-components'

export const SymbolContainer = styled.div`
    flex: 3;
    align-self: center;
    text-align: left
`

export const TWrapRow = styled.div`
    background-color: white;
    border-radius: 20px;
    border: 1px solid black;
    padding: 7px 0px 7px 0px;
    margin: 2px 0 2px 0;
    width: 100%;
`

export const WrappedRow = styled.div`
    display: flex;
    padding-top: 10px;
    padding-left: 35px;
    padding-right: 35px;
`

export const TRow = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    padding: 3px 25px
`
export const TColumn1 = styled.div`
    flex: 1;
    display: flex;
`

export const TColumn1WithColor = styled.div`
    flex: 1;
    text-align: right;
    color: ${props => props.theme.secondBackgroundColor};
`

export const TBodyExpanded = styled.div`
    
`

export const TBodyExpandedDiv = styled.div`
    padding-left: 20px;
    padding-right: 20px; 
    padding-top: 10px;
`

export const TBodyExpandedDivBorder = styled.div`
    border-top: 1px solid black;
`


export const CircleButton = styled.button`
    background-color: ${props => props.theme.secondBackgroundColor};
    display: flex;
    padding: 0;
    border: 0;
    cursor: pointer;
    justify-content: center;
    border-radius: 45%;
    margin: 5px;
    height: 4.5vh;
    width: 4.5vh;
`

export const SwapIconImageStyled = styled.img`
    border-radius: 50%;
`
export const SwapIconTwoImageStyled = styled.img`
    position: relative;
    border-radius: 50%;
    left: -16px;
`

export const SwapIconImageStyledRelative = styled.img`
    border-radius: 50%;
    position: relative; 
    left: -10px;
`
