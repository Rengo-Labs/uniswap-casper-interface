import BigNumber from 'bignumber.js'

import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { ConfigProviderContext } from '../../../contexts/ConfigContext'
import {
    ExchangeRateBox,
    NewSwapButton
} from '../../atoms'
import {FlechaIcon} from '../../atoms/FlechaIcon'
import {LoadersSwap} from '../../atoms/LoadersSwap'
import {SwitchSwap} from '../../atoms/SwitchSwap'

import {LPDetail} from '../../molecules'
import {useSearchParams} from "react-router-dom";
import {LiquidityRemovingModule} from "../LiquidityRemovingModule";
import {LiquidityItem} from "../../molecules/LiquidityItem";
import {TbTrash} from "react-icons/tb";
import {lightTheme} from "../../../contexts/ThemeContext/themes";
import {CircleButton} from "../../molecules/POCTBody/styles";
import { NewSwapContainerNSM } from '../../atoms/NewSwapContainerNSM'
import { IconPlaceNSM } from '../../atoms/IconPlaceNSM'
import { SwapDetailsNSM } from '../../atoms/SwapDetailsNSM'
import { TokenSelectNSM } from '../../atoms/TokenSelectNSM'
import { NewTokenDetailSelectNSM } from '../../atoms/NewTokenDetailSelectNSM'
import { NewTokenDetailItems1NSM } from '../../atoms/NewTokenDetailItems1NSM'
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
import { BalanceInputItem2NSM } from '../../atoms/BalanceInputItem2NSM'
import { ButtonSpaceNSM } from '../../atoms/ButtonSpaceNSM'
import FloatMenu  from '../FloatMenu'

