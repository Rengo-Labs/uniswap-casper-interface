import { useState } from 'react';
import { MenuItem, MenuItemMobile } from '../../atoms';
import { StyledCommunityMenu, Title } from './styles';

export interface MenuOption {
  icon?: any;
  text: string;
  navegateTo: string;
}

interface CommunityMenuProps {
  communityOptions: MenuOption[];
}

export const CommunityMenuMobile = ({ communityOptions }: CommunityMenuProps) => {
  const [selectedOption, selectedOptionSet] = useState(0);

  function onOptionClickHandler(navegateTo: string) {
    window.open(navegateTo, '_blank');
  }

  return (
    <StyledCommunityMenu>
      <Title>Community</Title>
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
