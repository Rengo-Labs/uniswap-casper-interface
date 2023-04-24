import React, {useContext, useEffect, useState, useRef} from "react";
import {Menu, ToggleVariant, UIProviderContext, WalletConnection} from "rengo-ui-kit";
import {useNavigate} from "react-router-dom";
import { ChildrenContainer, Container } from "./styles";
import {WalletProviderContext} from '../contexts/WalletContext'
import {WalletName} from "../commons";
import {OptAction} from "rengo-ui-kit/lib/components/molecules/Menu/types";

import casperIcon from "../assets/newDesignIcons/casperIcon.svg";
import casperTitle from '../assets/newDesignIcons/casperTitle.svg'
import swapIcon from "../assets/newDesignIcons/swap-icon.svg";
import liquidityIcon from "../assets/newDesignIcons/liquidity.svg";
import balanceIcon from "../assets/newDesignIcons/wallet.svg";
import poolIcon from "../assets/newDesignIcons/pool-icon.svg";
import casperWallet from "../assets/newDesignIcons/casper-wallet.svg";
import ledgerWallet from "../assets/newDesignIcons/ledger-wallet.svg";
import torusWallet from "../assets/newDesignIcons/torus-wallet.svg";
export interface ILayoutProps {
    children?: React.ReactElement;
}

interface ContextProps {
    selectedTheme: string
    toggleTheme: (theme: string) => void
}

const Layout = ({children}: ILayoutProps) => {
    const navigate = useNavigate();
    const { selectedTheme, toggleTheme } = useContext<ContextProps>(UIProviderContext);
    const [showConnectionPopup, setShowConnectionPopup] = React.useState(false);
    const {onConnectWallet, isConnected, walletState} = useContext(WalletProviderContext)
    const [rightAction, setRightAction] = useState({
        startIcon: casperWallet,
        title: "Connect Wallet",
        background: "#7AEDD4",
        color: "#715FF5",
        onAction: () => setShowConnectionPopup(true),
        isWalletConnected: false,
        walletAddress: null,
        onActionConnected: null,
        endIcon: balanceIcon,
    } as OptAction);

    const menuRef = useRef(null);
    const [menuHeight, setMenuHeight] = useState(0);

    useEffect(() => {
        if(isConnected) {
            setRightAction(prevState => ({
                ...prevState,
                isWalletConnected: isConnected,
                walletAddress: walletState.walletAddress,
                onActionConnected: () => handleWalletOptions()
            }))
            setShowConnectionPopup(false)
        }
    }, [isConnected])

    const handleWalletOptions = () => {
        console.log("Abrir popup de opciones")
    }

    const handleConnectionPopup = () => {
        setShowConnectionPopup(!showConnectionPopup);
    };

    const WALLETS_DATA = [
        {
            id: 1,
            name: 'Casper Signer',
            icon: casperWallet,
            onConnect: () => onConnectWallet(WalletName.CASPER_SIGNER)
        },
        {
            id: 2,
            name: 'Casper Wallet',
            icon: casperWallet,
            onConnect: () => onConnectWallet(WalletName.CASPER_WALLET)
        },
        {
            id: 3,
            name: 'Ledger',
            icon: ledgerWallet,
            onConnect: () => onConnectWallet(WalletName.CASPER_SIGNER)
        },
        {
            id: 4,
            name: 'Torus Wallet',
            icon: torusWallet,
            onConnect: () => onConnectWallet(WalletName.TORUS)
        },
    ]


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

    return (
        <Container selectedTheme={selectedTheme}>
            <Menu
                ref={menuRef}
                casperIcon={casperTitle}
                title="casperswap"
                links={routes}
                menuIcon={casperIcon}
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
                wallets={WALLETS_DATA as any}
                isOpen={showConnectionPopup}
                linkCallback={() => {}}
            />
            <ChildrenContainer menuHeight={menuHeight}>
            {children}
            </ChildrenContainer>
        </Container>
    );
};

export default Layout;
