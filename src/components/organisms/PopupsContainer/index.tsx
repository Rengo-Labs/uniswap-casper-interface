import React, {useContext} from "react";
import { ConfigProviderContext } from "../../../contexts/ConfigContext";
import {WalletProviderContext} from "../../../contexts/WalletContext";
import {Settings, WalletConnectedOptions, WalletConnection} from "rengo-ui-kit";
import casperWallet from "../../../assets/newDesignIcons/casper-wallet.svg";
import {WalletName} from "../../../commons";
import torusWallet from "../../../assets/newDesignIcons/torus-wallet.svg";
import {globalStore} from "../../../store/store";
import lineBreakIcon from "../../../assets/newDesignIcons/linkbreak.svg";
import metamaskFlask from '../../../assets/newDesignIcons/metaMaskFlask.svg';
import store from "store2";
import {CSPR_NETWORK_URL, TOKEN_SYMBOL_GAUGE} from "../../../constant";

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
        {
            id: 3,
            name: 'CasperDash',
            icon: casperWallet,
            onConnect: () => onConnectWallet(WalletName.CASPER_DASH)
        },
        // {
        //     id: 3,
        //     name: 'Ledger',
        //     icon: ledgerWallet,
        //     onConnect: () => onConnectWallet(WalletName.CASPER_SIGNER)
        // },
        {
            id: 4,
            name: 'Torus Wallet',
            icon: torusWallet,
            onConnect: () => onConnectWallet(WalletName.TORUS)
        },
        {
            id: 5,
            name: 'Metamask Flask',
            icon: metamaskFlask,
            onConnect: () => onConnectWallet(WalletName.METAMASK_FLASK)
        },
    ]

    const WALLET_CONNECTED_OPTIONS = [
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
            onClick: () => window.open(`${CSPR_NETWORK_URL}${walletState.walletAddress}`)
        },
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
    const handleShowWalletOnClose = () => {
      setShowConnectionPopup(false)
    }
    const handleExternalLink = () => {
        const link = "https://docs.casperswap.xyz/the-casperswap-protocol-1/how-to-make-a-swap-on-casperswap"
        window.open(link, '_blank')
    }
    const handleShowSettingsOnClose = () => {
      setShowSettings(false);
    }
    const handleSaveSettings = (slippageTolerance, customNodeUr) => {
      updateSlippageTolerance(slippageTolerance)
      updateNodeUrl(customNodeUr)
      handleShowSettingsOnClose()
    }
    const handleWalletOptionsOnClose = () => {
      setShowWalletOptions(false);
    }

    return (
        <>
          <WalletConnection
            closeCallback={handleShowWalletOnClose}
            wallets={WALLETS_DATA}
            isOpen={showConnectionPopup}
            linkCallback={handleExternalLink}
          />

          <Settings
            isOpen={showSettings}
            handleClose={handleShowSettingsOnClose}
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
            closeCallback={handleWalletOptionsOnClose}
            options={WALLET_CONNECTED_OPTIONS as any[]}
            isOpen={showWalletOptions}
          />
        </>
    );
}
