import { CommunityMenuMobile, SettingMobile } from '../../molecules';
import {StyledMenu} from "./styles";
import { ReactComponent as Twitter } from '../../../assets/newIcons/twitter.svg';
import { ReactComponent as Instagram } from '../../../assets/newIcons/instagram.svg';
import { ReactComponent as Discord } from '../../../assets/newIcons/discord.svg';
import { MenuOption } from '../../molecules/CommunityMobile';
import { MenuMobileOptions } from '../../../constant';

const settingMenuOptions: MenuOption[] = [
    { text: 'Twitter', navegateTo: 'https://twitter.com/casperswap', icon: Twitter },
    { text: 'Discord', navegateTo: 'https://www.discord.com', icon: Discord },
    {
      text: 'Instagram',
      navegateTo: 'https://www.instagram.com',
      icon: Instagram,
    },
  ];

export const NavMenuMobile = ({children, open, option = 'null', setOption}) => {
    let subMenuComponent = null;
console.log('option', option)
    
    switch (option) {
        case MenuMobileOptions.Community:
            subMenuComponent = <CommunityMenuMobile communityOptions={settingMenuOptions} setOption={setOption}/>
            break;
        case MenuMobileOptions.Settings:
            subMenuComponent = <SettingMobile setOption={setOption}/>
            break;
        default:
            subMenuComponent = null
    }


    return (
        <StyledMenu open={open}>
            {children}
            {subMenuComponent}
        </StyledMenu>
    )
}
