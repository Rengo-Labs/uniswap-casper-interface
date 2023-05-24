import React, {useEffect, useState} from 'react';
import {Token} from '../../../commons';
import isCSPRValid from '../../../hooks/isCSPRValid';
import {CoinCard, ExchangeRates, Button, CreatePoolDialog} from 'rengo-ui-kit'
import BigNumber from 'bignumber.js';
import arrowIcon from '../../../assets/newDesignIcons/chevron-down.svg'
import {PairState} from "../../../reducers/PairsReducer";
import {TokenState} from "../../../reducers/TokenReducers";

enum tokenType {
  tokenA = 'tokenA',
  tokenB = 'tokenB',
}

interface LiquiditySwapperProps {
  onIncreaseAllow,
  onConnectWallet,
  isConnected,
  getProgress,
  refresh,
  calculateUSDtokens,
  pairState: PairState,
  firstTokenSelected,
  secondTokenSelected,
  onSelectFirstToken,
  onSelectSecondToken,
  tokenState: TokenState,
  onSwitchTokens,
  onActionConfirm,
  filterPopupTokens,
  updateDetail,
  gasPriceSelectedForLiquidity,
  amountSwapTokenA,
  amountSwapTokenASetter,
  amountSwapTokenB,
  amountSwapTokenBSetter,
  isProcessingTransaction
  clearProgress,
  valueAUSD,
  valueBUSD,
  setValueAUSD,
  setValueBUSD
}

