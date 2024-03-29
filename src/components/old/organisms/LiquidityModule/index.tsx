import BigNumber from 'bignumber.js';

import React, { useContext, useEffect, useState } from 'react';
import { ConfigProviderContext } from '../../../../contexts/ConfigContext';
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
  ContainerSwapActionsNSM,
  ExchangeRateBox,
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
  FlechaIcon,
  TrashIcon,
} from '../../atoms';
import SwitchSwap from '../../atoms/SwitchSwap';
import { LPDetail } from '../../molecules';
import FloatMenu from '../FloatMenu';
import { useSearchParams } from 'react-router-dom';
import { LiquidityItem } from '../../molecules/LiquidityItem';
import { CircleButton } from '../../molecules/POCTBody/styles';

import {PairsContextProvider} from "../../../../contexts/PairsContext";
import {StateHashProviderContext} from "../../../../contexts/StateHashContext";
import {TokensProviderContext} from "../../../../contexts/TokensContext";
import {WalletProviderContext} from "../../../../contexts/WalletContext";
import { convertAllFormatsToUIFixedString, Token } from '../../../../commons';
import { BalanceInput } from '../../atoms/BalanceInputNSM';
import { ContainerLiquidityNSM } from '../../atoms/ContainerLiquidityNSM';
import { ContainerLiquidityPoolList } from '../../atoms/ContainerLiquidityPoolList';
import { UpdatableCircle } from '../../atoms/UpdatableCircle';
import { ProgressBarProviderContext } from '../../../../contexts/ProgressBarContext';
import { LiquidityRemovingWithInputRangeModule } from '../LiquidityRemovingWithInputRangeModule';
import { LiquidityProviderContext } from '../../../../contexts/LiquidityContext';
import { globalStore } from '../../../../store/store';
import isCSPRValid from '../../../../hooks/isCSPRValid';

enum tokenType {
  tokenA = 'tokenA',
  tokenB = 'tokenB',
}

