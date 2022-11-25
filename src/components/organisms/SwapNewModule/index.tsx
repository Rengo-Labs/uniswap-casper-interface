import React, { useContext, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import styled from 'styled-components'
import { ConfigProviderContext } from '../../../contexts/ConfigContext'
import {
    ActionContainerJC,
    ArrowContainerJC,
    BalanceInputContainerJC,
    BalanceInputItem1JC,
    BalanceInputItem2JC,
    BalanceInputJC,
    ButtonConnection,
    ButtonHalfMax,
    ButtonHalfMaxContainer,
    ButtonSpaceJC,
    CloseButtonAtom,
    CoinContainerJC,
    ConfirmSwapButton,
    ContainerJC,
    ContainerSwapActionsJC,
    ContainerSwapStaticsJC,
    ExchangeRateBox,
    FlechaIcon,
    Graphics,
    HeaderModalAtom,
    IconPlaceJC,
    LoadersSwap,
    NewBalanceSpaceJC,
    NewSwapButton,
    NewSwapContainerJC,
    NewTokenDetailActionsJC,
    NewTokenDetailItems1JC,
    NewTokenDetailItems2JC,
    NewTokenDetailItems3JC,
    NewTokenDetailItems4JC,
    NewTokenDetailSelectJC,
    SearchInputAtom,
    SearchSectionAtom,
    SwapButton,
    SwapContainer,
    SwapContainerAtom,
    SwapDetailsJC,
    SwapHeaderAtom,
    SwapTokenBalance,
    SwapTokenSelect,
    SwitchSwap,
    TokenSelectionJC,
    TokenSelectJC
} from '../../atoms'
import { SwapConfirmAtom, SwapDetail, SwapModal } from '../../molecules'
import FloatMenu from '../FloatMenu'

const SwapNewModule = () => {
    const [activeModalPrimary, setActiveModalPrimary] = React.useState(false)
    const [activeModalSecondary, setActiveModalSecondary] = React.useState(false)
    const [activeModalSwap, setActiveModalSwap] = React.useState(false)
    const [amountSwapTokenA, amountSwapTokenASetter] = useState<any>(0)
    const [amountSwapTokenB, amountSwapTokenBSetter] = useState<any>(0)
    const [slippSwapToken, slippSwapTokenSetter] = useState<any>(0.5)
    const [tokensToTransfer, tokensToTransferSetter] = useState<any>(0)
    const [priceImpact, priceImpactSetter] = useState<any>(0)
    const [feeToPay, feeToPaySetter] = useState<any>(0.03)
    const [exchangeRateA, exchangeRateASetter] = useState<any>(0)
    const [exchangeRateB, exchangeRateBSetter] = useState<any>(0)
    const [defaultPriceImpactLabel, defaultPriceImpactLabelSetter] = useState<any>('')
    const [switchMovement, switchMovementSetter] = useState(false)
    const [allowanceA, setAllowanceA] = useState(0)
    const {
        onConnectWallet,
        configState,
        tokenState,
        onSelectFirstToken,
        onSelectSecondToken,
        onSwitchTokens,
        tokens,
        firstTokenSelected,
        secondTokenSelected,
        isConnected,
        onConfirmSwapConfig,
        slippageToleranceSelected,
        onCalculateReserves,
        getSwapDetails,
        getAllowanceAgainstOwnerAndSpender,
        onIncreaseAllow,
        onDisconnectWallet,
        ResetTokens,
        onListenerFirstInput
    } = useContext(ConfigProviderContext)
    const {
        walletAddress
    } = configState

    async function onConnect() {
        onConnectWallet()
    }
    function onSwitchTokensHandlers() {
        ResetAll()
        onSwitchTokens()
    }

    async function onDisconnect() {
        onDisconnectWallet()
    }
    const handleModalPrimary = () => {
        setActiveModalPrimary(!activeModalPrimary)
        ResetAll()
    }
    const handleModalSecondary = () => {
        setActiveModalSecondary(!activeModalSecondary)
        ResetAll()
    }
    function ResetAll() {
        amountSwapTokenASetter(0)
        amountSwapTokenBSetter(0)
        ResetTokens()
    }

    async function onConfirmSwap() {
        setActiveModalSwap(false);
        const waiting = await onConfirmSwapConfig(amountSwapTokenA, amountSwapTokenB, slippSwapToken)
        amountSwapTokenASetter(0)
        onConnectWallet()
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

    async function requestIncreaseAllowance(amount, contractHash) {
        console.log("requestIncreaseAllowance")
        await onIncreaseAllow(amount, contractHash, amountSwapTokenA, firstTokenSelected.amount)
        await updateSwapDetail(firstTokenSelected, secondTokenSelected, amount, firstTokenSelected)
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
        amountSwapTokenBSetter(minTokenToReceive)
    }

    async function changeTokenB(value: string) {
        let filteredValue = parseFloat(value)
        if (isNaN(filteredValue)) {
            filteredValue = 0
        } else if (filteredValue < 0) {
            filteredValue = Math.abs(filteredValue)
        }

        amountSwapTokenBSetter(filteredValue)

        const minTokenToReceive = await updateSwapDetail(firstTokenSelected, secondTokenSelected, filteredValue, secondTokenSelected)
        amountSwapTokenASetter(minTokenToReceive)
    }

    const [searchModalA, searchModalASetter] = useState(false)
    async function SelectAndCloseTokenA(token) {
        onSelectFirstToken(token)
        searchModalASetter(false)

        const minTokenToReceive = await updateSwapDetail(token, secondTokenSelected, amountSwapTokenA, token)
        amountSwapTokenBSetter(minTokenToReceive)

    }
    const [searchModalB, searchModalBSetter] = useState(false)
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
    function returnFilterB(tokens, firstTokenSelected) {
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
        return filtered
    }
    const freeAllowance = allowanceA / Math.pow(10, 9) - parseFloat(amountSwapTokenA)
    const isApproved = firstTokenSelected.symbol == 'CSPR' || (
        firstTokenSelected.symbol != 'CSPR' &&
        freeAllowance >= 0
    )

    return (
        <ContainerJC>
            <ContainerSwapActionsJC>
                <NewSwapContainerJC>
                    <TokenSelectJC>
                        <NewTokenDetailSelectJC>
                            <NewTokenDetailItems1JC>From</NewTokenDetailItems1JC>
                            <NewTokenDetailItems2JC src={firstTokenSelected.logoURI} />
                            <NewTokenDetailItems3JC>{firstTokenSelected.symbol}</NewTokenDetailItems3JC>
                            <NewTokenDetailItems4JC>
                                <ArrowContainerJC>
                                    <FlechaIcon onClick={() => { searchModalASetter(true) }} />
                                    {searchModalA && <FloatMenu
                                        lefilter={true}
                                        lesymbol={secondTokenSelected.symbol}
                                        tokens={tokens}
                                        selectToken={SelectAndCloseTokenA}
                                        onClick={() => { searchModalASetter(false) }}
                                    />}
                                </ArrowContainerJC>
                            </NewTokenDetailItems4JC>
                        </NewTokenDetailSelectJC>
                    </TokenSelectJC>
                    <TokenSelectionJC>
                        <NewTokenDetailActionsJC>
                            <NewBalanceSpaceJC>Balance: {firstTokenSelected.amount || "--"}</NewBalanceSpaceJC>
                            <ActionContainerJC>
                                <ButtonHalfMaxContainer>
                                    <ButtonHalfMax onClick={() => { makeHalf(firstTokenSelected.amount, amountSwapTokenASetter) }}>Half</ButtonHalfMax>
                                    <ButtonHalfMax onClick={() => { makeMax(firstTokenSelected.amount, amountSwapTokenASetter) }}>Max</ButtonHalfMax>
                                </ButtonHalfMaxContainer>
                                <BalanceInputContainerJC>
                                    <BalanceInputItem1JC>
                                        <BalanceInputJC
                                            min={0}
                                            onChange={(e) => { changeTokenA(e.target.value) }}
                                            value={amountSwapTokenA}
                                        />
                                    </BalanceInputItem1JC>
                                    <BalanceInputItem2JC>
                                        <p>$34.75</p>
                                    </BalanceInputItem2JC>
                                </BalanceInputContainerJC>
                            </ActionContainerJC>
                        </NewTokenDetailActionsJC>
                    </TokenSelectionJC>
                </NewSwapContainerJC>
                <IconPlaceJC>
                    <SwitchSwap onClick={() => { onSwitchTokens(); ResetAll() }} />
                    <SwapDetailsJC>
                        <ExchangeRateBox
                            tokenASymbol={firstTokenSelected.symbol}
                            tokenBSymbol={secondTokenSelected.symbol}
                            exchangeRateA={exchangeRateA}
                            exchangeRateB={exchangeRateB}
                        />
                    </SwapDetailsJC>
                    <LoadersSwap />
                </IconPlaceJC>
                <NewSwapContainerJC>
                    <TokenSelectJC>
                        <NewTokenDetailSelectJC>
                            <NewTokenDetailItems1JC>To</NewTokenDetailItems1JC>
                            <NewTokenDetailItems2JC src={secondTokenSelected.logoURI} />
                            <NewTokenDetailItems3JC>{secondTokenSelected.symbol}</NewTokenDetailItems3JC>
                            <NewTokenDetailItems4JC>
                                <ArrowContainerJC>
                                    <FlechaIcon onClick={() => { searchModalBSetter(true) }} />
                                    {searchModalB && <FloatMenu
                                        tokens={returnFilter(tokens, firstTokenSelected)}
                                        selectToken={SelectAndCloseTokenB}
                                        onClick={() => { searchModalBSetter(false) }}
                                    />}
                                </ArrowContainerJC>
                            </NewTokenDetailItems4JC>
                        </NewTokenDetailSelectJC>
                    </TokenSelectJC>
                    <TokenSelectionJC>
                        <NewTokenDetailActionsJC>
                            <NewBalanceSpaceJC>Balance: {secondTokenSelected.amount || "--"}</NewBalanceSpaceJC>
                            <ActionContainerJC>
                                <ButtonHalfMaxContainer>
                                    <ButtonHalfMax onClick={() => { makeHalf(secondTokenSelected.amount, amountSwapTokenASetter) }}>Half</ButtonHalfMax>
                                    <ButtonHalfMax onClick={() => { makeMax(secondTokenSelected.amount, amountSwapTokenASetter) }}>Max</ButtonHalfMax>
                                </ButtonHalfMaxContainer>
                                <BalanceInputContainerJC>
                                    <BalanceInputItem1JC>
                                        <BalanceInputJC
                                            min={0}
                                            onChange={(e) => { changeTokenB(e.target.value) }}
                                            value={amountSwapTokenB}
                                        />
                                    </BalanceInputItem1JC>
                                    <BalanceInputItem2JC>
                                        <p>$34.75</p>
                                    </BalanceInputItem2JC>
                                </BalanceInputContainerJC>
                            </ActionContainerJC>
                        </NewTokenDetailActionsJC>
                    </TokenSelectionJC>
                </NewSwapContainerJC>
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
                <ButtonSpaceJC>
                    {
                        !isConnected && <NewSwapButton style={{ width: "391px", height: "57px" }} content="Connect to Wallet" handler={async () => { onConnect() }} />
                    }
                    {
                        !isApproved && isConnected && <NewSwapButton style={{ width: "391px", height: "57px" }} content={`Approve ${-freeAllowance} ${firstTokenSelected.symbol}`} handler={async () => { await requestIncreaseAllowance(-freeAllowance, firstTokenSelected.contractHash) }} />
                    }
                    {
                        isApproved && isConnected && <NewSwapButton style={{ width: "391px", height: "57px" }} content="Swap" disabled={amountSwapTokenB <= 0} handler={async () => { await onConfirmSwap() }} />
                    }
                </ButtonSpaceJC>
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

            </ContainerSwapActionsJC>
            <ContainerSwapStaticsJC>
                <CoinContainerJC>
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
                </CoinContainerJC>
                <CoinContainerJC>
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
                </CoinContainerJC>
            </ContainerSwapStaticsJC>
        </ContainerJC>
    )
}

export default SwapNewModule