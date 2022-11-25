import axios from 'axios';
import BigNumber from 'bignumber.js'
import React, { createContext, ReactNode, useEffect, useReducer, useState } from 'react'
import toast from 'react-hot-toast';

import { PopupsModule } from '../../components/organisms';
import { BASE_URL, DEADLINE, NODE_ADDRESS, ROUTER_PACKAGE_HASH } from '../../constant';

import { initialConfigState, ConfigReducer, ConfigActions } from '../../reducers'
import { initialPairsState, PairsReducer, PairActions, PairData, PairState } from '../../reducers/PairsReducer';
import { initialTokenState, TokenReducer, TokenActions, TokenAction, TokenState } from '../../reducers/TokenReducers';

const NETWORK_NAME = Network.CASPER_TESTNET

import {
  APIClient,
  Client as CasperClient,
  CasperSignerWallet,
  TorusWallet,
  Network,
  Token,
  Wallet,

  convertBigNumberToUIString,
  convertUIStringToBigNumber,

  SwapDetails,
  calculateSwapDetails,

  LiquidityDetails,
  calculateLiquidityDetails,

  log,
  WalletName,
} from '../../commons'

import {
  signAndDeploySwap,
  signAndDeployAllowance,
  signAndDeployAddLiquidity,
  signAndDeployRemoveLiquidity,
} from '../../commons/deploys'
import { ConfigState } from '../../reducers/ConfigReducers'
import { Row } from 'react-table'
import { CasperServiceByJsonRPC } from 'casper-js-sdk';
import { ConnectionPopup } from '../../components/atoms';

type MaybeWallet = Wallet | undefined

export interface ConfigContext {
  onConnectWallet: (name?: WalletName, ignoreError?: boolean) => Promise<void>,
  onDisconnectWallet: () => Promise<void>,
  configState: ConfigState,
  tokenState: TokenState,
  onSelectFirstToken: (token: string | Token) => void,
  onSelectSecondToken: (token: string | Token) => void,
  onSwitchTokens: () => void,
  getSwapDetails: (tokenA: Token, tokenB: Token, inputValue: BigNumber.Value, token: Token, slippage: number, fee: number) => Promise<SwapDetails>,
  getLiquidityDetails: (tokenA: Token, tokenB: Token, inputValue: BigNumber.Value, token: Token, slippage: number, fee: number) => Promise<LiquidityDetails>,
  tokens: Record<string, Token>,
  firstTokenSelected: Token,
  secondTokenSelected: Token,
  isConnected: boolean,
  onConfirmSwapConfig: (amountA: number | string, amountB: number | string, slippage: number) => Promise<boolean>,
  slippageToleranceSelected: number,
  onIncreaseAllow: (amount: number | string, contractHash: string) => Promise<boolean>,
  onAddLiquidity: (amountA: number | string, amountB: number | string, slippage: number) => Promise<boolean>,
  pairState: PairState,
  onRemoveLiquidity: (liquidity: number | string, tokenA: Token, tokenB: Token, amountA: number | string, amountB: number | string, slippage: number) => Promise<boolean>

  // To Delete
  poolColumns: any[],
  getPoolList: () => PairData[],
  getTVLandVolume: () => Promise<void>,
  gralData: Record<string, string>,
  isStaked: boolean,
  setStaked: (v: boolean) => void,
  filter: (onlyStaked: boolean, row: Row<PairData>) => any,
  getContractHashAgainstPackageHash,
  onCalculateReserves: (v: any, reverse: boolean) => Promise<any>
}

export const ConfigProviderContext = createContext<ConfigContext>({} as any)

export const casperClient = new CasperClient(NETWORK_NAME, NODE_ADDRESS)

export const apiClient = new APIClient(BASE_URL)

const formatter = Intl.NumberFormat('en', { notation: 'compact' })

export const convertNumber = (number: number) => {
  return formatter.format(number)
}

/**
 * Return type for GetStatus
 */
export type StatusResponseType = {
  // network token balance of the account
  balance: BigNumber,
  // uref of the main purse
  mainPurse: string,
}

