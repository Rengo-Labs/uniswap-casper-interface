import BigNumber from 'bignumber.js'

import React, { useContext, useState, useEffect } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import styled from 'styled-components'
import { ConfigProviderContext } from '../../../contexts/ConfigContext'
import {
  CloseButtonAtom,
  ActionContainerNSM,
  ArrowContainerNSM,
  BalanceInputContainerNSM,
  BalanceInputItem1NSM,
  BalanceInputItem2NSM,
  BalanceInputNSM,
  ButtonHalfMax,
  ButtonHalfMaxContainer,
  ButtonSpaceNSM,
  CoinContainerNSM,
  ContainerInnerNSM,
  ContainerSwapActionsNSM,
  ContainerSwapStaticsNSM,
  ExchangeRateBox,
  FlechaIcon,
  HeaderModalAtom,
  IconPlaceNSM,
  NewBalanceSpaceNSM,
  NewSwapButton,
  SwapContainerAtom,
  SwapHeaderAtom,
  NewSwapContainerNSM,
  NewTokenDetailActionsNSM,
  NewTokenDetailItems1NSM,
  NewTokenDetailItems2NSM,
  NewTokenDetailItems3NSM,
  NewTokenDetailItems4NSM,
  NewTokenDetailSelectNSM,
  SwapDetailsNSM,
  TokenSelectionNSM,
  TokenSelectNSM
} from '../../atoms'
import Graphics from '../../atoms/Graphics'
import LoadersSwap from '../../atoms/LoadersSwap'
import SwitchSwap from '../../atoms/SwitchSwap'
import { SwapConfirmAtom, SwapDetail, SwapModal } from '../../molecules'
import FloatMenu from '../FloatMenu'
import { useSearchParams } from "react-router-dom";

import {
  convertAllFormatsToUIFixedString,
  Token,
} from '../../../commons'


