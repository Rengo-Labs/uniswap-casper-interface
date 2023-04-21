import styled from 'styled-components'

export const Container = styled.div<{selectedTheme: string}>`
  width: 100%;
  height: 100%;
  background: ${({ selectedTheme }) => selectedTheme === 'default' ? '#E5F5FC': '#241E52'};
`;

export const ChildrenContainer = styled.div<{menuHeight: number}>`
  margin-top: ${({ menuHeight }) => menuHeight}px;
`;