import BigNumber from 'bignumber.js';

import React, { useContext, useState, useEffect } from 'react';
import { ConfigProviderContext } from '../../../contexts/ConfigContext';
import {
  ActionContainerNSM,
  ArrowContainerNSM,
  BalanceInputContainerNSM,
  BalanceInputItem1NSM,
  BalanceInputItem2NSM,
  BalanceInputNSM,
  ButtonHalfMax,
  ButtonHalfMaxContainer,
  ButtonSpaceNSM,
  ContainerInnerNSM,
  ContainerSwapActionsNSM,
  ExchangeRateBox,
  FlechaIcon,
  IconPlaceNSM,
  NewBalanceSpaceNSM,
  NewSwapButtonWidth100,
  NewSwapContainerNSM,
  NewTokenDetailActionsNSM,
  NewTokenDetailItems1NSM,
  NewTokenDetailItems2NSM,
  NewTokenDetailItems3NSM,
  NewTokenDetailItems4NSM,
  NewTokenDetailSelectNSM,
  SwapDetailsNSM,
  TokenSelectionNSM,
  TokenSelectNSM,
} from '../../atoms';

import { SwapDetail, SwapStatistics } from '../../molecules';
import FloatMenu from '../FloatMenu';
import { useSearchParams } from 'react-router-dom';

