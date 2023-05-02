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
        getLiquidityDetails,
        onRemoveLiquidity
    } = useContext(LiquidityProviderContext)
    const {progressBar, getProgress, clearProgress} = useContext(ProgressBarProviderContext)
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
        id: 'd3jd92d',
        tokenName: 'CSPR',
        liquidity: '0',
        allowance: '0',
        firstIcon: '',
        firstName: 'CSPR',
        firstSymbol: 'CSPR',
        firstLiquidity: '0',
        firstRate: '0',
        secondIcon: '',
        secondName: 'WETH',
        secondSymbol: 'WETH',
        secondLiquidity: '0',
        secondRate: '0',
    })
    const [removeLiquidityInput, setRemoveLiquidityInput] = useState(0)
    const [removeLiquidityToggle, setRemoveLiquidityToggle] = useState(false)
    const [removeLiquidityButtonEnabled, setRemoveLiquidityButtonEnabled] = useState(false)
    const [removeLiquidityAllowanceEnabled, setRemoveLiquidityAllowanceEnabled] = useState(false)
    const [removeLiquidityCalculation, setRemoveLiquidityCalculation] = useState({
        lpAmount: 0,
        firstAmount: 0,
        secondAmount: 0
    })
    const Navigator = useNavigate()

    const handleChangeInput = (value) => {
        setRemoveLiquidityInput(value)
        handleRemoveCalculation(value)
    }
    const handleRemoveLiquidityToggle = (e) => {
        setRemoveLiquidityToggle(e)
    }

    const handleRemoveCalculation = (value) => {
        const inputPercent = new BigNumber(removeLiquidityInput / 100)
        const lpAmount = new BigNumber(removeLiquidityData.liquidity).multipliedBy(inputPercent)
        const firstAmount = new BigNumber(removeLiquidityData.firstLiquidity).multipliedBy(inputPercent)
        const secondAmount = new BigNumber(removeLiquidityData.secondLiquidity).multipliedBy(inputPercent)
        const newVar = (prevState) => ({
            ...prevState,
            lpAmount: lpAmount.toNumber().toFixed(2),
            firstAmount: firstAmount.toNumber().toFixed(2),
            secondAmount: secondAmount.toNumber().toFixed(2)
        });

        setRemoveLiquidityCalculation(newVar)
    }

    const handleRemoveLiquidity = async () => {
        setShowRemoveLiquidityDialog(!showRemoveLiquidityDialog)
    }

    const onActionRemove = async () => {
        await onRemoveLiquidity(
          removeLiquidityCalculation.lpAmount,
          firstTokenSelected,
          secondTokenSelected,
          removeLiquidityCalculation.firstAmount,
          removeLiquidityCalculation.secondAmount,
          slippageTolerance,
          gasFee,
          removeLiquidityToggle)
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
            console.log("item", item)

            const data = {
                id: 'd3jd92d',
                tokenName: item.name,
                liquidity: item.balance,
                allowance: item.allowance,
                firstIcon: item.token0Icon,
                firstName: item.token0Name,
                firstSymbol: item.token0Symbol,
                firstLiquidity: item.totalReserve0,
                firstRate: '',
                secondIcon: item.token1Icon,
                secondName: item.token1Symbol,
                secondSymbol: item.token1Symbol,
                secondLiquidity: item.totalReserve1,
                secondRate: '',
            }
            console.log("data", data)
            setRemoveLiquidityData((prevState) => ({
                ...prevState,
                ...data
            }))
            handleRemoveLiquidity()
        }

        if (action === 'Swap') {
            handleNavigate(item)
        }
    }

    const loadUserLP = () => {
        const userPairs = Object.values(pairState).filter(
            (v) => parseFloat(v.balance) > 0
        ).map((i) => {
            return {
                firstTokenIcon: i.token0Icon,
                secondTokenIcon: i.token1Icon,
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
    }

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
                // @ts-ignore
                closeCallback={handleRemoveLiquidity}
                liquidityPoolData={removeLiquidityData as any}
                isOpen={showRemoveLiquidityDialog}
                disabledButton={removeLiquidityButtonEnabled}
                disabledAllowanceButton={removeLiquidityAllowanceEnabled}
                isRemoveLiquidityCSPR={removeLiquidityToggle}
                handleChangeInput={handleChangeInput}
                handleToggle={handleRemoveLiquidityToggle}
                handleRemoveLiquidity={onActionRemove}
                calculatedAmounts={removeLiquidityCalculation}
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
                                  clearProgress={clearProgress}
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
