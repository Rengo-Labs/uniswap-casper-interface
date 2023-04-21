import React, {useContext, useState} from 'react';
import TokenSwapper from "../../organisms/TokenSwapper";
import SwapDetail from "../../organisms/SwapDetail";
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
    const { progressBar, getProgress } = useContext(ProgressBarProviderContext);
    const {calculateUSDtokens, pairState, findReservesBySymbols} = useContext(PairsContextProvider)
    const {refresh} = useContext(StateHashProviderContext)
    const {firstTokenSelected, secondTokenSelected, onSelectFirstToken, onSelectSecondToken, tokenState, onSwitchTokens} = useContext(TokensProviderContext)

    const onActionConfirm = async (amountA, amountB, slippage, gas) => {
        await onConfirmSwapConfig(
          amountA,
          amountB,
          slippage,
          gas
        );

        refresh();
    }

    return (
        <WrappedTemplate>
            <WrappedMolecule>
                <div style={{flex: "1"}}>
                     <SwapDetail />
                </div>
                <div style={{flex: "1"}}>
                    <TokenSwapper
                        onIncreaseAllow={onIncreaseAllow}
                        gasPriceSelectedForSwapping={gasPriceSelectedForSwapping}
                        onConnectWallet={onConnectWallet}
                        isConnected={isConnected}
                        getSwapDetails={getSwapDetails}
                        progressBar={progressBar}
                        getProgress={getProgress}
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
                        onActionConfirm={onActionConfirm}
                    />
                </div>
            </WrappedMolecule>
        </WrappedTemplate>
    )
};
