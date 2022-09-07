import React, { useContext, useState } from 'react'

import { useLocation } from 'react-router-dom'
import {
  CardContainer, CloseButtonAtom, ConfirmSwapButton, HeaderModalAtom, SearchSectionAtom, SwapButton,
  SwapContainer, SwapContainerAtom, SwapHeaderAtom, SwapTokenBalance, SwapTokenSelect,
  SearchInputAtom
} from '../../atoms'
import { SwapModule } from '../../organisms'

import { BasicLayout } from '../../../layout/Basic'
import {SwapConfirmAtom, SwapModal, SwapTokens, SwapToken, CollapsingBox, SwitchBox, ApprovalButton} from '../../molecules'
import { AiOutlineClose } from 'react-icons/ai'
import { v4 as uuidv4 } from 'uuid';

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

import { ConfigProviderContext } from '../../../contexts/ConfigContext'
import {WrappedApprovalButton} from "./styles";

export const Swap = () => {
  //const query = useQuery()
  //const tokenOne = query.get("tokenOne")
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
  const [isApprovedToken, isApprovedTokenSetter] = useState(true)

  const handleModalPrimary = () => {
    setActiveModalPrimary(!activeModalPrimary)
    ResetTokens()
  }
  const handleModalSecondary = () => {
    setActiveModalSecondary(!activeModalSecondary)
    ResetTokens()
  }

  const {
    onConnectConfig,
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
    getSwapDetail,
    onIncreaseAllow
  } = useContext(ConfigProviderContext)

  function onConnect() {
    onConnectConfig()
  }


  async function onConfirmSwap() {
    const waiting = await onConfirmSwapConfig(amountSwapTokenA, amountSwapTokenB, slippSwapToken)
    amountSwapTokenASetter(0)
    setActiveModalSwap(false);
    onConnectConfig()
  }

  function onSwitch() {
    onSwitchTokens()
    amountSwapTokenASetter(0)
    amountSwapTokenBSetter(0)
    switchMovementSetter(false)
  }

  function ResetTokens() {
    amountSwapTokenASetter(0)
    amountSwapTokenBSetter(0)
  }

  async function changeTokenA(value) {
    amountSwapTokenASetter(value)

    const minTokenToReceive = await updateSwapDetail(firstTokenSelected, secondTokenSelected, value)
    amountSwapTokenBSetter(minTokenToReceive)
  }

  async function changeTokenB(value) {
    amountSwapTokenBSetter(value)

    const minTokenToReceive = await updateSwapDetail(secondTokenSelected, firstTokenSelected, value)
    amountSwapTokenASetter(minTokenToReceive)
  }

  async function updateSwapDetail(tokenA, tokenB, value) {
    const {
      tokensToTransfer,
      priceImpact,
      exchangeRateA,
      exchangeRateB
    } = await getSwapDetail(firstTokenSelected, secondTokenSelected, value, slippSwapToken, feeToPay)
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
    const isApproved = await onIncreaseAllow(amount, contractHash)
    isApprovedTokenSetter(isApproved)
  }

  return (
      <BasicLayout>
        <CardContainer cardTitle="Swap">
          <SwapModule >
            <SwapContainer>
              <SwapTokenSelect onClickHandler={handleModalPrimary} token={firstTokenSelected} isWalletConnected={isConnected} />
              <SwapTokenBalance token={firstTokenSelected} amountSwapTokenSetter={changeTokenA} amountSwapToken={amountSwapTokenA} />
            </SwapContainer>
            {
                activeModalPrimary &&
                <SwapModal >
                  <SwapContainerAtom >
                    <SwapHeaderAtom>
                      <HeaderModalAtom>Select Token</HeaderModalAtom>
                      <CloseButtonAtom onClick={handleModalPrimary}>
                        <AiOutlineClose />
                      </CloseButtonAtom>
                    </SwapHeaderAtom>
                    <SearchSectionAtom>
                      <SearchInputAtom
                          placeholder="Search name"
                      />
                    </SearchSectionAtom>
                    <SwapTokens >
                      {
                        Object.keys(tokens)
                            .map((key) => {
                              const handleToken = () => { onSelectFirstToken(tokens[key]), handleModalPrimary() }

                              return <SwapToken key={uuidv4()} token={tokens[key]} handleToken={handleToken} />
                            })
                      }
                    </SwapTokens>

                  </SwapContainerAtom>
                </SwapModal>
            }

            <SwitchBox
                       onSwitch={onSwitch}
                       secondTokenSelected={secondTokenSelected}
                       firstTokenSelected={firstTokenSelected}
                       exchangeRateA={exchangeRateA}
                       exchangeRateB={exchangeRateB}
                       defaultPriceImpactLabel={defaultPriceImpactLabel}
                       active={switchMovement}
            />

            <SwapContainer>
              <SwapTokenSelect onClickHandler={handleModalSecondary} token={secondTokenSelected} isWalletConnected={isConnected} />
              <SwapTokenBalance token={secondTokenSelected} amountSwapTokenSetter={changeTokenB} amountSwapToken={amountSwapTokenB} />
            </SwapContainer>
            {
                amountSwapTokenB > 0 &&
                <CollapsingBox firstToken={amountSwapTokenA}
                               firstSymbolToken={firstTokenSelected}
                               receivedSymbolToken={secondTokenSelected}
                               tokensToTransfer={tokensToTransfer}
                               priceImpact={priceImpact}
                               slippage={slippSwapToken}
                               defaultPriceImpact={defaultPriceImpactLabel}
                               slippageSetter={slippSwapTokenSetter}
                               fullWidth={true}
                               fullExpanded = {false}
                               expandedEnabled = {true}
                               slippageEnabled = {true}
                />
            }
            {
                activeModalSecondary &&
                <SwapModal >
                  <SwapContainerAtom >
                    <SwapHeaderAtom>
                      <HeaderModalAtom>Select Token</HeaderModalAtom>
                      <CloseButtonAtom onClick={handleModalSecondary}>
                        <AiOutlineClose />
                      </CloseButtonAtom>
                    </SwapHeaderAtom>
                    <SearchSectionAtom>
                      <SearchInputAtom
                          placeholder="Search name"
                      />
                    </SearchSectionAtom>
                    <SwapTokens >
                      {
                        Object.keys(tokens)
                            .map((key) => {
                              const filter = new RegExp(firstTokenSelected.symbol)
                              if (filter.test(key)) { return }
                              const handleToken = () => { onSelectSecondToken(tokens[key]), handleModalSecondary() }
                              return <SwapToken key={uuidv4()} token={tokens[key]} handleToken={handleToken} />
                            })
                      }
                    </SwapTokens>
                  </SwapContainerAtom>
                </SwapModal>
            }
            {!isConnected && <SwapButton content="Connect to Wallet" handler={async () => { onConnect() }} />}
            <WrappedApprovalButton>
              <ApprovalButton isVisible={!isApprovedToken && (isConnected && firstTokenSelected.symbol !== 'CSPR' && secondTokenSelected.symbol !== 'CSPR')}
                              title={'Approve ' + secondTokenSelected.symbol}
                              amount={amountSwapTokenB}
                              contractHash={secondTokenSelected.contractHash}
                              callIncreaseAllowance={requestIncreaseAllowance}/>
            </WrappedApprovalButton>
            {
              isConnected && ( ! (firstTokenSelected.symbol !== 'CSPR' && secondTokenSelected.symbol !== 'CSPR') || isApprovedToken )&&
                <SwapButton content="Swap" disabled={amountSwapTokenB <= 0} handler={async () => { setActiveModalSwap(true) }} />
            }
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
                      <ConfirmSwapButton content="Confirm Swap" handler={async () => { await onConfirmSwap() }} />
                    </SwapConfirmAtom>

                  </SwapContainerAtom>
                </SwapModal>
            }

          </SwapModule>
        </CardContainer >
      </BasicLayout>
  )
}