import { convertAllFormatsToUIFixedString, formatNaN, Token } from '../../../commons';
import SwitchSwap from '../../atoms/SwitchSwap';
import { UpdatableCircle } from '../../atoms/UpdatableCircle';
import { ProgressBarProviderContext } from '../../../contexts/ProgressBarContext';
import styled from 'styled-components';
import { SwapProviderContext } from '../../../contexts/SwapContext';
import { globalStore } from '../../../store/store';
import isCSPRValid from '../../../hooks/isCSPRValid';
import {PairsContextProvider} from "../../../contexts/PairsContext";
import {StateHashProviderContext} from "../../../contexts/StateHashContext";
import {TokensProviderContext} from "../../../contexts/TokensContext";
import {WalletProviderContext} from "../../../contexts/WalletContext";
import {getListPath } from "../../../commons/calculations/pathFinder";

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: black;
`;

enum tokenType {
  tokenA = 'tokenA',
  tokenB = 'tokenB',
}

const SwapNewModule = () => {
  const {
    onIncreaseAllow,
    gasPriceSelectedForSwapping,
  } = useContext(ConfigProviderContext);

  const {
    onConnectWallet,
    isConnected,
  } = useContext(WalletProviderContext);
  const { onConfirmSwapConfig, getSwapDetails } =
    useContext(SwapProviderContext);
  const { progressBar } = useContext(ProgressBarProviderContext);
  const {calculateUSDtokens, pairState, findReservesBySymbols} = useContext(PairsContextProvider)
  const {refresh} = useContext(StateHashProviderContext)
  const {firstTokenSelected, secondTokenSelected, onSelectFirstToken, onSelectSecondToken, tokenState, onSwitchTokens} = useContext(TokensProviderContext)

  const [gasFee, gasFeeSetter] = useState<number>(gasPriceSelectedForSwapping);
  const [amountSwapTokenA, amountSwapTokenASetter] = useState<number>(0);
  const [amountSwapTokenB, amountSwapTokenBSetter] = useState<number>(0);
  const [priceImpact, priceImpactSetter] = useState<number | string>(0);
  const [feeToPay, feeToPaySetter] = useState<number>(0.03);
  const [exchangeRateA, exchangeRateASetter] = useState<number>(0);
  const [exchangeRateB, exchangeRateBSetter] = useState<number>(0);
  const [defaultPriceImpactLabel, defaultPriceImpactLabelSetter] =
    useState<string>('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentValue, setCurrentValue] = useState<number>(0);

  const { disableButton, setDisableButton, handleValidate, showNotification, dismissNotification } =
    isCSPRValid();

  const [lastChanged, setLastChanged] = useState('A');
  const [valueAUSD, setValueAUSD] = useState('0.00');
  const [valueBUSD, setValueBUSD] = useState('0.00');

  const { slippageTolerance, updateSlippageTolerance } = globalStore()
  const [priceA, setPriceA] = useState("0.00")
  const [priceB, setPriceB] = useState("0.00")
  const [isProcessingTransaction, setIsProcessingTransaction] = useState(false);
  const [pairPath, setPairPath] = useState([])

  useEffect(() => {
    const t0 = searchParams.get('token0');
    const t1 = searchParams.get('token1');
    if (t0) {
      onSelectFirstToken(tokenState.tokens[t0]);
      onSelectSecondToken(tokenState.tokens[t1]);
    }
  }, [isConnected, pairState]);

  useEffect(() => {
    progressBar(async () => {
      await refresh();
    });
  }, [amountSwapTokenA, amountSwapTokenB]);

  useEffect(() => {
    // prevent unnecesary switch
    if (lastChanged === 'A') {
      return
    }

    const switchToken = async () => {
      lastChanged == 'A'
          ? await changeTokenA(amountSwapTokenB)
          : await changeTokenB(amountSwapTokenA);
    }

    switchToken().catch((e) => console.log(e));

  }, [firstTokenSelected]);

  async function onConnect() {
    await onConnectWallet();
  }

  function onSwitchTokensHandler() {
    onSwitchTokens();
    if (lastChanged == 'A') {
      changeTokenB(amountSwapTokenA.toString());
      setLastChanged('B');
    } else if (lastChanged == 'B') {
      changeTokenA(amountSwapTokenB.toString());
      setLastChanged('A');
    }
  }

  function resetAll() {
    amountSwapTokenASetter(0);
    amountSwapTokenBSetter(0);
  }

  async function onConfirmSwap() {
    setIsProcessingTransaction(true);
    await onConfirmSwapConfig(
      amountSwapTokenA,
      amountSwapTokenB,
      slippageTolerance,
      gasFee
    );

    if(onwaiting) {
      setIsProcessingTransaction(false);
    }

    resetAll();
  }
  const calculateSwapDetailResponse = async (tokenA: Token, tokenB: Token, value: number, token: Token) => {
    const isAorB = tokenA.symbol === token.symbol
    const [param, param1] = isAorB ? [tokenA.symbol, tokenB.symbol] : [tokenB.symbol, tokenA.symbol]
    const listPath = getListPath(param, param1, Object.values(tokenState.tokens), Object.values(pairState))
    const pairExist = listPath.length == 0

    let getSwapDetailResponse = null;
    let nextTokensToTransfer = value
    gasFeeSetter(gasPriceSelectedForSwapping)

    if(pairExist) {
      const { reserve0, reserve1 } = findReservesBySymbols(
          tokenA.symbol,
          tokenB.symbol,
          tokenState
      );
      getSwapDetailResponse = await getSwapDetails(
          tokenA,
          tokenB,
          reserve0,
          reserve1,
          value,
          token,
          slippageTolerance,
          feeToPay
      );
      setPairPath([tokenA.symbol, tokenB.symbol])
    } else {
      const pairListPaths = listPath
      let priceImpactAcm: any = 0
      const pairPath = []
      for (const pair of pairListPaths) {
        const {symbol0, symbol1} = pair
        const {reserve0, reserve1} = findReservesBySymbols(
            symbol0,
            symbol1,
            tokenState
        );
        getSwapDetailResponse = await getSwapDetails(
            {symbol: symbol0} as any,
            {symbol: symbol1} as any,
            reserve0,
            reserve1,
            nextTokensToTransfer,
            {symbol: symbol0} as any,
            slippageTolerance,
            feeToPay
        );

        const {tokensToTransfer, priceImpact} = getSwapDetailResponse;
        priceImpact !== '<0.01'? priceImpactAcm += parseFloat(priceImpact.toString()) : priceImpactAcm = priceImpact
        getSwapDetailResponse.priceImpact = isNaN(priceImpactAcm)? priceImpactAcm : priceImpactAcm.toFixed(2)
        nextTokensToTransfer = parseFloat(tokensToTransfer.toString())
        pairPath.push(symbol0, symbol1)
      }
      //base swap cost + listPath.length -1 * hop cost
      gasFeeSetter(gasPriceSelectedForSwapping + (listPath.length -1) * 30)
      setPairPath([...new Set(pairPath)])
    }

    return {
      getSwapDetailResponse,
    }
  }

  async function updateSwapDetail(
    tokenA: Token,
    tokenB: Token,
    value = amountSwapTokenA,
    token = firstTokenSelected
  ) {
    const { getSwapDetailResponse } = await calculateSwapDetailResponse(tokenA, tokenB, value, token)
    const { tokensToTransfer, priceImpact, exchangeRateA, exchangeRateB } =
        getSwapDetailResponse;
    const nextTokensToTransfer = tokensToTransfer;

    priceImpactSetter(priceImpact);
    exchangeRateASetter(exchangeRateA);
    exchangeRateBSetter(exchangeRateB);

    defaultPriceImpactLabelSetter(
      parseFloat(priceImpact as any) > 1
        ? 'Price Impact Warning'
        : 'Low Price Impact'
    );

    calculateUSDValues(value, tokensToTransfer, tokenA.symbolPair, tokenB.symbolPair, exchangeRateA, exchangeRateB, token.symbolPair);
    return tokensToTransfer;
  }

  async function requestIncreaseAllowance(amount, contractHash) {
    console.log('requestIncreaseAllowance');
    await onIncreaseAllow(amount, contractHash);
    await updateSwapDetail(
      firstTokenSelected,
      secondTokenSelected,
      amount,
      firstTokenSelected
    );
  }

  async function changeTokenA(value: string | number, first = firstTokenSelected, second = secondTokenSelected) {
    setLastChanged('A');

    let filteredValue = formatNaN(value);
    if (filteredValue < 0) {
      filteredValue = Math.abs(filteredValue);
    }

    amountSwapTokenASetter(filteredValue);

    const minTokenToReceive = await updateSwapDetail(
      firstTokenSelected,
      secondTokenSelected,
      filteredValue,
      firstTokenSelected
    );

    amountSwapTokenBSetter(formatNaN(minTokenToReceive));
  }

  async function changeTokenB(value) {
    setLastChanged('B');

    let filteredValue = parseFloat(value);
    if (isNaN(filteredValue)) {
      filteredValue = 0;
    } else if (filteredValue < 0) {
      filteredValue = Math.abs(filteredValue);
    }

    amountSwapTokenBSetter(filteredValue);

    const minTokenToReceive = await updateSwapDetail(
        firstTokenSelected,
        secondTokenSelected,
        filteredValue,
        secondTokenSelected
    );
    amountSwapTokenASetter(formatNaN(minTokenToReceive));
  }

  const handleChange = async (e) => {
    setCurrentValue(e.target.value);
    handleValidate(
      parseFloat(e.target.value),
      parseFloat(firstTokenSelected.amount),
      gasFee || 0
    );
    await changeTokenA(e.target.value);
  };
  const handleChangeB = async (e) => {
    await changeTokenB(e.target.value);
    const minTokenToReceive = await updateSwapDetail(
      firstTokenSelected,
      secondTokenSelected,
      parseFloat(e.target.value),
      secondTokenSelected
    );
    handleValidate(
      parseFloat(minTokenToReceive),
      parseFloat(firstTokenSelected.amount),
      gasFee || 0
    );
  };

  const handleChangeGasFee = (value) => {
    const gasFeeValue = value ? parseFloat(value) : 0;
    gasFeeSetter(value);
    handleValidate(currentValue, parseFloat(firstTokenSelected.amount), gasFeeValue);
  }

  const [searchModalA, searchModalASetter] = useState(false);
  async function selectAndCloseTokenA(token: Token): Promise<void> {
    if (token.symbol === secondTokenSelected.symbol) {
      return;
    }
    onSelectFirstToken(token);
    searchModalASetter(false);
    const minTokenToReceive = await updateSwapDetail(
      token,
      secondTokenSelected,
      amountSwapTokenA,
      token
    );
    amountSwapTokenBSetter(formatNaN(minTokenToReceive));
  }

  const [searchModalB, searchModalBSetter] = useState(false);
  async function selectAndCloseTokenB(token: Token): Promise<void> {
    if (token.symbol === firstTokenSelected.symbol) {
      return;
    }
    onSelectSecondToken(token);
    searchModalBSetter(false);
    const minTokenToReceive = await updateSwapDetail(
      firstTokenSelected,
      token,
      amountSwapTokenB,
      token
    );
    amountSwapTokenASetter(formatNaN(minTokenToReceive));
  }

  async function validateToken(amount, token) {
    if (token === tokenType.tokenA) {
      if (parseFloat(firstTokenSelected.amount) > gasFee) {
        amount = parseFloat(firstTokenSelected.amount) - gasFee;
        setCurrentValue(amount);
        dismissNotification();
        setDisableButton(false);
      } else if(Number(amount) > 0){
        showNotification();
        setCurrentValue(amount);
      }
    } else if (token == tokenType.tokenB) {
      const minTokenToReceive = await updateSwapDetail(
        firstTokenSelected,
        secondTokenSelected,
        parseFloat(amount),
        secondTokenSelected
      );
      setCurrentValue(parseFloat(minTokenToReceive));
      if (
        parseFloat(minTokenToReceive) > 0 &&
        parseFloat(minTokenToReceive) >
        parseFloat(firstTokenSelected.amount) - gasFee
      ) {
        showNotification();
      }
    }
    return amount;
  }

  async function makeHalf(amount, setter, token) {
    amount = await validateToken(amount, token);
    setter(amount / 2);
  }
  async function makeMax(amount, setter, token) {
    amount = await validateToken(amount, token);
    setter(amount);
  }

  const freeAllowance = new BigNumber(firstTokenSelected.allowance || 0)
    .minus(new BigNumber(amountSwapTokenA))
    .toNumber();

  const isApproved =
    firstTokenSelected.symbol == 'CSPR' ||
    (firstTokenSelected.symbol != 'CSPR' && freeAllowance >= 0);

  const refreshPrices = async () => {
    await refresh()
  };

  const calculateUSDValues = (amountA: string | number, amountB: string | number, symbolA, symbolB, rateA, rateB, tokenSelected) => {
    const isA2B = symbolA == tokenSelected

    const [usdA, usdB] = calculateUSDtokens(
      symbolA,
      symbolB,
      amountA,
      amountB,
      isA2B
    );

    const _usdA = isNaN(parseFloat(usdA)) ? "0.00" : usdA;
    const _usdB = isNaN(parseFloat(usdB)) ? "0.00" : usdB;

    setValueAUSD(_usdA);
    setValueBUSD(_usdB);

    setPriceA((parseFloat(_usdA) * formatNaN(rateA)).toFixed(2));
    setPriceB((parseFloat(_usdB) * formatNaN(rateB)).toFixed(2));
  };

  return (
    <Wrapper>
      <ContainerInnerNSM>
        <ContainerSwapActionsNSM>
          <NewSwapContainerNSM>
            <TokenSelectNSM>
              <NewTokenDetailSelectNSM>
                <NewTokenDetailItems1NSM
                  handleClick={() => searchModalASetter(true)}
                >
                  from
                </NewTokenDetailItems1NSM>
                <NewTokenDetailItems2NSM
                  src={firstTokenSelected.logoURI}
                  handleClick={() => searchModalASetter(true)}
                />
                <NewTokenDetailItems3NSM
                  handleClick={() => searchModalASetter(true)}
                >
                  {firstTokenSelected.symbol}
                </NewTokenDetailItems3NSM>
                <NewTokenDetailItems4NSM>
                  <ArrowContainerNSM>
                    <FlechaIcon
                      onClick={() => {
                        searchModalASetter(true);
                      }}
                    />
                    {searchModalA && (
                      <FloatMenu
                        excludedSymbols={[secondTokenSelected.symbol]}
                        tokens={tokenState.tokens}
                        onSelectToken={selectAndCloseTokenA}
                        onClick={() => {
                          searchModalASetter(false);
                        }}
                      />
                    )}
                  </ArrowContainerNSM>
                </NewTokenDetailItems4NSM>
              </NewTokenDetailSelectNSM>
            </TokenSelectNSM>
            <TokenSelectionNSM>
              <NewTokenDetailActionsNSM>
                <NewBalanceSpaceNSM>
                  Balance:{' '}
                  {firstTokenSelected.amount
                    ? convertAllFormatsToUIFixedString(
                      firstTokenSelected.amount,
                      firstTokenSelected.decimals
                    )
                    : '--'}
                </NewBalanceSpaceNSM>
                <ActionContainerNSM>
                  <ButtonHalfMaxContainer>
                    <ButtonHalfMax
                      onClick={() => {
                        makeHalf(
                          firstTokenSelected.amount,
                          changeTokenA,
                          tokenType.tokenA
                        );
                      }}
                    >
                      Half
                    </ButtonHalfMax>
                    <ButtonHalfMax
                      onClick={() => {
                        makeMax(
                          firstTokenSelected.amount,
                          changeTokenA,
                          tokenType.tokenA
                        );
                      }}
                    >
                      Max
                    </ButtonHalfMax>
                  </ButtonHalfMaxContainer>
                  <BalanceInputContainerNSM>
                    <BalanceInputItem1NSM>
                      <BalanceInputNSM
                        min={0}
                        onChange={handleChange}
                        type='number'
                        name=''
                        id=''
                        value={amountSwapTokenA}
                      />
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
            <UpdatableCircle strokeWidth={12} handler={refreshPrices} />
          </IconPlaceNSM>
          <NewSwapContainerNSM>
            <TokenSelectNSM>
              <NewTokenDetailSelectNSM>
                <NewTokenDetailItems1NSM
                  handleClick={() => searchModalBSetter(true)}
                >
                  to
                </NewTokenDetailItems1NSM>
                <NewTokenDetailItems2NSM
                  src={secondTokenSelected.logoURI}
                  handleClick={() => searchModalBSetter(true)}
                />
                <NewTokenDetailItems3NSM
                  handleClick={() => searchModalBSetter(true)}
                >
                  {secondTokenSelected.symbol}
                </NewTokenDetailItems3NSM>
                <NewTokenDetailItems4NSM>
                  <ArrowContainerNSM>
                    <FlechaIcon
                      onClick={() => {
                        searchModalBSetter(true);
                      }}
                    />
                    {searchModalB && (
                      <FloatMenu
                        excludedSymbols={[firstTokenSelected.symbol]}
                        tokens={tokenState.tokens}
                        onSelectToken={selectAndCloseTokenB}
                        onClick={() => {
                          searchModalBSetter(false);
                        }}
                      />
                    )}
                  </ArrowContainerNSM>
                </NewTokenDetailItems4NSM>
              </NewTokenDetailSelectNSM>
            </TokenSelectNSM>
            <TokenSelectionNSM>
              <NewTokenDetailActionsNSM>
                <NewBalanceSpaceNSM>
                  Balance:{' '}
                  {secondTokenSelected.amount
                    ? convertAllFormatsToUIFixedString(
                      secondTokenSelected.amount,
                      firstTokenSelected.decimals
                    )
                    : '--'}
                </NewBalanceSpaceNSM>
                <ActionContainerNSM>
                  <ButtonHalfMaxContainer>
                    <ButtonHalfMax
                      onClick={() => {
                        makeHalf(
                          secondTokenSelected.amount,
                          changeTokenB,
                          tokenType.tokenB
                        );
                      }}
                    >
                      Half
                    </ButtonHalfMax>
                    <ButtonHalfMax
                      onClick={() => {
                        makeMax(
                          secondTokenSelected.amount,
                          changeTokenB,
                          tokenType.tokenB
                        );
                      }}
                    >
                      Max
                    </ButtonHalfMax>
                  </ButtonHalfMaxContainer>
                  <BalanceInputContainerNSM>
                    <BalanceInputItem1NSM>
                      <BalanceInputNSM
                        min={0}
                        onChange={handleChangeB}
                        type='number'
                        name=''
                        id=''
                        value={amountSwapTokenB}
                      />
                    </BalanceInputItem1NSM>
                    <BalanceInputItem2NSM>
                      <p>$ {valueBUSD}</p>
                    </BalanceInputItem2NSM>
                  </BalanceInputContainerNSM>
                </ActionContainerNSM>
              </NewTokenDetailActionsNSM>
            </TokenSelectionNSM>
          </NewSwapContainerNSM>
          {(exchangeRateA && exchangeRateB) ? (
            <SwapDetail
              firstSymbolToken={firstTokenSelected.symbol}
              firstTokenAmount={amountSwapTokenA}
              secondSymbolToken={secondTokenSelected.symbol}
              secondTokenAmount={amountSwapTokenB}
              priceImpactMessage={defaultPriceImpactLabel}
              priceImpact={priceImpact}
              gasFee={gasFee}
              gasFeeSetter={handleChangeGasFee}
              gasFeeEnabled={true}
              slippage={slippageTolerance}
              slippageEnabled={true}
              slippageSetter={updateSlippageTolerance}
              fullExpanded={false}
              pairPath={pairPath}
            />
          ) : null}
          <ButtonSpaceNSM>
            {!isConnected && (
              <NewSwapButtonWidth100
                content='Connect to Wallet'
                handler={async () => {
                  onConnect();
                }}
              />
            )}
            {!isApproved && isConnected && (
              <NewSwapButtonWidth100
                content={`Approve ${-freeAllowance} ${firstTokenSelected.symbol
                  }`}
                disabled={disableButton}
                handler={async () => {
                  await requestIncreaseAllowance(
                    -freeAllowance,
                    firstTokenSelected.contractHash
                  );
                }}
              />
            )}
            {isApproved && isConnected && (
              <NewSwapButtonWidth100
                content='Swap'
                disabled={
                  disableButton ||
                  amountSwapTokenA <= 0 ||
                  amountSwapTokenB <= 0 ||
                  amountSwapTokenA > parseFloat(firstTokenSelected.amount) ||
                  isProcessingTransaction ||
                  disableButton
                }
                handler={async () => {
                  await onConfirmSwap();
                }}
              />
            )}
          </ButtonSpaceNSM>
        </ContainerSwapActionsNSM>
      </ContainerInnerNSM>
      <SwapStatistics />
    </Wrapper>
  );
};

export default SwapNewModule;
