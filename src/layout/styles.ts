import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  /* background: tomato;
  display: flex;
  flex-direction: column; */
`;

export const NavbarContainer = styled.div`
  width: 100%;
  /* position: relative; */
  /* position: fixed; */
`;

export const ChildrenContainer = styled.div<{menuHeight: number}>`
  margin-top: ${({ menuHeight }) => menuHeight}px;
`;