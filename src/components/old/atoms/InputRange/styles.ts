import styled from 'styled-components'

export const ButtonStyle = styled.button<any>`
    color: ${props => props.enabled ? props.theme.secondBackgroundColor : props.theme.NewGrayColor};
    background-color: ${props => props.enabled ? props.theme.thirdBackgroundColor : props.theme.NewGreyColor};
    padding: 1.7vh 1.7em;
    border-radius: 10px;
    border:none;
    width: 8vw;
    height: 5.6vh;
    font-family: 'EpilogueLight';
    font-size: .8vw;
    display: grid;
    place-items: center;
    &:hover{
        cursor: pointer;
    }
    &:active{
        color: ${props => props.enabled ? props.theme.thirdBackgroundColor : props.theme.NewGrayColor};
        background-color: ${props => props.enabled ? props.theme.secondBackgroundColor : props.theme.NewGreyColor};
    }
`

export const StyledInputRange = styled.input`
    background-color: ${props => props.theme.mainBackgroundColor};
    width: 82%;
    text-align: center;
    align-items: center;
    align-self: center;
    align-content: center;
    
`

export const WrappedInputRange = styled.label`
    width: 100%;
    display: flex; 
    flex-direction: column; 
    font-family: 'EpilogueLight'; 
    font-size: 14px;
`

export const WrappedPerLabel = styled.div`
    display: flex;
`

export const FuchsiaPerItem = styled.div`
    flex: 1; 
    text-align: center; 
    color: fuchsia;
`

export const PerItem = styled.div`
    flex: 1; 
    text-align: center; 
`