import React, { useContext, useEffect, useState } from 'react'
import { ConfigProviderContext } from '../../../contexts/ConfigContext'
import {
    ButtonHalfMax,
    ButtonHalfMaxContainer,
    ContainerLiquidityNew,
    ContainerLiquidityNewModule,
    ContainerLiquidityStatics,
    ExchangeRateBox,
    FlechaIcon,
    LoadersSwap,
    NewSwapButton,
    SwitchSwap
} from '../../atoms'


import {LPDetail} from '../../molecules'
import FloatMenu from '../FloatMenu'
import {useSearchParams} from "react-router-dom";
import {LiquidityRemovingModule} from "../LiquidityRemovingModule";
import {LiquidityItem} from "../../molecules/LiquidityItem";
import wethIcon from "../../../assets/swapIcons/wethIcon.svg";
import casprIcon from "../../../assets/swapIcons/casprIcon.png";
import {TbTrash} from "react-icons/tb";
import {lightTheme} from "../../../contexts/ThemeContext/themes";
import {CircleButton} from "../../molecules/POCTBody/styles";
import BigNumber from 'bignumber.js'
import { NewSwapContainerNSM } from '../../atoms/NewSwapContainerNSM'
import { TokenSelectNSM } from '../../atoms/TokenSelectNSM'
import { NewTokenDetailItems1NSM } from '../../atoms/NewTokenDetailItems1NSM'
import { NewTokenDetailSelectNSM } from '../../atoms/NewTokenDetailSelectNSM'
import { NewTokenDetailItems2NSM } from '../../atoms/NewTokenDetailItems2NSM'
import { NewTokenDetailItems3NSM } from '../../atoms/NewTokenDetailItems3NSM'
import { NewTokenDetailItems4NSM } from '../../atoms/NewTokenDetailItems4NSM'
import { ArrowContainerNSM } from '../../atoms/ArrowContainerNSM'
import { TokenSelectionNSM } from '../../atoms/TokenSelectionNSM'
import { NewTokenDetailActionsNSM } from '../../atoms/NewTokenDetailActionsNSM'
import { NewBalanceSpaceNSM } from '../../atoms/NewBalanceSpaceNSM'
import { ActionContainerNSM } from '../../atoms/ActionContainerNSM'
import { BalanceInputContainerNSM } from '../../atoms/BalanceInputContainerNSM'
import { BalanceInputItem1NSM } from '../../atoms/BalanceInputItem1NSM'
import { BalanceInputNSM } from '../../atoms/BalanceInputNSM'
import { IconPlaceNSM } from '../../atoms/IconPlaceNSM'
import { SwapDetailsNSM } from '../../atoms/SwapDetailsNSM'
import { BalanceInputItem2NSM } from '../../atoms/BalanceInputItem2NSM'
import { ButtonSpaceNSM } from '../../atoms/ButtonSpaceNSM'

