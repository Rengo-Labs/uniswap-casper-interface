import React, {useContext, useEffect, useRef, useState} from "react";
import {Menu, UIProviderContext, ToggleVariant, useDeviceType, GeolocationMessage} from "rengo-ui-kit";
import {createGlobalStyle} from 'styled-components';
import {useNavigate} from "react-router-dom";
import casperIcon from "../assets/newDesignIcons/casperIcon.svg";
import swapIcon from "../assets/newDesignIcons/swap-icon.svg";
import liquidityIcon from "../assets/newDesignIcons/liquidity.svg";
import balanceIcon from "../assets/newDesignIcons/wallet.svg";
import poolIcon from "../assets/newDesignIcons/pool-icon.svg";
import settingIcon from "../assets/newDesignIcons/setting-icon.svg";
import casperWallet from "../assets/newDesignIcons/casper-wallet.svg";
import casperLogo from "../assets/newDesignIcons/type_logo.svg";
import {ChildrenContainer, Container} from "./styles";
import {WalletProviderContext} from "../contexts/WalletContext";
import {OptActionProps} from "rengo-ui-kit/lib/components/molecules/Menu/types";
import {ConfigProviderContext} from "../contexts/ConfigContext";
import CasperLoader from "../components/organisms/CasperLoader";
import {useLocation} from 'react-router-dom'
import {useLoader} from '../hooks/useLoader'
import {getLocalStorageData, setLocalStorageData} from "../commons/utils/persistData";
import {getCountryFromIP, getIPfromUser} from "../commons/utils";

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

const LOCAl_STORAGE_THEME_KEY = 'current-theme'

const Layout = ({children}: ILayoutProps) => {

    const {
        isConnected,
        setShowConnectionPopup,
        walletState,
        onConnectWallet
    } = useContext(WalletProviderContext);
    const menuRef = useRef(null);
    const location = useLocation()
    const {setLoader, loading} = useLoader()
    const navigate = useNavigate();
    const {selectedTheme, toggleTheme} = useContext<ContextProps>(UIProviderContext);
    const [menuHeight, setMenuHeight] = useState(0);
    const rightActionInit = {
        startIcon: casperWallet,
        title: "ConnectWallet",
        background: "#7AEDD4",
        color: "#715FF5",
        onAction: () => handleWalletOptions(),
        isWalletConnected: false,
        endIcon: balanceIcon,
    } as OptActionProps
    const rightConnectionActionInit = {
        startIcon: casperWallet,
        title: "ConnectWallet",
        background: "#7AEDD4",
        color: "#715FF5",
        onAction: () => onConnectWallet(),
        isWalletConnected: false,
        endIcon: balanceIcon,
    } as OptActionProps
    const [rightAction, setRightAction] = useState(rightActionInit)
    const [pathName, setPathName] = useState('')
    const [isSanctionedCounty, setIsSanctionedCountry] = useState(false)

    const {
        showSettings,
        setShowSettings,
        showWalletOptions,
        setShowWalletOptions,
    } = useContext(ConfigProviderContext);

    const deviceType = useDeviceType()
    const isMobile = deviceType === 'mobile'

    const callGeoLocationService = async () => {
        const ip = await getIPfromUser()
        if (!ip) { return }
        console.log('IP from user', ip)
        const data = await getCountryFromIP(ip)
        if (!data) { return }
        setIsSanctionedCountry(data.isSanctioned)
    }

    useEffect(() => {
        const currentTheme = getLocalStorageData(LOCAl_STORAGE_THEME_KEY)
        let newTheme = ''
        if (currentTheme.length === 0 || currentTheme !== 'dark') {
            newTheme = 'default'
        } else {
            newTheme = currentTheme
        }

        //console.log(currentTheme);
        toggleTheme(newTheme);

        callGeoLocationService().then(() => console.log('geolocation service called'))
    }, [])

    const handleShowSettings = () => {
        setShowSettings(!showSettings);
    }

    const handleWalletOptions = () => {
        setShowWalletOptions(!showWalletOptions);
    }

    useEffect(() => {
        setPathName(location.pathname)
        if (location.pathname === pathName) {
            return
        }

        setLoader(1000, true)
    }, [location])


    useEffect(() => {
        const height = menuRef.current?.offsetHeight;

        setMenuHeight(height);
    }, [menuRef]);

    useEffect(() => {
        if (isConnected) {
            setRightAction(prevState => ({
                ...prevState,
                isWalletConnected: isConnected,
                walletAddress: walletState.walletAddress
            }))
            setShowConnectionPopup(false)
        } else {
            setRightAction(prevState => ({
                ...prevState,
                ...rightActionInit
            }))
        }
    }, [isConnected, walletState])


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

    const handleThemeSwitch = () => {
        const currentTheme = selectedTheme === AvailableThemes.Dark ? AvailableThemes.Default : AvailableThemes.Dark
        toggleTheme(currentTheme)
        setLocalStorageData(LOCAl_STORAGE_THEME_KEY, currentTheme)
    }

    return (
        <Container selectedTheme={selectedTheme}>
            <GlobalStyle selectedTheme={selectedTheme}/>
            {
                // TODO check if user is in sanctioned country
                isSanctionedCounty ? <GeolocationMessage/> :
                    (
                        <>
                            <Menu
                                ref={menuRef}
                                title="casperswap"
                                links={routes}
                                menuIcon={casperIcon}
                                casperIcon={casperLogo}
                                rightOptionAction={rightConnectionActionInit}
                                rightConnectionAction={rightAction}
                                toggle={{
                                    isActive: selectedTheme === AvailableThemes.Dark,
                                    toggle: () => handleThemeSwitch(),
                                    labelText: "",
                                    variant: ToggleVariant.ThemeSwitcher,
                                }}
                                handleRedirect={() => navigate("/")}
                            />

                            <ChildrenContainer
                                menuHeight={menuHeight}
                                isMobile={isMobile}>
                                {loading ? <CasperLoader/> : children}
                            </ChildrenContainer>
                        </>
                    )
            }
        </Container>
    );
};

export default Layout;
