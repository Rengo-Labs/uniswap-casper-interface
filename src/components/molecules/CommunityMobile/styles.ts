import styled, { keyframes } from 'styled-components';

const progress = keyframes`
  100% {
    transform: translateY(0);
  }
`;

export const StyledCommunityMenu = styled.ul`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 16px 32px 50px;
  gap: 12px;
  background: ${(props) => props.theme.NewWhiteColor};
  border: 1px solid #080808;
  border-radius: 16px 16px 0px 0px;
  width: 100vw;
  height: 300px;
  position: absolute;
  align-self: flex-end;
  margin-right: 33px;
  transform: translateY(100%);
  animation: ${progress} 0.3s linear forwards;
  & :hover {
    border-radius: 16px;
  }
`;

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  `;

export const Title = styled.h5`
  font-family: 'MyriadPro';
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 26px;
  letter-spacing: 0.02em;
  color: ${(props) => props.theme.NewPurpleColor};
  margin: 0px;
  padding-left: 8px;
`;

export const Close = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 12px;
  font-family: 'MyriadPro';
  font-size: 24px;
  cursor: pointer;
  color: ${(props) => props.theme.NewPurpleColor};
`;
