import React, { useContext, useEffect, useState } from 'react';
import { ConfigProviderContext } from '../../../contexts/ConfigContext';

import { useSearchParams } from 'react-router-dom';

import {PairsContextProvider} from "../../../contexts/PairsContext";
import {StateHashProviderContext} from "../../../contexts/StateHashContext";
import {TokensProviderContext} from "../../../contexts/TokensContext";
import {WalletProviderContext} from "../../../contexts/WalletContext";
import {formatNaN, getListPath, Token} from '../../../commons';
import { ProgressBarProviderContext } from '../../../contexts/ProgressBarContext';
import { LiquidityProviderContext } from '../../../contexts/LiquidityContext';
import { globalStore } from '../../../store/store';
import isCSPRValid from '../../../hooks/isCSPRValid';
import {CoinCard, ExchangeRates, Button} from 'rengo-ui-kit'
import arrowIcon from '../../../assets/newIcons/flecha.svg'
import {SwapProviderContext} from "../../../contexts/SwapContext";

enum tokenType {
  tokenA = 'tokenA',
  tokenB = 'tokenB',
}

const TokenSwapper = () => {
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
    <div style={{display: "flex", flexDirection: "column", padding: "8px 32px 8px 32px", gap: "10px"}}>
    <CoinCard title='From'
              startIcon={firstTokenSelected.logoURI}
              endIcon={arrowIcon}
              value={amountSwapTokenA}
              placeholder={''}
              onChangeToken={() => console.log("")}
              onChangeValue={() => console.log("")}
              tokenName={firstTokenSelected.name}
              tokenBalance={firstTokenSelected.amount}
              tokenPrice={valueAUSD}
              iconSize='36px'
    />

    <ExchangeRates exchangeRateA={exchangeRateA}
                   tokenASymbol={firstTokenSelected.symbol}
                   exchangeRateB={exchangeRateB}
                   tokenBSymbol={secondTokenSelected.symbol}
                   handleClickSwap={() => console.log("")}
                   strokeWidth={2}
                   clearProgress={() => console.log("")}
                   getProgress={() => 40}
                   handlerButtonCircle={() => refreshPrices()}/>

    <CoinCard title='To'
              startIcon={secondTokenSelected.logoURI}
              endIcon={arrowIcon}
              value={amountSwapTokenB}
              placeholder={''}
              onChangeToken={() => console.log("")}
              onChangeValue={() => console.log("")}
              tokenName={secondTokenSelected.name}
              tokenBalance={secondTokenSelected.amount}
              tokenPrice={valueBUSD}
              iconSize='36px'
    />
    <div style={{display: "flex", justifyContent: "right"}}>
      {!isConnected && (
        <Button type={"large"} props={{style: {width: 'auto'}, onClick: () => console.log("Hola Mundo")}}>Connect Wallet</Button>
      )}
      {!isApproved && isConnected && (
        <Button type={"large"} props={{style: {width: 'auto'}, onClick: () => async () => {
            await requestIncreaseAllowance(
              -freeAllowance,
              firstTokenSelected.contractHash
            );
          }}}>`Approve ${-freeAllowance} ${firstTokenSelected.symbol}`</Button>
      )}
      {isApproved && isConnected && (
        <Button type={"large"} props={{style: {width: 'auto'}, onClick: () => console.log("Hola Mundo")}}>SWAP</Button>
      )}
    </div>
  </div>
  );
};

export default TokenSwapper;