const LiquidityNewModule = () => {
    const [amountSwapTokenA, amountSwapTokenASetter] = useState<any>(0)
    const [amountSwapTokenB, amountSwapTokenBSetter] = useState<any>(0)
    const [slippSwapToken, slippSwapTokenSetter] = useState<any>(0.5)
    const [feeToPay, feeToPaySetter] = useState<any>(0.03)
    const [exchangeRateA, exchangeRateASetter] = useState<any>(0)
    const [exchangeRateB, exchangeRateBSetter] = useState<any>(0)
    const [lastChanged, setLastChanged] = useState('')

    const [userLiquidity, setUserLiquidity] = useState(0)
    const [isOpenedRemoving, setOpenedRemoving] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()
    const [valueAUSD, setValueAUSD] = useState("0")
    const [valueBUSD, setValueBUSD] = useState("0")

    const [activeModalPrimary, setActiveModalPrimary] = React.useState(false)
    const [activeModalSecondary, setActiveModalSecondary] = React.useState(false)
    const [activeModalSwap, setActiveModalSwap] = React.useState(false)
    const [tokensToTransfer, tokensToTransferSetter] = useState<any>(0)
    const [priceImpact, priceImpactSetter] = useState<any>(0)
    const [defaultPriceImpactLabel, defaultPriceImpactLabelSetter] = useState<any>('')
    const [switchMovement, switchMovementSetter] = useState(false)
    const [allowanceA, setAllowanceA] = useState(0)

    const {
        onConnect,

        onConnectWallet,
        onAddLiquidity,
        pairState,
        onSelectFirstToken,
        onSelectSecondToken,
        onSwitchTokens,
        tokens,
        firstTokenSelected,
        secondTokenSelected,
        isConnected,
        getSwapDetails,
        slippageToleranceSelected,
        getLiquidityDetails,
        onIncreaseAllow,
        configState,
        getAllowanceAgainstOwnerAndSpender
    } = useContext(ConfigProviderContext)

    const {
        walletAddress
    } = configState


    const userPairData = Object.entries(pairState).map(([k, v]) => v)

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
    }, [isConnected])

    function onSwitchTokensHandler() {
        onSwitchTokens()
        
        if(lastChanged == 'A') {
            changeTokenB(amountSwapTokenA)
            setLastChanged('B')
        } else if(lastChanged == 'B') {
            changeTokenA(amountSwapTokenB)
            setLastChanged('A')
        }
    }


    function resetAll() {
        amountSwapTokenASetter(0)
        amountSwapTokenBSetter(0)
    }

    async function updateLiquidityDetail(tokenA, tokenB, value = amountSwapTokenA, token = firstTokenSelected) {
        const getLiquidityDetailP = getLiquidityDetails(
            tokenA, 
            tokenB, 
            value, 
            token, 
            slippSwapToken, 
            feeToPay
        )
        const ps = [getLiquidityDetailP]

        const [getLiquidityDetailResponse] = await Promise.all(ps)

        const {
            tokensToTransfer,
            exchangeRateA,
            exchangeRateB
        } = getLiquidityDetailResponse
        exchangeRateASetter(exchangeRateA)
        exchangeRateBSetter(exchangeRateB)

        return tokensToTransfer
    }

    async function requestIncreaseAllowance(amount, contractHash) {
        console.log("requestIncreaseAllowance")
        await onIncreaseAllow(amount, contractHash)
        await updateLiquidityDetail(firstTokenSelected, secondTokenSelected)
    }

    async function changeTokenA(value: string) {
        let filteredValue = parseFloat(value)
        if (isNaN(filteredValue)) {
            filteredValue = 0
        } else if (filteredValue < 0) {
            filteredValue = Math.abs(filteredValue)
        }

        amountSwapTokenASetter(filteredValue)
        const minTokenToReceive = await updateLiquidityDetail(firstTokenSelected, secondTokenSelected, filteredValue, firstTokenSelected)

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
        const minTokenToReceive = await updateLiquidityDetail(secondTokenSelected, firstTokenSelected, value, secondTokenSelected)

        amountSwapTokenASetter(minTokenToReceive)
    }

    const [searchModalA, searchModalASetter] = useState(false)
    async function selectAndCloseTokenA(token) {
        onSelectFirstToken(token)
        searchModalASetter(false)

        const minTokenToReceive = await updateLiquidityDetail(token, secondTokenSelected, amountSwapTokenA, token)
        amountSwapTokenBSetter(minTokenToReceive)

    }
    const [searchModalB, searchModalBSetter] = useState(false)
    async function selectAndCloseTokenB(token) {
        onSelectSecondToken(token)
        searchModalBSetter(false)

        const minTokenToReceive = await updateLiquidityDetail(firstTokenSelected, token, amountSwapTokenB, token)
        amountSwapTokenASetter(minTokenToReceive)
    }

    function makeHalf(amount, Setter) {
        Setter(amount / 2)
    }
    function makeMax(amount, Setter) {
        Setter(amount)
    }

    async function onLiquidity() {

        await onAddLiquidity(amountSwapTokenA, amountSwapTokenB, slippageToleranceSelected)
        resetAll()
        //onConnectConfig()
    }

    const disableButton = (amount0, amount1) => {
        if (!isConnected) {
            return true
        }
        if (parseFloat(amount0) <= 0 || parseFloat(amount0) > parseFloat(firstTokenSelected.amount.toString())) {
            return true
        }
        if (parseFloat(amount1) <= 0 || parseFloat(amount1) > parseFloat(secondTokenSelected.amount.toString())) {            
            return true
        }
    }

    const freeAllowanceA = new BigNumber(firstTokenSelected.allowance || 0).minus(new BigNumber(amountSwapTokenA)).toNumber()

    const isApprovedA = firstTokenSelected.symbol == 'CSPR' || (
        firstTokenSelected.symbol != 'CSPR' &&
        freeAllowanceA >= 0
    )

    const freeAllowanceB = new BigNumber(secondTokenSelected.allowance || 0).minus(new BigNumber(amountSwapTokenB)).toNumber()

    const isApprovedB = secondTokenSelected.symbol == 'CSPR' || (
        secondTokenSelected.symbol != 'CSPR' &&
        freeAllowanceB >= 0
    )

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

    async function SelectAndCloseTokenA(token) {
        onSelectFirstToken(token)
        searchModalASetter(false)

        const minTokenToReceive = await updateSwapDetail(token, secondTokenSelected, amountSwapTokenA, token)
        amountSwapTokenBSetter(minTokenToReceive)
    }

    async function updateSwapDetail(tokenA, tokenB, value = amountSwapTokenA, token = firstTokenSelected) {
        const getSwapDetailP = getSwapDetails(tokenA, tokenB, value, token, slippSwapToken, feeToPay)
        const ps = [getSwapDetailP]

        if (tokenA.contractHash) {
            ps.push(getAllowanceAgainstOwnerAndSpender(tokenA.contractHash, walletAddress))
        } else {
            ps.push(Promise.resolve(0))
        }

        const [getSwapDetailResponse, getAllowanceAgainstOwnerAndSpenderResponse] = await Promise.all(ps)

        setAllowanceA(getAllowanceAgainstOwnerAndSpenderResponse)

        const {
            tokensToTransfer,
            priceImpact,
            exchangeRateA,
            exchangeRateB
        } = getSwapDetailResponse

        tokensToTransferSetter(tokensToTransfer)
        priceImpactSetter(priceImpact)
        exchangeRateASetter(exchangeRateA)
        exchangeRateBSetter(exchangeRateB)

        defaultPriceImpactLabelSetter(priceImpact > 1 ? 'Price Impact Warning' : 'Low Price Impact')
        switchMovementSetter(value > 0)
        return tokensToTransfer
    }
    async function SelectAndCloseTokenB(token) {
        onSelectSecondToken(token)
        searchModalBSetter(false)
        const minTokenToReceive = await updateSwapDetail(firstTokenSelected, token, amountSwapTokenB, token)
        amountSwapTokenASetter(minTokenToReceive)
    }


    return (
        <Container>
            <ContainerSwapActions>
                <NewSwapContainerNSM>
                    <TokenSelectNSM>
                        <NewTokenDetailSelectNSM>
                            <NewTokenDetailItems1NSM>From</NewTokenDetailItems1NSM>
                            <NewTokenDetailItems2NSM src={firstTokenSelected}/>
                            <NewTokenDetailItems3NSM>{firstTokenSelected.symbol}</NewTokenDetailItems3NSM>
                            <NewTokenDetailItems4NSM>
                                <ArrowContainerNSM>
                                    <FlechaIcon onClick={() => { searchModalASetter(true) }} />
                                    {searchModalA && <FloatMenu
                                        lefilter={true}
                                        lesymbol={secondTokenSelected.symbol}

                                        tokens={tokens}
                                        onSelectToken={selectAndCloseTokenA}
                                        onClick={() => { searchModalASetter(false) }}
                                    />}
                                </ArrowContainerNSM>
                            </NewTokenDetailItems4NSM>
                        </NewTokenDetailSelectNSM>
                    </TokenSelectNSM>
                    <TokenSelectionNSM>
                        <NewTokenDetailActionsNSM>
                        <NewBalanceSpaceNSM>Balance: {'--'}</NewBalanceSpaceNSM>
                            <ActionContainerNSM>

                                <ButtonHalfMaxContainer>
                                    <ButtonHalfMax onClick={() => { makeHalf(firstTokenSelected.amount, changeTokenA) }}>Half</ButtonHalfMax>
                                    <ButtonHalfMax onClick={() => { makeMax(firstTokenSelected.amount, changeTokenA) }}>Max</ButtonHalfMax>
                                </ButtonHalfMaxContainer>
                                <BalanceInputContainerNSM>
                                    <BalanceInputItem1NSM>
                                        <BalanceInputNSM
                                            min={0}
                                            onChange={(e) => { changeTokenA(e.target.value) }}
                                            type="number" name="" id="" value={amountSwapTokenA} />
                                    </BalanceInputItem1NSM>
                                    <BalanceInputItem2NSM>
                                        <p>$ {valueAUSD}</p>
                                    </BalanceInputItem2NSM>
                                </BalanceInputContainerNSM>
                            </ActionContainerNSM>
                        </NewTokenDetailActionsNSM>
                    </TokenSelectionNSM>
                </NewSwapContainerNSM>
                <IconPlaceNSM>
                    <SwitchSwap onClick={onSwitchTokensHandler} />
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
                                        excludedSymbols={[firstTokenSelected.symbol]}
                                        tokens={tokens}
                                        onSelectToken={selectAndCloseTokenB}
                                        onClick={() => { searchModalBSetter(false) }}
                                    />}
                                </ArrowContainerNSM>
                            </NewTokenDetailItems4NSM>
                        </NewTokenDetailSelectNSM>
                    </TokenSelectNSM>
                    <TokenSelectionNSM>
                        <NewTokenDetailActionsNSM>
                        <NewBalanceSpaceNSM>Balance: {'--'}</NewBalanceSpaceNSM>
                            <ActionContainerNSM>

                                <ButtonHalfMaxContainer>
                                    <ButtonHalfMax onClick={() => { makeHalf(secondTokenSelected.amount, changeTokenB) }}>Half</ButtonHalfMax>
                                    <ButtonHalfMax onClick={() => { makeMax(secondTokenSelected.amount, changeTokenB) }}>Max</ButtonHalfMax>
                                </ButtonHalfMaxContainer>
                                <BalanceInputContainerNSM>
                                    <BalanceInputItem1NSM>
                                        <BalanceInputNSM
                                            min={0}
                                            onChange={(e) => { changeTokenB(e.target.value) }}
                                            type="number" name="" id="" value={amountSwapTokenB} />
                                    </BalanceInputItem1NSM>
                                    <BalanceInputItem2NSM>
                                        <p>$ {valueBUSD}</p>
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
                        !isConnected && <NewSwapButton style={{height: "57px", width: "100%"}} content="Connect to Wallet" handler={async () => { onConnect() }} />
                    }
                    {
                        !isApprovedA && isConnected &&
                        <NewSwapButton style={{height: "57px", width: "100%"}} content={`Approve ${-freeAllowanceA} ${firstTokenSelected.symbol}`} handler={async () => { await requestIncreaseAllowance(-freeAllowanceA, firstTokenSelected.contractHash) }} />
                    }
                    {

                        !isApprovedB && isConnected &&
                        <NewSwapButton style={{height: "57px", width: "100%"}} content={`Approve ${-freeAllowanceB} ${secondTokenSelected.symbol}`} handler={async () => { await requestIncreaseAllowance(-freeAllowanceB, secondTokenSelected.contractHash) }} />
                    }
                    {    
                        isApprovedA && isApprovedB && isConnected &&
                        <NewSwapButton style={{height: "57px", width: "100%"}} disabled={disableButton(amountSwapTokenA, amountSwapTokenB)} content="Add Liquidity" handler={async () => { await onLiquidity() }} />
                    }
                </ButtonSpaceNSM>


            </ContainerSwapActions>
            {
                isConnected && userPairData.length > 0 &&
                <ContainerSwapStatics>
                    {// Loop over the table rows
                        userPairData.filter((v:any) => parseFloat(v.balance) > 0).map((row:any) => {

                            const openPopup = isOpenedRemoving && row.token0Symbol == firstTokenSelected.symbol && row.token1Symbol == secondTokenSelected.symbol
                            return (
                                // Apply the row props
                                <LiquidityItem
                                    key={`${row.token0Symbol}-${row.token1Symbol}`}
                                    fullExpanded={openPopup}
                                    firstIcon={row.token0Icon}
                                    firstSymbol={row.token0Symbol}
                                    firstLiquidity={row.reserve0}
                                    secondIcon={row.token1Icon}
                                    secondSymbol={row.token1Symbol}
                                    secondLiquidity={row.reserve1}
                                    liquidity={row.balance}
                                    perLiquidity={new BigNumber(row.balance).div(row.totalSupply).times(100).toFixed(2)} >

                                    <LiquidityRemovingModule isConnected={true}
                                                             openedPopup={openPopup}
                                                             firstHash={row.contract0}
                                                             firstSymbol={row.token0Symbol}
                                                             firstLiquidity={row.reserve0}
                                                             secondHash={row.contract1}
                                                             secondSymbol={row.token1Symbol}
                                                             secondLiquidity={row.reserve1}
                                                             liquidityId={row.id}
                                                             liquidity={row.balance}
                                                             allowance={row.allowance}
                                                             liquidityUSD={row.liquidityUSD}
                                    >
                                        <CircleButton>
                                            <TbTrash style={{alignSelf: "center", color: lightTheme.thirdBackgroundColor}} size="1.3rem"/>
                                        </CircleButton>
                                    </LiquidityRemovingModule>
                                </LiquidityItem>
                            )
                        })
                    }
                </ContainerSwapStatics>
            }
        </Container>
    )
}

