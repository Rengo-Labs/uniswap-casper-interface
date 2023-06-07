import styled from 'styled-components'
export const BurgerButtonStyled = styled.button.attrs((props: { open?: boolean }) => props)`
  position: absolute;
  top: 25%;
  left: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;

  &:focus {
    outline: none;
  }

  & div {
    width: 2rem;
    height: 0.25rem;
    background: ${props => props.open ? props.theme.NewAquamarineColor : '#FFFFFF'};
    border-radius: 10px;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: 1px;

    :first-child {
      transform: ${props => props.open ? 'rotate(45deg)' : 'rotate(0)'};
    }

    :nth-child(2) {
      opacity: ${props => props.open ? '0' : '1'};
      transform: ${props => props.open ? 'translateX(20px)' : 'translateX(0)'};
    }

    :nth-child(3) {
      transform: ${props => props.open ? 'rotate(-45deg)' : 'rotate(0)'};
    }
  }
`
