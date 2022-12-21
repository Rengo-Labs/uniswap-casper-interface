import { useState } from 'react';
import { MenuItem } from '../../atoms';
import { StyledCommunityMenu } from './styles';

export interface MenuOption {
  icon?: any;
  text: string;
  navegateTo: string;
}

interface CommunityMenuProps {
  communityOptions: MenuOption[];
}

export const CommunityMenu = ({ communityOptions }: CommunityMenuProps) => {
  const [selectedOption, selectedOptionSet] = useState(0);

  function onOptionClickHandler(navegateTo: string) {
    window.open(navegateTo, '_blank');
  }

  return (
    <StyledCommunityMenu>
      {communityOptions.map((option, index) => (
        <MenuItem
          key={index}
          icon={option.icon}
          text={option.text}
          onClickHandler={() => onOptionClickHandler(option.navegateTo)}
        />
      ))}
    </StyledCommunityMenu>
  );
};