/**
 * Get the balance and main purse of the wallet
 * 
 * @param wallet Wallet whose account is being used
 * @returns the balance and make purse uref
 */
export async function getStatus(wallet: Wallet): Promise<StatusResponseType> {
  const balance = await casperClient.getBalance(wallet)
  const mainPurse = await casperClient.getMainPurse(wallet)

  return { balance, mainPurse };
}

/**
 * Convert Token array to Token Record
 * 
 * @param listTokens an array of tokens
 * @returns a Record of tokens indexed by symbol
 */
function tokensToObject(listTokens: Token[]): Record<string, Token> {
  return listTokens.reduce((acc, token) => {
    return {
      ...acc, [token.symbol]: {
        ...token,
        amount: "0.0000",
        symbolPair: token.symbol
      }
    };
  }, {})
}

/***
 * it returns tokensToTransfer, priceImpact, minTokenBToTransfer, exchangeRateA and exchangeRateB that belong to the swap detail
 * @param tokenA first token
 * @param tokenB second token
 * @param inputValue input tokens
 * @param token input token types matching one of tokenA or tokenB
 * @param slippage decimal slippage
 * @param fee decimal fee
 * 
 * @return SwapDetails
 */
async function getSwapDetails(tokenA: Token, tokenB: Token, inputValue: BigNumber.Value, token: Token, slippage = 0.005, fee = 0.003): Promise<SwapDetails> {
  return calculateSwapDetails(apiClient, tokenA, tokenB, inputValue, token, slippage, fee)
}

async function getLiquidityDetails(tokenA: Token, tokenB: Token, inputValue: BigNumber.Value, token: Token, slippage = 0.005, fee = 0.003): Promise<LiquidityDetails> {
  return calculateLiquidityDetails(apiClient, tokenA, tokenB, inputValue, token, slippage, fee)
}

async function allowanceAgainstOwnerAndSpenderPairContract(accountHashStr: string, pairId: string) {
  try {
    const res = await apiClient.getAllowanceAgainstOwnerAndSpenderPairContract(accountHashStr, `hash-${pairId}`)
    return res.allowance
  } catch (err) {
    log.error(`allowanceAgainstOwnerAndSpenderPairContract error: ${err}`)
  }
}

async function liquidityAgainstUserAndPair(accountHashStr: string, pairId: string) {
  try {
    const res = await apiClient.getLiquidityAgainstUserAndPair(accountHashStr, `hash-${pairId}`)
    return res.liquidity
  } catch (err) {
    log.error(`liquidityAgainstUserAndPair error: ${err}`)
  }
}

