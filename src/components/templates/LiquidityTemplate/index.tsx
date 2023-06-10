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
import {LPContainer, RemoveLiquidityDialog, StakeDialog} from 'rengo-ui-kit';
import {useNavigate} from "react-router";
import wcsprIcon from "../../../assets/swapIcons/wrappedCasperIcon.png";
import csprIcon from "../../../assets/swapIcons/casperIcon.png";
import isCSPRValid from "../../../hooks/isCSPRValid";
import {SUPPORTED_NETWORKS} from "../../../constant";
import {convertBigNumberToUIString, convertToUSDCurrency, convertUIStringToBigNumber} from '../../../commons/utils';
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
        onRemoveLiquidity,
        onClaimRewards,
        onDeposit,
        onWithdraw
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
    const { showNotification } = isCSPRValid();
    const [searchParams, setSearchParams] = useSearchParams()
    const [totalSupply, setTotalSupply] = useState('0')
    const [gasFee, gasFeeSetter] = useState<number>(gasPriceSelectedForLiquidity)
    const { slippageTolerance, updateSlippageTolerance } = globalStore()
    const [userPairDataNonZero, userPairDataNonZeroSetter] = useState([])
    const [amountSwapTokenA, amountSwapTokenASetter] = useState<any>(0)
    const [amountSwapTokenB, amountSwapTokenBSetter] = useState<any>(0)
    //const [isOpenedRemoving, setOpenedRemoving] = useState(isRemovingPopupOpen)
    const [currentFReserve, setFirstReserve] = useState<any>(0)
    const [currentSReserve, setSecondReserve] = useState<any>(0)
    const [valueAUSD, setValueAUSD] = useState('0')
    const [valueBUSD, setValueBUSD] = useState('0')

    const [isProcessingTransaction, setIsProcessingTransaction] = useState(false)
    const [showRemoveLiquidityDialog, setShowRemoveLiquidityDialog] = useState(false)
    const [removeLiquidityData, setRemoveLiquidityData] = useState({
        id: 'd3jd92d',
        tokenName: 'CSPR',
        liquidity: '0',
        allowance: 0,
        firstIcon: '',
        firstName: 'CSPR',
        firstSymbol: 'CSPR',
        firstLiquidity: '0',
        firstRate: '0',
        firstHash: '',
        firstDecimals: 9,
        decimals: 9,
        secondIcon: '',
        secondName: 'WETH',
        secondSymbol: 'WETH',
        secondLiquidity: '0',
        secondRate: '0',
        secondHash: '',
        secondDecimals: 9
    })
    const [removeLiquidityInput, setRemoveLiquidityInput] = useState(0)
    const [removeLiquidityToggle, setRemoveLiquidityToggle] = useState(true)
    const [removeLiquidityButtonDisabled, setRemoveLiquidityButtonDisabled] = useState(true)
    const [removeLiquidityAllowanceEnabled, setRemoveLiquidityAllowanceEnabled] = useState(false)
    const [removeLiquidityCalculation, setRemoveLiquidityCalculation] = useState<any>({
        lpAmount: 0,
        firstAmount: 0,
        secondAmount: 0,
        allowance: 0
    })
    const [showRemovingToggle, setShowRemovingToggle] = useState(false)
    const Navigator = useNavigate()
    const [stakePopup, setStakePopup] = useState(false)
    const [titleStakePopup, setTitleStakePopup] = useState('')
    const [titleStakeButton, setTitleStakeButton] = useState('')
    const [stakingToggle, setStakingToggle] = useState(false)

    const handleChangeInput = (value) => {
        if (value === 0) {
          setRemoveLiquidityButtonDisabled(true)
        }

        if (value > 0 && removeLiquidityButtonDisabled) {
          setRemoveLiquidityButtonDisabled(false)
        }

        setRemoveLiquidityInput(value)
        handleRemoveCalculation(value)
    }

    const handleChangeGasFee = (value) => {
        const gasFeeValue = value ? parseFloat(value) : 0;
        if (gasFeeValue === 0)  {
            showNotification('The gas fee needs to be greater than 0')
            return;
        }
        gasFeeSetter(value);
    }
    const handleRemoveLiquidityToggle = (e) => {

        if (removeLiquidityData.firstSymbol.includes('CSPR')) {
            setRemoveLiquidityData(prevState => ({
                ...prevState,
                firstIcon: e ? csprIcon : wcsprIcon,
                firstSymbol: e ? 'CSPR' : 'WCSPR',
                firstName: e ? 'Casper' : 'Wrapped Casper'
            }))
        } else {
            setRemoveLiquidityData(prevState => ({
                ...prevState,
                secondIcon: e ? csprIcon : wcsprIcon,
                secondSymbol: e ? 'CSPR' : 'WCSPR',
                secondName: e ? 'Casper' : 'Wrapped Casper'
            }))
        }
        setRemoveLiquidityToggle(e)
    }

    const handleRemoveCalculation = (value) => {
        const inputPercent = new BigNumber(value).dividedBy(100)

        const lpAmount = new BigNumber(removeLiquidityData.liquidity).multipliedBy(inputPercent)
        const firstAmount = new BigNumber(removeLiquidityData.firstLiquidity).multipliedBy(inputPercent)
        const secondAmount = new BigNumber(removeLiquidityData.secondLiquidity).multipliedBy(inputPercent)
        const newVar = (prevState) => ({
            ...prevState,
            lpAmount: lpAmount.toNumber().toFixed(removeLiquidityData.decimals),
            firstAmount: firstAmount.toNumber().toFixed(removeLiquidityData.decimals),
            secondAmount: secondAmount.toNumber().toFixed(removeLiquidityData.decimals),
            allowance: lpAmount.toNumber() - removeLiquidityData.allowance
        });

        setRemoveLiquidityCalculation(newVar)
    }

    const handleRemoveLiquidity =  () => {
      setRemoveLiquidityButtonDisabled(true)
      setRemoveLiquidityInput(0)
      setShowRemoveLiquidityDialog(false)
    }

    const onRemoveAction = async () => {
      setRemoveLiquidityButtonDisabled(true)

      const result = await onRemoveLiquidity(
        removeLiquidityCalculation.lpAmount,
        removeLiquidityData.decimals,
        {
            symbol: removeLiquidityData.firstSymbol.replace('WCSPR', 'CSPR'),
            packageHash: removeLiquidityData.firstHash,
            decimals: removeLiquidityData.firstDecimals
        } as any, {
            symbol: removeLiquidityData.secondSymbol.replace('WCSPR', 'CSPR'),
            packageHash: removeLiquidityData.secondHash,
            decimals: removeLiquidityData.secondDecimals
        } as any,
        removeLiquidityCalculation.firstAmount,
        removeLiquidityCalculation.secondAmount,
        slippageTolerance,
        gasFee,
        removeLiquidityToggle)

      if (result) {

        setRemovingPopup(false)
        setRemoveLiquidityInput(0)
        setShowRemoveLiquidityDialog(false)
      } else {
          setRemoveLiquidityButtonDisabled(false)
      }
    }

    const onStakeAndUnstakeAction = async () => {
        setRemoveLiquidityButtonDisabled(true)
        let result = null

        if (titleStakePopup === 'Stake') {
            result = await onDeposit(removeLiquidityCalculation.lpAmount)
        } else {
            result = await onWithdraw(removeLiquidityCalculation.lpAmount)
        }

        if (result) {

            setRemovingPopup(false)
            setRemoveLiquidityInput(0)
            setShowRemoveLiquidityDialog(false)
        } else {
            setRemoveLiquidityButtonDisabled(false)
        }
    }

    const onActionAllowance = async () => {
        await onIncreaseAllow(removeLiquidityCalculation.allowance, removeLiquidityData.id, removeLiquidityCalculation.decimals)
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

            createRemovingDataForPopup(item)
        }

        if (action === 'Swap') {
            handleNavigate(item)
        }

        if (action === 'StakeLP') {
            createStakeDataForPopup(item)
        }

        if (action === 'UnstakeLP') {
            createUnstakeDataForPopup(item)
        }

        if (action === 'ClaimLP') {
            onClaimAction()
        }
    }

    const handleStakeClose =  () => {
        setRemoveLiquidityButtonDisabled(true)
        setRemoveLiquidityInput(0)
        setStakePopup(false)
    }

    const createRemovingDataForPopup = (item) => {
        setRemoveLiquidityToggle(true)
        const token0 = tokenState.tokens[item.token0Symbol]
        const token1 = tokenState.tokens[item.token1Symbol]
        const tokenActive = token0.symbolPair === 'WCSPR' || token0.symbolPair === 'CSPR'
          || token1.symbolPair === 'WCSPR' || token1.symbolPair === 'CSPR'
        setShowRemovingToggle(tokenActive)

        const data = {
            id: item.contractHash,
            tokenName: item.name,
            liquidity: item.balance,
            allowance: parseFloat(item.allowance),
            firstIcon: item.token0Symbol.includes('CSPR') ? csprIcon : item.token0Icon,
            firstName: item.token0Symbol.includes('CSPR') ? 'Casper' : item.token0Name,
            firstSymbol: item.token0Symbol.includes('CSPR') ? 'CSPR' : item.token0Symbol,
            firstLiquidity: item.reserve0,
            firstRate: new BigNumber(item.reserve0).div(item.reserve1).toFixed(token0.decimals),
            firstHash: item.contract0,
            firstDecimals: token0.decimals,
            secondIcon: item.token1Symbol.includes('CSPR') ? csprIcon : item.token1Icon,
            secondName: item.token1Symbol.includes('CSPR') ? 'Casper' : item.token1Name,
            secondSymbol: item.token1Symbol.includes('CSPR') ? 'CSPR' : item.token1Symbol,
            secondLiquidity: item.reserve1,
            secondRate: new BigNumber(item.reserve1).div(item.reserve0).toFixed(token1.decimals),
            secondHash: item.contract1,
            decimals: item.decimals,
            secondDecimals: token1.decimals
        }
        setRemoveLiquidityData((prevState) => ({
            ...prevState,
            ...data
        }))

        setRemoveLiquidityCalculation((prevState => ({...prevState, lpAmount: 0, firstAmount: 0, secondAmount: 0, allowance: parseFloat(item.liquidity) - parseFloat(item.allowance)})))
        setShowRemoveLiquidityDialog(true)
    }

    const createStakeDataForPopup = (item) => {
        const token0 = tokenState.tokens[item.token0Symbol]
        const token1 = tokenState.tokens[item.token1Symbol]

        setTitleStakePopup('Stake')
        setTitleStakeButton('Stake')

        const data = {
            id: item.contractHash,
            tokenName: item.name,
            liquidity: item.balance,
            allowance: parseFloat(item.allowance),
            firstIcon: item.token0Symbol.includes('CSPR') ? csprIcon : item.token0Icon,
            firstName: item.token0Symbol.includes('CSPR') ? 'Casper' : item.token0Name,
            firstSymbol: item.token0Symbol.includes('CSPR') ? 'CSPR' : item.token0Symbol,
            firstHash: item.contract0,
            firstDecimals: token0.decimals,
            secondIcon: item.token1Symbol.includes('CSPR') ? csprIcon : item.token1Icon,
            secondName: item.token1Symbol.includes('CSPR') ? 'Casper' : item.token1Name,
            secondSymbol: item.token1Symbol.includes('CSPR') ? 'CSPR' : item.token1Symbol,
            secondHash: item.contract1,
            decimals: item.decimals,
            secondDecimals: token1.decimals
        }
        setRemoveLiquidityData((prevState) => ({
            ...prevState,
            ...data
        }))

        setRemoveLiquidityCalculation((prevState => ({...prevState, lpAmount: 0, firstAmount: 0, secondAmount: 0, allowance: parseFloat(item.liquidity) - parseFloat(item.allowance)})))
        setStakePopup(true)
    }

    const createUnstakeDataForPopup = (item) => {
        const token0 = tokenState.tokens[item.token0Symbol]
        const token1 = tokenState.tokens[item.token1Symbol]

        setTitleStakePopup('Unstake & Claim')
        setTitleStakeButton('Unstake')

        const data = {
            id: item.contractHash,
            tokenName: item.name,
            liquidity: item.balance,
            allowance: parseFloat(item.allowance),
            firstIcon: item.token0Symbol.includes('CSPR') ? csprIcon : item.token0Icon,
            firstName: item.token0Symbol.includes('CSPR') ? 'Casper' : item.token0Name,
            firstSymbol: item.token0Symbol.includes('CSPR') ? 'CSPR' : item.token0Symbol,
            firstHash: item.contract0,
            firstDecimals: token0.decimals,
            secondIcon: item.token1Symbol.includes('CSPR') ? csprIcon : item.token1Icon,
            secondName: item.token1Symbol.includes('CSPR') ? 'Casper' : item.token1Name,
            secondSymbol: item.token1Symbol.includes('CSPR') ? 'CSPR' : item.token1Symbol,
            secondHash: item.contract1,
            decimals: item.decimals,
            secondDecimals: token1.decimals
        }
        setRemoveLiquidityData((prevState) => ({
            ...prevState,
            ...data
        }))

        setRemoveLiquidityCalculation((prevState => ({...prevState, lpAmount: 0, firstAmount: 0, secondAmount: 0, allowance: parseFloat(item.liquidity) - parseFloat(item.allowance)})))
        setStakePopup(true)
    }

    const onClaimAction = async () => {
        await onClaimRewards()
    }

    const loadUserLP = () => {
        const userPairs = Object.values(pairState).filter(
            (v) => parseFloat(v.balance) > 0
        ).map((i) => {
            return {
                contractPackage: i.packageHash.slice(5),
                firstTokenIcon: i.token0Icon,
                secondTokenIcon: i.token1Icon,
                isFavorite: false,
                firstSymbol: i.token0Symbol,
                secondSymbol: i.token1Symbol,
                firstAmount: i.reserve0,
                secondAmount: i.reserve1,
                userLP: i.balance,
                totalLP: i.totalSupply,
                yourShare: (100 * (Number(i.balance) / Number(i.totalSupply))).toFixed(2),
                onOptionClick: (action: string, firstSymbol: string, secondSymbol: string) => actions(i, action, firstSymbol, secondSymbol),
                hasStake: true
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

        if (isRemovingPopupOpen) {
            createRemovingDataForPopup(pairState[`${t0}-${t1}`] ?? pairState[`${t1}-${t0}`])
            setRemovingPopup(false)
        }
        // TODO set information?
        updateLiquidityDetail(
          firstTokenSelected,
          secondTokenSelected,
          amountSwapTokenA,
          firstTokenSelected
        )
    }, []);

    useEffect(() => {

        if (showRemoveLiquidityDialog) {
            const pair = pairState[removeLiquidityData.tokenName]

            setRemoveLiquidityData((prevState) => ({
                ...prevState,
                allowance: parseFloat(pair.allowance)
            }))

            setRemoveLiquidityCalculation((prevState) => ({
                ...prevState,
                allowance: removeLiquidityCalculation.lpAmount - parseFloat(pair.allowance)
            }))
        }

    }, [tokenState])

    async function onLiquidity(amountA, amountB) {
        setIsProcessingTransaction(true)
        const pair = pairState[`${firstTokenSelected.symbolPair}-${secondTokenSelected.symbolPair}`] ?? pairState[`${secondTokenSelected.symbolPair}-${firstTokenSelected.symbolPair}`]
        await onAddLiquidity(
            amountA,
            amountB,
            slippageTolerance,
            gasFee,
            pair.packageHash
        );
        refresh()
        amountSwapTokenASetter(0)
        amountSwapTokenBSetter(0)
        setValueAUSD('0')
        setValueBUSD('0')
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


        //exchangeRateASetter(exchangeRateA);
        //exchangeRateBSetter(exchangeRateB);
        if (token === tokenA) {
            setFirstReserve(firstReserve);
            setSecondReserve(secondReserve);
        } else {
            setFirstReserve(secondReserve);
            setSecondReserve(firstReserve);
        }
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

    const performSwitchTokens = () => {
        onSwitchTokens()

        setFirstReserve(currentSReserve);
        setSecondReserve(currentFReserve);
    }

    return (
        <>
            <RemoveLiquidityDialog
                showToggle={showRemovingToggle}
                firstRate={removeLiquidityData.firstRate}
                secondRate={removeLiquidityData.secondRate}
                // @ts-ignore
                closeCallback={handleRemoveLiquidity}
                liquidityPoolData={removeLiquidityData as any}
                isOpen={showRemoveLiquidityDialog}
                disabledButton={removeLiquidityButtonDisabled}
                disabledAllowanceButton={removeLiquidityAllowanceEnabled}
                showAllowance={(removeLiquidityCalculation.allowance) > 0}
                defaultValue={removeLiquidityInput}
                isRemoveLiquidityCSPR={removeLiquidityToggle}
                handleChangeInput={handleChangeInput}
                handleToggle={handleRemoveLiquidityToggle}
                handleRemoveLiquidity={onRemoveAction}
                handleAllowanceLiquidity={onActionAllowance}
                calculatedAmounts={removeLiquidityCalculation}
            />

            <StakeDialog
                titleDialog={titleStakePopup}
                titleConfirmButton={titleStakeButton}
                // @ts-ignore
                closeCallback={handleStakeClose}
                liquidityPoolData={removeLiquidityData as any}
                isOpen={stakePopup}
                disabledButton={removeLiquidityButtonDisabled}
                disabledAllowanceButton={removeLiquidityAllowanceEnabled}
                showAllowance={(removeLiquidityCalculation.allowance) > 0}
                defaultValue={removeLiquidityInput}
                handleChangeInput={handleChangeInput}
                handleAction={onStakeAndUnstakeAction}
                handleAllowance={onActionAllowance}
                calculatedAmounts={removeLiquidityCalculation}
            />
            <DoubleColumn isMobile={isMobile} title="Liquidity" subTitle='If you staked your LP tokens in a farm, unstake them to see them here'>
                <LiquidityDetail
                  firstSymbol={firstTokenSelected.symbolPair}
                  secondSymbol={secondTokenSelected.symbolPair}
                  baseAmount={amountSwapTokenA}
                  minAmount={`${amountSwapTokenB}`}
                  firstTotalLiquidity={currentFReserve}
                  secondTotalLiquidity={currentSReserve}
                  totalSupply={totalSupply}
                  slippage={slippageTolerance}
                  networkFee={gasFee}
                  setSlippage={updateSlippageTolerance}
                  setNetworkFee={handleChangeGasFee}
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
                                  onSwitchTokens={performSwitchTokens}
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
                                  valueAUSD={valueAUSD}
                                  valueBUSD={valueBUSD}
                                  setValueAUSD={setValueAUSD}
                                  setValueBUSD={setValueBUSD}
                />
            </DoubleColumn>
            {
                isConnected && userPairDataNonZero.length > 0 &&
              <SingleColumn isMobile={isMobile}>
                  <LPContainer title="My Liquidity"
                               networkLink={`${SUPPORTED_NETWORKS.blockExplorerUrl}/contract-package/`}
                               lpTokens={userPairDataNonZero}
                               toggleAction={() => setStakingToggle(!stakingToggle)}
                               toggleActive={stakingToggle}
                  />
              </SingleColumn>
            }
        </>
    )
};
