import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {formatNaN, Token} from '../../../commons';
import isCSPRValid from '../../../hooks/isCSPRValid';
import {CoinCard, ExchangeRates, Button, CreatePoolDialog} from 'rengo-ui-kit'
import BigNumber from 'bignumber.js';
import arrowIcon from '../../../assets/newDesignIcons/chevron-down.svg'

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
  clearProgress
}

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
                        clearProgress
                      }: TokenSwapperProps) => {

  const [openPoolDialog, setOpenPoolDialog] = useState({firstSelector: true, open: false})
  const [exchangeRateA, exchangeRateASetter] = useState<number>(0);
  const [exchangeRateB, exchangeRateBSetter] = useState<number>(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentValue, setCurrentValue] = useState<number>(0);
  const { disableButton, setDisableButton, handleValidate, showNotification, dismissNotification } =
      isCSPRValid();

  const [lastChanged, setLastChanged] = useState('A');
  const [valueAUSD, setValueAUSD] = useState('0.00');
  const [valueBUSD, setValueBUSD] = useState('0.00');

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

  useEffect(() => {
    //Todo Compartido
    const switchToken = async () => {
      lastChanged == 'A'
          ? await changeTokenA(amountSwapTokenB)
          : await changeTokenB(amountSwapTokenA);
    }

    switchToken().catch((e) => console.log(e));

  }, [lastChanged]);

  //TODO Compartido
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

  async function requestIncreaseAllowance(amount, contractHash) {
    console.log('requestIncreaseAllowance');
    await onIncreaseAllow(amount, contractHash);
    const {tokensToTransfer, exchangeRateA, exchangeRateB, priceImpact} = await updateDetail(
        firstTokenSelected,
        secondTokenSelected,
        amount,
        firstTokenSelected
    )

    calculateUSDValues(amount, tokensToTransfer,
      firstTokenSelected.symbolPair, secondTokenSelected.symbolPair,
      exchangeRateA, exchangeRateB,
      firstTokenSelected.symbolPair)
  }

  async function changeTokenA(value: string | number, first = firstTokenSelected, second = secondTokenSelected) {
    setLastChanged('A');

    let filteredValue = formatNaN(value);
    if (filteredValue < 0) {
      filteredValue = Math.abs(filteredValue);
    }

    amountSwapTokenASetter(filteredValue);

    const {tokensToTransfer, exchangeRateA, exchangeRateB, priceImpact} = await updateDetail(
        firstTokenSelected,
        secondTokenSelected,
        filteredValue,
        firstTokenSelected
    );

    calculateUSDValues(value, tokensToTransfer, firstTokenSelected.symbolPair, secondTokenSelected.symbolPair, exchangeRateA, exchangeRateB, firstTokenSelected.symbolPair)
    amountSwapTokenBSetter(formatNaN(tokensToTransfer))
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

    const {tokensToTransfer, exchangeRateA, exchangeRateB, priceImpact} = await updateDetail(
        firstTokenSelected,
        secondTokenSelected,
        filteredValue,
        secondTokenSelected
    );

    calculateUSDValues(value, tokensToTransfer, firstTokenSelected.symbolPair, secondTokenSelected.symbolPair, exchangeRateA, exchangeRateB, secondTokenSelected.symbolPair)
    amountSwapTokenASetter(formatNaN(tokensToTransfer))
  }

  //TODO Compartido
  const handleChangeA = async (e) => {
    setCurrentValue(e)
    // TODO: check if we need to show this when wallet is not connected
      handleValidate(
        parseFloat(e),
        parseFloat(firstTokenSelected.amount),
        gasPriceSelectedForSwapping || 0
    );
    await changeTokenA(e)
  };

  //TODO Compartido
  const handleChangeB = async (e) => {
    await changeTokenB(e);
    const {tokensToTransfer, exchangeRateA, exchangeRateB, priceImpact} = await updateDetail(
        firstTokenSelected,
        secondTokenSelected,
        parseFloat(e),
        secondTokenSelected
    )
      // TODO check if we need to show this when wallet is not connected
      handleValidate(
        parseFloat(tokensToTransfer),
        parseFloat(firstTokenSelected.amount),
        gasPriceSelectedForSwapping || 0
    )
  }

  const freeAllowance = new BigNumber(firstTokenSelected.allowance || 0)
      .minus(new BigNumber(amountSwapTokenA))
      .toNumber();

  const isApproved =
      firstTokenSelected.symbol == 'CSPR' ||
      (firstTokenSelected.symbol != 'CSPR' && freeAllowance >= 0);

  //Todo compatido
  const refreshPrices = async () => {
    await refresh()
  };

  //TODO Compartido
  const calculateUSDValues = (amountA: string | number, amountB: string | number, symbolA, symbolB, rateA, rateB, tokenSelected) => {
    exchangeRateASetter(rateA);
    exchangeRateBSetter(rateB);

    const isA2B = symbolA == tokenSelected

    const [usdA, usdB] = calculateUSDtokens(
        symbolA,
        symbolB,
        amountA,
        amountB,
        isA2B
    )

    const _usdA = isNaN(parseFloat(usdA)) ? "0.00" : usdA;
    const _usdB = isNaN(parseFloat(usdB)) ? "0.00" : usdB;

    setValueAUSD(_usdA);
    setValueBUSD(_usdB);
  }

  const popularTokens = Object.values(tokenState.tokens).map((token) => {
    const {chainId, symbol, name, amount, logoURI}: any = token;
    return (
        {
          id: chainId,
          name: symbol,
          fullName: name,
          amount: amount,
          tokenImg: logoURI,
          favorite: false
        }
    );
  });

  async function selectAndCloseToken(token: Token): Promise<void> {

    if (openPoolDialog.firstSelector) {
      onSelectFirstToken(token)
      const {tokensToTransfer, exchangeRateA, exchangeRateB, priceImpact} = await updateDetail(token, secondTokenSelected, amountSwapTokenA, token)
      amountSwapTokenASetter(formatNaN(tokensToTransfer))
    } else {
      onSelectSecondToken(token)
      const {tokensToTransfer, exchangeRateA, exchangeRateB, priceImpact} = await updateDetail(token, firstTokenSelected, amountSwapTokenB, token)
      amountSwapTokenBSetter(formatNaN(tokensToTransfer))
    }
    setOpenPoolDialog(prevState => ({...prevState, open: false}))
  }

  const getCSPRPosition = () => {
    if ('CSPR' === firstTokenSelected.symbol) {
      return 0
    }
    if ('CSPR' === secondTokenSelected.symbol) {
      return 1
    }

    return -1
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
                  value={amountSwapTokenB}
                  placeholder={''}
                  onChangeToken={() => setOpenPoolDialog(prevState => ({...prevState, firstSelector: false, open: true}))}
                  onChangeValue={handleChangeB}
                  tokenName={secondTokenSelected.symbol}
                  tokenBalance={secondTokenSelected.amount}
                  tokenPrice={valueBUSD}
                  iconSize='36px'
        />
        <div style={{display: "flex", justifyContent: "right"}}>
          {!isConnected && (
              <Button type={"large"} props={{style: {width: 'auto'}, onClick: () => onConnectWallet()}}>Connect Wallet</Button>
          )}
          {!isApproved && isConnected && (
              <Button type={"large"} props={{style: {width: 'auto'}, onClick: async () => {
                  await requestIncreaseAllowance(
                      Math.abs(freeAllowance),
                      firstTokenSelected.contractHash
                  );
                }}}>Approve {Math.abs(freeAllowance)} {firstTokenSelected.symbol}</Button>
          )}
          {isApproved && isConnected && (
              <Button type={"large"} props={{
                disabled: disableButton ||
                  amountSwapTokenA <= 0 ||
                  amountSwapTokenB <= 0 ||
                  amountSwapTokenA > parseFloat(firstTokenSelected.amount) ||
                  isProcessingTransaction ||
                  disableButton,
                style: {width: 'auto'}, onClick: () => onActionConfirm(amountSwapTokenA, amountSwapTokenB)}}>SWAP</Button>
          )}
        </div>
        {openPoolDialog.open && (
            <CreatePoolDialog
                closeCallback={() => setOpenPoolDialog(prevState => ({...prevState, open: false}))}
                tokenListData={filterPopupTokens([firstTokenSelected.symbol, secondTokenSelected.symbol], getCSPRPosition(), openPoolDialog.firstSelector)}
                popularTokensData={filterPopupTokens([firstTokenSelected.symbol, secondTokenSelected.symbol], getCSPRPosition(), openPoolDialog.firstSelector)}
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

export default TokenSwapper;