const LiquidityNewModule = () => {
    const [amountSwapTokenA, amountSwapTokenASetter] = useState<any>(0)
    const [amountSwapTokenB, amountSwapTokenBSetter] = useState<any>(0)
    const [slippSwapToken, slippSwapTokenSetter] = useState<any>(0.5)
    const [feeToPay, feeToPaySetter] = useState<any>(0.03)
    const [exchangeRateA, exchangeRateASetter] = useState<any>(0)
    const [exchangeRateB, exchangeRateBSetter] = useState<any>(0)
    const [allowanceA, setAllowanceA] = useState(0)
    const [allowanceB, setAllowanceB] = useState(0)
    const [searchModalA, searchModalASetter] = useState(false)
    const [searchModalB, searchModalBSetter] = useState(false)

    const {
        onAddLiquidity,
        configState,
        onSelectFirstToken,
        onSelectSecondToken,
        onSwitchTokens,
        tokens,
        firstTokenSelected,
        secondTokenSelected,
        isConnected,
        slippageToleranceSelected,
        getLiquidityDetails,
        getAllowanceAgainstOwnerAndSpender,
        onIncreaseAllow,
        ResetTokens,
        getAccountHash,
        getPoolDetailByUser,
        getPoolList
    } = useContext(ConfigProviderContext)

    const {
        walletAddress
    } = configState

    const [usersLP, setUsersLP] = useState([])
    const [pools, setPools] = useState([])
    const [userLiquidity, setUserLiquidity] = useState(0)
    const [isOpenedRemoving, setOpenedRemoving] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()
    const [valueUSD, setValueUSD] = useState("0")

    useEffect( () => {
        const t0 = searchParams.get("token0")
        const t1 = searchParams.get("token1")
        if (t0) {
            onSelectFirstToken(tokens[t0])
            onSelectSecondToken(tokens[t1])
        }
        const isOpened = searchParams.get("remove")
        if (isOpened) {
            setOpenedRemoving(true)
            searchParams.delete('remove')
            setSearchParams(searchParams)
        }

        const result = async () => {
            const list = await getPoolList()
            setPools(list)
            if (isConnected) {
                const newList = await getPoolDetailByUser(getAccountHash())
                setUsersLP(newList)
            }
        }
        result().catch(() => console.log("Error"))

    }, [isConnected])

    const calculateUserLP = (token0, token1, amount0, amount1) => {
        const filter = pools.filter(r => r.pair.token0 === token0 && r.pair.token1 === token1)
        if (filter.length > 0) {
            const userLP = BigNumber.max(new BigNumber(amount0).times(filter[0].totalSupply).div(filter[0].reserve0), new BigNumber(amount1).times(filter[0].totalSupply).div(filter[0].reserve1)).toNumber()
            return userLP
        }

        const filter2 = pools.filter(r => r.pair.token1 === token0 && r.pair.token0 === token1)
        if (filter2.length > 0) {
            const userLP = BigNumber.max(new BigNumber(amount1).times(filter2[0].totalSupply).div(filter2[0].reserve1), new BigNumber(amount0).times(filter2[0].totalSupply).div(filter2[0].reserve0)).toNumber()
            return userLP
        }
    }

    const calculateUSDtokens = (token0, token1, amount0, amount1) => {
        const filter = pools.filter(r => r.pair.token0 === token0 && r.pair.token1 === token1)
        if (filter.length > 0) {
            return (amount0 * filter[0].token0Price).toFixed(2)
        }

        const filter2 = pools.filter(r => r.pair.token1 === token0 && r.pair.token0 === token1)
        if (filter2.length > 0) {
            return (amount1 * filter2[0].token1Price).toFixed(2)
        }
    }

    function ResetAll() {
        amountSwapTokenASetter(0)
        amountSwapTokenBSetter(0)
        ResetTokens()
    }

    async function updateSwapDetail(tokenA, tokenB, value = amountSwapTokenA, token = firstTokenSelected) {
        const getLiquidityDetailP = getLiquidityDetails(
            tokenA, 
            tokenB, 
            value, 
            token, 
            slippSwapToken, 
            feeToPay
        )
        const ps = [getLiquidityDetailP]

        if (tokenA.contractHash) {
            ps.push(getAllowanceAgainstOwnerAndSpender(tokenA.contractHash, walletAddress))
        } else {
            ps.push(Promise.resolve(0))
        }

        if (tokenB.contractHash) {
            ps.push(getAllowanceAgainstOwnerAndSpender(tokenB.contractHash, walletAddress))
        } else {
            ps.push(Promise.resolve(0))
        }

        const [getSwapDetailResponse, getTokenAAllowanceResponse, getTokenBAllowanceResponse] = await Promise.all(ps)

        setAllowanceA(getTokenAAllowanceResponse)
        setAllowanceB(getTokenBAllowanceResponse)

        const {
            tokensToTransfer,
            priceImpact,
            exchangeRateA,
            exchangeRateB
        } = getSwapDetailResponse
        exchangeRateASetter(exchangeRateA)
        exchangeRateBSetter(exchangeRateB)

        return tokensToTransfer
    }

    async function requestIncreaseAllowance(amount, contractHash) {
        console.log("requestIncreaseAllowance")
        await onIncreaseAllow(amount, contractHash, amountSwapTokenA, firstTokenSelected.amount)
        await updateSwapDetail(firstTokenSelected, secondTokenSelected)
    }

    async function changeTokenA(value: string) {
        let filteredValue = parseFloat(value)
        if (isNaN(filteredValue)) {
            filteredValue = 0
        } else if (filteredValue < 0) {
            filteredValue = Math.abs(filteredValue)
        }

        amountSwapTokenASetter(filteredValue)
        const minTokenToReceive = await updateSwapDetail(firstTokenSelected, secondTokenSelected, filteredValue, firstTokenSelected)
        const userLP = calculateUserLP(firstTokenSelected.symbolPair, secondTokenSelected.symbolPair, filteredValue, parseFloat(minTokenToReceive))

        setUserLiquidity(userLP)
        setValueUSD(calculateUSDtokens(firstTokenSelected.symbolPair, secondTokenSelected.symbolPair, filteredValue, parseFloat(minTokenToReceive)))

        amountSwapTokenBSetter(minTokenToReceive)
    }

    async function changeTokenB(value) {
        let filteredValue = parseFloat(value)
        if (isNaN(filteredValue)) {
            filteredValue = 0
        } else if (filteredValue < 0) {
            filteredValue = Math.abs(filteredValue)
        }

        amountSwapTokenBSetter(filteredValue)
        const minTokenToReceive = await updateSwapDetail(secondTokenSelected, firstTokenSelected, value, secondTokenSelected)
        const userLP = calculateUserLP(firstTokenSelected.symbolPair, secondTokenSelected.symbolPair, filteredValue, parseFloat(minTokenToReceive))

        setUserLiquidity(userLP)
        setValueUSD(calculateUSDtokens(firstTokenSelected.symbolPair, secondTokenSelected.symbolPair, filteredValue, parseFloat(minTokenToReceive)))

        amountSwapTokenASetter(minTokenToReceive)
    }

    
    async function SelectAndCloseTokenA(token) {
        onSelectFirstToken(token)
        searchModalASetter(false)

        const minTokenToReceive = await updateSwapDetail(token, secondTokenSelected, amountSwapTokenA, token)
        amountSwapTokenBSetter(minTokenToReceive)

    }
    async function SelectAndCloseTokenB(token) {
        onSelectSecondToken(token)
        searchModalBSetter(false)
        const minTokenToReceive = await updateSwapDetail(firstTokenSelected, token, amountSwapTokenB, token)
        amountSwapTokenASetter(minTokenToReceive)
    }

    function makeHalf(amount, Setter) {
        Setter(amount / 2)
    }
    function makeMax(amount, Setter) {
        Setter(amount)
    }

    function returnFilter(tokens, firstTokenSelected) {
        const tokenHead = Object.keys(tokens)
        let tokenFiltered = {}
        const filtered = tokenHead.reduce((acc, keya) => {
            const filter = new RegExp(firstTokenSelected.symbol)
            if (filter.test(keya)) { return }
            tokenFiltered = {
                ...acc,
                [keya]: tokens[keya]
            }
            return tokenFiltered
        }, {})
        return tokenFiltered
    }

    async function onLiquidity() {

        await onAddLiquidity(amountSwapTokenA, amountSwapTokenB, slippageToleranceSelected)
        //onConnectConfig()
    }

    const enableButton = (amount0, amount1) => {
        if (!isConnected) {
            return true
        }
        if (amount0 <= 0 || amount0 > firstTokenSelected.amount) {
            return true
        }
        if (amount1 <= 0 || amount1 > secondTokenSelected.amount) {
            return true
        }
    }

    const freeAllowanceA = allowanceA / Math.pow(10, 9) - parseFloat(amountSwapTokenA)

    const isApprovedA = firstTokenSelected.symbol == 'CSPR' || (
        firstTokenSelected.symbol != 'CSPR' &&
        freeAllowanceA >= 0
    )

    const freeAllowanceB = allowanceB / Math.pow(10, 9) - parseFloat(amountSwapTokenB)

    const isApprovedB = secondTokenSelected.symbol == 'CSPR' || (
        secondTokenSelected.symbol != 'CSPR' &&
        freeAllowanceB >= 0
    )

    return (
        <ContainerLiquidityNew>
            <ContainerLiquidityNewModule>
                <NewSwapContainerNSM>
                    <TokenSelectNSM>
                        <NewTokenDetailSelectNSM>
                            <NewTokenDetailItems1NSM>From</NewTokenDetailItems1NSM>
                            <NewTokenDetailItems2NSM src={firstTokenSelected} />
                            <NewTokenDetailItems3NSM>{firstTokenSelected.symbol}</NewTokenDetailItems3NSM>
                            <NewTokenDetailItems4NSM>
                                <ArrowContainerNSM>
                                    <FlechaIcon onClick={() => { searchModalASetter(true) }} />
                                    {searchModalA && <FloatMenu
                                        tokens={tokens}
                                        selectToken={SelectAndCloseTokenA}
                                        onClick={() => { searchModalASetter(false) }}
                                    />}
                                </ArrowContainerNSM>
                            </NewTokenDetailItems4NSM>
                        </NewTokenDetailSelectNSM>
                    </TokenSelectNSM>
                    <TokenSelectionNSM>
                        <NewTokenDetailActionsNSM>
                            <NewBalanceSpaceNSM>Balance: {firstTokenSelected.amount || "--"}</NewBalanceSpaceNSM>
                            <ActionContainerNSM>
                                <ButtonHalfMaxContainer>
                                    <ButtonHalfMax onClick={() => { makeHalf(firstTokenSelected.amount, amountSwapTokenASetter) }}>Half</ButtonHalfMax>
                                    <ButtonHalfMax onClick={() => { makeMax(firstTokenSelected.amount, amountSwapTokenASetter) }}>Max</ButtonHalfMax>
                                </ButtonHalfMaxContainer>
                                <BalanceInputContainerNSM>
                                    <BalanceInputItem1NSM>
                                        <BalanceInputNSM
                                            min={0}
                                            onChange={(e) => { changeTokenA(e.target.value) }}
                                            type="number" name="" id="" value={amountSwapTokenA} />
                                    </BalanceInputItem1NSM>
                                    <BalanceInputItem1NSM>
                                        <p>$ {valueUSD}</p>
                                    </BalanceInputItem1NSM>
                                </BalanceInputContainerNSM>
                            </ActionContainerNSM>
                        </NewTokenDetailActionsNSM>
                    </TokenSelectionNSM>
                </NewSwapContainerNSM>
                <IconPlaceNSM>
                    <SwitchSwap onClick={() => { onSwitchTokens(); ResetAll() }} />
                    <SwapDetailsNSM>
                        <ExchangeRateBox
                            tokenASymbol={firstTokenSelected.symbol}
                            tokenBSymbol={secondTokenSelected.symbol}
                            exchangeRateA={exchangeRateA}
                            exchangeRateB={exchangeRateB}
                        />
                    </SwapDetailsNSM>
                    <LoadersSwap />
                </IconPlaceNSM>
                <NewSwapContainerNSM>
                    <TokenSelectNSM>
                        <NewTokenDetailSelectNSM>
                            <NewTokenDetailItems1NSM>To</NewTokenDetailItems1NSM>
                            <NewTokenDetailItems2NSM src={secondTokenSelected} />
                            <NewTokenDetailItems3NSM>{secondTokenSelected.symbol}</NewTokenDetailItems3NSM>
                            <NewTokenDetailItems4NSM>
                                <ArrowContainerNSM>
                                    <FlechaIcon onClick={() => { searchModalBSetter(true) }} />
                                    {searchModalB && <FloatMenu
                                        tokens={returnFilter(tokens, firstTokenSelected)}
                                        selectToken={SelectAndCloseTokenB}
                                        onClick={() => { searchModalBSetter(false) }}
                                    />}
                                </ArrowContainerNSM>
                            </NewTokenDetailItems4NSM>
                        </NewTokenDetailSelectNSM>
                    </TokenSelectNSM>
                    <TokenSelectionNSM>
                        <NewTokenDetailActionsNSM>
                            <NewBalanceSpaceNSM>Balance: {secondTokenSelected.amount || "--"}</NewBalanceSpaceNSM>
                            <ActionContainerNSM>
                                <ButtonHalfMaxContainer>
                                    <ButtonHalfMax onClick={() => { makeHalf(secondTokenSelected.amount, amountSwapTokenASetter) }}>Half</ButtonHalfMax>
                                    <ButtonHalfMax onClick={() => { makeMax(secondTokenSelected.amount, amountSwapTokenASetter) }}>Max</ButtonHalfMax>
                                </ButtonHalfMaxContainer>
                                <BalanceInputContainerNSM>
                                    <BalanceInputItem1NSM>
                                        <BalanceInputNSM
                                            min={0}
                                            onChange={(e) => { changeTokenB(e.target.value) }}
                                            type="number" name="" id="" value={amountSwapTokenB} />
                                    </BalanceInputItem1NSM>
                                    <BalanceInputItem2NSM>
                                        <p>$ {valueUSD}</p>
                                    </BalanceInputItem2NSM>
                                </BalanceInputContainerNSM>
                            </ActionContainerNSM>
                        </NewTokenDetailActionsNSM>
                    </TokenSelectionNSM>
                </NewSwapContainerNSM>
                {
                    amountSwapTokenA > 0 &&
                    <LPDetail
                        firstSymbolToken={firstTokenSelected.symbolPair}
                        firstTokenAmount={amountSwapTokenA}
                        secondSymbolToken={secondTokenSelected.symbolPair}
                        secondTokenAmount={amountSwapTokenB}
                        liquidity={userLiquidity.toFixed(8)}
                        slippage={slippageToleranceSelected}
                        slippageSetter={slippSwapTokenSetter} />
                }
                <ButtonSpaceNSM>
                    {
                        !isApprovedA && isConnected && amountSwapTokenA <= firstTokenSelected.amount &&
                        <NewSwapButton style={{height: "57px", width: "100%"}} disabled={enableButton(amountSwapTokenA, amountSwapTokenB)} content={`Approve ${-freeAllowanceA} ${firstTokenSelected.symbol}`} handler={async () => { await requestIncreaseAllowance(-freeAllowanceA, firstTokenSelected.contractHash) }} />
                    }
                    {
                        !isApprovedB && isConnected && amountSwapTokenB <= secondTokenSelected.amount &&
                        <NewSwapButton style={{height: "57px", width: "100%"}} disabled={enableButton(amountSwapTokenA, amountSwapTokenB)} content={`Approve ${-freeAllowanceB} ${secondTokenSelected.symbol}`} handler={async () => { await requestIncreaseAllowance(-freeAllowanceB, secondTokenSelected.contractHash) }} />
                    }
                    <NewSwapButton style={{height: "57px", width: "100%"}} disabled={enableButton(amountSwapTokenA, amountSwapTokenB)} content="Add Liquidity" handler={async () => { await onLiquidity() }} />
                </ButtonSpaceNSM>

            </ContainerLiquidityNewModule>
            {
                usersLP.length > 0 &&
                <ContainerLiquidityStatics>
                    {// Loop over the table rows
                        usersLP.map(row => {
                            const openPopup = isOpenedRemoving && row.token0 == firstTokenSelected.symbol && row.token1 == secondTokenSelected.symbol

                            console.log('ROW', row)

                            return (
                                // Apply the row props
                                <LiquidityItem
                                    fullExpanded={openPopup}
                                    firstIcon={casprIcon}
                                    firstSymbol={row.token0}
                                    firstLiquidity={row.token0Liquidity}
                                    secondIcon={wethIcon}
                                    secondSymbol={row.token1}
                                    secondLiquidity={row.token1Liquidity}
                                    liquidity={row.totalLiquidityPool}
                                    perLiquidity={((row.totalPool / row.totalSupply)*100).toFixed(2)} >

                                    <LiquidityRemovingModule isConnected={true}
                                                             openedPopup={openPopup}
                                                             firstHash={row.contract0}
                                                             firstSymbol={row.token0}
                                                             firstLiquidity={row.token0Liquidity}
                                                             secondHash={row.contract1}
                                                             secondSymbol={row.token1}
                                                             secondLiquidity={row.token1Liquidity}
                                                             liquidityId={row.totalPoolId}
                                                             liquidity={row.totalPool}
                                                             liquidityUSD={row.totalPoolUSD}
                                    >
                                        <CircleButton>
                                            <TbTrash style={{alignSelf: "center", color: lightTheme.thirdBackgroundColor}} size="1.3rem"/>
                                        </CircleButton>
                                    </LiquidityRemovingModule>
                                </LiquidityItem>
                            )
                        })
                    }
                </ContainerLiquidityStatics>
            }
        </ContainerLiquidityNew>
    )
}

export default LiquidityNewModule