const LiquidityNewModule = () => {
  const {
    onIncreaseAllow,
    gasPriceSelectedForLiquidity,
  } = useContext(ConfigProviderContext);

  const {
    onConnectWallet,
    isConnected,
  } = useContext(WalletProviderContext);

  const {
    isRemovingPopupOpen,
    setRemovingPopup,
    onAddLiquidity,
    getLiquidityDetails,
  } = useContext(LiquidityProviderContext)

  const {pairState, calculateUSDtokens, getPoolList, findReservesBySymbols} = useContext(PairsContextProvider)
  const {refresh} = useContext(StateHashProviderContext)
  const { progressBar } = useContext(ProgressBarProviderContext)
  const {tokenState, onSwitchTokens, onSelectFirstToken, onSelectSecondToken, firstTokenSelected, secondTokenSelected} = useContext(TokensProviderContext)
  const userPairData = Object.values(pairState)

  const [amountSwapTokenA, amountSwapTokenASetter] = useState<any>(0);
  const [amountSwapTokenB, amountSwapTokenBSetter] = useState<any>(0);
  const [excludedA, setExcludedA] = useState<string[]>([
    secondTokenSelected.symbolPair,
  ]);
  const [excludedB, setExcludedB] = useState<string[]>([
    firstTokenSelected.symbolPair,
  ]);
  const [feeToPay, feeToPaySetter] = useState<any>(0.03);
  const [exchangeRateA, exchangeRateASetter] = useState<any>(0);
  const [exchangeRateB, exchangeRateBSetter] = useState<any>(0);

  const [totalLiquidity, setTotalLiquidity] = useState('0');
  const [isOpenedRemoving, setOpenedRemoving] = useState(isRemovingPopupOpen);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentFReserve, setFirstReserve] = useState(0);
  const [currentSReserve, setSecondReserve] = useState(0);

  const [lastChanged, setLastChanged] = useState('');
  const [valueAUSD, setValueAUSD] = useState('0');
  const [valueBUSD, setValueBUSD] = useState('0');
  const [currentValue, setCurrentValue] = useState<number>(0);

  const [gasFee, gasFeeSetter] = useState<number>(gasPriceSelectedForLiquidity);
  const { slippageTolerance, updateSlippageTolerance } = globalStore();
  const [isProcessingTransaction, setIsProcessingTransaction] = useState(false);
  const {
    disableButton: disableButtonValid,
    setDisableButton,
    handleValidate,
    showNotification,
    dismissNotification,
  } = isCSPRValid();

  useEffect(() => {
    const t0 = searchParams.get('token0');
    const t1 = searchParams.get('token1');
    if (t0) {
      onSelectFirstToken(tokenState.tokens[t0])
      onSelectSecondToken(tokenState.tokens[t1])
    }

    if (isRemovingPopupOpen) {
      setOpenedRemoving(true);
      setRemovingPopup(false);
    }

    updateLiquidityDetail(
      firstTokenSelected,
      secondTokenSelected,
      amountSwapTokenA,
      lastChanged == 'A' ? firstTokenSelected : secondTokenSelected
    );
  }, [isConnected, pairState]);

  useEffect(() => {
    if (!isConnected) {
      // TODO - Investigate why we have the amountSwapTokenA or amountSwapTokenB with NAN value instead of zeros
      resetAll();
    }
    progressBar(async () => {
      //lastChanged == 'A' ? await changeTokenA(amountSwapTokenA) : await changeTokenB(amountSwapTokenB)
      await refresh()
    })
  }, [isConnected]);

  useEffect(() => {
    const fn = async () => {
      let tSymbol = '';
      const includes: Record<string, boolean> = {};
      const pairs = Object.values(pairState);
      const tokens = tokenState.tokens;
      for (const pair of pairs) {
        if (
          pair.token0Symbol === firstTokenSelected.symbol ||
          pair.token0Symbol === firstTokenSelected.symbolPair
        ) {
          includes[pair.token1Symbol] = true;
          if (!tSymbol) {
            tSymbol = pair.token1Symbol;
          }
        }
        if (
          pair.token1Symbol === firstTokenSelected.symbol ||
          pair.token1Symbol === firstTokenSelected.symbolPair
        ) {
          includes[pair.token0Symbol] = true;
          if (!tSymbol) {
            tSymbol = pair.token0Symbol;
          }
        }
      }

      if (includes['WCSPR']) {
        includes['CSPR'] = true;
      }

      if (tSymbol && !includes[secondTokenSelected.symbol]) {
        const symbol = tSymbol === 'WCSPR' ? 'CSPR' : tSymbol;
        selectAndCloseTokenA(firstTokenSelected);
        selectAndCloseTokenB(tokens[symbol]);
      } else {
        selectAndCloseTokenA(firstTokenSelected);
        selectAndCloseTokenB(secondTokenSelected);
      }
    };

    fn();
  }, []);

  const calculateUSDValues = (amountA, amountB, isAorB) => {
    const [usdA, usdB] = calculateUSDtokens(
      firstTokenSelected.priceUSD,
      secondTokenSelected.priceUSD,
      amountA,
      amountB,
      isAorB
    );

    setValueAUSD(isNaN(parseFloat(usdA)) ? '0.0000' : usdA);
    setValueBUSD(isNaN(parseFloat(usdB)) ? '0.0000' : usdB);
  };

  async function onConnect() {
    onConnectWallet();
  }

  function onSwitchTokensHandler() {
    onSwitchTokens()

    exchangeRateASetter(exchangeRateB)
    exchangeRateBSetter(exchangeRateA)
    amountSwapTokenASetter(amountSwapTokenB)
    amountSwapTokenBSetter(amountSwapTokenA)

    setFirstReserve(currentSReserve)
    setSecondReserve(currentFReserve)

    setValueAUSD(valueBUSD)
    setValueBUSD(valueAUSD)

    setExcludedA(excludedB)
    setExcludedB(excludedA)
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
  };

  function resetAll() {
    amountSwapTokenASetter(0);
    amountSwapTokenBSetter(0);
  }

  async function updateLiquidityDetail(
    tokenA,
    tokenB,
    value = amountSwapTokenA,
    token = firstTokenSelected
  ) {
    const { reserve0, reserve1 } = findReservesBySymbols(
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
      token,
      slippageTolerance,
      feeToPay
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

    exchangeRateASetter(exchangeRateA);
    exchangeRateBSetter(exchangeRateB);
    if (token === tokenA) {
      setFirstReserve(firstReserve);
      setSecondReserve(secondReserve);
    } else {
      setFirstReserve(secondReserve);
      setSecondReserve(firstReserve);
    }

    calculateUSDValues(value, tokensToTransfer, token === tokenA);
    return tokensToTransfer;
  }

  async function requestIncreaseAllowance(amount, contractHash) {
    setIsProcessingTransaction(true);
    await onIncreaseAllow(amount, contractHash);
    await updateLiquidityDetail(firstTokenSelected, secondTokenSelected);
    setIsProcessingTransaction(false);
  }

  async function changeTokenA(value: string) {
    let filteredValue = parseFloat(value);
    if (isNaN(filteredValue)) {
      filteredValue = 0;
    } else if (filteredValue < 0) {
      filteredValue = Math.abs(filteredValue);
    }

    setLastChanged('A');

    amountSwapTokenASetter(filteredValue);
    const minTokenToReceive = await updateLiquidityDetail(
      firstTokenSelected,
      secondTokenSelected,
      filteredValue,
      firstTokenSelected
    );
    amountSwapTokenBSetter(minTokenToReceive);

    const totalLP = calculateTotalLP(
      firstTokenSelected.symbolPair,
      secondTokenSelected.symbolPair
    );
    setTotalLiquidity(totalLP);
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

  async function changeTokenB(value: string) {
    let filteredValue = parseFloat(value);
    if (isNaN(filteredValue)) {
      filteredValue = 0;
    } else if (filteredValue < 0) {
      filteredValue = Math.abs(filteredValue);
    }

    setLastChanged('B');

    amountSwapTokenBSetter(filteredValue);
    const minTokenToReceive = await updateLiquidityDetail(
      firstTokenSelected,
      secondTokenSelected,
      filteredValue,
      secondTokenSelected
    );
    amountSwapTokenASetter(minTokenToReceive);

    const totalLP = calculateTotalLP(
      firstTokenSelected.symbolPair,
      secondTokenSelected.symbolPair
    );
    setTotalLiquidity(totalLP);
  }

  const handleChangeB = async (e) => {
    changeTokenB(e.target.value);
    const minTokenToReceive = await updateLiquidityDetail(
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
    handleValidate(
      currentValue,
      parseFloat(firstTokenSelected.amount),
      gasFeeValue
    );
  };

  const [searchModalA, searchModalASetter] = useState(false);
  async function selectAndCloseTokenA(token: Token): Promise<void> {
    if (token.symbol === secondTokenSelected.symbol) {
      return;
    }

    const includes: Record<string, boolean> = {};
    const pairs = Object.values(pairState);
    for (const pair of pairs) {
      if (
        pair.token0Symbol === token.symbol ||
        pair.token0Symbol === token.symbolPair
      ) {
        includes[pair.token1Symbol] = true;
      }
      if (
        pair.token1Symbol === token.symbol ||
        pair.token1Symbol === token.symbolPair
      ) {
        includes[pair.token0Symbol] = true;
      }
    }

    if (includes['WCSPR']) {
      includes['CSPR'] = true;
    }

    const tokens = Object.values(tokenState.tokens);
    const excludes = tokens.reduce((acc: string[], v: Token): string[] => {
      if (!includes[v.symbol]) {
        acc.push(v.symbol);
      }
      return acc;
    }, []);

    onSelectFirstToken(token)
    setExcludedB(excludes)
    searchModalASetter(false)

    const minTokenToReceive = await updateLiquidityDetail(
      token,
      secondTokenSelected,
      amountSwapTokenA,
      token
    );
    amountSwapTokenBSetter(minTokenToReceive);
  }

  const [searchModalB, searchModalBSetter] = useState(false);
  async function selectAndCloseTokenB(token: Token): Promise<void> {
    if (token.symbol === firstTokenSelected.symbol) {
      return;
    }

    const includes: Record<string, boolean> = {};
    const pairs = Object.values(pairState);
    for (const pair of pairs) {
      if (
        pair.token0Symbol === token.symbol ||
        pair.token0Symbol === token.symbolPair
      ) {
        includes[pair.token1Symbol] = true;
      }
      if (
        pair.token1Symbol === token.symbol ||
        pair.token1Symbol === token.symbolPair
      ) {
        includes[pair.token0Symbol] = true;
      }
    }

    if (includes['WCSPR']) {
      includes['CSPR'] = true;
    }

    const tokens = Object.values(tokenState.tokens);
    const excludes = tokens.reduce((acc: string[], v: Token): string[] => {
      if (!includes[v.symbol]) {
        acc.push(v.symbol);
      }
      return acc;
    }, []);

    // console.log('excludes', includes, excludes)

    onSelectSecondToken(token);
    setExcludedA(excludes);
    searchModalBSetter(false);

    const minTokenToReceive = await updateLiquidityDetail(
      firstTokenSelected,
      token,
      amountSwapTokenB,
      token
    );
    amountSwapTokenASetter(minTokenToReceive);
  }

  async function validateToken(amount, token) {
    if (token === tokenType.tokenA) {
      console.log('amount', amount)
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
      const minTokenToReceive = await updateLiquidityDetail(
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

  async function onLiquidity() {
    setIsProcessingTransaction(true);
    const pair = pairState[`${firstTokenSelected.symbolPair}-${secondTokenSelected.symbolPair}`] ?? pairState[`${firstTokenSelected.symbolPair}-${secondTokenSelected.symbolPair}`]
    await onAddLiquidity(
      amountSwapTokenA,
      amountSwapTokenB,
      slippageTolerance,
      gasFee,
      pair.packageHash
    );
    setIsProcessingTransaction(false);
    resetAll();
  }

  const disableButton = (amount0, amount1) => {
    if (isNaN(amount0)) {
      return true;
    }
    if (isNaN(amount1)) {
      return true;
    }
    if (!isConnected) {
      return true;
    }
    if (
      parseFloat(amount0) <= 0 ||
      parseFloat(amount0) > parseFloat(firstTokenSelected.amount.toString())
    ) {
      return true;
    }
    if (
      parseFloat(amount1) <= 0 ||
      parseFloat(amount1) > parseFloat(secondTokenSelected.amount.toString())
    ) {
      return true;
    }
  };

  const amountA = isNaN(amountSwapTokenA) ? 0 : amountSwapTokenA;
  const amountB = isNaN(amountSwapTokenB) ? 0 : amountSwapTokenB;
  const freeAllowanceA = new BigNumber(firstTokenSelected.allowance || 0)
    .minus(new BigNumber(amountA || 0))
    .toNumber();

  const isApprovedA =
    firstTokenSelected.symbol === 'CSPR' ||
    (firstTokenSelected.symbol !== 'CSPR' && freeAllowanceA >= 0);

  const freeAllowanceB = new BigNumber(secondTokenSelected.allowance || 0)
    .minus(new BigNumber(amountB || 0))
    .toNumber();

  const isApprovedB =
    secondTokenSelected.symbol === 'CSPR' ||
    (secondTokenSelected.symbol !== 'CSPR' && freeAllowanceB >= 0);

  const userPairDataNonZero = userPairData.filter(
    (v) => parseFloat(v.balance) > 0
  );

  const refreshPrices = async () => {
    await refresh()
    await changeTokenA(amountSwapTokenA)
  }

  return (
    <ContainerLiquidityNSM>
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
                      excludedSymbols={excludedA}
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
        {/*TODO: we need create another component with this background <NewSwapContainerNSM style={{backgroundColor: "white"}}>*/}
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
                      excludedSymbols={excludedB}
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
                {firstTokenSelected.amount
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
                    <BalanceInput
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
        {exchangeRateA && exchangeRateB ? (
          <LPDetail
            firstSymbolToken={firstTokenSelected.symbol}
            secondSymbolToken={secondTokenSelected.symbol}
            secondTokenAmount={amountSwapTokenB}
            liquidity={parseFloat(totalLiquidity)}
            firstReserve={currentFReserve / 10 ** firstTokenSelected.decimals}
            secondReserve={currentSReserve / 10 ** secondTokenSelected.decimals}
            gasFee={gasFee}
            gasFeeSetter={handleChangeGasFee}
            gasFeeEnabled={true}
            slippage={slippageTolerance}
            slippageEnabled={true}
            slippageSetter={updateSlippageTolerance}
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
          {!isApprovedA && isConnected && (
            <NewSwapButtonWidth100
              disabled={
                disableButton(amountSwapTokenA, amountSwapTokenB) ||
                disableButtonValid
              }
              content={`Approve ${-freeAllowanceA} ${
                firstTokenSelected.symbol
              }`}
              handler={async () => {
                await requestIncreaseAllowance(
                  -freeAllowanceA,
                  firstTokenSelected.contractHash
                );
              }}
            />
          )}
          {!isApprovedB && isConnected && (
            <NewSwapButtonWidth100
              disabled={
                disableButton(amountSwapTokenA, amountSwapTokenB) ||
                disableButtonValid
              }
              content={`Approve ${-freeAllowanceB} ${
                secondTokenSelected.symbol
              }`}
              handler={async () => {
                await requestIncreaseAllowance(
                  -freeAllowanceB,
                  secondTokenSelected.contractHash
                );
              }}
            />
          )}
          {isApprovedA && isApprovedB && isConnected && (
            <NewSwapButtonWidth100
              disabled={
                disableButton(amountSwapTokenA, amountSwapTokenB) ||
                isProcessingTransaction ||
                disableButtonValid
              }
              content='Add Liquidity'
              handler={async () => {
                await onLiquidity();
              }}
            />
          )}
        </ButtonSpaceNSM>
      </ContainerSwapActionsNSM>
      {isConnected && userPairDataNonZero.length > 0 && (
        <ContainerLiquidityPoolList>
          {
            // Loop over the table rows
            userPairDataNonZero.map((row) => {
              const openPopup =
                isOpenedRemoving &&
                row.token0Symbol === firstTokenSelected.symbolPair &&
                row.token1Symbol === secondTokenSelected.symbolPair;
              return (
                // Apply the row props
                <LiquidityItem
                  key={`${row.token0Symbol}-${row.token1Symbol}`}
                  fullExpanded={openPopup}
                  firstIcon={row.token0Icon}
                  firstSymbol={row.token0Symbol}
                  firstLiquidity={new BigNumber(row.reserve0).toFixed(
                    row.decimals
                  )}
                  secondIcon={row.token1Icon}
                  secondSymbol={row.token1Symbol}
                  secondLiquidity={new BigNumber(row.reserve1).toFixed(
                    row.decimals
                  )}
                  liquidity={row.balance}
                  perLiquidity={new BigNumber(row.balance)
                    .div(row.totalSupply)
                    .times(100)
                    .toFixed(2)}
                >
                  <LiquidityRemovingWithInputRangeModule
                    isConnected={true}
                    openedPopup={openPopup}
                    firstName={row.token0Name}
                    firstHash={row.contract0}
                    firstSymbol={row.token0Symbol}
                    firstLiquidity={row.reserve0}
                    firstPrice={row.token0Price}
                    secondName={row.token1Name}
                    secondHash={row.contract1}
                    secondSymbol={row.token1Symbol}
                    secondLiquidity={row.reserve1}
                    secondPrice={row.token1Price}
                    contractHash={row.contractHash}
                    packageHash={row.packageHash}
                    liquidity={row.balance}
                    allowance={row.allowance}
                    firstIcon={row.token0Icon}
                    secondIcon={row.token1Icon}
                    decimals={row.decimals}
                  >
                    <CircleButton>
                      <TrashIcon />
                    </CircleButton>
                  </LiquidityRemovingWithInputRangeModule>
                </LiquidityItem>
              );
            })
          }
        </ContainerLiquidityPoolList>
      )}
    </ContainerLiquidityNSM>
  );
};

export default LiquidityNewModule;
