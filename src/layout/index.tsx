import React, { useContext, useEffect, useRef, useState } from "react";
import { Menu, UIProviderContext, ToggleVariant, WalletConnection, useDeviceType } from "rengo-ui-kit";
import { createGlobalStyle } from 'styled-components';
import { useNavigate } from "react-router-dom";

import casperIcon from "../assets/newDesignIcons/casperIcon.svg";
import swapIcon from "../assets/newDesignIcons/swap-icon.svg";
import liquidityIcon from "../assets/newDesignIcons/liquidity.svg";
import balanceIcon from "../assets/newDesignIcons/wallet.svg";
import poolIcon from "../assets/newDesignIcons/pool-icon.svg";
import casperWallet from "../assets/newDesignIcons/casper-wallet.svg";
import ledgerWallet from "../assets/newDesignIcons/ledger-wallet.svg";
import torusWallet from "../assets/newDesignIcons/torus-wallet.svg";
import casperLogo from "../assets/newDesignIcons/type_logo.svg";
import { ChildrenContainer, Container } from "./styles";
export interface ILayoutProps {
  children?: React.ReactElement;
}

interface ContextProps {
  selectedTheme: string
  toggleTheme: (theme: string) => void
}

enum AvailableThemes {
  Dark = 'dark',
  Default = 'default'
}

const GlobalStyle = createGlobalStyle<{ selectedTheme: string}>`
  body {
    background-color: ${({ selectedTheme }) => selectedTheme === AvailableThemes.Default ? '#E5F5FC': '#241E52' };
  }
`;

const WALLETS_DATA = [
  {
    id: 1,
    name: 'Casper Signer',
    icon: casperWallet,
    onConnect: () => console.log('Casper Signer'),
  },
  {
    id: 2,
    name: 'Casper Wallet',
    icon: casperWallet,
    onConnect: () => console.log('Casper Wallet'),
  },
  {
    id: 3,
    name: 'Ledger',
    icon: ledgerWallet,
    onConnect: () => console.log('Ledger'),
  },
  {
    id: 4,
    name: 'Torus Wallet',
    icon: torusWallet,
    onConnect: () => console.log('Torus Wallet'),
  },
]

const Layout = ({ children }: ILayoutProps) => {
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { selectedTheme, toggleTheme } = useContext<ContextProps>(UIProviderContext);
  const [menuHeight, setMenuHeight] = useState(0);
  const [showConnectionPopup, setShowConnectionPopup] = React.useState(false);

  const deviceType = useDeviceType()
  const isMobile = deviceType === 'mobile'

  useEffect(() => {
    const height = menuRef.current?.offsetHeight;

    setMenuHeight(height);
  }, [menuRef]);

  const handleConnectionPopup = () => {
      setShowConnectionPopup(!showConnectionPopup);
  };


  const routes = [
    {
      icon: swapIcon,
      page: "Swap",
      path: "/swap",
      onAction: () => navigate("/swap"),
    },
    {
      icon: liquidityIcon,
      page: "Liquidity",
      path: "/liquidity",
      onAction: () => navigate("/liquidity"),
    },
    {
      icon: balanceIcon,
      page: "Balance",
      path: "/balance",
      onAction: () => navigate("/balance"),
    },
    {
      icon: poolIcon,
      page: "Pool",
      path: "/pools",
      onAction: () => navigate("/pools"),
    },
  ];

  const rightAction = {
    startIcon: balanceIcon,
    title: "Connect Wallet",
    background: "#7AEDD4",
    color: "#715FF5",
    onAction: () => setShowConnectionPopup(true),
    endIcon: balanceIcon,
  };

  return (
    <Container selectedTheme={selectedTheme}>
      <GlobalStyle selectedTheme={selectedTheme} />
      <Menu
        ref={menuRef}
        title="casperswap"
        links={routes}
        menuIcon={casperIcon}
        casperIcon={casperLogo}
        rightAction={rightAction}
        toggle={{
          isActive: selectedTheme === AvailableThemes.Dark,
          toggle: () =>
            toggleTheme(selectedTheme === AvailableThemes.Dark ? AvailableThemes.Default : AvailableThemes.Dark),
          labelText: "",
          variant: ToggleVariant.ThemeSwitcher,
        }}
      />
      <WalletConnection
        closeCallback={handleConnectionPopup}
        wallets={WALLETS_DATA}
        isOpen={showConnectionPopup}
      />
      <ChildrenContainer
          menuHeight={menuHeight}
          isMobile={isMobile}>
        {children}
      </ChildrenContainer>
    </Container>
  );
};

export default Layout;
