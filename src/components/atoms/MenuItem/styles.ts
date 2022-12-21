import styled from 'styled-components';

export const StyledMenuItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: .6rem 0;
  cursor: pointer;
  color: ${(props) => props.theme.NewPurpleColor};
  &:hover {
    background-color: ${(props) => props.theme.NewGreyColor};
  }
  `;

export const StyledIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: .1rem 1.2rem;
`
