import { useState } from 'react';
import { MenuItemMobile } from '../../atoms';
import { Close, HeaderContainer, StyledCommunityMenu, Title } from './styles';

export interface MenuOption {
  icon?: any;
  text: string;
  navegateTo: string;
}

interface CommunityMenuProps {
  communityOptions: MenuOption[];
  setOption?: (option: string) => void;
}

export const CommunityMenuMobile = ({ communityOptions, setOption }: CommunityMenuProps) => {
  const [selectedOption, selectedOptionSet] = useState(0);

  function onOptionClickHandler(navegateTo: string) {
    window.open(navegateTo, '_blank');
  }

  return (
    <StyledCommunityMenu>
      <HeaderContainer>
      <Title>Community</Title>
      <Close onClick={() => setOption && setOption('')} >x</Close>
      </HeaderContainer>
      {communityOptions.map((option, index) => (
        <MenuItemMobile
          key={index}
          icon={option.icon}
          text={option.text}
          onClickHandler={() => onOptionClickHandler(option.navegateTo)}
        />
      ))}
    </StyledCommunityMenu>
  );
};
