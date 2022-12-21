import { NewIcons } from '../NewIcons';
import { StyledIconContainer, StyledMenuItem } from './styles';

export const MenuItem = ({
  icon,
  text,
  onClickHandler,
}: {
  icon?: any;
  text: string;
  onClickHandler: any;
}) => {
  return (
    <StyledMenuItem onClick={onClickHandler}>
      <StyledIconContainer>
        <a
          href='https://www.discord.com'
          target='_blank'
          style={{ display: 'grid', placeItems: 'center' }}
        >
          <NewIcons Icon={icon} size={20} style={{ fill: '#715ff5' }} />
        </a>
        {text}
      </StyledIconContainer>
    </StyledMenuItem>
  );
};
