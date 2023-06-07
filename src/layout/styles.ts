import styled from 'styled-components'

export const Container = styled.div<{ selectedTheme: string }>`
  width: 100%;
  height: 100%;
  background: ${({selectedTheme}) => selectedTheme === 'default' ? '#E5F5FC' : '#241E52'};
`;

export const ChildrenContainer = styled.div<{ menuHeight: number, isMobile: boolean }>`
  position: relative;
  margin-top: ${({menuHeight}) => `${menuHeight}px`};
  margin-left: ${({isMobile}) => isMobile ? '16.5px' : '70px'};
  margin-right: ${({isMobile}) => isMobile ? '16.5px' : '70px'};
`;

/* Double column styles */
export const DoubleColumnContainer = styled.section<{ isMobile: boolean }>`
  width: 100%;
  display: ${({isMobile}) => isMobile ? 'flex' : 'grid'};
  grid-template-columns: ${({isMobile}) => isMobile ? 'repeat(1, 1fr)' : 'repeat(2, 1fr)'};
  gap: ${({isMobile}) => isMobile ? '40px' : '20px'};
  margin-bottom: ${({isMobile}) => isMobile ? '39px' : '71px'};
  flex-direction: column-reverse;
`;

export const TitleContainer = styled.div<{ isMobile: boolean }>`
  width: 100%;
  display: grid;
  grid-template-columns: ${({isMobile}) => isMobile ? 'repeat(1, 1fr)' : 'repeat(2, 1fr)'};
  gap: ${({isMobile}) => isMobile ? '40px' : '20px'};
  padding-top: ${({isMobile}) => isMobile ? '27px' : '23px'};
  padding-bottom: ${({isMobile}) => isMobile ? '16px' : '32px'};

`;

export const Title = styled.h1<{ isMobile: boolean }>`
  font-family: ${({theme}) => theme.typography.secondaryFont};
  font-size: ${({isMobile}) => isMobile ? '28px' : '55px'};
  color: ${({theme}) => theme.defaultColor};
  text-align: left;
  font-style: normal;
  font-weight: 800;
  line-height: ${({isMobile}) => isMobile ? '36px' : '71px'};;
  letter-spacing: 0.05em;
`;

export const Subtitle = styled.h2<{ isMobile: boolean }>`
  display: flex;
  align-items: center;
  font-family: ${({theme}) => theme.typography.secondaryFont};
  font-style: normal;
  font-weight: 600;
  color: ${({theme}) => theme.defaultColor};
  font-size: ${({isMobile}) => isMobile ? '16px' : '18px'};
  line-height: ${({isMobile}) => isMobile ? '19px' : '26px'};;
  letter-spacing: 0.02em;
`;

/* Single column styles */
export const SingleColumnContainer = styled.section<{ isMobile: boolean }>`
  width: 100%;
  margin-bottom: ${({isMobile}) => isMobile ? '40px' : '50px'};
`;
