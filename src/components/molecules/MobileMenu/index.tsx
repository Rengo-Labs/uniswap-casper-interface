import {
  Container,
  NavBarMobileContainerStyled,
  NavBarMobileMenuStyled,
} from './styles';
import React from 'react';
import {
  BurgerButton,
  NavMenuMobile,
  ButtonConnectionOverMobile,
} from '../../atoms';

// TODO - Add notifications?
export const MobileMenu = ({
  isConnected,
  onConnect,
  onDisconnect,
  accountHashString,
  icon,
  notifications,
  showNotifications,
  setShowNotifications,
  updateNotificationReadState,
  open,
  setOpen,
  menuIcons,
  option,
  setOption,
}) => {
  return (
    <NavBarMobileContainerStyled>
      <BurgerButton open={open} setOpen={setOpen} />
      <NavBarMobileMenuStyled>
        <a href={'/'}>{icon}</a>
      </NavBarMobileMenuStyled>
      <ButtonConnectionOverMobile
        isConnected={isConnected}
        onConnect={onConnect}
        onDisconnect={onDisconnect}
        accountHashString={accountHashString}
      />
      <NavMenuMobile open={open} option={option} setOption={setOption}>{menuIcons}</NavMenuMobile>
    </NavBarMobileContainerStyled>
  );
};
