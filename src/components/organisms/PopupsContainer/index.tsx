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
import {useNavigate} from 'react-router-dom'

export const PopupsContainer = () => {
  const navigate = useNavigate()
  
    const {
        showSettings,
        setShowSettings,
        showWalletOptions,
        setShowWalletOptions,
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
            onClick: () => navigate('/account', { state: { accountDefaultTab: 'transfer' }})
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
            slippageToleranceValue={slippageTolerance}
          />

          <WalletConnectedOptions
            closeCallback={handleWalletOptionsOnClose}
            options={WALLET_CONNECTED_OPTIONS as any[]}
            isOpen={showWalletOptions}
          />
        </>
    );
}
