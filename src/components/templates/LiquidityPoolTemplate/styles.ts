import styled from "styled-components";

export const Container = styled.section<{ isMobile: boolean }>`
  display: flex;
  flex-direction: column;

  gap: ${({ isMobile }) => isMobile ? '26px' : '16px' };
`;

export const SubHeader = styled.p`
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 26px;
  letter-spacing: 0.02em;

  /* color: #715FF5; */

  font-family: ${({theme}) => theme.typography.secondaryFont};
  color: ${({theme}) => theme.color.modalText};
  text-align: left;
  font-style: normal;
  font-weight: 800;
  letter-spacing: 0.05em;

`;

