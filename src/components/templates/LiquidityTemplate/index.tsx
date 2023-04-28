import React, {useCallback, useContext, useEffect, useState} from 'react';
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
import {LPContainer, RemoveLiquidityDialog} from 'rengo-ui-kit';
import {useNavigate} from "react-router";
import {PairData} from "../../../reducers/PairsReducer";
export const LiquidityTemplate = ({isMobile}) => {
    const {
        onIncreaseAllow,
        gasPriceSelectedForLiquidity,
    } = useContext(ConfigProviderContext)

    const {
        onConnectWallet,
        isConnected,
    } = useContext(WalletProviderContext)

    const {
        isRemovingPopupOpen,
        setRemovingPopup,
        onAddLiquidity,
        getLiquidityDetails
    } = useContext(LiquidityProviderContext)
    const {progressBar, getProgress} = useContext(ProgressBarProviderContext)
    const {calculateUSDtokens, pairState, findReservesBySymbols, getPoolList} = useContext(PairsContextProvider)
    const {refresh} = useContext(StateHashProviderContext)
    const {
        firstTokenSelected,
        secondTokenSelected,
        onSelectFirstToken,
        onSelectSecondToken,
        tokenState,
        onSwitchTokens,
        filterTokenPairsByToken
    } = useContext(TokensProviderContext)

    const [searchParams, setSearchParams] = useSearchParams()
    const [totalSupply, setTotalSupply] = useState('0')
    const [gasFee, gasFeeSetter] = useState<number>(gasPriceSelectedForLiquidity)
    const { slippageTolerance, updateSlippageTolerance } = globalStore()
    const [userPairDataNonZero, userPairDataNonZeroSetter] = useState([])
    const [amountSwapTokenA, amountSwapTokenASetter] = useState<any>(0)
    const [amountSwapTokenB, amountSwapTokenBSetter] = useState<any>(0)
    //const [isOpenedRemoving, setOpenedRemoving] = useState(isRemovingPopupOpen)
    const [currentFReserve, setFirstReserve] = useState(0)
    const [currentSReserve, setSecondReserve] = useState(0)
    const [isProcessingTransaction, setIsProcessingTransaction] = useState(false)
    const [showRemoveLiquidityDialog, setShowRemoveLiquidityDialog] = useState(false)
    const [removeLiquidityData, setRemoveLiquidityData] = useState({
        id: '',
        tokenName: '',
        liquidity: '',
        allowance: '',
        firstIcon: '',
        firstName: '',
        firstSymbol: '',
        firstLiquidity: '',
        firstRate: '',
        secondIcon: '',
        secondName: '',
        secondSymbol: '',
        secondLiquidity: '',
        secondRate: ''
    } as any)
    const Navigator = useNavigate()
    const handleRemoveLiquidity = () => {
        setShowRemoveLiquidityDialog(!showRemoveLiquidityDialog)
    }
    const handleNavigate = (item) => {
        Navigator(`/swap?token0=${item.token0Symbol}&token1=${item.token1Symbol}`)
    }
    const actions = (item, action, firstSymbol, secondSymbol) => {
        if (action === 'AddLiquidity') {
            onSelectFirstToken(tokenState.tokens[firstSymbol])
            onSelectSecondToken(tokenState.tokens[secondSymbol])
        }

        if (action === 'DeleteLP') {
            const pairData = (pairState.pairs[`${firstSymbol}-${secondSymbol}`] ??
              pairState.pairs[`${secondSymbol}-${firstSymbol}`]) as PairData

            const data = {
                id: pairData.packageHash,
                tokenName: pairData.name,
                liquidity: pairData.balance,
                allowance: pairData.allowance,
                firstIcon: pairData.token0Icon,
                firstName: pairData.token0Name,
                firstSymbol: pairData.token0Symbol,
                firstLiquidity: pairData.reserve0,
                firstRate: parseFloat(pairData.reserve0) / parseFloat(pairData.reserve1),
                secondIcon: pairData.token1Icon,
                secondName: pairData.token1Name,
                secondSymbol: pairData.token1Symbol,
                secondLiquidity: pairData.reserve1,
                secondRate: parseFloat(pairData.reserve1) / parseFloat(pairData.reserve0)
            }
            setRemoveLiquidityData(data)
            handleRemoveLiquidity()
        }

        if (action === 'Swap') {
            handleNavigate(item)
        }
    }

    const loadUserLP = useCallback(() => {
        const userPairs = Object.values(pairState).filter(
          (v) => parseFloat(v.balance) > 0
        ).map((i) => {
            return {
                icon: i.token1Icon,
                isFavorite: false,
                firstSymbol: i.token0Symbol,
                secondSymbol: i.token1Symbol,
                firstAmount: i.reserve0,
                secondAmount: i.reserve1,
                userLP: i.liquidity,
                totalLP: i.totalLiquidityUSD,
                onOptionClick: (action: string, firstSymbol: string, secondSymbol: string) => actions(i, action, firstSymbol, secondSymbol),
            }
        })
        userPairDataNonZeroSetter(userPairs)

    }, [userPairDataNonZero])


    useEffect(() => {
        if (!isConnected) {
            refresh()
        }
        loadUserLP()
        progressBar(async () => {
            await refresh()
        })
    }, [isConnected, pairState])

    useEffect(() => {
        const t0 = searchParams.get('token0');
        const t1 = searchParams.get('token1');
        if (t0) {
            onSelectFirstToken(tokenState.tokens[t0])
            onSelectSecondToken(tokenState.tokens[t1])
        }

        /*
        if (isRemovingPopupOpen) {
            setOpenedRemoving(true)
            setRemovingPopup(false)
        }*/
        // TODO set information?
        updateLiquidityDetail(
          firstTokenSelected,
          secondTokenSelected,
          amountSwapTokenA,
          firstTokenSelected
        )
    }, [isConnected, pairState]);

    async function onLiquidity(amountA, amountB) {
        setIsProcessingTransaction(true)
        await onAddLiquidity(
            amountA,
            amountB,
            slippageTolerance,
            gasFee
        );
        refresh()
        amountSwapTokenASetter(0)
        amountSwapTokenBSetter(0)
        setIsProcessingTransaction(false)
    }

    async function updateLiquidityDetail(
        tokenA,
        tokenB,
        value = 0,
        token = firstTokenSelected
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

        setFirstReserve(firstReserve);
        setSecondReserve(secondReserve);
        const totalLP = calculateTotalLP(
          firstTokenSelected.symbolPair,
          secondTokenSelected.symbolPair
        )
        setTotalSupply(totalLP)

        //amountSwapTokenBSetter(tokensToTransfer)
        return {tokensToTransfer, exchangeRateA, exchangeRateB};
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
    // TODO cambiar el remove liquidity para que reciba los parametros correctos
    // TODO revisar el componente para pasarle 2 imagen en caso de ser par
    return (
        <>
            <RemoveLiquidityDialog
                id='remove-liquidity-dialog'
                isOpen={showRemoveLiquidityDialog}
                // @ts-ignore
                onClose={handleRemoveLiquidity}
                liquidityPoolData={removeLiquidityData}
            />
            <DoubleColumn isMobile={isMobile} title="Liquidity" subTitle='If you staked your LP tokens in a farm, unstake them to see them here'>
                <LiquidityDetail
                  firstSymbol={firstTokenSelected.symbol}
                  secondSymbol={secondTokenSelected.symbol}
                  maxAmount={`${amountSwapTokenB}`}
                  firstTotalLiquidity={currentFReserve / 10 ** firstTokenSelected.decimals}
                  secondTotalLiquidity={currentSReserve / 10 ** secondTokenSelected.decimals}
                  totalSupply={totalSupply}
                  slippage={slippageTolerance}
                  networkFee={gasFee}
                  setSlippage={updateSlippageTolerance}
                  setNetworkFee={gasFeeSetter}
                />
                <LiquiditySwapper onIncreaseAllow={onIncreaseAllow}
                                  onConnectWallet={onConnectWallet}
                                  isConnected={isConnected}
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
                                  onActionConfirm={onLiquidity}
                                  filterPopupTokens={filterTokenPairsByToken}
                                  updateDetail={updateLiquidityDetail}
                                  gasPriceSelectedForLiquidity={gasPriceSelectedForLiquidity}
                                  amountSwapTokenA={amountSwapTokenA}
                                  amountSwapTokenASetter={amountSwapTokenASetter}
                                  amountSwapTokenB={amountSwapTokenB}
                                  amountSwapTokenBSetter={amountSwapTokenBSetter}
                                  isProcessingTransaction={isProcessingTransaction}
                                  clearProgress={refresh}
                />
            </DoubleColumn>
            {
                isConnected && userPairDataNonZero.length > 0 &&
              <SingleColumn isMobile={isMobile}>
                  <LPContainer title="My Liquidity"
                               lpTokens={userPairDataNonZero} />
              </SingleColumn>
            }
        </>
    )
};