const SwapNewModule = () => {

  const {
    onConnectWallet,
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
    slippageToleranceSelected
  } = useContext(ConfigProviderContext)

  const [activeModalSwap, setActiveModalSwap] = React.useState(false)
  const [amountSwapTokenA, amountSwapTokenASetter] = useState<any>(0)
  const [amountSwapTokenB, amountSwapTokenBSetter] = useState<any>(0)
  const [slippSwapToken, slippSwapTokenSetter] = useState<any>(slippageToleranceSelected)
  const [tokensToTransfer, tokensToTransferSetter] = useState<any>(0)
  const [priceImpact, priceImpactSetter] = useState<any>(0)
  const [feeToPay, feeToPaySetter] = useState<any>(0.03)
  const [exchangeRateA, exchangeRateASetter] = useState<any>(0)
  const [exchangeRateB, exchangeRateBSetter] = useState<any>(0)
  const [defaultPriceImpactLabel, defaultPriceImpactLabelSetter] = useState<any>('')
  const [searchParams, setSearchParams] = useSearchParams()

  const [lastChanged, setLastChanged] = useState('')

  useEffect(() => {
    const t0 = searchParams.get("token0")
    const t1 = searchParams.get("token1")
    if (t0) {
      onSelectFirstToken(tokens[t0])
      onSelectSecondToken(tokens[t1])
    }

    updateSwapDetail(firstTokenSelected, secondTokenSelected, amountSwapTokenA, firstTokenSelected)
  }, [isConnected])
  
  async function onConnect() {
    onConnectWallet()
  }

  function onSwitchTokensHandler() {
    onSwitchTokens()

    if (lastChanged == 'A') {
      changeTokenB(amountSwapTokenA.toString())
      setLastChanged('B')
    } else if (lastChanged == 'B') {
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
    if (token.symbol === secondTokenSelected.symbol) {
      return;
    }
    onSelectFirstToken(token)
    searchModalASetter(false)

    const minTokenToReceive = await updateSwapDetail(token, secondTokenSelected, amountSwapTokenA, token)
    amountSwapTokenBSetter(parseFloat(minTokenToReceive))

  }

  const [searchModalB, searchModalBSetter] = useState(false)
  async function selectAndCloseTokenB(token): Promise<void> {
    if (token.symbol === firstTokenSelected.symbol) {
      return;
    }
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
    <ContainerInnerNSM>
      <ContainerSwapActionsNSM>
        <NewSwapContainerNSM>
          <TokenSelectNSM>
            <NewTokenDetailSelectNSM>
              <NewTokenDetailItems1NSM>From</NewTokenDetailItems1NSM>
              <NewTokenDetailItems2NSM src={firstTokenSelected.logoURI} />
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
              <NewBalanceSpaceNSM>Balance: {firstTokenSelected.amount ? convertAllFormatsToUIFixedString(firstTokenSelected.amount) : '--'}</NewBalanceSpaceNSM>
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
              <NewTokenDetailItems2NSM src={secondTokenSelected.logoURI} />
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
              <NewBalanceSpaceNSM>Balance: {secondTokenSelected.amount ? convertAllFormatsToUIFixedString(secondTokenSelected.amount) : '--'}</NewBalanceSpaceNSM>
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
            slippage={slippSwapToken}
            slippageEnabled={true}
            slippageSetter={slippSwapTokenSetter}
            fullExpanded={false}
          />
        }
        <ButtonSpaceNSM>
          {
            !isConnected && <NewSwapButton style={{ height: "57px", width: "100%" }} content="Connect to Wallet" handler={async () => { onConnect() }} />
          }
          {
            !isApproved && isConnected && <NewSwapButton style={{ height: "57px", width: "100%" }} content={`Approve ${-freeAllowance} ${firstTokenSelected.symbol}`} handler={async () => { await requestIncreaseAllowance(-freeAllowance, firstTokenSelected.contractHash) }} />
          }
          {
            isApproved && isConnected && <NewSwapButton style={{ height: "57px", width: "100%" }} content="Swap" disabled={amountSwapTokenA <= 0 || amountSwapTokenB <= 0 || amountSwapTokenA > parseFloat(firstTokenSelected.amount)} handler={async () => { await onConfirmSwap() }} />
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

      </ContainerSwapActionsNSM>
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
    </ContainerInnerNSM>
  )
}

export const BalanceInput = styled.input`
    all: unset;
    width: 100%;
    height: 100%;
    text-align: right;
    font-size: 22px;
    &:active{
        border: none;
    }
`

export const BalanceInputContainerStyled = styled.div`
    width: 100%;
    display: grid;
    grid-template-rows: auto auto;
    justify-items: end;
    gap:10px;
`
export const BalanceInputItem1Styled = styled.div`
    align-self: center;
    color:${props => props.theme.NewPurpleColor};
    font-size: 3em;
`
export const BalanceInputItem2Styled = styled.div`
align-self: center;
`

export const ArrowContainerStyle = styled.div`
    padding-top:10px;
    align-self: start;
`
export const ActionContainerStyled = styled.div`
    display: flex;
`





export const IconPlaceStyle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`
export const ButtonSpaceStyled = styled.div`
    justify-self: center;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 10px;
`
export const TokenSelectStyled = styled.div`
    display: flex;
    justify-content: space-between;
`
export const TokenSelectionStyled = styled.div`
    display: flex;
    align-items: center;
    gap:10px;
`

const CoinContainerStyled = styled.div`
    width: 27rem;
    height: 3.5rem;
    background-color: white;
    box-sizing: border-box;
    border:1px solid black;
    border-radius: 20px;
    padding:10px;
    display: flex;
    gap:10px;
    align-items: center;
`
const ContainerSwapStatics = styled.section`
    justify-self: start;
    box-sizing: border-box;
    width: 28.2rem;
    height: 10rem;
    padding:2rem;
    border:1px solid black;
    border-radius: 20px;
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap:10px;
    z-index: 2;
`
export const NewTokenDetailSelectStyled = styled.section`
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto auto auto;
`
export const NewTokenDetailItems1Styled = styled.section`
    grid-column: 1/2;
    grid-row: 1/2;
    justify-self: center;
`
export const NewTokenDetailItems2Styled = styled.img`
    grid-column: 1/2;
    grid-row: 2/3;
    align-self: center;
`
export const NewTokenDetailItems3Styled = styled.section`
    grid-column: 1/2;
    grid-row: 3/4;
    justify-self: center;
`
export const NewTokenDetailItems4Styled = styled.section`
    grid-column: 2/3;
    grid-row: 2/3;
    justify-self: center;
`

export const NewTokenDetailActionsStyled = styled.section`
    width: 100%;
    display: grid;
    grid-template-rows: auto 1fr;
`
export const NewBalanceSpace = styled.section`
    justify-self:end;
`

export const NewSwapContainer = styled.section`
    background-color:white;
    box-sizing: border-box; 
    justify-self: center;
    height: 8rem;
    padding: 1rem;
    border:1px solid black;
    border-radius: 20px;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 10px;
`

const Container = styled.main`
    box-sizing: border-box;
    justify-self:center;
    box-sizing: border-box;
    width: 100%;
    gap:10px;
    color:black;
    display: grid;
    grid-template-columns: auto auto;
    padding: 10px;
`

export default SwapNewModule