import BigNumber from "bignumber.js";

import React, { useContext, useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { ConfigProviderContext } from "../../../contexts/ConfigContext";
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
} from "../../atoms";

import { SwapConfirmAtom, SwapDetail, SwapModal } from "../../molecules";
import FloatMenu from "../FloatMenu";
import { useSearchParams } from "react-router-dom";

import { convertAllFormatsToUIFixedString, Token } from "../../../commons";
import SwitchSwap from "../../atoms/SwitchSwap";
import LoadersSwap from "../../atoms/LoadersSwap";

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
    slippageToleranceSelected,
  } = useContext(ConfigProviderContext);

  const [amountSwapTokenA, amountSwapTokenASetter] = useState<any>(0);
  const [amountSwapTokenB, amountSwapTokenBSetter] = useState<any>(0);
  const [slippSwapToken, slippSwapTokenSetter] = useState<any>(
    slippageToleranceSelected
  );
  const [tokensToTransfer, tokensToTransferSetter] = useState<any>(0);
  const [priceImpact, priceImpactSetter] = useState<any>(0);
  const [feeToPay, feeToPaySetter] = useState<any>(0.03);
  const [exchangeRateA, exchangeRateASetter] = useState<any>(0);
  const [exchangeRateB, exchangeRateBSetter] = useState<any>(0);
  const [defaultPriceImpactLabel, defaultPriceImpactLabelSetter] =
    useState<any>("");
  const [searchParams, setSearchParams] = useSearchParams();

  const [lastChanged, setLastChanged] = useState("");

  useEffect(() => {
    const t0 = searchParams.get("token0");
    const t1 = searchParams.get("token1");
    if (t0) {
      onSelectFirstToken(tokens[t0]);
      onSelectSecondToken(tokens[t1]);
    }

    updateSwapDetail(
      firstTokenSelected,
      secondTokenSelected,
      amountSwapTokenA,
      firstTokenSelected
    );
  }, [isConnected]);

  async function onConnect() {
    onConnectWallet();
  }

  function onSwitchTokensHandler() {
    onSwitchTokens();

    if (lastChanged == "A") {
      changeTokenB(amountSwapTokenA.toString());
      setLastChanged("B");
    } else if (lastChanged == "B") {
      changeTokenA(amountSwapTokenB.toString());
      setLastChanged("A");
    }
  }

  function resetAll() {
    amountSwapTokenASetter(0);
    amountSwapTokenBSetter(0);
  }

  async function onConfirmSwap() {
    const waiting = await onConfirmSwapConfig(
      amountSwapTokenA,
      amountSwapTokenB,
      slippSwapToken
    );
    resetAll();
  }

  async function updateSwapDetail(
    tokenA,
    tokenB,
    value = amountSwapTokenA,
    token = firstTokenSelected
  ) {
    const getSwapDetailP = getSwapDetails(
      tokenA,
      tokenB,
      value,
      token,
      slippSwapToken,
      feeToPay
    );
    const ps = [getSwapDetailP];

    const [getSwapDetailResponse] = await Promise.all(ps);

    const { tokensToTransfer, priceImpact, exchangeRateA, exchangeRateB } =
      getSwapDetailResponse;

    tokensToTransferSetter(tokensToTransfer);
    priceImpactSetter(priceImpact);
    exchangeRateASetter(exchangeRateA);
    exchangeRateBSetter(exchangeRateB);

    defaultPriceImpactLabelSetter(
      parseFloat(priceImpact) > 1 ? "Price Impact Warning" : "Price impact"
    );
    return tokensToTransfer;
  }

  async function requestIncreaseAllowance(amount, contractHash) {
    console.log("requestIncreaseAllowance");
    await onIncreaseAllow(amount, contractHash);
    await updateSwapDetail(
      firstTokenSelected,
      secondTokenSelected,
      amount,
      firstTokenSelected
    );
  }

  async function changeTokenA(value: string) {
    let filteredValue = parseFloat(value);
    if (isNaN(filteredValue)) {
      filteredValue = 0;
    } else if (filteredValue < 0) {
      filteredValue = Math.abs(filteredValue);
    }

    setLastChanged("A");

    amountSwapTokenASetter(filteredValue);

    const minTokenToReceive = await updateSwapDetail(
      firstTokenSelected,
      secondTokenSelected,
      filteredValue,
      firstTokenSelected
    );
    amountSwapTokenBSetter(parseFloat(minTokenToReceive));
  }

  async function changeTokenB(value: string) {
    let filteredValue = parseFloat(value);
    if (isNaN(filteredValue)) {
      filteredValue = 0;
    } else if (filteredValue < 0) {
      filteredValue = Math.abs(filteredValue);
    }
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
    amountSwapTokenBSetter(parseFloat(minTokenToReceive));
  }

  const [searchModalB, searchModalBSetter] = useState(false);
  async function selectAndCloseTokenB(token): Promise<void> {
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
    amountSwapTokenASetter(parseFloat(minTokenToReceive));
  }

  function makeHalf(amount, Setter) {
    Setter(amount / 2);
  }
  function makeMax(amount, Setter) {
    Setter(amount);
  }

  const freeAllowance = new BigNumber(firstTokenSelected.allowance || 0)
    .minus(new BigNumber(amountSwapTokenA))
    .toNumber();

  const isApproved =
    firstTokenSelected.symbol == "CSPR" ||
    (firstTokenSelected.symbol != "CSPR" && freeAllowance >= 0);

  return (
    <ContainerInnerNSM>
      <ContainerSwapActionsNSM>
        <NewSwapContainerNSM>
          <TokenSelectNSM>
            <NewTokenDetailSelectNSM>
              <NewTokenDetailItems1NSM>from</NewTokenDetailItems1NSM>
              <NewTokenDetailItems2NSM src={firstTokenSelected.logoURI} />
              <NewTokenDetailItems3NSM>
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
                Balance:{" "}
                {firstTokenSelected.amount
                  ? convertAllFormatsToUIFixedString(firstTokenSelected.amount)
                  : "--"}
              </NewBalanceSpaceNSM>
              <ActionContainerNSM>
                <ButtonHalfMaxContainer>
                  <ButtonHalfMax
                    onClick={() => {
                      makeHalf(firstTokenSelected.amount, changeTokenA);
                    }}
                  >
                    half
                  </ButtonHalfMax>
                  <ButtonHalfMax
                    onClick={() => {
                      makeMax(firstTokenSelected.amount, changeTokenA);
                    }}
                  >
                    max
                  </ButtonHalfMax>
                </ButtonHalfMaxContainer>
                <BalanceInputContainerNSM>
                  <BalanceInputItem1NSM>
                    <BalanceInputNSM
                      min={0}
                      onChange={(e) => {
                        changeTokenA(e.target.value);
                      }}
                      type="number"
                      name=""
                      id=""
                      value={amountSwapTokenA}
                    />
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
              <NewTokenDetailItems1NSM>to</NewTokenDetailItems1NSM>
              <NewTokenDetailItems2NSM src={secondTokenSelected.logoURI} />
              <NewTokenDetailItems3NSM>
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
                Balance:{" "}
                {secondTokenSelected.amount
                  ? convertAllFormatsToUIFixedString(secondTokenSelected.amount)
                  : "--"}
              </NewBalanceSpaceNSM>
              <ActionContainerNSM>
                <ButtonHalfMaxContainer>
                  <ButtonHalfMax
                    onClick={() => {
                      makeHalf(secondTokenSelected.amount, changeTokenB);
                    }}
                  >
                    half
                  </ButtonHalfMax>
                  <ButtonHalfMax
                    onClick={() => {
                      makeMax(secondTokenSelected.amount, changeTokenB);
                    }}
                  >
                    max
                  </ButtonHalfMax>
                </ButtonHalfMaxContainer>
                <BalanceInputContainerNSM>
                  <BalanceInputItem1NSM>
                    <BalanceInputNSM
                      min={0}
                      onChange={(e) => {
                        changeTokenB(e.target.value);
                      }}
                      type="number"
                      name=""
                      id=""
                      value={amountSwapTokenB}
                    />
                  </BalanceInputItem1NSM>
                  <BalanceInputItem2NSM>
                    <p>$34.75</p>
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
            slippage={slippSwapToken}
            slippageEnabled={true}
            slippageSetter={slippSwapTokenSetter}
            fullExpanded={false}
          />
        )}
        <ButtonSpaceNSM>
          {!isConnected && (
            <NewSwapButtonWidth100
              content="Swap"
              handler={async () => {
                onConnect();
              }}
            />
          )}
          {!isApproved && isConnected && (
            <NewSwapButtonWidth100
              content={`Approve ${-freeAllowance} ${firstTokenSelected.symbol}`}
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
              content="Swap"
              disabled={
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
  );
};

export default SwapNewModule;
