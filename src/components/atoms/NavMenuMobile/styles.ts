import styled from 'styled-components'
export const StyledMenu = styled.nav.attrs((props: { open?: boolean }) => props)`
  display: grid;
  grid-template: auto 1fr auto / auto;
  justify-items: center;
  flex-direction: column;
  justify-content: center;
  background: ${props => props.theme.NewPurpleColor};
  transform: ${props => props.open ? 'translateX(0)' : 'translateX(-100%)'};
  height: 100vh;
  text-align: left;
  padding: 1rem;
  position: fixed;
  top: 0;
  left: 0;
  transition: transform 0.3s ease-in-out;
  z-index: 3;
  width: 100%;

  @media (max-width: 576px) {
      width: 100%;
  }
  
`
