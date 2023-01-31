import styled from 'styled-components';

export const StyledCommunityMenu = styled.ul`
  position: absolute;
  background-color: white;
  box-sizing: border-box;
  justify-self: center;
  height: 320px;
  width: 180px;
  border: 1px solid ${(props) => props.theme.NewBlackColor};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 50;
  margin-left: 470px;
  margin-top: -300px;
  & > :first-child {
    border-radius: 10px 10px 0 0;
  }
  & > :last-child {
    border-radius: 0 0 10px 10px;
  }
`;