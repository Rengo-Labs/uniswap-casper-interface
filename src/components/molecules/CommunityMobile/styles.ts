import styled, { keyframes } from 'styled-components';

const progress = keyframes`
  100% {
    transform: translateX(0);
  }
`;

export const StyledCommunityMenu = styled.ul`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 24px;
  gap: 12px;
  background: ${(props) => props.theme.NewWhiteColor};
  border: 1px solid #080808;
  border-bottom: none;
  border-radius: 16px 16px 0px 0px;
  width: 100%;
  height: 286px;
  margin-right: auto;
  position: absolute;
  transform: translateX(-100%);
  margin-bottom: 135px;
  animation: ${progress} 0.3s linear forwards;
  & :hover {
    border-radius: 16px;
  }
`;

export const Title = styled.h5`
  font-family: 'Myriad Pro';
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 26px;
  letter-spacing: 0.02em;
  color: ${(props) => props.theme.NewPurpleColor};
  margin: 0px;
  padding-left: 8px;
`;
