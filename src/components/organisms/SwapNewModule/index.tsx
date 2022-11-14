import BigNumber from 'bignumber.js'

import React, { useContext, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { ConfigProviderContext } from '../../../contexts/ConfigContext'
import {
    ButtonConnection,
    ButtonHalfMax,
    ButtonHalfMaxContainer,
    CloseButtonAtom,
    ExchangeRateBox,
    HeaderModalAtom,
    NewSwapButton,
    SwapContainerAtom,
    SwapHeaderAtom,
} from '../../atoms'
import { ActionContainerNSM } from '../../atoms/ActionContainerNSM'
import { ArrowContainerNSM } from '../../atoms/ArrowContainerNSM'
import { BalanceInputContainerNSM } from '../../atoms/BalanceInputContainerNSM'
import { BalanceInputItem1NSM } from '../../atoms/BalanceInputItem1NSM'
import { BalanceInputItem2NSM } from '../../atoms/BalanceInputItem2NSM'
import { BalanceInputNSM } from '../../atoms/BalanceInputNSM'
import { ButtonSpaceNSM } from '../../atoms/ButtonSpaceNSM'
import { CoinContainerNSM } from '../../atoms/CoinContainerNSM'
import { ContainerNSM } from '../../atoms/ContainerNSM'
import { ContainerSwapActions } from '../../atoms/ContainerSwapActions'
import { ContainerSwapStaticsNSM } from '../../atoms/ContainerSwapStaticsNSM'
import { IconPlaceNSM } from '../../atoms/IconPlaceNSM'
import { NewBalanceSpaceNSM } from '../../atoms/NewBalanceSpaceNSM'
import { NewSwapContainerNSM } from '../../atoms/NewSwapContainerNSM'
import { NewTokenDetailActionsNSM } from '../../atoms/NewTokenDetailActionsNSM'
import { NewTokenDetailItems1NSM } from '../../atoms/NewTokenDetailItems1NSM'
import { NewTokenDetailItems2NSM } from '../../atoms/NewTokenDetailItems2NSM'
import { NewTokenDetailItems3NSM } from '../../atoms/NewTokenDetailItems3NSM'
import { NewTokenDetailItems4NSM } from '../../atoms/NewTokenDetailItems4NSM'
import { NewTokenDetailSelectNSM } from '../../atoms/NewTokenDetailSelectNSM'
import { SwapDetailsNSM } from '../../atoms/SwapDetailsNSM'
import { TokenSelectionNSM } from '../../atoms/TokenSelectionNSM'
import { TokenSelectNSM } from '../../atoms/TokenSelectNSM'
import { SwapConfirmAtom, SwapDetail, SwapModal} from '../../molecules'
import FloatMenu from '../FloatMenu'
import { 
    convertAllFormatsToUIFixedString,
    Token,
} from '../../../commons'

const SwapNewModule = () => {
    const [activeModalSwap, setActiveModalSwap] = React.useState(false)
    const [amountSwapTokenA, amountSwapTokenASetter] = useState<number>(0)
    const [amountSwapTokenB, amountSwapTokenBSetter] = useState<number>(0)
    const [slippSwapToken, slippSwapTokenSetter] = useState<any>(0.5)
    const [tokensToTransfer, tokensToTransferSetter] = useState<any>(0)
    const [priceImpact, priceImpactSetter] = useState<any>(0)
    const [feeToPay, feeToPaySetter] = useState<any>(0.03)
    const [exchangeRateA, exchangeRateASetter] = useState<any>(0)
    const [exchangeRateB, exchangeRateBSetter] = useState<any>(0)
    const [defaultPriceImpactLabel, defaultPriceImpactLabelSetter] = useState<any>('')
    const [lastChanged, setLastChanged] = useState('')

    const {
        onConnectWallet,
        configState,
        onSelectFirstToken,
        onSelectSecondToken,
        onSwitchTokens,
        tokens,
        firstTokenSelected,
        secondTokenSelected,
        isConnected,
        onConfirmSwapConfig,
        getSwapDetails,
        onIncreaseAllow,
    } = useContext(ConfigProviderContext)

    async function onConnect() {
        onConnectWallet()
    }

    function onSwitchTokensHandler() {
        onSwitchTokens()
        
        if(lastChanged == 'A') {
            changeTokenB(amountSwapTokenA.toString())
            setLastChanged('B')
        } else if(lastChanged == 'B') {
            changeTokenA(amountSwapTokenB.toString())
            setLastChanged('A')
        }
    }

    function resetAll() {
        amountSwapTokenASetter(0)
        amountSwapTokenBSetter(0)
    }

    async function onConfirmSwap() {
        setActiveModalSwap(false);
        const waiting = await onConfirmSwapConfig(amountSwapTokenA, amountSwapTokenB, slippSwapToken)
        resetAll()
    }

    async function updateSwapDetail(tokenA, tokenB, value = amountSwapTokenA, token = firstTokenSelected) {
        const getSwapDetailP = getSwapDetails(tokenA, tokenB, value, token, slippSwapToken, feeToPay)
        const ps = [getSwapDetailP]

        const [getSwapDetailResponse] = await Promise.all(ps)

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

        defaultPriceImpactLabelSetter(parseFloat(priceImpact) > 1 ? 'Price Impact Warning' : 'Low Price Impact')
        return tokensToTransfer
    }

    async function requestIncreaseAllowance(amount, contractHash) {
        console.log("requestIncreaseAllowance")
        await onIncreaseAllow(amount, contractHash)
        await updateSwapDetail(firstTokenSelected, secondTokenSelected, amount, firstTokenSelected)
    }

    async function changeTokenA(value: string) {
        let filteredValue = parseFloat(value)
        if (isNaN(filteredValue)) {
            filteredValue = 0
        } else if (filteredValue < 0) {
            filteredValue = Math.abs(filteredValue)
        }

        setLastChanged('A')

        amountSwapTokenASetter(filteredValue)

        const minTokenToReceive = await updateSwapDetail(firstTokenSelected, secondTokenSelected, filteredValue, firstTokenSelected)
        amountSwapTokenBSetter(parseFloat(minTokenToReceive))
    }

    async function changeTokenB(value: string) {
        let filteredValue = parseFloat(value)
        if (isNaN(filteredValue)) {
            filteredValue = 0
        } else if (filteredValue < 0) {
            filteredValue = Math.abs(filteredValue)
        }

        setLastChanged('B')

        amountSwapTokenBSetter(filteredValue)

        const minTokenToReceive = await updateSwapDetail(firstTokenSelected, secondTokenSelected, filteredValue, secondTokenSelected)
        amountSwapTokenASetter(parseFloat(minTokenToReceive))
    }

    const [searchModalA, searchModalASetter] = useState(false)
    async function selectAndCloseTokenA(token: Token): Promise<void> {
        onSelectFirstToken(token)
        searchModalASetter(false)

        const minTokenToReceive = await updateSwapDetail(token, secondTokenSelected, amountSwapTokenA, token)
        amountSwapTokenBSetter(parseFloat(minTokenToReceive))

    }

    const [searchModalB, searchModalBSetter] = useState(false)
    async function selectAndCloseTokenB(token: Token): Promise<void> {
        onSelectSecondToken(token)
        searchModalBSetter(false)
        const minTokenToReceive = await updateSwapDetail(firstTokenSelected, token, amountSwapTokenB, token)
        amountSwapTokenASetter(parseFloat(minTokenToReceive))
    }

    function makeHalf(amount, Setter) {
        Setter(amount / 2)
    }
    function makeMax(amount, Setter) {
        Setter(amount)
    }

    const freeAllowance = new BigNumber(firstTokenSelected.allowance || 0).minus(new BigNumber(amountSwapTokenA)).toNumber()

    const isApproved = firstTokenSelected.symbol == 'CSPR' || (
        firstTokenSelected.symbol != 'CSPR' &&
        freeAllowance >= 0
    )

    return (
        <ContainerNSM>
            <ContainerSwapActions>
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
                                        excludedSymbols={[secondTokenSelected.symbol]}
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
                            <NewBalanceSpaceNSM>Balance: {firstTokenSelected.amount || "--"}</NewBalanceSpaceNSM>
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
                                        <p>$34.75</p>
                                    </BalanceInputItem2NSM>
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
                            <NewBalanceSpaceNSM>Balance: {secondTokenSelected.amount || "--"}</NewBalanceSpaceNSM>
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
                                        <p>$34.75</p>
                                    </BalanceInputItem2NSM>
                                </BalanceInputContainerNSM>
                            </ActionContainerNSM>
                        </NewTokenDetailActionsNSM>
                    </TokenSelectionNSM>
                </NewSwapContainerNSM>
                {
                    amountSwapTokenB > 0 &&
                    <SwapDetail
                        firstSymbolToken={firstTokenSelected.symbol}
                        firstTokenAmount={amountSwapTokenA}
                        secondSymbolToken={secondTokenSelected.symbol}
                        secondTokenAmount={amountSwapTokenB}
                        priceImpactMessage={defaultPriceImpactLabel}
                        priceImpact={priceImpact}
                        fullExpanded={false}
                    />
                }
                <ButtonSpaceNSM>
                    {
                        !isConnected && <NewSwapButton style={{height: "57px", width: "100%"}} content="Connect to Wallet" handler={async () => { onConnect() }} />
                    }
                    {
                        !isApproved && isConnected && <NewSwapButton style={{height: "57px", width: "100%"}} content={`Approve ${-freeAllowance} ${firstTokenSelected.symbol}`} handler={async () => { await requestIncreaseAllowance(-freeAllowance, firstTokenSelected.contractHash) }} />
                    }
                    {
                        isApproved && isConnected && <NewSwapButton style={{height: "57px", width: "100%"}} content="Swap" disabled={amountSwapTokenA <= 0 || amountSwapTokenB <= 0 || amountSwapTokenA > parseFloat(firstTokenSelected.amount)} handler={async () => { await onConfirmSwap() }} />
                    }
                </ButtonSpaceNSM>
                {
                    activeModalSwap &&
                    <SwapModal >
                        <SwapContainerAtom >
                            <SwapHeaderAtom>
                                <HeaderModalAtom>Confirm Swap</HeaderModalAtom>
                                <CloseButtonAtom onClick={() => { setActiveModalSwap(false) }}>
                                    <AiOutlineClose />
                                </CloseButtonAtom>
                            </SwapHeaderAtom>
                            <SwapConfirmAtom
                                firstToken={amountSwapTokenA}
                                firstTokenSelected={firstTokenSelected}
                                secondTokenSelected={secondTokenSelected}
                                amountSwapTokenA={amountSwapTokenA}
                                amountSwapTokenB={amountSwapTokenB}
                                slippSwapToken={slippSwapToken}
                                tokensToTransfer={tokensToTransfer}
                                priceImpact={priceImpact}
                                defaultPriceImpactLabel={defaultPriceImpactLabel}
                                slippSwapTokenSetter={slippSwapTokenSetter}
                            >
                                <NewSwapButton content="Confirm Swap" handler={async () => { await onConfirmSwap() }} />
                            </SwapConfirmAtom>

                        </SwapContainerAtom>
                    </SwapModal>
                }

            </ContainerSwapActions>
            <ContainerSwapStaticsNSM>
                <CoinContainerNSM>
                    <img src={firstTokenSelected.logoURI} width="50" height="50" />
                    <div>{firstTokenSelected.symbol}</div>
                    <div>|</div>
                    <div>
                        <div>price</div>
                        <div>$1.456</div>
                    </div>
                    <div>
                        <div>24H%</div>
                        <div>12.05</div>
                    </div>
                    <div>
                        <Graphics />
                    </div>
                </CoinContainerNSM>
                <CoinContainerNSM>
                    <img src={secondTokenSelected.logoURI} width="50" height="50" />
                    <div>{secondTokenSelected.symbol}</div>
                    <div>|</div>
                    <div>
                        <div>price</div>
                        <div>$1.456</div>
                    </div>
                    <div>
                        <div>24H%</div>
                        <div>12.05</div>
                    </div>
                    <div>
                        <Graphics />
                    </div>
                </CoinContainerNSM>
            </ContainerSwapStaticsNSM>
        </ContainerNSM>
    )
}

export default SwapNewModule