import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {formatNaN, Token} from '../../../commons';
import isCSPRValid from '../../../hooks/isCSPRValid';
import {CoinCard, ExchangeRates, Button, CreatePoolDialog} from 'rengo-ui-kit'
import BigNumber from 'bignumber.js';
import arrowIcon from '../../../assets/newDesignIcons/chevron-down.svg'
import {PairState} from "../../../reducers/PairsReducer";
import { getLocalStorageData, setLocalStorageData } from '../../../commons/utils/persistData';

interface TokenSwapperProps {
  onIncreaseAllow,
  gasPriceSelectedForSwapping,
  onConnectWallet,
  isConnected,
  progressBar,
  getProgress,
  refresh,
  calculateUSDtokens,
  firstTokenSelected,
  secondTokenSelected,
  onSelectFirstToken,
  onSelectSecondToken,
  tokenState,
  onSwitchTokens,
  onActionConfirm,
  filterPopupTokens,
  updateDetail,
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
}

const DEFAULT_USD_TOKEN_VALUE = "0.00"
const LOCAL_STORAGE_KEY = 'token-list'
const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

const TokenSwapper = ({
                        onIncreaseAllow,
                        gasPriceSelectedForSwapping,
                        onConnectWallet,
                        isConnected,
                        progressBar,
                        getProgress,
                        refresh,
                        calculateUSDtokens,
                        firstTokenSelected,
                        secondTokenSelected,
                        onSelectFirstToken,
                        onSelectSecondToken,
                        tokenState,
                        onSwitchTokens,
                        onActionConfirm,
                        filterPopupTokens,
                        updateDetail,
                        amountSwapTokenA,
                        amountSwapTokenASetter,
                        amountSwapTokenB,
                        amountSwapTokenBSetter,
                        isProcessingTransaction,
                        clearProgress,
                        valueAUSD,
                        valueBUSD,
                        setValueAUSD,
                        setValueBUSD,
                      }: TokenSwapperProps) => {

  const [openPoolDialog, setOpenPoolDialog] = useState({firstSelector: true, open: false})
  const [exchangeRateA, exchangeRateASetter] = useState<number>(0);
  const [exchangeRateB, exchangeRateBSetter] = useState<number>(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentValue, setCurrentValue] = useState<number>(0);
  const { disableButton, setDisableButton, handleValidate, showNotification, dismissNotification, cleanValidationState } =
      isCSPRValid();
  const [lastChanged, setLastChanged] = useState('A');
  const [tokenListData, setTokenListData] = useState<any[]>([]);
  const [initializeCalculation, setInitializeCalculation] = useState(false)

  const tokenListFromFilter = useMemo(() => {
    return filterPopupTokens([firstTokenSelected.symbol, secondTokenSelected.symbol], openPoolDialog.firstSelector);
  }, [firstTokenSelected.symbol, secondTokenSelected.symbol, openPoolDialog.firstSelector]);
  
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
    const favoriteData: string[] = getLocalStorageData(LOCAL_STORAGE_KEY)
    const newTokenListData = tokenListFromFilter.map(token =>( {...token, isFavorite: favoriteData.includes(token.name) } ))
    setTokenListData(newTokenListData)
  }, [tokenListFromFilter])

  useEffect(() => {
    const t0 = searchParams.get('token0');
    const t1 = searchParams.get('token1');
    if (t0) {
      onSelectFirstToken(tokenState.tokens[t0]);
      onSelectSecondToken(tokenState.tokens[t1]);
    }
  }, []);

  useEffect(() => {
    progressBar(async () => {
      await refresh();
    });
  }, [amountSwapTokenA, amountSwapTokenB]);

  function onSwitchTokensHandler() {
    console.log("Current amount of approved tokens", firstTokenSelected.symbolPair, firstTokenSelected.allowance)
    if (lastChanged == 'A') {
      updateDetailAndUSDValuesForInputA(secondTokenSelected, firstTokenSelected, amountSwapTokenA.toString(), secondTokenSelected, true)
    } else if (lastChanged == 'B') {
      updateDetailAndUSDValuesForInputB(firstTokenSelected, secondTokenSelected, amountSwapTokenB.toString(), firstTokenSelected, true)
    }
  }

  async function requestIncreaseAllowance(amount, contractHash) {
    console.log("Amount of approved tokens before increasing it", firstTokenSelected.symbolPair, firstTokenSelected.decimals, firstTokenSelected.allowance)
    await onIncreaseAllow(amount, contractHash, firstTokenSelected.decimals, firstTokenSelected.optApproval, null, firstTokenSelected.symbol)
    const {tokensToTransfer, exchangeRateA, exchangeRateB, priceImpact} = await updateDetail(
        firstTokenSelected,
        secondTokenSelected,
        amount,
        firstTokenSelected,
        false
    )

    calculateUSDValues(amount,
      tokensToTransfer,
      firstTokenSelected.symbolPair,
      secondTokenSelected.symbolPair,
      exchangeRateA, exchangeRateB,
      firstTokenSelected.symbolPair,
      firstTokenSelected.priceUSD,
      secondTokenSelected.priceUSD
    )
  }

  useEffect(() => {
    if (firstTokenSelected?.priceUSD === DEFAULT_USD_TOKEN_VALUE || initializeCalculation) {
      return
    }

    const filteredValue = 1
    const firstTokenOnMount = tokenState.tokens['CSPR']
    const twoTokenOnMount = tokenState.tokens['WETH']

    const handleExchangeCalculation = async () => {
      const {tokensToTransfer, exchangeRateA, exchangeRateB, priceImpact} = await updateDetail(
        firstTokenOnMount,
        twoTokenOnMount,
        filteredValue,
        firstTokenOnMount,
        false
      );

      calculateUSDValues(
        filteredValue,
        tokensToTransfer,
        firstTokenOnMount.symbolPair,
        twoTokenOnMount.symbolPair,
        exchangeRateA,
        exchangeRateB,
        firstTokenOnMount.symbolPair,
        firstTokenOnMount.priceUSD,
        twoTokenOnMount.priceUSD)

      setInitializeCalculation(true)
    }
  
    handleExchangeCalculation()
  }, [firstTokenSelected])
  
  async function changeTokenA(value:  number, isSwitched = false) {
    setLastChanged('A');
    setCurrentValue(value)

    updateDetailAndUSDValuesForInputA(firstTokenSelected, secondTokenSelected, value, firstTokenSelected, isSwitched)
  }

  const updateDetailAndUSDValuesForInputA = async (firstToken, secondToken, filteredValue, activeToken, isSwitched) => {
    amountSwapTokenASetter(filteredValue);

    const {tokensToTransfer, exchangeRateA, exchangeRateB, priceImpact} = await updateDetail(
      firstToken,
      secondToken,
      filteredValue,
      activeToken,
      isSwitched
    );

    calculateUSDValues(
      filteredValue,
      tokensToTransfer,
      firstToken.symbolPair,
      secondToken.symbolPair,
      exchangeRateA,
      exchangeRateB,
      firstToken.symbolPair,
      firstToken.priceUSD,
      secondToken.priceUSD)
    amountSwapTokenBSetter(formatNaN(tokensToTransfer))

    if (filteredValue) {
      cleanValidationState(typeof filteredValue === "number" ? filteredValue : parseFloat(filteredValue), parseFloat(firstToken.amount), gasPriceSelectedForSwapping || 0)
    }
  }

  const handleTokenInputsValidation = (amountSwapTokenA, amountSwapTokenB) => {
    const isFirstTokenValueInvalid = handleValidate(currentValue, parseFloat(firstTokenSelected.amount), gasPriceSelectedForSwapping || 0)
    const isSecondTokenValueInvalid = handleValidate(amountSwapTokenA, parseFloat(firstTokenSelected.amount), gasPriceSelectedForSwapping || 0)

    if (!isFirstTokenValueInvalid && !isSecondTokenValueInvalid) {
      onActionConfirm(amountSwapTokenA, amountSwapTokenB)
    }
  }

  async function changeTokenB(value, isSwitched = false) {
    setLastChanged('B');

    let filteredValue = parseFloat(value);
    if (isNaN(filteredValue)) {
      filteredValue = 0;
    } else if (filteredValue < 0) {
      filteredValue = Math.abs(filteredValue);
    }

    updateDetailAndUSDValuesForInputB(firstTokenSelected, secondTokenSelected, filteredValue, secondTokenSelected, isSwitched)
  }

  const updateDetailAndUSDValuesForInputB = async (firstToken, secondToken, filteredValue, activeToken, isSwitched) => {
    amountSwapTokenBSetter(filteredValue)
    const {tokensToTransfer, exchangeRateA, exchangeRateB, priceImpact} = await updateDetail(
      firstToken,
      secondToken,
      filteredValue,
      activeToken,
      isSwitched
    );

    calculateUSDValues(
      filteredValue,
      tokensToTransfer,
      firstToken.symbolPair,
      secondToken.symbolPair,
      exchangeRateA,
      exchangeRateB,
      activeToken.symbolPair,
      firstToken.priceUSD,
      secondToken.priceUSD)
    amountSwapTokenASetter(formatNaN(tokensToTransfer))

    if (tokensToTransfer) {
      cleanValidationState(parseFloat(tokensToTransfer), parseFloat(firstToken.amount), gasPriceSelectedForSwapping || 0)
    }
  }

  const handleChangeA = async (e) => {
    let filteredValue = formatNaN(e);
    if (filteredValue < 0) {
      filteredValue = Math.abs(filteredValue);
    }
    
    await changeTokenA(filteredValue)
  };

  const handleChangeB = async (e) => {
    await changeTokenB(e);
  }

  const freeAllowance = new BigNumber(firstTokenSelected.allowance || 0)
      .minus(new BigNumber(amountSwapTokenA))
      .toNumber();

  const isApproved =
      firstTokenSelected.symbol == 'CSPR' ||
      (firstTokenSelected.symbol != 'CSPR' && freeAllowance >= 0) ||
      (firstTokenSelected.symbol == 'WCSPR' && secondTokenSelected.symbol === 'CSPR')

  const refreshPrices = async () => {
    await refresh()
  };

  const calculateUSDValues = (amountA: string | number, amountB: string | number, symbolA, symbolB, rateA, rateB, tokenSelected, priceA, priceB) => {
    exchangeRateASetter(rateA);
    exchangeRateBSetter(rateB);

    const isA2B = symbolA == tokenSelected

    const [usdA, usdB] = calculateUSDtokens(
        priceA,
        priceB,
        amountA,
        amountB,
        isA2B
    )

    const _usdA = isNaN(parseFloat(usdA)) ? "0.00" : usdA;
    const _usdB = isNaN(parseFloat(usdB)) ? "0.00" : usdB;

    setValueAUSD(_usdA);
    setValueBUSD(_usdB);
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

  async function selectAndCloseToken(token: Token): Promise<void> {

    if (openPoolDialog.firstSelector) {
      onSelectFirstToken(token)
      updateDetailAndUSDValuesForInputA(token, secondTokenSelected, amountSwapTokenA.toString(), token, true)
    } else {
      onSelectSecondToken(token)
      updateDetailAndUSDValuesForInputB(firstTokenSelected, token, amountSwapTokenB.toString(), token, true)
    }
    setOpenPoolDialog(prevState => ({...prevState, open: false}))
  }

  const handlerFavoriteToken = (tokenName: string) => {
    const currentPersistedData: string[] = getLocalStorageData(LOCAL_STORAGE_KEY);
    
    const isPresent = currentPersistedData.includes(tokenName);

    updateTokenListData(tokenName, isPresent)
    updateLocalStorage(tokenName, currentPersistedData, isPresent)
  }

  return (
      <div style={{display: "flex", flexDirection: "column", gap: "16px"}}>
        <CoinCard title='From'
                  startIcon={firstTokenSelected.logoURI}
                  endIcon={arrowIcon}
                  value={amountSwapTokenA}
                  placeholder={''}
                  onChangeToken={() => setOpenPoolDialog(prevState => ({...prevState, firstSelector: true, open: true}))}
                  onChangeValue={handleChangeA}
                  tokenName={firstTokenSelected.symbol}
                  tokenBalance={firstTokenSelected.amount}
                  tokenPrice={valueAUSD}
                  gasFee={gasPriceSelectedForSwapping}
                  iconSize='36px'
        />


        <ExchangeRates exchangeRateA={exchangeRateA}
                       tokenASymbol={firstTokenSelected.symbol}
                       exchangeRateB={exchangeRateB}
                       tokenBSymbol={secondTokenSelected.symbol}
                       handleClickSwap={() => {
                          onSwitchTokens()
                          onSwitchTokensHandler()
                       }}
                       strokeWidth={12}
                       clearProgress={() => clearProgress()}
                       getProgress={() => getProgress}
                       handlerButtonCircle={() => refreshPrices()}/>

        <CoinCard title='To'
                  startIcon={secondTokenSelected.logoURI}
                  endIcon={arrowIcon}
                  value={amountSwapTokenB}
                  placeholder={''}
                  onChangeToken={() => setOpenPoolDialog(prevState => ({...prevState, firstSelector: false, open: true}))}
                  onChangeValue={handleChangeB}
                  tokenName={secondTokenSelected.symbol}
                  tokenBalance={secondTokenSelected.amount}
                  tokenPrice={valueBUSD}
                  gasFee={gasPriceSelectedForSwapping}
                  iconSize='36px'
        />
        <div style={{display: "flex", justifyContent: "right"}}>
          {!isConnected && (
              <Button type={"large"} props={{style: {width: 'auto'}, onClick: () => onConnectWallet()}}>Connect Wallet</Button>
          )}
          {!isApproved && isConnected && (
              <Button type={"large"} props={{style: {width: 'auto'}, onClick: async () => {
                  await requestIncreaseAllowance(
                      Math.abs(firstTokenSelected.optApproval ? amountSwapTokenA : freeAllowance ),
                      firstTokenSelected.contractHash
                  );
                }}}>Approve {Math.abs(firstTokenSelected.optApproval ? amountSwapTokenA : freeAllowance )} {firstTokenSelected.symbol}</Button>
          )}
          {isApproved && isConnected && (
              <Button type={"large"} props={{
                  disabled: disableButton ||
                    amountSwapTokenA <= 0 ||
                    amountSwapTokenB <= 0 ||
                    isProcessingTransaction ||
                    disableButton,
                  style: {width: 'auto'},
                  onClick: () => handleTokenInputsValidation(amountSwapTokenA, amountSwapTokenB)
                }}>
                  SWAP
              </Button>
          )}
        </div>
        {openPoolDialog.open && (
            <CreatePoolDialog
                closeCallback={() => setOpenPoolDialog(prevState => ({...prevState, open: false}))}
                tokenListData={sortedTokenListData}
                popularTokensData={filterPopupTokens([firstTokenSelected.symbol, secondTokenSelected.symbol], openPoolDialog.firstSelector)}
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

export default TokenSwapper;
