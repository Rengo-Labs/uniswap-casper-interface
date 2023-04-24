import React, {useContext, useState} from 'react';
import LiquidityDetail from "../../organisms/LiquidityDetail";
import {ConfigProviderContext} from "../../../contexts/ConfigContext";
import {WalletProviderContext} from "../../../contexts/WalletContext";
import {ProgressBarProviderContext} from "../../../contexts/ProgressBarContext";
import {PairsContextProvider} from "../../../contexts/PairsContext";
import {StateHashProviderContext} from "../../../contexts/StateHashContext";
import {TokensProviderContext} from "../../../contexts/TokensContext";
import {WrappedMolecule, WrappedTemplate} from "./styles";
import BigNumber from "bignumber.js";
import {LiquidityProviderContext} from "../../../contexts/LiquidityContext";

export const LiquidityTemplate = () => {
    const {
        onIncreaseAllow,
        gasPriceSelectedForSwapping,
    } = useContext(ConfigProviderContext);

    const {
        onConnectWallet,
        isConnected,
    } = useContext(WalletProviderContext);
    const { onAddLiquidity, getLiquidityDetails } =
        useContext(LiquidityProviderContext);
    const { progressBar, getProgress } = useContext(ProgressBarProviderContext);
    const {calculateUSDtokens, pairState, findReservesBySymbols, getPoolList} = useContext(PairsContextProvider)
    const {refresh} = useContext(StateHashProviderContext)
    const {
        firstTokenSelected,
        secondTokenSelected,
        onSelectFirstToken,
        onSelectSecondToken,
        tokenState,
        onSwitchTokens,
        filterPopupTokens
    } = useContext(TokensProviderContext)

    async function onLiquidity(amountA, amountB, slippageTolerance, gasFee) {
        await onAddLiquidity(
          amountA,
          amountB,
          slippageTolerance,
          gasFee
        );
        refresh();
    }

    async function updateLiquidityDetail(
      tokenA,
      tokenB,
      value = 0,
      token = firstTokenSelected,
      slippageTolerance
    ) {
        const { reserve0, reserve1 } = findReservesBySymbols(
          tokenA.symbol,
          tokenB.symbol,
          tokenState
        );

        const getLiquidityDetailP = getLiquidityDetails(
          tokenA,
          tokenB,
          reserve0,
          reserve1,
          value,
          token,
          slippageTolerance,
          gasPriceSelectedForSwapping
        );
        const ps = [getLiquidityDetailP];

        const [getLiquidityDetailResponse] = await Promise.all(ps);

        const {
            tokensToTransfer,
            exchangeRateA,
            exchangeRateB,
            firstReserve,
            secondReserve,
        } = getLiquidityDetailResponse;

        /*
        exchangeRateASetter(exchangeRateA);
        exchangeRateBSetter(exchangeRateB);
        if (token === tokenA) {
            setFirstReserve(firstReserve);
            setSecondReserve(secondReserve);
        } else {
            setFirstReserve(secondReserve);
            setSecondReserve(firstReserve);
        }*/

        //calculateUSDValues(value, tokensToTransfer, token === tokenA);
        return tokensToTransfer;
    }

    const calculateTotalLP = (token0, token1) => {
        const filter = getPoolList().filter(
          (r) => r.token0Symbol === token0 && r.token1Symbol === token1
        );
        if (filter.length > 0) {
            const userLP = new BigNumber(filter[0].totalSupply).toFixed(
              filter[0].decimals
            );
            return userLP;
        }

        const filter2 = getPoolList().filter(
          (r) => r.token1Symbol === token0 && r.token0Symbol === token1
        );
        if (filter2.length > 0) {
            const userLP = new BigNumber(filter2[0].totalSupply).toFixed(
              filter2[0].decimals
            );
            return userLP;
        }
    }

    return (
        <WrappedTemplate>
            <WrappedMolecule>
                <div style={{flex: "1"}}>
                     <LiquidityDetail />
                </div>
                <div style={{flex: "1"}}>

                </div>
            </WrappedMolecule>
        </WrappedTemplate>
    )
};
