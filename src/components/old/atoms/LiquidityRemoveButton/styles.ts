import styled from 'styled-components'

export const ButtonStyle = styled.button<any>`
  color: ${props => props.enabled ? props.theme.secondBackgroundColor : props.theme.NewGrayColor};
  background-color: ${props => props.enabled ? props.theme.thirdBackgroundColor : props.theme.NewGreyColor};
  padding: 1.7vh 1.7em;
  border-radius: 10px;
  border: none;
  width: 391px;
  height: 57px;
  font-family: 'EpilogueLight';
  font-size: 16px;
  display: grid;
  place-items: center;
  marginTop: 10px;
  &:hover {
    cursor: pointer;
  }
  &:active {
    color: ${props => props.enabled ? props.theme.thirdBackgroundColor : props.theme.NewGrayColor};
    background-color: ${props => props.enabled ? props.theme.secondBackgroundColor : props.theme.NewGreyColor};
  }`
