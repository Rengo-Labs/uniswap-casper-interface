import styled from 'styled-components'

export const TBody = styled.div`
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    color: black;
    font-family: 'MyriadPro';
    gap: 8px;
`

export const TWrapRow = styled.div`
    border-radius: 16px;
    border: 1px solid black;
    padding: 1rem 2rem;
    background-color: white;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0.02em;
`

export const WrappedRow = styled.div`
    display: flex;
    width: 100%;
    padding: .5rem 0 0;
`

export const TRow = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

export const TColumn6 = styled.div`
    flex: 6;
`

export const TBodyColumn6 = styled.div`
    flex: 6;
    padding: 0.3rem 0 0;
`

export const TColumn3 = styled.div`
    flex: 3;
`

export const TColumn1 = styled.div`
    flex: 1;
`

export const TColumn2andHalf = styled.div`
    flex: 2.5;
`

export const PairTitleColumn = styled.div`
  flex: 3; 
  align-self: center;
  text-align: center;
`

export const IconColumn1 = styled.div`
  align-self: center; 
  display: flex;
  flex: 1;
`

export const TitleBodyRow = styled.div`
  flex: 3;
  text-align: center; 
  font-size: 16px; 
  line-height: 32px; 
  font-family: "MyriadProSemiBold";
`

export const NormalBodyRow = styled.div`
  flex: 3;
  text-align: center; 
  font-size: 16px; 
  line-height: 32px; 
  font-family: "MyriadPro";
`

export const TButtonColumn3 = styled.div`
  flex: 3;
  padding: 0.25rem 0 0;
`

export const TBodyColumn3 = styled.div`
  flex: 3;
  padding: 0.3rem 0 0;
`

export const TBodyExpanded = styled.div`
    display: flex;
`

export const CircleButton = styled.button`
    background-color: ${props => props.disabled ? "grey" : props.theme.secondBackgroundColor};
    display: flex;
    padding: 0;
    border: 0;
    cursor: ${props => props.disabled ? "auto" : "pointer"};
    justify-content: center;
    border-radius: 45%;
    margin: 5px;
    height: 4.5vh;
    width: 4.5vh;
`

export const AddLiquidityButton = styled.button<any>`
    color: ${props => props.enabled ? props.theme.secondBackgroundColor : props.theme.NewGrayColor};
    background-color: ${props => props.enabled ? props.theme.thirdBackgroundColor : props.theme.NewGreyColor};
    border:none;
    align-items: center;
    font-size: 16px;
    line-height: 32px;
    letter-spacing: 0.02em;
    font-family: 'MyriadPro';
    display: flex; 
    border-radius: 8px; 
    padding: 0.25rem 1.375rem; 
    height: 2.5rem; 
    justify-content: center; 
    
    &:hover{
        cursor: pointer;
    }
    &:active{
        color: ${props => props.enabled ? props.theme.thirdBackgroundColor : props.theme.NewGrayColor};
        background-color: ${props => props.enabled ? props.theme.secondBackgroundColor : props.theme.NewGreyColor};
    }
`