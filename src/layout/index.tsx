import React, {useContext} from 'react';
import {Menu, UIProviderContext, ToggleVariant} from 'rengo-ui-kit'
import {useNavigate} from "react-router-dom";

import casperIcon from '../assets/newIcons/casperIcon.svg'
import swapIcon from '../assets/newIcons/swapIcon.svg'
import liquidityIcon from '../assets/newIcons/liquidityIcon.svg'
import poolIcon from '../assets/newIcons/poolIcon.svg'
import walletIcon from '../assets/newIcons/wallet-icon.svg'

export interface ILayoutProps {
    children?: React.ReactElement;
}

const Layout = ({children}: ILayoutProps) => {
    const navigate = useNavigate();
    const {selectedTheme, toggleTheme} = useContext(UIProviderContext)

    const routes = [
        {icon: swapIcon, page: 'Swap', path: '/swap', onAction: () => navigate('/swap')},
        {icon: liquidityIcon, page: "Liquidity", path: '/liquidity', onAction: () => navigate('/liquidity')},
        {icon: poolIcon, page: "Pool", path: '/pools', onAction: () => navigate('/pools')}
    ]

    const rightAction = {
        startIcon: walletIcon,
        title: 'Connect Wallet',
        background: '#7AEDD4',
        color: '#715FF5',
        onAction: () => console.log("Open Right Options"),
        endIcon: walletIcon
    }

    return (
        <div>
            <Menu
                title='CASPERSWAP'
                isMobile={true}
                links={routes}
                menuIcon={casperIcon}
                rightAction={rightAction}
                toggle={{
                    isActive: selectedTheme === 'dark',
                    toggle: () => toggleTheme(selectedTheme === 'dark' ? 'default' : 'dark'),
                    labelText: '',
                    variant: ToggleVariant.ThemeSwitcher
                }}
            />
            {children}
        </div>
    );
}

export default Layout;
