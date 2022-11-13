import styled from "styled-components"

const ContainerStyled = styled.div`
  width: 100%;
  display:grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  background-color: #F7FCFE;
`
export function ContainerSwapModule({ children }) {
  return (<ContainerStyled>{children}</ContainerStyled>)
}