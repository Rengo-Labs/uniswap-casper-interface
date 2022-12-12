import styled from 'styled-components';

export const StyledMenuItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: .5rem 0;
  cursor: pointer;
  color: ${(props) => props.theme.NewPurpleColor};
  &:hover {
    background-color: ${(props) => props.theme.NewGreyColor};
  }
  `;