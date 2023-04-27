import React, {useContext, useEffect, useRef, useState} from "react";
import {Menu, UIProviderContext, ToggleVariant, WalletConnection, useDeviceType, Settings, WalletConnectedOptions} from "rengo-ui-kit";
import {createGlobalStyle} from 'styled-components';
import {useNavigate} from "react-router-dom";
import casperIcon from "../assets/newDesignIcons/casperIcon.svg";
import swapIcon from "../assets/newDesignIcons/swap-icon.svg";
import liquidityIcon from "../assets/newDesignIcons/liquidity.svg";
import balanceIcon from "../assets/newDesignIcons/wallet.svg";
import poolIcon from "../assets/newDesignIcons/pool-icon.svg";
import settingIcon from "../assets/newDesignIcons/setting-icon.svg";
import casperWallet from "../assets/newDesignIcons/casper-wallet.svg";
import ledgerWallet from "../assets/newDesignIcons/ledger-wallet.svg";
import torusWallet from "../assets/newDesignIcons/torus-wallet.svg";
import casperLogo from "../assets/newDesignIcons/type_logo.svg";
import lineBreakIcon from "../assets/newDesignIcons/linkbreak.svg";
import {ChildrenContainer, Container} from "./styles";
import {WalletProviderContext} from "../contexts/WalletContext";
import {WalletName} from "../commons";
import {OptAction} from "rengo-ui-kit/lib/components/molecules/Menu/types";

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

const GlobalStyle = createGlobalStyle<{ selectedTheme: string }>`
  body {
    background-color: ${({selectedTheme}) => selectedTheme === AvailableThemes.Default ? '#E5F5FC' : '#241E52'};
  }
`;
const Layout = ({children}: ILayoutProps) => {
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const {selectedTheme, toggleTheme} = useContext<ContextProps>(UIProviderContext);
    const [menuHeight, setMenuHeight] = useState(0);
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

    const {
        onConnectWallet,
        isConnected,
        showConnectionPopup,
        setShowConnectionPopup,
        walletState
    } = useContext(WalletProviderContext);

    const deviceType = useDeviceType()
    const isMobile = deviceType === 'mobile'

    const [showSettings, setShowSettings] = useState(false);
    const [showWalletOptions, setShowWalletOptions] = useState(false);

    const handleSettings = () => {
        setShowSettings(!showSettings);
    }
    const handleWalletOptions = () => {
        setShowWalletOptions(!showWalletOptions);
    }

    useEffect(() => {
        const height = menuRef.current?.offsetHeight;

        setMenuHeight(height);
    }, [menuRef]);

    useEffect(() => {
        if (isConnected) {
            setRightAction(prevState => ({
                ...prevState,
                isWalletConnected: isConnected,
                walletAddress: walletState.walletAddress,
                onActionConnected: () => handleWalletOptions()
            }))
            setShowConnectionPopup(false)
        }
    }, [isConnected])

    const WALLET_CONNECTED_OPTIONS = [
        {
            id: 'dmx0031b2b421',
            key: 'account',
            name: 'My Account',
            iconName: 'Copy',
            type: 'Redirect',
        },
        {
            id: '3d23f23xxx88nf',
            key: 'wallet',
            name: walletState.walletAddress,
            iconName: 'Copy',
            type: 'copy',
        },
        {
            id: '1x9x9900jjwoa',
            key: 'transactions',
            name: 'Recent Transactions',
            iconName: 'Clock',
            type: 'redirect',
        },
        {
            id: '0zokxj8h82nndl',
            key: 'disconnect',
            name: 'Disconnect Wallet',
            iconName: '',
            icon: lineBreakIcon,
            type: 'redirect',
        },
    ]

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
        {
            icon: settingIcon,
            page: "Settings",
            path: "#",
            onAction: () => handleSettings(),
        },
    ];

    return (
        <Container selectedTheme={selectedTheme}>
            <GlobalStyle selectedTheme={selectedTheme}/>
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
                closeCallback={() => setShowConnectionPopup(!showConnectionPopup)}
                wallets={WALLETS_DATA}
                isOpen={showConnectionPopup}
            />
            <Settings
                isOpen={showSettings}
                handleClose={handleSettings}
                handleSave={() => console.log("Guardar")}
                customNodeUrlValue=''
                slippageToleranceValue={0.5}
            />
            <WalletConnectedOptions
                closeCallback={handleWalletOptions}
                options={WALLET_CONNECTED_OPTIONS as any[]}
                isOpen={showWalletOptions}
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
