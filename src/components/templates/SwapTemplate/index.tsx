import React, {useContext} from 'react';
import TokenSwapper from "../../organisms/TokenSwapper";
import {ConfigProviderContext} from "../../../contexts/ConfigContext";
import {WalletProviderContext} from "../../../contexts/WalletContext";
import {SwapProviderContext} from "../../../contexts/SwapContext";
import {ProgressBarProviderContext} from "../../../contexts/ProgressBarContext";
import {PairsContextProvider} from "../../../contexts/PairsContext";
import {StateHashProviderContext} from "../../../contexts/StateHashContext";
import {TokensProviderContext} from "../../../contexts/TokensContext";
import {WrappedMolecule, WrappedTemplate} from "./styles";

export const SwapTemplate = () => {
    const {
        onIncreaseAllow,
        gasPriceSelectedForSwapping,
    } = useContext(ConfigProviderContext);

    const {
        onConnectWallet,
        isConnected,
    } = useContext(WalletProviderContext);
    const { onConfirmSwapConfig, getSwapDetails } =
        useContext(SwapProviderContext);
    const { progressBar } = useContext(ProgressBarProviderContext);
    const {calculateUSDtokens, pairState, findReservesBySymbols} = useContext(PairsContextProvider)
    const {refresh} = useContext(StateHashProviderContext)
    const {firstTokenSelected, secondTokenSelected, onSelectFirstToken, onSelectSecondToken, tokenState, onSwitchTokens} = useContext(TokensProviderContext)

    return (
        <WrappedTemplate>
            <WrappedMolecule>
                <div style={{flex: "1"}}>Chart</div>
                <div style={{flex: "1"}}>
                    <TokenSwapper
                        onIncreaseAllow={onIncreaseAllow}
                        gasPriceSelectedForSwapping={gasPriceSelectedForSwapping}
                        onConnectWallet={onConnectWallet}
                        isConnected={isConnected}
                        onConfirmSwapConfig={onConfirmSwapConfig}
                        getSwapDetails={getSwapDetails}
                        progressBar={progressBar}
                        calculateUSDtokens={calculateUSDtokens}
                        pairState={pairState}
                        findReservesBySymbols={findReservesBySymbols}
                        refresh={refresh}
                        firstTokenSelected={firstTokenSelected}
                        secondTokenSelected={secondTokenSelected}
                        onSelectFirstToken={onSelectFirstToken}
                        onSelectSecondToken={onSelectSecondToken}
                        tokenState={tokenState}
                        onSwitchTokens={onSwitchTokens}
                    />
                </div>
            </WrappedMolecule>
            <WrappedMolecule>
                My liquidity
            </WrappedMolecule>
        </WrappedTemplate>

    )
};
