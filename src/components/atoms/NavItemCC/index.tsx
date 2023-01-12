import React from 'react';
import styled from 'styled-components';

const NavItemStyled = styled.nav<any>`
  box-sizing: border-box;
  width: 100%;
  padding: 10px 1.2em;
  cursor: pointer;
  display: flex;
  gap: 40px;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  transition: all 100ms ease 0s;

  & svg {
    stroke: white;
    fill: white;
    transition: all 100ms ease;
  }

  &:hover {
    //background-color: white;
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
