import React, { useContext } from 'react';
import { Menu, UIProviderContext } from 'rengo-ui-kit'
import casperIcon from '../assets/newIcons/casperIcon.svg'
import swapIcon from '../assets/newIcons/swapIcon.svg'
import liquidityIcon from '../assets/newIcons/liquidityIcon.svg'
import poolIcon from '../assets/newIcons/poolIcon.svg'
import walletIcon from '../assets/newIcons/wallet-icon.svg'

export interface ILayoutProps {
    children?: React.ReactElement;
}

const rightAction = {startIcon: walletIcon, title: 'Connect Wallet', background: '#7AEDD4', color: '#715FF5', onAction: () => console.log("Open Right Options"), endIcon: walletIcon}
const toggleAction = {isActive: 'default', toggle: () => {}, variant: 'theme-switcher'}
const routes = [
    {icon: swapIcon, page: 'Swap', path: '/swap', onAction: () => console.log('/swap')},
    {icon: liquidityIcon, page: "Liquidity", path: '/liquidity', onAction: () => console.log('/liquidity')},
    {icon: poolIcon, page: "Pool", path: '/pool', onAction: () => console.log('/pool')}
]

const Layout = ({children} : ILayoutProps) => {
  const { selectedTheme, toggleTheme } = useContext(UIProviderContext)
  // const menuToggleAction = (e) => {

  // }

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
               toggle: toggleTheme,
               labelText: '',
               variant: 'default'
             }}
            />
            {children}
        </div>
    );
}

export default Layout;
