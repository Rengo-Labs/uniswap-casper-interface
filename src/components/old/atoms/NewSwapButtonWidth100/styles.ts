import styled from 'styled-components'

export const ButtonStyle = styled.button`
  box-sizing: border-box;
  width: 100%;
  height: 57px;
  color: ${props => props.theme.NewPurpleColor};
  background-color: ${props => props.theme.NewAquamarineColor};
  padding:10px 0;
  border-radius: 10px;
  border:none;
  &:hover{
    cursor: pointer;
    background-color: ${props => props.theme.NewAquamarineColor};
  }
  &:active{
    background-color: ${props => props.theme.NewAquamarineColor};
  }
  &:disabled{
    cursor: not-allowed;
    background: #CCCCCC 0% 0% no-repeat padding-box;
    border-radius: 12px;
    color: #999999;
  }
`
