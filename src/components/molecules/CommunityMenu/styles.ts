import styled from 'styled-components';

export const StyledCommunityMenu = styled.ul`
  position: absolute;
  background-color: white;
  box-sizing: border-box;
  justify-self: center;
  height: 115px;
  width: 200px;
  border: 1px solid ${(props) => props.theme.NewGreyColor};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 50;
  margin-left: 490px;
  margin-top: -80px;
  & > :first-child {
    border-radius: 10px 10px 0 0;
  }
  & > :last-child {
    border-radius: 0 0 10px 10px;
  }
`;