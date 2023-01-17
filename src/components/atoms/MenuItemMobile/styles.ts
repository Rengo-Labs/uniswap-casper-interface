import styled from 'styled-components';
import { device } from '../../../contexts/ThemeContext/themes';

export const StyledMenuItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 0.6rem 0;
  cursor: pointer;
  color: ${(props) => props.theme.NewPurpleColor};
  @media ${device.tablet} {
    &:hover {
    background-color: ${(props) => props.theme.NewGreyColor};
  }
  }
`;

export const StyledIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding-left: 8px;
`;

export const Text = styled.p`
  color: ${(props) => props.theme.NewPurpleColor};
  font-family: 'MyriadPro';
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 32px;
  letter-spacing: 0.02em;
`;
