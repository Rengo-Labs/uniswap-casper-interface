import React, { useContext, useEffect, useRef, useState } from "react";
import { Menu, UIProviderContext, ToggleVariant, WalletConnection } from "rengo-ui-kit";
import { useNavigate } from "react-router-dom";

import casperIcon from "../assets/newDesignIcons/casperIcon.svg";
// import walletIcon from '../assets/newDesignIcons/wallet-icon.svg'
import swapIcon from "../assets/newDesignIcons/swap-icon.svg";
import liquidityIcon from "../assets/newDesignIcons/liquidity.svg";
import balanceIcon from "../assets/newDesignIcons/wallet.svg";
import poolIcon from "../assets/newDesignIcons/pool-icon.svg";
import casperWallet from "../assets/newDesignIcons/casper-wallet.svg";
import ledgerWallet from "../assets/newDesignIcons/ledger-wallet.svg";
import torusWallet from "../assets/newDesignIcons/torus-wallet.svg";
import { ChildrenContainer, Container, NavbarContainer } from "./styles";


export interface ILayoutProps {
  children?: React.ReactElement;
}

interface ContextProps {
  selectedTheme: string
  toggleTheme: (theme: string) => void
}

export const WALLETS_DATA = [
    {
      id: 1,
      name: 'Casper Signer',
      icon: casperWallet,
    },
    {
      id: 2,
      name: 'Casper Wallet',
      icon: casperWallet,
    },
    {
      id: 3,
      name: 'Ledger',
      icon: ledgerWallet,
    },
    {
      id: 4,
      name: 'Torus Wallet',
      icon: torusWallet,
    },
  ]

const Layout = ({ children }: ILayoutProps) => {
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const [menuHeight, setMenuHeight] = useState(0);
  const { selectedTheme, toggleTheme } = useContext<ContextProps>(UIProviderContext);
  const [showConnectionPopup, setShowConnectionPopup] = React.useState(false);

    useEffect(() => {
      // Get height of menu
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
    <Container>
        <Menu
          ref={menuRef}
          casperIcon={''}
          title=""
          links={routes}
          menuIcon={casperLogo}
          rightAction={rightAction}
          toggle={{
            isActive: selectedTheme === "dark",
            toggle: () =>
              toggleTheme(selectedTheme === "dark" ? "default" : "dark"),
            labelText: "",
            variant: ToggleVariant.ThemeSwitcher,
          }}
        />

        <WalletConnection
          closeCallback={handleConnectionPopup}
          wallets={WALLETS_DATA}
          isOpen={showConnectionPopup}
        />
      <ChildrenContainer menuHeight={menuHeight}>
        {children}
      </ChildrenContainer>
    </Container>
  );
};

export default Layout;