const LiquiditySwapper = ({
                            onIncreaseAllow,
                            onConnectWallet,
                            isConnected,
                            getProgress,
                            refresh,
                            calculateUSDtokens,
                            pairState,
                            firstTokenSelected,
                            secondTokenSelected,
                            onSelectFirstToken,
                            onSelectSecondToken,
                            tokenState,
                            onSwitchTokens,
                            onActionConfirm,
                            filterPopupTokens,
                            updateDetail,
                            gasPriceSelectedForLiquidity,
                            amountSwapTokenA,
                            amountSwapTokenASetter,
                            amountSwapTokenB,
                            amountSwapTokenBSetter,
                            isProcessingTransaction,
                            clearProgress,
                            valueAUSD,
                            valueBUSD,
                            setValueAUSD,
                            setValueBUSD
                          }: LiquiditySwapperProps) => {

  const [openPoolDialog, setOpenPoolDialog] = useState({firstSelector: true, open: false})

  const [excludedA, setExcludedA] = useState<string[]>([
    secondTokenSelected.symbolPair,
  ]);
  const [excludedB, setExcludedB] = useState<string[]>([
    firstTokenSelected.symbolPair,
  ]);

  const [exchangeRateA, exchangeRateASetter] = useState<any>(0);
  const [exchangeRateB, exchangeRateBSetter] = useState<any>(0);

  const [lastChanged, setLastChanged] = useState('');
  const [currentValue, setCurrentValue] = useState<number>(0)
  const [gasFee, gasFeeSetter] = useState<number>(gasPriceSelectedForLiquidity)

  const {
    disableButton: disableButtonValid,
    setDisableButton,
    handleValidate,
    showNotification,
    dismissNotification,
  } = isCSPRValid();

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

  function onSwitchTokensHandler() {
    onSwitchTokens()

    exchangeRateASetter(exchangeRateB)
    exchangeRateBSetter(exchangeRateA)
    amountSwapTokenASetter(amountSwapTokenB)
    amountSwapTokenBSetter(amountSwapTokenA)

    setValueAUSD(valueBUSD)
    setValueBUSD(valueAUSD)

    setExcludedA(excludedB)
    setExcludedB(excludedA)
  }

  async function requestIncreaseAllowance(amount, contractHash, decimals, optApproval="") {
    await onIncreaseAllow(amount, contractHash, decimals, optApproval)
    await updateDetail(firstTokenSelected, secondTokenSelected)
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
    const {tokensToTransfer, exchangeRateA, exchangeRateB} = await updateDetail(
      firstTokenSelected,
      secondTokenSelected,
      filteredValue,
      firstTokenSelected
    );

    calculateUSDValues(filteredValue, tokensToTransfer, true)
    setUSDByTokens(exchangeRateA, exchangeRateB, true)

    amountSwapTokenBSetter(tokensToTransfer);
    handleValidate(
      parseFloat(tokensToTransfer),
      parseFloat(secondTokenSelected.amount),
      gasFee || 0,
      secondTokenSelected.symbol
    )
  }

  const handleChangeA = (value) => {
    setCurrentValue(value)
    handleValidate(
      parseFloat(value),
      parseFloat(firstTokenSelected.amount),
      gasFee || 0
    )
    changeTokenA(value);
  };

  const setUSDByTokens = (rateA, rateB, value) => {
    if (value) {
      exchangeRateASetter(rateA)
      exchangeRateBSetter(rateB)
    } else {
      exchangeRateASetter(rateB);
      exchangeRateBSetter(rateA);
    }
  }

  async function changeTokenB(value: string) {
    let filteredValue = parseFloat(value);
    if (isNaN(filteredValue)) {
      filteredValue = 0;
    } else if (filteredValue < 0) {
      filteredValue = Math.abs(filteredValue);
    }

    setLastChanged('B');

    amountSwapTokenBSetter(filteredValue);
    const {tokensToTransfer, exchangeRateA, exchangeRateB} = await updateDetail(
      firstTokenSelected,
      secondTokenSelected,
      filteredValue,
      secondTokenSelected
    );
    amountSwapTokenASetter(tokensToTransfer);
    calculateUSDValues(filteredValue, tokensToTransfer, true)
    setUSDByTokens(exchangeRateA, exchangeRateB, true)

    handleValidate(
      parseFloat(tokensToTransfer),
      parseFloat(firstTokenSelected.amount),
      gasFee || 0,
      firstTokenSelected.symbol
    )
  }

  const handleChangeB = async (value) => {
    changeTokenB(value);
    const {tokensToTransfer} = await updateDetail(
      firstTokenSelected,
      secondTokenSelected,
      parseFloat(value),
      secondTokenSelected
    );
    handleValidate(
      parseFloat(tokensToTransfer),
      parseFloat(firstTokenSelected.amount),
      gasFee || 0
    );
  };

  const selectAndCloseToken = async (token: Token) => {
    openPoolDialog.firstSelector ? selectAndCloseTokenA(token) : selectAndCloseTokenB(token)
    setOpenPoolDialog(prevState => ({...prevState, open: false}))
  }

  async function selectAndCloseTokenA(token: Token): Promise<void> {
    if (token.symbol === secondTokenSelected.symbol) {
      return;
    }

    onSelectFirstToken(token)

    const {tokensToTransfer} = await updateDetail(
      token,
      secondTokenSelected,
      amountSwapTokenA,
      token
    )
    amountSwapTokenBSetter(tokensToTransfer);
  }

  async function selectAndCloseTokenB(token: Token): Promise<void> {
    if (token.symbol === firstTokenSelected.symbol) {
      return;
    }

    onSelectSecondToken(token)

    const {tokensToTransfer} = await updateDetail(
      firstTokenSelected,
      token,
      amountSwapTokenB,
      token
    )
    amountSwapTokenASetter(tokensToTransfer)
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

  const refreshPrices = async () => {
    await refresh()
    await changeTokenA(amountSwapTokenA)
  }

  const calculateUSDValues = (amountA, amountB, isAorB) => {
    const [usdA, usdB] = calculateUSDtokens(
      firstTokenSelected.symbolPair,
      secondTokenSelected.symbolPair,
      amountA,
      amountB,
      isAorB
    );

    setValueAUSD(isNaN(parseFloat(usdA)) ? '0.00' : usdA);
    setValueBUSD(isNaN(parseFloat(usdB)) ? '0.00' : usdB);
  }

  return (
    <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
      <CoinCard title='From'
                startIcon={firstTokenSelected.logoURI}
                endIcon={arrowIcon}
                value={amountA}
                placeholder={''}
                onChangeToken={() => setOpenPoolDialog(prevState => ({...prevState, firstSelector: true, open: true}))}
                onChangeValue={handleChangeA}
                tokenName={firstTokenSelected.symbol}
                tokenBalance={firstTokenSelected.amount}
                tokenPrice={valueAUSD}
                iconSize='36px'
      />


      <ExchangeRates exchangeRateA={exchangeRateA}
                     tokenASymbol={firstTokenSelected.symbol}
                     exchangeRateB={exchangeRateB}
                     tokenBSymbol={secondTokenSelected.symbol}
                     handleClickSwap={() => onSwitchTokensHandler()}
                     strokeWidth={12}
                     clearProgress={() => clearProgress()}
                     getProgress={() => getProgress}
                     handlerButtonCircle={() => refreshPrices()}/>

      <CoinCard title='To'
                startIcon={secondTokenSelected.logoURI}
                endIcon={arrowIcon}
                value={amountB}
                placeholder={''}
                onChangeToken={() => setOpenPoolDialog(prevState => ({...prevState, firstSelector: false, open: true}))}
                onChangeValue={handleChangeB}
                tokenName={secondTokenSelected.symbol}
                tokenBalance={secondTokenSelected.amount}
                tokenPrice={valueBUSD}
                iconSize='36px'
      />
      <div style={{display: "flex", justifyContent: "right", gap: "10px"}}>
        {!isConnected && (
          <Button type={"large"} props={{style: {width: 'auto'}, onClick: () => onConnectWallet()}}>Connect Wallet</Button>
        )}

        {!isApprovedA && isConnected && (
          <Button type={"large"} props={{disabled: disableButton(amountSwapTokenA, amountSwapTokenB),
            style: {width: 'auto', flex: !isApprovedA && !isApprovedB ? "1": "" }, onClick: async () => {
              await requestIncreaseAllowance(
                Math.abs(freeAllowanceA),
                firstTokenSelected.contractHash,
                firstTokenSelected.decimals,
                firstTokenSelected.optApproval
              );
            }}}>Approve {Math.abs(freeAllowanceA)} {firstTokenSelected.symbol}</Button>
        )}
        {!isApprovedB && isConnected && (
          <Button type={"large"} props={{disabled: disableButton(amountSwapTokenA, amountSwapTokenB),
            style: {width: 'auto', flex: !isApprovedA && !isApprovedB ? "1": ""}, onClick: async () => {
              await requestIncreaseAllowance(
                Math.abs(freeAllowanceB),
                secondTokenSelected.contractHash,
                secondTokenSelected.decimals,
                secondTokenSelected.optApproval
              );
            }}}>Approve {Math.abs(freeAllowanceB)} {secondTokenSelected.symbol}</Button>
        )}

        {isApprovedA && isApprovedB && isConnected && (
          <Button type={"large"} props={{disabled: disableButton(amountSwapTokenA, amountSwapTokenB) || isProcessingTransaction || disableButtonValid,
            style: {width: 'auto'}, onClick: () => onActionConfirm(amountSwapTokenA, amountSwapTokenB)}}>Add Liquidity</Button>
        )}
      </div>
      {openPoolDialog.open && (
        <CreatePoolDialog
          closeCallback={() => setOpenPoolDialog(prevState => ({...prevState, open: false}))}
          tokenListData={filterPopupTokens(!openPoolDialog.firstSelector ? firstTokenSelected.symbol : secondTokenSelected.symbol, pairState)}
          popularTokensData={filterPopupTokens(!openPoolDialog.firstSelector ? firstTokenSelected.symbol : secondTokenSelected.symbol, pairState)}
          onSelectToken={(name) => {
            selectAndCloseToken(tokenState.tokens[name])
          }}
          onSelectFavoriteToken={(name, value) => console.log("Is favorite", name, value)}
          isOpen={openPoolDialog.open}
        />
      )}
    </div>
  );
};

export default LiquiditySwapper;
