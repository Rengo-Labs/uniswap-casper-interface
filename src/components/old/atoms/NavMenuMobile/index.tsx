import { CommunityMenuMobile, SettingMobile } from '../../molecules';
import {StyledMenu} from "./styles";
import { MenuMobileOptions } from '../../../../constant';
import { settingMenuOptions } from '../../../../layout/NewLayout';



export const NavMenuMobile = ({children, open, option = 'null', setOption}) => {
    let subMenuComponent = null;

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
