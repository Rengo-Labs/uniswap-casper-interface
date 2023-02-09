import { useContext, useState } from "react";
import { ConfigProviderContext } from "../../contexts/ConfigContext";
import { ConnectionPopup } from "../atoms";
import { PopupsModule } from "../organisms";

export const PopupsContainer = () => {
    const {
        confirmModal,
        isConnected,
        linkExplorer,
        onConnectWallet,
        progressModal,
        setConfirmModal,
        setProgressModal,
        setShowConnectionPopup,
        showConnectionPopup,
    } = useContext(ConfigProviderContext);

    return (
        <>
            <PopupsModule isOpen={progressModal} handleOpen={setProgressModal} progress>
                Check the progress of your{" "}
                <a href={linkExplorer} target="_blank">
                    deploy
                </a>
                .
            </PopupsModule>
            <PopupsModule isOpen={confirmModal} handleOpen={setConfirmModal} progress={false}>
                Your{" "}
                <a href={linkExplorer} target="_blank">
                    deploy
                </a>{" "}
                was successful.
            </PopupsModule>
            <ConnectionPopup
                isConnected={isConnected}
                isOpened={showConnectionPopup}
                onToggle={() => setShowConnectionPopup(!showConnectionPopup)}
                title="Connect your wallet to CasperSwap"
                onClose={() => setShowConnectionPopup(false)}
                onConnect={onConnectWallet}
                showButton={false}
            />
        </>
    );
}