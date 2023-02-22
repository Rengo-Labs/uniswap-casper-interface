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
    onConnectWallet,
    onSelectFirstToken,
    onSelectSecondToken,
    onSwitchTokens,
    tokens,
    firstTokenSelected,
    secondTokenSelected,
    isConnected,
    onIncreaseAllow,
    pairState,
    gasPriceSelectedForSwapping,
    refreshAll,
    calculateUSDtokens,
    findReservesBySymbols,
  } = useContext(ConfigProviderContext);
  const { onConfirmSwapConfig, getSwapDetails } =
    useContext(SwapProviderContext);
  const { progressBar } = useContext(ProgressBarProviderContext);

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

  const [lastChanged, setLastChanged] = useState('');
  const [valueAUSD, setValueAUSD] = useState('0.00');
  const [valueBUSD, setValueBUSD] = useState('0.00');

  const { slippageTolerance, updateSlippageTolerance } = globalStore();
  const [priceA, setPriceA] = useState('0.00');
  const [priceB, setPriceB] = useState('0.00');

  useEffect(() => {
    const t0 = searchParams.get('token0');
    const t1 = searchParams.get('token1');
    if (t0) {
      onSelectFirstToken(tokens[t0]);
      onSelectSecondToken(tokens[t1]);
    }

    updateSwapDetail(
      firstTokenSelected,
      secondTokenSelected,
      amountSwapTokenA,
      lastChanged == 'A' ? firstTokenSelected : secondTokenSelected
    );
  }, [isConnected, pairState]);

  useEffect(() => {
    progressBar(async () => {
      lastChanged == 'A'
        ? await changeTokenA(amountSwapTokenA)
        : await changeTokenB(amountSwapTokenB);
      await refreshAll();
    });
  }, [amountSwapTokenA, amountSwapTokenB, isConnected]);

  async function onConnect() {
    onConnectWallet();
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
    await onConfirmSwapConfig(
      amountSwapTokenA,
      amountSwapTokenB,
      slippageTolerance,
      gasFee
    );
    resetAll();
  }

  async function updateSwapDetail(
    tokenA: Token,
    tokenB: Token,
    value = amountSwapTokenA,
    token = firstTokenSelected
  ) {
    const { reserve0, reserve1 } = findReservesBySymbols(
      tokenA.symbol,
      tokenB.symbol
    );

    const getSwapDetailResponse = await getSwapDetails(
      tokenA,
      tokenB,
      reserve0,
      reserve1,
      value,
      token,
      slippageTolerance,
      feeToPay
    );

    const { tokensToTransfer, priceImpact, exchangeRateA, exchangeRateB } =
      getSwapDetailResponse;

    priceImpactSetter(priceImpact);
    exchangeRateASetter(exchangeRateA);
    exchangeRateBSetter(exchangeRateB);

    defaultPriceImpactLabelSetter(
      parseFloat(priceImpact as any) > 1
        ? 'Price Impact Warning'
        : 'Low Price Impact'
    );

    calculateUSDValues(value, tokensToTransfer);
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

  async function changeTokenA(value: string | number) {
    let filteredValue = formatNaN(value);
    if (filteredValue < 0) {
      filteredValue = Math.abs(filteredValue);
    }

    setLastChanged('A');

    amountSwapTokenASetter(filteredValue);

    const minTokenToReceive = await updateSwapDetail(
      firstTokenSelected,
      secondTokenSelected,
      filteredValue,
      firstTokenSelected
    );

    amountSwapTokenBSetter(formatNaN(minTokenToReceive));
  }
  
  const handleChange = (e) => {
    setCurrentValue(e.target.value);
    handleValidate(
      parseFloat(e.target.value),
      parseFloat(firstTokenSelected.amount),
      gasFee || 0
    );
    changeTokenA(e.target.value);
  };

  async function changeTokenB(value) {
    let filteredValue = parseFloat(value);
    if (isNaN(filteredValue)) {
      filteredValue = 0;
    } else if (filteredValue < 0) {
      filteredValue = Math.abs(filteredValue);
    }

    setLastChanged('B');

    amountSwapTokenBSetter(filteredValue);

    const minTokenToReceive = await updateSwapDetail(
      firstTokenSelected,
      secondTokenSelected,
      filteredValue,
      secondTokenSelected
    );
    amountSwapTokenASetter(formatNaN(minTokenToReceive));
  }

  const handleChangeB = async (e) => {
    changeTokenB(e.target.value);
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
      } else {
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
    console.log('refreshPrices', amountSwapTokenA);
    await refreshAll();
    await changeTokenA(amountSwapTokenA);
  };

  const calculateUSDValues = (amountA: string | number, amountB: string | number) => {
    const [usdA, usdB] = calculateUSDtokens(
      firstTokenSelected.symbolPair,
      secondTokenSelected.symbolPair,
      amountA,
      amountB
    );
  
    const _usdA = isNaN(parseFloat(usdA)) ? "0.00" : usdA;
    const _usdB = isNaN(parseFloat(usdB)) ? "0.00" : usdB;

    setValueAUSD(_usdA);
    setValueBUSD(_usdB);
    
    setPriceA((parseFloat(_usdA) * formatNaN(exchangeRateA)).toFixed(2));
    setPriceB((parseFloat(_usdB) * formatNaN(exchangeRateB)).toFixed(2));
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
                        tokens={tokens}
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
                  handleClick={() => searchModalASetter(true)}
                >
                  to
                </NewTokenDetailItems1NSM>
                <NewTokenDetailItems2NSM
                  src={secondTokenSelected.logoURI}
                  handleClick={() => searchModalASetter(true)}
                />
                <NewTokenDetailItems3NSM
                  handleClick={() => searchModalASetter(true)}
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
                        tokens={tokens}
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
          {amountSwapTokenB > 0 && (
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
            />
          )}
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
                  amountSwapTokenA > parseFloat(firstTokenSelected.amount)
                }
                handler={async () => {
                  await onConfirmSwap();
                }}
              />
            )}
          </ButtonSpaceNSM>
        </ContainerSwapActionsNSM>
      </ContainerInnerNSM>
      <SwapStatistics
        token0Price={priceA}
        token1Price={priceB}
        token0Per={0}
        token1Per={0}
      />
    </Wrapper>
  );
};

export default SwapNewModule;