const ButtonSpaceModalStyled = styled.div`
    width: 100%;
    display: flex;
    gap:10px;
    justify-content: center;
`

const CoinContainerStyled = styled.div`
    box-sizing: border-box;
    border:1px solid black;
    border-radius: 10px;
    padding:10px;
    display: flex;
    gap:10px;
    align-items: center;
`
const ContainerSwapStatics = styled.section`
    box-sizing: border-box;
    justify-self: start;
    padding:10px;
    border:1px solid black;
    border-radius: 10px;
    display:flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    gap:10px;
`

const Container = styled.main`
    box-sizing: border-box;
    height:100%;
    width: 100%;
    gap:10px;
    padding:10px;
    color:black;
    display: grid;
    grid-template-columns: repeat(2,auto);
    align-items: start;
`
const ContainerSwapActions = styled.section`
    justify-self: end;
    padding: 20px 25px 10px 25px;
    border:1px solid black;
    border-radius: 10px;
    display:grid;
    gap:10px;
    grid-template-rows: repeat(6,auto);
`

const ButtonHalfMaxContainer = styled.div`
    border-left: 3px solid ${props => props.theme.NewPurpleColor};
    padding-left:10px;
    display: grid;
    gap:10px;
`

const ButtonHalfMax = styled.div<any>`
    background-color: ${props => props.theme.NewPurpleColor};
    color: white;
    padding:10px;
    border-radius: 12px;
    width: 21px;
    height: 12px;
    cursor: pointer;
    font-size: 12px;
`

export default LiquidityNewModule