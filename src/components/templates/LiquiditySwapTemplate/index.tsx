import React, {useContext, useEffect, useState} from 'react';
import LiquidityDetail from "../../organisms/LiquidityDetail";
import {ConfigProviderContext} from "../../../contexts/ConfigContext";
import {WalletProviderContext} from "../../../contexts/WalletContext";
import {ProgressBarProviderContext} from "../../../contexts/ProgressBarContext";
import {PairsContextProvider} from "../../../contexts/PairsContext";
import {StateHashProviderContext} from "../../../contexts/StateHashContext";
import {TokensProviderContext} from "../../../contexts/TokensContext";
import BigNumber from "bignumber.js";
import {LiquidityProviderContext} from "../../../contexts/LiquidityContext";
import {SingleColumn} from "../../../layout/SingleColumn";
import {DoubleColumn} from "../../../layout/DoubleColumn";
import {useSearchParams} from "react-router-dom";
import {globalStore} from "../../../store/store";
import LiquiditySwapper from "../../organisms/LiquiditySwapper";

export const LiquidityTemplate = ({isMobile}) => {
    const {
        onIncreaseAllow,
        gasPriceSelectedForLiquidity,
    } = useContext(ConfigProviderContext);

    const {
        onConnectWallet,
        isConnected,
    } = useContext(WalletProviderContext);
    const {onAddLiquidity, getLiquidityDetails} =
        useContext(LiquidityProviderContext);
    const {progressBar, getProgress} = useContext(ProgressBarProviderContext);
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

    const [searchParams, setSearchParams] = useSearchParams()
    const [totalLiquidity, setTotalLiquidity] = useState('0')
    const [gasFee, gasFeeSetter] = useState<number>(gasPriceSelectedForLiquidity);
    const { slippageTolerance, updateSlippageTolerance } = globalStore();

    useEffect(() => {
        const t0 = searchParams.get('token0');
        const t1 = searchParams.get('token1');
        if (t0) {
            onSelectFirstToken(tokenState.tokens[t0])
            onSelectSecondToken(tokenState.tokens[t1])
        }

        /*
        if (isRemovingPopupOpen) {
            setOpenedRemoving(true);
            setRemovingPopup(false);
        }

        updateLiquidityDetail(
          firstTokenSelected,
          secondTokenSelected,
          amountSwapTokenA,
          lastChanged == 'A' ? firstTokenSelected : secondTokenSelected
        );
        */
    }, [isConnected, pairState]);

    async function onLiquidity(amountA, amountB) {
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
        const {reserve0, reserve1} = findReservesBySymbols(
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
            token
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
        <>
            <DoubleColumn isMobile={isMobile} title="Liquidity" subTitle='If you staked your LP tokens in a farm, unstake them to see them here'>
                <LiquidityDetail/>
                <LiquiditySwapper onIncreaseAllow={onIncreaseAllow}
                                  onConnectWallet={onConnectWallet}
                                  isConnected={isConnected}
                                  progressBar={progressBar}
                                  getProgress={getProgress}
                                  refresh={refresh}
                                  calculateUSDtokens={calculateUSDtokens}
                                  pairState={pairState}
                                  firstTokenSelected={firstTokenSelected}
                                  secondTokenSelected={secondTokenSelected}
                                  onSelectFirstToken={onSelectFirstToken}
                                  onSelectSecondToken={onSelectSecondToken}
                                  tokenState={tokenState}
                                  onSwitchTokens={onSwitchTokens}
                                  onActionConfirm={onAddLiquidity}
                                  filterPopupTokens={filterPopupTokens}
                                  updateDetail={updateLiquidityDetail}
                                  calculateTotalLP={calculateTotalLP}
                                  setTotalLiquidity={setTotalLiquidity}
                                  gasPriceSelectedForLiquidity={gasPriceSelectedForLiquidity} />
            </DoubleColumn>
            <SingleColumn isMobile={isMobile}>
                <div>single column</div>
            </SingleColumn>
        </>
    )
};