export const ConfigContextWithReducer = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(ConfigReducer, initialConfigState)
  const [tokenState, tokenDispatch] = useReducer(TokenReducer, initialTokenState);
  const [pairState, pairDispatch] = useReducer(PairsReducer, initialPairsState);
  const { tokens, firstTokenSelected, secondTokenSelected } = tokenState;
  const [progressModal, setProgressModal] = useState(false)
  const [confirmModal, setConfirmModal] = useState(false)
  const columns = getColumns()
  const poolColumns = React.useMemo(() => columns, [])
  const [gralData, setGralData] = useState({})
  const [isStaked, setStaked] = useState(false)
  const [linkExplorer, setLinkExplorer] = useState("")

  const [showConnectionPopup, setShowConnectionPopup] = useState(false)

  let debounceConnect = false

  /**
   * return value for connect()
   */
  type ConnectReturn = {
    // wallet
    wallet?: Wallet,
    // balance of wallet
    balance: BigNumber,
    // main purse of wallet's address
    mainPurse: string,
    // wallet accountHashString
    walletAddress: string,
    // was the connection successful?
    isConnected: boolean,
  }

  /**
   * Connect to the currently selected wallet
   * 
   * @param name name of wallet to connect
   * 
   * @returns wallet, balance, mainPurse, and walletAddress
   */
  async function connect(name: WalletName = WalletName.NONE): Promise<ConnectReturn> {
    if (debounceConnect) {
      return {
        wallet: state.wallet,
        mainPurse: state.mainPurse,
        walletAddress: state.wallet?.accountHashString ?? '',
        balance: convertUIStringToBigNumber(tokenState.tokens.CSPR.amount),
        isConnected: state.wallet?.isConnected ?? false,
      }
    }

    debounceConnect = true
    let w: MaybeWallet

    switch (name) {
      case WalletName.CASPER_SIGNER:
        try {
          if (state.wallet?.isConnected) {
            await state.wallet.disconnect()
          }

          w = new CasperSignerWallet(NETWORK_NAME)
          await w.connect()
        } catch (e) {
          debounceConnect = false
          throw e
        }

        if (!w?.publicKey) {
          debounceConnect = false
          throw new Error("casper signer error")
        }
        break
      case WalletName.TORUS:
        try {
          if (state.wallet?.isConnected) {
            await state.wallet.disconnect()
          }

          w = new TorusWallet(NETWORK_NAME)
          await w.connect()
        } catch (e) {
          debounceConnect = false
          throw e
        }

        if (!w?.publicKey) {
          debounceConnect = false
          throw new Error("torus wallet error")
        }
        break
      default:
        setShowConnectionPopup(true)
        return {
          mainPurse: '',
          walletAddress: '',
          balance: convertUIStringToBigNumber(tokenState.tokens.CSPR.amount),
          isConnected: false,
        }
    }

    const { balance, mainPurse } = await getStatus(w)
    debounceConnect = false
    return {
      wallet: w,
      balance,
      mainPurse,
      walletAddress: w.accountHashString,
      isConnected: w.isConnected,
    }
  }

  async function updateBalances(
    wallet: Wallet,
    tokens: Record<string, Token>,
    tokenDispatch: React.Dispatch<TokenAction>,
  ): Promise<void> {
    if (!wallet.isConnected) {
      return
    }

    try {
      console.log('tokenState', tokenState)
      const ps = Object.keys(tokens).map((x) => {
        const token = tokens[x]

        console.log('token', x, token)
        if (tokens[x].contractHash) {
          return Promise.all([
            apiClient.getAllowanceAgainstOwnerAndSpender(wallet.accountHashString, token.contractHash)
              .then((response) => {
                console.log('allowance', token, response.allowance)
                tokenDispatch({
                  type: TokenActions.LOAD_ALLOWANCE,
                  payload: {
                    name: x,
                    allowance: convertBigNumberToUIString(new BigNumber(response.allowance))
                  },
                })
              }),
            apiClient.getBalanceAgainstUser(wallet.accountHashString, token.contractHash)
              .then((response) => {
                console.log('balance', response.balance)
                tokenDispatch({
                  type: TokenActions.LOAD_BALANCE,
                  payload: {
                    name: x,
                    amount: convertBigNumberToUIString(new BigNumber(response.balance))
                  },
                })
              })
          ])
        } else {
          return casperClient.getBalance(wallet)
            .then((balance) => {
              console.log('balance', convertBigNumberToUIString(balance))
              tokenDispatch({
                type: TokenActions.LOAD_BALANCE,
                payload: {
                  name: 'CSPR',
                  amount: convertBigNumberToUIString(balance)
                },
              });
            })
        }
      })

      await Promise.all(ps)
    } catch (err) {
      log.error(`updateBalances error: ${err}`)
    }
  }

  async function refresh(wallet: Wallet) {
    await fillPairs(wallet)
    await fillPairDetail(wallet)
    await updateBalances(
      wallet,
      tokens,
      tokenDispatch,
    )
  }

  async function onConnectWallet(name: WalletName = WalletName.NONE, ignoreError = false): Promise<void> {
    if (state.wallet?.isConnected) {
      return
    }

    if (debounceConnect) {
      return
    }

    let toastLoading: any

    try {
      const ret = await connect(name)

      if (!ret.isConnected) {
        return
      }

      toastLoading = toast.loading("Connecting to your wallet...")

      dispatch({ type: ConfigActions.SELECT_MAIN_PURSE, payload: { mainPurse: ret.mainPurse } })
      dispatch({ type: ConfigActions.CONNECT_WALLET, payload: { wallet: ret.wallet } })

      refresh(ret.wallet)

      toast.dismiss(toastLoading)
      toast.success("Connected!")
    } catch (err) {
      log.error(`onConnectWallet error: ${err}`)
      toast.dismiss(toastLoading)
      if (!ignoreError) {
        toast.error("Ooops we have an error")
      }
    }
  }

  const {
    isConnected,
    walletSelected,
    slippageToleranceSelected,
    mainPurse,
  } = state

  useEffect(() => {
    const fn = async () => {
      await loadPairs()
      await getTVLandVolume()
      const data = await apiClient.getTokenList()
      const tokens = tokensToObject(data.tokens)
      console.log('TOKENS', tokens)
      tokenDispatch({ type: TokenActions.UPDATE_TOKENS, payload: { tokens } as any })
    }

    fn().catch((e) => log.error(`UPDATE_TOKENS error": ${e}`))
  }, [])

  useEffect(() => {
    // console.log("localStorage.getItem(selectedWallet)", localStorage.getItem("selectedWallet"));
    // if (props.selectedWallet === "Casper" || localStorage.getItem("selectedWallet") === "Casper") {
    window.addEventListener('signer:connected', msg => {
      console.log("signer:connected", msg)
      //onConnectConfig()
    });
    window.addEventListener('signer:disconnected', msg => {
      console.log("signer:disconnected", msg)
      //onDisconnectWallet()
    });
    window.addEventListener('signer:tabUpdated', msg => {
      console.log("signer:tabUpdated", msg)
      //onConnectConfig()
    });
    window.addEventListener('signer:activeKeyChanged', msg => {
      console.log("signer:activeKeyChanged", msg)
      //onConnectConfig()
    });
    window.addEventListener('signer:locked', msg => {
      console.log("signer:locked", msg)
      onDisconnectWallet()
    });
    window.addEventListener('signer:unlocked', msg => {
      console.log("signer:unlocked", msg)
      //onConnectConfig()
    });

    window.addEventListener('signer:initialState', msg => {
      console.log("signer:initialState", msg)
      //connect()
    });
    // }
  }, []);

  function getColumns() {
    return [
      {
        id: 1,
        Header: 'Pool',
        accessor: 'tokeIcon',
        Cell: (tableProps: any) => (
          <img
            src={tableProps.row.original.tokeIcon}
            width={25}
            alt='Token Icon'
          />
        )
      },
      {
        id: 2,
        Header: 'Liquidity',
        accessor: 'tokenLiquidity',
      },
      {
        id: 3,
        Header: 'Volume 7D',
        accessor: 'volume24h',
      },
      {
        id: 4,
        Header: 'Fees 7d',
        accessor: 'volume7d',
      },
      {
        id: 5,
        Header: 'APR 7D',
        accessor: 'fees24h',
      }
    ]
  }

  const getTVLandVolume = async (): Promise<void> => {

    const data = {
      tvl: "192,168,000,000",
      totalVolume: "1,000,000"
    }

    setGralData(data)
  }

  const getPoolList = (): PairData[] => {
    return Object.entries(pairState).map(([k, v]) => {
      return v
    })
  }

  const getContractHashAgainstPackageHash = async (pairId) => {
    const result = await axios.post(`${BASE_URL}/getContractHashAgainstPackageHash`, { packageHash: pairId })

    if (result.data.success) {
      return result.data["Data"].contractHash
    } else {
      return null
    }
  }

  const filter = (onlyStaked: boolean, row: Row<PairData>): any => {
    if (onlyStaked) {
      return parseFloat(row.original.balance) > 0
    }

    return row
  }

  async function loadPairs(): Promise<void> {
    try {
      const pairListResponse = await apiClient.getPairList()
      pairListResponse.pairList.map((pl) => {
        const token0Decimals = tokenState.tokens[pl.token0.symbol].decimals
        const token1Decimals = tokenState.tokens[pl.token1.symbol].decimals
        const reserve0 = convertBigNumberToUIString(new BigNumber(pl.reserve0), token0Decimals)
        const reserve1 = convertBigNumberToUIString(new BigNumber(pl.reserve1), token1Decimals)

        console.log('pl', pl)

        pairDispatch({
          type: PairActions.LOAD_PAIR,
          payload: {
            name: `${pl.token0.symbol}-${pl.token1.symbol}`,
            token0Symbol: pl.token0.symbol,
            token1Symbol: pl.token1.symbol,
            totalLiquidityUSD: new BigNumber(reserve0).times(pl.token0Price).plus(new BigNumber(reserve1).times(pl.token1Price)).toString(),
            volume7d: new BigNumber(convertBigNumberToUIString(new BigNumber(pl.volumeUSD), 9)).toFixed(2),
            fees24h: '0',
            oneYFees: '0',
            volume: convertBigNumberToUIString(new BigNumber(pl.volumeUSD), 9),
            totalReserve0: reserve0,
            totalReserve1: reserve1,
            totalSupply: convertBigNumberToUIString(new BigNumber(pl.totalSupply)),
            token0Price: pl.token0Price,
            token1Price: pl.token1Price,
            contract0: pl.token0.id,
            contract1: pl.token1.id,
            id: pl.id,
          }
        })
      })
    } catch (err) {
      log.error("loadPairs", err.message)
    }
  }

  async function fillPairs(wallet: Wallet): Promise<void> {
    console.log('isConnected', wallet.isConnected)
    if (!wallet.isConnected) {
      return
    }

    try {
      await loadPairs()
      const ps = []
      const pairList = Object.keys(pairState).map(x => pairState[x])
      for (const pair of pairList) {
        ps.push(liquidityAgainstUserAndPair(wallet.accountHashString, pair.id)
          .then((liquidity) => pairDispatch({ type: PairActions.ADD_BALANCE_TO_PAIR, payload: { name: pair.name, balance: convertBigNumberToUIString(new BigNumber(liquidity)) } })))
        ps.push(allowanceAgainstOwnerAndSpenderPairContract(wallet.accountHashString, pair.id)
          .then((allowance) => pairDispatch({ type: PairActions.ADD_ALLOWANCE_TO_PAIR, payload: { name: pair.name, allowance: convertBigNumberToUIString(new BigNumber(allowance)) } })))
      }

      await Promise.all(ps)
    } catch (err) {
      log.error("fillPairs", err.message)
    }
  }

  async function fillPairDetail(wallet: Wallet): Promise<void> {
    try {
      let result = {
        pairsdata:[],
        userpairs: [],
      }

      try {
        result = await apiClient.getPairAgainstUser(wallet.accountHashString)        
      } catch (err) {
        return
      }
      
      const pairList = result.pairsdata
      const userPairs = result.userpairs

      await Promise.all(pairList.map(async d => {
        const data = userPairs.filter(u => u.pair === d.id)
        console.log('d', data)
        if (data[0]) {
          const token0Decimals = tokenState.tokens[d.token0.symbol].decimals
          const token1Decimals = tokenState.tokens[d.token1.symbol].decimals

          pairDispatch({
            type: PairActions.LOAD_USER_PAIR, payload: {
              name: `${d.token0.symbol}-${d.token1.symbol}`,
              reserve0: convertBigNumberToUIString(new BigNumber(data[0].reserve0), token0Decimals),
              reserve1: convertBigNumberToUIString(new BigNumber(data[0].reserve1), token1Decimals),
              liquidityUSD: new BigNumber(convertBigNumberToUIString(new BigNumber(data[0].reserve0).times(d.token0Price), token0Decimals))
                .plus(convertBigNumberToUIString(new BigNumber(data[0].reserve1).times(d.token1Price), token1Decimals)).toFixed(2),
            }
          })
        }
      }))
    } catch (err) {
      log.error("fillPairDetail", err.message)
    }
  }

  async function onCalculateReserves(value, reverse) {
    try {
      if (!reverse) {
        return await calculateReserves(firstTokenSelected, secondTokenSelected, value)
      } else {
        return await calculateReserves(secondTokenSelected, firstTokenSelected, value)
      }
    } catch (error) {
      console.log(__filename, "onCalculateReserves", error)
      return { secondTokenReturn: 0, minAmountReturn: 0 }
    }
  }

  async function calculateReserves(firstTokenSelected, secondTokenSelected, value) {
    try {
      const response = await axios.post(`${BASE_URL}/getpathreserves`, {
        path: [
          firstTokenSelected.symbolPair,
          secondTokenSelected.symbolPair,
        ]
      })
      if (response.data.success) {
        const secondTokenReturn = parseFloat((value * parseFloat(response.data.reserve0)).toString().slice(0, 10))
        const minAmountReturn = (secondTokenReturn - (secondTokenReturn * 0.5) / 100).toString().slice(0, 5)
        return { secondTokenReturn, minAmountReturn }
      }
      throw Error()
    } catch (error) {
      console.log(__filename, "onCalculateReserves", error)
      return { secondTokenReturn: 0, minAmountReturn: 0 }
    }
  }

  function onSelectFirstToken(token: string | Token): void {
    if (typeof token === 'string') {
      tokenDispatch({ type: TokenActions.SELECT_FIRST_TOKEN, payload: token })
    } else {
      tokenDispatch({ type: TokenActions.SELECT_FIRST_TOKEN, payload: token.symbol })
    }
  }

  function onSelectSecondToken(token: string | Token): void {
    if (typeof token === 'string') {
      tokenDispatch({ type: TokenActions.SELECT_SECOND_TOKEN, payload: token })
    } else {
      tokenDispatch({ type: TokenActions.SELECT_SECOND_TOKEN, payload: token.symbol })
    }
  }

  function onSwitchTokens(): void {
    tokenDispatch({ type: TokenActions.SWITCH_TOKENS })
  }

  async function onConfirmSwapConfig(amountA: number | string, amountB: number | string, slippage: number): Promise<boolean> {
    const loadingToast = toast.loading("Swapping.")

    try {
      const [deployHash, deployResult] = await signAndDeploySwap(
        apiClient,
        casperClient,
        state.wallet,
        DEADLINE,
        convertUIStringToBigNumber(amountA),
        convertUIStringToBigNumber(amountB),
        tokenState.tokens[tokenState.firstTokenSelected],
        tokenState.tokens[tokenState.secondTokenSelected],
        slippage / 100,
        mainPurse,
      );

      setProgressModal(true)
      setLinkExplorer(`https://testnet.cspr.live/deploy/${deployHash}`)

      const result = await casperClient.waitForDeployExecution(deployHash)
      setProgressModal(false)
      setConfirmModal(true)

      toast.dismiss(loadingToast)
      refresh(state.wallet)
      return true
    } catch (err) {
      setProgressModal(false)
      toast.dismiss(loadingToast)
      console.log("onConfirmSwapConfig")
      toast.error(`${err}`)
      refresh(state.wallet)
      return false
    }
  }

  async function onIncreaseAllow(amount: number | string, contractHash: string): Promise<boolean> {
    const loadingToast = toast.loading("Increasing allowance.")

    try {
      const [deployHash, deployResult] = await signAndDeployAllowance(
        casperClient,
        state.wallet,
        contractHash,
        convertUIStringToBigNumber(amount),
      )

      setProgressModal(true)
      setLinkExplorer(`https://testnet.cspr.live/deploy/${deployHash}`)

      const result = await casperClient.waitForDeployExecution(deployHash)
      setProgressModal(false)
      setConfirmModal(true)

      toast.dismiss(loadingToast)
      toast.success("Success.")
      refresh(state.wallet)
      return true
    } catch (err) {
      setProgressModal(false)
      toast.dismiss(loadingToast)
      console.log("onIncreaseAllow")
      toast.error(`${err}`)
      refresh(state.wallet)
      return false
    }
  }

  async function onAddLiquidity(amountA: number | string, amountB: number | string, slippage: number): Promise<boolean> {
    const loadingToast = toast.loading("Adding liquidity.")
    try {
      const [deployHash, deployResult] = await signAndDeployAddLiquidity(
        apiClient,
        casperClient,
        state.wallet,
        DEADLINE,
        convertUIStringToBigNumber(amountA),
        convertUIStringToBigNumber(amountB),
        tokenState.tokens[tokenState.firstTokenSelected],
        tokenState.tokens[tokenState.secondTokenSelected],
        slippage / 100,
        mainPurse,
      )

      setProgressModal(true)
      setLinkExplorer(`https://testnet.cspr.live/deploy/${deployHash}`)

      const result = await casperClient.waitForDeployExecution(deployHash)
      setProgressModal(false)
      setConfirmModal(true)

      toast.dismiss(loadingToast)
      toast.success("Success.")
      refresh(state.wallet)
      return true
    } catch (err) {
      setProgressModal(false)
      toast.dismiss(loadingToast)
      console.log("onAddLiquidity")
      toast.error(`${err}`)
      refresh(state.wallet)
      return false
    }
  }

  async function onRemoveLiquidity(liquidity: number | string, tokenA: Token, tokenB: Token, amountA: number | string, amountB: number | string, slippage: number): Promise<boolean> {
    const loadingToast = toast.loading("Removing liquidity.")
    console.log('zzz', tokenA, tokenB, amountA, amountB)
    try {
      const [deployHash, deployResult] = await signAndDeployRemoveLiquidity(
        apiClient,
        casperClient,
        state.wallet,
        DEADLINE,
        convertUIStringToBigNumber(liquidity),
        convertUIStringToBigNumber(amountA),
        convertUIStringToBigNumber(amountB),
        tokenA,
        tokenB,
        slippage / 100,
      )

      setProgressModal(true)
      setLinkExplorer(`https://testnet.cspr.live/deploy/${deployHash}`)

      const result = await casperClient.waitForDeployExecution(deployHash)
      setProgressModal(false)
      setConfirmModal(true)

      toast.dismiss(loadingToast)
      toast.success("Success.")
      refresh(state.wallet)
      return true
    } catch (err) {
      setProgressModal(false)
      toast.dismiss(loadingToast)
      console.log("onRemoveLiquidity")
      toast.error(`${err}`)
      refresh(state.wallet)
      return false
    }
  }

  async function onDisconnectWallet(): Promise<void> {
    try {
      if (state.wallet) {
        await state.wallet.disconnect()

        dispatch({ type: ConfigActions.DISCONNECT_WALLET, payload: {} }),

          toast.success("Your wallet is disconnected")
      }
    } catch (error) {
      toast.error("Error disconnecting wallet")
    }
  }

  return (
    <ConfigProviderContext.Provider value={{
      onConnectWallet,
      onDisconnectWallet,
      configState: state,
      tokenState,
      onSelectFirstToken,
      onSelectSecondToken,
      onSwitchTokens,
      getSwapDetails,
      getLiquidityDetails,
      tokens,
      firstTokenSelected: tokenState.tokens[tokenState.firstTokenSelected],
      secondTokenSelected: tokenState.tokens[tokenState.secondTokenSelected],
      isConnected,
      onConfirmSwapConfig,
      slippageToleranceSelected,
      onIncreaseAllow,
      onAddLiquidity,
      pairState,
      onRemoveLiquidity,
      poolColumns,
      getPoolList,
      getTVLandVolume,
      gralData,
      isStaked,
      setStaked,
      filter,
      getContractHashAgainstPackageHash,
      onCalculateReserves
    }}>
      {children}
      <PopupsModule isOpen={progressModal} handleOpen={setProgressModal} progress>
        Check the progress of your <a href={linkExplorer} target='_blank'>deploy</a>.
      </PopupsModule>
      <PopupsModule isOpen={confirmModal} handleOpen={setConfirmModal} progress={false}>
        Your <a href={linkExplorer} target='_blank'>deploy</a> was successful.
      </PopupsModule>
      <ConnectionPopup 
        isConnected={isConnected} 
        isOpened={showConnectionPopup} 
        onToggle={() => setShowConnectionPopup(!showConnectionPopup)} 
        title="Connect your wallet to CasperSwap" 
        onClose={() => setShowConnectionPopup(false)} 
        onConnect={onConnectWallet} 
        showButton={false}
      />
    </ConfigProviderContext.Provider>
  )
}