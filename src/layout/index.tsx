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
import {ConfigProviderContext} from "../contexts/ConfigContext";
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
    const rightActionInit = {
        startIcon: casperWallet,
        title: "Connect Wallet",
        background: "#7AEDD4",
        color: "#715FF5",
        onAction: () => setShowConnectionPopup(true),
        isWalletConnected: false,
        walletAddress: null,
        onActionConnected: null,
        endIcon: balanceIcon,
    } as OptAction
    const [rightAction, setRightAction] = useState(rightActionInit);

    const {
        isConnected,
        setShowConnectionPopup,
        walletState
    } = useContext(WalletProviderContext);

    const {
        showSettings,
        setShowSettings,
        showWalletOptions,
        setShowWalletOptions,
    } = useContext(ConfigProviderContext);

    const deviceType = useDeviceType()
    const isMobile = deviceType === 'mobile'


    const handleShowSettings = () => {
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
        }else {
            setRightAction(prevState => ({
                ...prevState,
                ...rightActionInit
            }))
        }
    }, [isConnected])



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
            onAction: () => handleShowSettings(),
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
                handleRedirect={() => navigate("/")}
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
