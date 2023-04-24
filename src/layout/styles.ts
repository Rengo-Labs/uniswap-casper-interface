import styled from 'styled-components'

export const Container = styled.div<{selectedTheme: string}>`
  width: 100%;
  height: 100%;
  background: ${({ selectedTheme }) => selectedTheme === 'default' ? '#E5F5FC': '#241E52'};
`;

export const ChildrenContainer = styled.div<{menuHeight: number, isMobile: boolean}>`
  margin-top: ${({ menuHeight }) => `${menuHeight}px` };
  margin-left: ${({ isMobile }) => isMobile ? '16.5px' : '70px' };
  margin-right: ${({ isMobile }) => isMobile ? '16.5px' : '70px' };
`;

/* Double column styles */
export const DoubleColumnContainer = styled.section`
  width: 100%;
`;

/* Single column styles */
export const SingleColumnContainer = styled.section`
  width: 100%;
`;
