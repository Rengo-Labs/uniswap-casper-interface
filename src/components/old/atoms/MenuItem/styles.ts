import styled from 'styled-components';

export const StyledMenuItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 0.6rem 0;
  cursor: pointer;
  color: ${(props) => props.theme.NewPurpleColor};
  &:hover {
    background-color: ${(props) => props.theme.NewGreyColor};
  }
  svg {
      stroke: ${(props) => props.theme.NewPurpleColor} !important;
      fill: ${(props) => props.theme.NewPurpleColor} !important;
      
    }
`;

export const StyledIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 0.1rem 1.2rem;
`;

export const Text = styled.p`
  color: ${(props) => props.theme.NewPurpleColor};
  font-size: 16px;
  font-family: 'MyriadPro';
`