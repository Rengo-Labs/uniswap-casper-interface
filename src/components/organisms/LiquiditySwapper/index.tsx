import React, {useEffect, useMemo, useState} from 'react';
import {Token} from '../../../commons';
import isCSPRValid from '../../../hooks/isCSPRValid';
import {CoinCard, ExchangeRates, Button, CreatePoolDialog} from 'rengo-ui-kit'
import BigNumber from 'bignumber.js';
import arrowIcon from '../../../assets/newDesignIcons/chevron-down.svg'
import {PairState} from "../../../reducers/PairsReducer";
import {TokenState} from "../../../reducers/TokenReducers";
import { getLocalStorageData, setLocalStorageData } from '../../../commons/utils/persistData';

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

const DEFAULT_USD_TOKEN_VALUE = "0.00"
const LOCAL_STORAGE_KEY = 'token-list'
const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

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
  const [tokenToTransfer, setTokenToTransfers] = useState<any>(0)
  const [gasFee, gasFeeSetter] = useState<number>(gasPriceSelectedForLiquidity)
  const [tokenListData, setTokenListData] = useState<any[]>([]);
  const [initializeCalculation, setInitializeCalculation] = useState(false)

  const {
    disableButton: disableButtonValid,
    handleValidate,
    cleanValidationState
  } = isCSPRValid()

  const tokenListFromFilter = useMemo(() => {
    const symbol = !openPoolDialog.firstSelector ? firstTokenSelected.symbol : secondTokenSelected.symbol;
    return filterPopupTokens(symbol, pairState);
  }, [firstTokenSelected.symbol, secondTokenSelected.symbol, openPoolDialog.firstSelector, pairState]);

  useEffect(() => {
    const favoriteData: string[] = getLocalStorageData(LOCAL_STORAGE_KEY)
    const newTokenListData = tokenListFromFilter.map(token =>( {...token, isFavorite: favoriteData.includes(token.name) } ))
    
    setTokenListData(newTokenListData)
  }, [tokenListFromFilter])

  const sortedTokenListData = tokenListData.sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) {
      return -1;
    } else if (!a.isFavorite && b.isFavorite) {
      return 1;
    } else {
      return collator.compare(a.name, b.name);
    }
  });

  useEffect(() => {
    if (firstTokenSelected?.priceUSD ===  DEFAULT_USD_TOKEN_VALUE || initializeCalculation) {
      return
    }

    const filteredValue = 1
    const firstTokenOnMount = tokenState.tokens['CSPR']
    const secondTokenOnMount = tokenState.tokens['WETH']

    const handleExchangeCalculation = async () => {
      const {tokensToTransfer, exchangeRateA, exchangeRateB, priceImpact} = await updateDetail(
        firstTokenOnMount,
        secondTokenOnMount,
        filteredValue,
        firstTokenOnMount,
        false
      );

      calculateUSDValues(filteredValue, tokensToTransfer, true)
      setUSDByTokens(exchangeRateA, exchangeRateB, true)

      setInitializeCalculation(true)
    }
  
    handleExchangeCalculation()
  }, [firstTokenSelected])


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

  async function changeTokenA(value: string, firstValidation = false) {
    let filteredValue = parseFloat(value);
    if (isNaN(filteredValue)) {
      filteredValue = 0;
    } else if (filteredValue < 0) {
      filteredValue = Math.abs(filteredValue);
    }

    setLastChanged('A');
    setCurrentValue(filteredValue)
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
  }

  const handleChangeA = (value) => {
    cleanValidationState(parseFloat(value), parseFloat(firstTokenSelected.amount), gasPriceSelectedForLiquidity || 0)
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

  async function changeTokenB(value: string, secondValidation = false) {
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
    setTokenToTransfers(tokensToTransfer)

    amountSwapTokenASetter(tokensToTransfer);
    calculateUSDValues(tokensToTransfer, filteredValue, true)
    setUSDByTokens(exchangeRateA, exchangeRateB, true)
  }

  const handleChangeB = async (value) => {
    cleanValidationState(
      parseFloat(value),
      parseFloat(secondTokenSelected.amount),
      gasPriceSelectedForLiquidity || 0,
      secondTokenSelected.symbol)
    changeTokenB(value);
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
      firstTokenSelected.priceUSD,
      secondTokenSelected.priceUSD,
      amountA,
      amountB,
      isAorB
    );

    setValueAUSD(isNaN(parseFloat(usdA)) ? '0.00' : usdA);
    setValueBUSD(isNaN(parseFloat(usdB)) ? '0.00' : usdB);
  }

  const updateTokenListData = (tokenName: string, isFavorite: boolean) => {
    const newTokenList = tokenListData.map(token => {
      if (token.name === tokenName) {
        return {
          ...token,
          isFavorite: !isFavorite
        }
      }

      return token
    })    

    setTokenListData(newTokenList)
  }

  const updateLocalStorage = (
    name: string,
    currentPersistedData: string[],
    isFavorite: boolean
  ) => {
    const newLocalStorageData = isFavorite
      ? currentPersistedData.filter((item) => item !== name)
      : [...currentPersistedData, name];
    setLocalStorageData(LOCAL_STORAGE_KEY, newLocalStorageData);
  };

  const handlerFavoriteToken = (tokenName: string) => {
    const currentPersistedData: string[] = getLocalStorageData(LOCAL_STORAGE_KEY);    
    const isPresent = currentPersistedData.includes(tokenName);

    updateTokenListData(tokenName, isPresent)
    updateLocalStorage(tokenName, currentPersistedData, isPresent)
  }

  const handleAddLiquidity = () => {
    const tokenAIsInvalid = handleValidate( currentValue, parseFloat(firstTokenSelected.amount), gasPriceSelectedForLiquidity || 0)
    const secondValidation = handleValidate(parseFloat(tokenToTransfer), parseFloat(firstTokenSelected.amount), gasPriceSelectedForLiquidity || 0, firstTokenSelected.symbol)
  
    if (!tokenAIsInvalid && !secondValidation) {
      onActionConfirm(amountSwapTokenA, amountSwapTokenB)
    }
  }

  const handleAllowanceApproval = async (selectedToken) => {
    const isFirstTokenValueInvalid = handleValidate( currentValue, parseFloat(firstTokenSelected.amount), gasPriceSelectedForLiquidity || 0)
    const isSecondTokenValueInvalid = handleValidate(parseFloat(tokenToTransfer), parseFloat(firstTokenSelected.amount), gasPriceSelectedForLiquidity || 0, firstTokenSelected.symbol)
    
    if (!isFirstTokenValueInvalid && !isSecondTokenValueInvalid) {
      await requestIncreaseAllowance(
        Math.abs(freeAllowanceB),
        selectedToken.contractHash,
        selectedToken.decimals,
        selectedToken.optApproval
      );
    }
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
                gasFee={gasPriceSelectedForLiquidity}
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
                gasFee={gasPriceSelectedForLiquidity}
                iconSize='36px'
      />
      <div style={{display: "flex", justifyContent: "right", gap: "10px"}}>
        {!isConnected && (
          <Button type={"large"} props={{style: {width: 'auto'}, onClick: () => onConnectWallet()}}>Connect Wallet</Button>
        )}

        {!isApprovedA && isConnected && (
          <Button type={"large"} props={{
            style: {width: 'auto', flex: !isApprovedA && !isApprovedB ? "1": "" },
            onClick: async () => handleAllowanceApproval(firstTokenSelected)
          }}>Approve {Math.abs(freeAllowanceA)} {firstTokenSelected.symbol}</Button>
        )}
        {!isApprovedB && isConnected && (
          <Button type={"large"} props={{
            style: {width: 'auto', flex: !isApprovedA && !isApprovedB ? "1": ""},
            onClick: async () => handleAllowanceApproval(secondTokenSelected)
            }}>
              Approve {Math.abs(freeAllowanceB)} {secondTokenSelected.symbol}</Button>
        )}

        {isApprovedA && isApprovedB && isConnected && (
          <Button type={"large"} props={{
              disabled: isProcessingTransaction || disableButtonValid,
              style: {width: 'auto'},
              onClick: () => handleAddLiquidity() }}
              >
                Add Liquidity
          </Button>
        )}
      </div>
      {openPoolDialog.open && (
        <CreatePoolDialog
          closeCallback={() => setOpenPoolDialog(prevState => ({...prevState, open: false}))}
          tokenListData={sortedTokenListData}
          popularTokensData={filterPopupTokens(!openPoolDialog.firstSelector ? firstTokenSelected.symbol : secondTokenSelected.symbol, pairState)}
          onSelectToken={(name) => {
            selectAndCloseToken(tokenState.tokens[name])
          }}
          onSelectFavoriteToken={(name) => handlerFavoriteToken(name)}
          isOpen={openPoolDialog.open}
        />
      )}
    </div>
  );
};

export default LiquiditySwapper;
