import React from 'react';
import styled from 'styled-components';

const NavItemStyled = styled.nav<any>`
  box-sizing: border-box;
  width: 100%;
  padding: 10px 1.2em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  -webkit-box-pack: center;
  -webkit-box-align: center;
  transition: all 100ms ease 0s;
  font-size: 18px;

  & svg {
    stroke: white;
    fill: white;
    transition: all 100ms ease;
  }

  &:hover {
    color: ${(props) => props.theme.NewAquamarineColor};

    svg {
      stroke: ${(props) => props.theme.NewAquamarineColor};
      fill: ${(props) => props.theme.NewAquamarineColor};
    }
  }
`;

export const NavItemCC = ({
  children,
  redirect,
  collapse,
  onMouseEnter,
  onMouseLeave,
}: {
  children: any;
  redirect: () => void;
  collapse: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) => {
  return (
    <NavItemStyled
      onClick={redirect}
      collapse={collapse}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </NavItemStyled>
  );
};
