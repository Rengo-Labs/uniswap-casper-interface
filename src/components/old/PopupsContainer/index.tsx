import React, {useContext} from "react";
import { ConfigProviderContext } from "../../../contexts/ConfigContext";
import {WalletProviderContext} from "../../../contexts/WalletContext";
import {Settings, WalletConnectedOptions, WalletConnection} from "rengo-ui-kit";
import casperWallet from "../../../assets/newDesignIcons/casper-wallet.svg";
import metamaskFlask from "../../../assets/newDesignIcons/metaMaskFlask.svg";
import {WalletName} from "../../../commons";
import torusWallet from "../../../assets/newDesignIcons/torus-wallet.svg";
import {globalStore, notificationStore} from "../../../store/store";
import lineBreakIcon from "../../../assets/newDesignIcons/linkbreak.svg";
import store from "store2";
import {TOKEN_SYMBOL_GAUGE} from "../../../constant";
export const PopupsContainer = () => {
    const {
        showSettings,
        setShowSettings,
        showWalletOptions,
        setShowWalletOptions,
        gasFeeCST,
        gasFeeETH,
        setGasFeeCST,
        setGasFeeETH
    } = useContext(ConfigProviderContext);

    const {
        onConnectWallet,
        onDisconnectWallet,
        walletState,
        setShowConnectionPopup,
        showConnectionPopup,
    } = useContext(WalletProviderContext);
    const { slippageTolerance, updateSlippageTolerance, nodeUrl, updateNodeUrl } = globalStore()
    const { notification, updateNotification } = notificationStore();

    const WALLETS_DATA = [
        // TODO we will add ledger wallet later, first option is casper wallet
        {
            id: 1,
            name: 'Casper Wallet',
            icon: casperWallet,
            onConnect: () => onConnectWallet(WalletName.CASPER_WALLET)
        },
        {
            id: 2,
            name: 'Casper Signer',
            icon: casperWallet,
            onConnect: () => onConnectWallet(WalletName.CASPER_SIGNER)
        },
        // {
        //     id: 3,
        //     name: 'Ledger',
        //     icon: ledgerWallet,
        //     onConnect: () => onConnectWallet(WalletName.CASPER_SIGNER)
        // },
        {
            id: 3,
            name: 'Torus Wallet',
            icon: torusWallet,
            onConnect: () => onConnectWallet(WalletName.TORUS)
        },
        {
            id: 4,
            name: 'Metamask Flask',
            icon: metamaskFlask,
            onConnect: () => onConnectWallet(WalletName.METAMASK_FLASK)
        },
    ]

    const WALLET_CONNECTED_OPTIONS = [
        // TODO commented out for now, will be added later
        // {
        //     id: 'dmx0031b2b421',
        //     key: 'account',
        //     name: 'My Account',
        //     iconName: 'Copy',
        //     type: 'Redirect',
        // },
        {
            id: '3d23f23xxx88nf',
            key: 'wallet',
            name: walletState.walletAddress,
            iconName: 'Copy',
            type: 'copy',
        },
        // {
        //     id: '1x9x9900jjwoa',
        //     key: 'transactions',
        //     name: 'Recent Transactions',
        //     iconName: 'Clock',
        //     type: 'redirect',
        // },
        {
            id: '0zokxj8h82nndl',
            key: 'disconnect',
            name: 'Disconnect Wallet',
            iconName: '',
            icon: lineBreakIcon,
            type: 'redirect',
            onClick: () => handleDisconnectWallet()
        },
    ]

    const handleDisconnectWallet = async () => {
        await onDisconnectWallet();
    }

    const handleShowWallet = () => {
        setShowConnectionPopup(!showConnectionPopup)
    }

    const handleExternalLink = () => {
        const link = "https://docs.casperswap.xyz/the-casperswap-protocol-1/how-to-make-a-swap-on-casperswap"
        window.open(link, '_blank')
    }

    const handleShowSettings = () => {
        setShowSettings(!showSettings);
    }

    const handleSaveSettings = (slippageTolerance, customNodeUr) => {
        updateSlippageTolerance(slippageTolerance)
        updateNodeUrl(customNodeUr)
        handleShowSettings()
    }

    const handleWalletOptions = () => {
        setShowWalletOptions(!showWalletOptions);
    }

    const handleCloseNotification = () => {
        updateNotification({ ...notification, show: false });
    }

    return (
        <>
            <WalletConnection
                closeCallback={handleShowWallet}
                wallets={WALLETS_DATA}
                isOpen={showConnectionPopup}
                linkCallback={handleExternalLink}
            />

            <Settings
                isOpen={showSettings}
                handleClose={handleShowSettings}
                handleSave={handleSaveSettings}
                customNodeUrlValue={nodeUrl}
                slippageToleranceValue={slippageTolerance.toString()}
                handleCSTNetworkGasFee={(value) => {
                    setGasFeeCST(value)
                    store.set('handleCSTNetworkGasFee', value)
                }}
                handleETHNetworkGasFee={(value) => {
                    setGasFeeETH(value)
                    store.set('handleETHNetworkGasFee', value)
                }}
                networkGasFeeCSTValue={gasFeeCST}
                networkGasFeeETHValue={gasFeeETH}
                placeholderForCST={`Gas Fee`}
                placeholderForETH={`Gas Fee`}
                titleForCST={`Network Gas Fee CST`}
                titleForETH={`Network Gas Fee ${TOKEN_SYMBOL_GAUGE}`}
            />

            <WalletConnectedOptions
                closeCallback={handleWalletOptions}
                options={WALLET_CONNECTED_OPTIONS as any[]}
                isOpen={showWalletOptions}
            />

            {/*<Notification*/}
            {/*    title={notification.title}*/}
            {/*    message={notification.subtitle}*/}
            {/*    type={notification.type as any}*/}
            {/*    // @ts-ignore*/}
            {/*    position={'top-center'}*/}
            {/*    onClose={handleCloseNotification}*/}
            {/*/>*/}
        </>
    );
}
