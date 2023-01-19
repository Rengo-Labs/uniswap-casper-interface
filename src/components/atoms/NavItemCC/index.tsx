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
  gap: ${(props) => !props.collapse && '40px'};
  -webkit-box-pack: center;
  -webkit-box-align: center;
  transition: all 100ms ease 0s;
  font-size: 18px;
  margin-bottom: 10px;

  & svg {
    stroke: white;
    fill: white;
    transition: all 100ms ease;
  }

  &:hover {
    color: ${(props) => !props.isTitle && props.theme.NewAquamarineColor};

    svg {
      stroke: ${(props) => !props.isTitle && props.theme.NewAquamarineColor};
      fill: ${(props) =>!props.isTitle && props.theme.NewAquamarineColor};
    }
  }
`;

export const NavItemCC = ({
  children,
  redirect,
  collapse,
  isTitle,
  onMouseEnter,
  onMouseLeave,
}: {
  children: any;
  redirect: () => void;
  collapse: boolean;
  isTitle?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) => {
  return (
    <NavItemStyled
      onClick={redirect}
      collapse={collapse}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      isTitle={isTitle}
    >
      {children}
    </NavItemStyled>
  );
};
