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
export const DoubleColumnContainer = styled.section<{ isMobile: boolean}>`
  width: 100%;
  display: grid;
  grid-template-columns: ${({ isMobile }) => isMobile ? 'repeat(1, 1fr)' : 'repeat(2, 1fr)' } ;
  gap: ${({ isMobile }) => isMobile ? '40px' : '20px'};
  background: lightblue;
  margin-bottom: ${({ isMobile }) => isMobile ? '39px' : '71px' };
`;

/* Single column styles */
export const SingleColumnContainer = styled.section<{ isMobile: boolean}>`
  width: 100%;
  margin-bottom: ${({ isMobile }) => isMobile ? '40px' : '50px' };
`;
