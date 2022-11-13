import axios from 'axios';
import BigNumber from 'bignumber.js'
import {
    CLPublicKey,
} from 'casper-js-sdk';
import React, { createContext, ReactNode, useCallback, useEffect, useReducer, useState } from 'react'
import toast from 'react-hot-toast';

import { PopupsModule } from '../../components/organisms';
import { BASE_URL, DEADLINE, NODE_ADDRESS } from '../../constant';

import { initialConfigState, ConfigReducer, ConfigActions } from '../../reducers'
import { initialPairsState, PairsReducer, PairActions, PairData } from '../../reducers/PairsReducer';
import { initialTokenState, TokenReducer, TokenActions, TokenAction } from '../../reducers/TokenReducers';

import {
    APIClient,
    Client as CasperClient,
    CasperSignerWallet,
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

import wethIcon from "../../assets/swapIcons/wethIcon.svg";
import casprIcon from "../../assets/swapIcons/casprIcon.png";

type MaybeWallet = Wallet | undefined

export const ConfigProviderContext = createContext<any>({})

export const casperClient = new CasperClient(Network.CASPER_TESTNET, NODE_ADDRESS)
export const apiClient = new APIClient(BASE_URL)

const formatter = Intl.NumberFormat('en', {notation: 'compact'})

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

async function getAllowanceAgainstOwnerAndSpender(contractHash, activePublicKey) {
    if (!contractHash || !activePublicKey) {
        return 0
    }

    try {
        const res = await apiClient.getAllowanceAgainstOwnerAndSpender(contractHash, CLPublicKey.fromHex(activePublicKey).toAccountHashStr())
        console.log(res)
        return res.allowance;            
    } catch(error) {
        console.log(error);
        console.log(error.response);
    }
}

async function allowanceAgainstOwnerAndSpenderPairContract(activePublicKey: string, pairId: string) {
    if (!pairId || !activePublicKey) {
        return 0
    }

    try {
        const res = await apiClient.getAllowanceAgainstOwnerAndSpenderPairContract(CLPublicKey.fromHex(activePublicKey).toAccountHashStr(), `hash-${pairId}`)
        console.log(res)
        return res.allowance;            
    } catch(error) {
        console.log(error);
        console.log(error.response);
    }
}

async function liquidityAgainstUserAndPair(activePublicKey: string, pairId: string) {
    try {
        const res = await apiClient.getLiquidityAgainstUserAndPair(activePublicKey, `hash-${pairId}`)
        console.log(res)
        return res.liquidity;            
    } catch(error) {
        console.log(error);
        console.log(error.response);
    }
}

function ObjectToArray(object) {
    const array = []
    Object.keys(object).map(x => {
        array.push(object[x])
    })
    return array
}

function PairsWithBalance(pairs) {
    return ObjectToArray(pairs).filter(x => x.balance > 0)
}

export const ConfigContextWithReducer = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(ConfigReducer, initialConfigState)
    const [tokenState, tokenDispatch] = useReducer(TokenReducer, initialTokenState);
    const [pairState, pairDispatch] = useReducer(PairsReducer, initialPairsState);
    const {tokens, firstTokenSelected, secondTokenSelected} = tokenState;
    const [progressModal, setProgressModal] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const columns = getColumns()
    const poolColumns = React.useMemo(() => columns, [])
    const [poolList, setPoolList] = useState([])
    const [gralData, setGralData] = useState({})
    const [isStaked, setStaked] = useState(false)

    let debounceConnect = false

    /**
     * return value for connect()
     */
    type ConnectReturn = {
        // wallet
        wallet: Wallet,
        // balance of wallet
        balance: BigNumber,
        // main purse of wallet's address
        mainPurse: string,
        // wallet public key hex
        walletAddress: string,
    }

    /**
     * Connect to the currently selected wallet
     * 
     * @returns wallet, balance, mainPurse, and walletAddress
     */
    async function connect(): Promise<ConnectReturn> {
        if (debounceConnect) {
            return {
                wallet: state.wallet,
                mainPurse: state.mainPurse,
                walletAddress: state.wallet.publicKeyHex,
                balance: convertUIStringToBigNumber(tokenState.tokens.CSPR.amount),
            }
        }

        debounceConnect = true
        let w: MaybeWallet

        if (walletSelected === WalletName.CASPER_SIGNER) {
            try {
                if (state.wallet) {
                    state.wallet.disconnect()
                }

                w = new CasperSignerWallet()
                await w.connect()
            } catch (e) {
                debounceConnect = false
                throw e
            }
            if (!w?.publicKey) {
                debounceConnect = false
                throw new Error("casper signer error")
            }
        } else {
            /*
                torus = new Torus();

                if (!torus) {
                    throw new Error("torus error")
                }
                
                try {
                    await torus.init({
                        buildEnv: "testing",
                        showTorusButton: true,
                        network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
                    });
                } catch (e) {
                    debounceConnect = false
                    throw e
                }
                
                walletAddress = (await torus.login())[0];
            */
        }

        const { balance, mainPurse } = await getStatus(w)
        debounceConnect = false
        return {
            wallet: w,
            balance, 
            mainPurse, 
            walletAddress: w.publicKeyHex,
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
                        apiClient.getAllowanceAgainstOwnerAndSpender(token.contractHash, wallet.accountHashString)
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
                        apiClient.getBalanceAgainstUser(wallet.publicKeyHex, token.contractHash)
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
            console.log(err);
            console.log(err.response);
        }
    }

    async function refresh(wallet: Wallet) {
        await fillPairs(wallet)
        await updateBalances(
            wallet,
            tokens,
            tokenDispatch,
        )
    }

    async function onConnectWallet(ignoreError = false) {
        if (state.wallet?.isConnected) {
            return
        }
        
        if (debounceConnect) {
            return
        }

        const toastLoading = toast.loading("Try to connect your wallet")
        try {
            const ret = await connect()

            dispatch({ type: ConfigActions.SELECT_MAIN_PURSE, payload: { mainPurse: ret.mainPurse } })
            dispatch({ type: ConfigActions.CONNECT_WALLET, payload: { wallet: ret.wallet } })
            
            refresh(ret.wallet)

            toast.dismiss(toastLoading)
            toast.success("your wallet is mounted and ready to ride!")
        } catch (e) {
            console.log('error', e)
            toast.dismiss(toastLoading)
            if (!ignoreError) {
                toast.error("Ooops we have an error")
            }
        }
    }

    const {
        isConnected,
        walletAddress,
        walletSelected,
        languagesSelected,
        visualModeSelected,
        slippageToleranceSelected,
        gasPriceSelected,
        mainPurse 
    } = state

    useEffect(() => {
        const fn = async () => {
            loadPairs()
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
                Cell: (tableProps:any) => (
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

    const getTVLandVolume = () => {

        const data = {
            tvl: "192,168,000,000",
            totalVolume: "1,000,000"
        }

        setGralData(data)
    }

    const getPoolList = (): PairData[] => {
        return Object.entries(pairState).map(([k, v])=>{
            return v
        })
    }

    const getPoolDetailByUser = async (hash: string, wa: string | number | boolean | void = null) => {

        const result = await axios.post(`${BASE_URL}/getpairagainstuser`, {user: hash})

        if (result.data.success) {
            const pairList = result.data.pairsdata
            const userPairs = result.data.userpairs

            const list = await Promise.all(pairList.map(async d => {
                const data = userPairs.filter(u => u.pair === d.id)
                const token0Decimals = tokenState.tokens[d.token0.symbol].decimals
                const token1Decimals = tokenState.tokens[d.token1.symbol].decimals

                const totalLiquidity = await getLiquidityByUserAndPairDataId(getAccountHash(wa), d.id)

                return {
                    token0: d.token0.symbol,
                    token1: d.token1.symbol,
                    contract0: d.token0.id,
                    contract1: d.token1.id,
                    token0Liquidity: normalizeAmount(data[0].reserve0, token0Decimals),
                    token1Liquidity: normalizeAmount(data[0].reserve1, token1Decimals),
                    totalLiquidityPool: normalizeAmount(totalLiquidity, 9),
                    totalLiquidityUSD: normalizeAmount(data[0].reserve0, token0Decimals) * parseFloat(d.token0Price) + normalizeAmount(data[0].reserve1, token1Decimals) * parseFloat(d.token1Price),
                    volume: normalizeAmount(d.volumeUSD, 9),
                    totalPoolId: d.id,
                    totalPool: normalizeAmount(totalLiquidity, token1Decimals),
                    totalPoolUSD: normalizeAmount(data[0].reserve0, token0Decimals) * parseFloat(d.token0Price) + normalizeAmount(data[0].reserve1, token1Decimals) * parseFloat(d.token1Price),
                    totalSupply: normalizeAmount(d.totalSupply, token0Decimals),
                }
            }))

            return list
        }
        return []
    }

    const getContractHashAgainstPackageHash = async (pairId) => {
        const result = await axios.post(`${BASE_URL}/getContractHashAgainstPackageHash`, {packageHash: pairId})

        if (result.data.success) {
            return result.data["Data"].contractHash
        } else {
            return null
        }
    }

    const getLiquidityByUserAndPairDataId = async (user, pairDataId) => {
      try {
          const liquidityResp = await axios.post(`${BASE_URL}/liquidityagainstuserandpair`, {pairid: pairDataId, to: user})

          if (liquidityResp.data.success) {
              return liquidityResp.data.liquidity
          } else {
              return "0"
          }
      } catch (e) {
          console.error(`Error - it happened an error trying to get user pool liquidity`)
          return "0"
      }
    }

    const loadPoolDetailByUser = async (hash, poolList, wa: string | number | boolean | void = null) => {
        const list = await getPoolDetailByUser(hash, wa)

        const newList = poolList.map(d => {
            const data = list.filter(f => d.pair.token0 === f.token0 && d.pair.token1 === f.token1 || d.pair.token1 === f.token0 && d.pair.token0 === f.token1)
            if (data.length > 0) {
                return {...d, pair: data[0]}
            }
            return d
        })

        return newList
    }

    const normalizeAmount = (amount, decimalQuantity) => {
        const strAmount = parseFloat(amount).toFixed(0).toString();

        if (strAmount.length > decimalQuantity) {
            const newReserve = strAmount.slice(0, strAmount.length - decimalQuantity) + '.' + strAmount.slice(strAmount.length - decimalQuantity, strAmount.length)
            return parseFloat(newReserve)
        } else {
            let newReserve = strAmount

            for (let i = 0; i < decimalQuantity; i++) {
                if (newReserve.length < decimalQuantity) {
                    newReserve = '0' + newReserve
                } else {
                    break
                }
            }
            return parseFloat(`0.${newReserve}`)
        }
    }

    const filter = (onlyStaked, row) => {
        if (onlyStaked) {
            return row.original.pair.totalPool > 0
        }

        return row
    }

    async function loadPairs(): Promise<void> {
        const pairListResponse = await apiClient.getPairList()
        pairListResponse.pairList.map((pl) => {
            const token0Decimals = tokenState.tokens[pl.token0.symbol].decimals
            const token1Decimals = tokenState.tokens[pl.token1.symbol].decimals
            const reserve0 = convertBigNumberToUIString(new BigNumber(pl.reserve0), token0Decimals)
            const reserve1 = convertBigNumberToUIString(new BigNumber(pl.reserve1), token1Decimals)

            pairDispatch({ 
                type: PairActions.LOAD_PAIR, 
                payload: { 
                    name: `${pl.token0.symbol}-${pl.token1.symbol}`,
                    token0Symbol: pl.token0.symbol,
                    token1Symbol: pl.token1.symbol,
                    totalLiquidity: new BigNumber(reserve0).times(pl.token0Price).plus(new BigNumber(reserve1).times(pl.token1Price)).toString(),
                    volume7d: new BigNumber(convertBigNumberToUIString(new BigNumber(pl.volumeUSD), 9)).toFixed(2),
                    fees24h: '0',
                    oneYFees: '0',
                    volume: convertBigNumberToUIString(new BigNumber(pl.volumeUSD), 9),
                    reserve0: reserve0,
                    reserve1: reserve1,
                    totalSupply: convertBigNumberToUIString(new BigNumber(pl.totalSupply)),
                    token0Price: pl.token0Price,
                    token1Price: pl.token1Price,
                }
            })
                /*pair: {
                    token0: d.token0.symbol,
                    token1: d.token1.symbol,
                    token0Liquidity: 0,
                    token1Liquidity: 0,
                    totalLiquidityPool: 0,
                    totalLiquidityUSD: 0,
                    volumePercentage: 0,
                    totalPool: 0
                }*/
              
        })
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
                ps.push(liquidityAgainstUserAndPair(wallet.publicKeyHex, pair.id)
                    .then((liquidity) => pairDispatch({ type: PairActions.ADD_BALANCE_TO_PAIR, payload: { name: pair.name, balance: convertBigNumberToUIString(new BigNumber(liquidity)) } })))
                ps.push(allowanceAgainstOwnerAndSpenderPairContract(wallet.publicKeyHex, pair.id)
                    .then((liquidity) => pairDispatch({ type: PairActions.ADD_ALLOWANCE_TO_PAIR, payload: { name: pair.name, allowance: convertBigNumberToUIString(new BigNumber(liquidity)) } })))
            }

            await Promise.all(ps)
        } catch (error) {
            console.log("fillPairs", error.message)
        }
    }

    function cleanPairs() {
        return PairsWithBalance(pairState)
    }
    function onSelectFirstToken(token: string | Token) {
        if (typeof token === 'string') {
            tokenDispatch({ type: TokenActions.SELECT_FIRST_TOKEN, payload: token })
        } else {
            tokenDispatch({ type: TokenActions.SELECT_FIRST_TOKEN, payload: token.symbol })
        }
    }

    function onSelectSecondToken(token: string | Token) {
        if (typeof token === 'string') {
            tokenDispatch({ type: TokenActions.SELECT_SECOND_TOKEN, payload: token })
        } else {
            tokenDispatch({ type: TokenActions.SELECT_SECOND_TOKEN, payload: token.symbol })
        }
    }

    function onSwitchTokens() {
        tokenDispatch({ type: TokenActions.SWITCH_TOKENS })
    }

    const [linkExplorer, setLinkExplorer] = useState("")
    const [deployExplorer, setDeployExplorer] = useState("")

    async function onConfirmSwapConfig(amountA: number | string, amountB: number | string, slippage: number) {
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

    async function onIncreaseAllow(amount: number | string, contractHash) {
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
    

    async function onAddLiquidity(amountA: number | string, amountB: number | string, slippage: number) {
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

    async function onRemoveLiquidity(liquidity: number | string, tokenA: Token, tokenB: Token, amountA: number | string, amountB: number | string, slippage: number) {
        const loadingToast = toast.loading("Removing liquidity.")
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
            return true
        } catch (err) {
            setProgressModal(false)
            toast.dismiss(loadingToast)
            console.log("onRemoveLiquidity")
            toast.error(`${err}`)
            return false
        }
    }

    async function onDisconnectWallet() {
        try {
            if (state.wallet) {
                state.wallet.disconnect()
                
                dispatch({ type: ConfigActions.DISCONNECT_WALLET, payload: {} }),

                toast.success("Your wallet is disconnected")
            }
        } catch (error) {
            toast.error("Error disconnecting wallet")
        }
    }

    async function onAllowanceAgaintPair(pairId: string) {
        return await allowanceAgainstOwnerAndSpenderPairContract(walletAddress, pairId)
    }

    function getAccountHash(wa: string | number | boolean | void = null): string {
        return Buffer.from(CLPublicKey.fromHex(wa as any ?? state.wallet.publicKeyHex).toAccountHash()).toString("hex")
    }

    return (
        <ConfigProviderContext.Provider value={{
            getAccountHash,
            onConnectWallet,
            onDisconnectWallet,
            configState: state,
            tokenState,
            tokenDispatch,
            onSelectFirstToken,
            onSelectSecondToken,
            onSwitchTokens,
            getSwapDetails,
            getLiquidityDetails,
            getAllowanceAgainstOwnerAndSpender,
            tokens,
            firstTokenSelected: tokenState.tokens[tokenState.firstTokenSelected],
            secondTokenSelected: tokenState.tokens[tokenState.secondTokenSelected],
            isConnected,
            onConfirmSwapConfig,
            slippageToleranceSelected,
            onIncreaseAllow,
            onAllowanceAgaintPair,
            onAddLiquidity,
            //fillPairs,
            pairState,
            cleanPairs,
            onRemoveLiquidity,
            poolColumns,
            poolList,
            setPoolList,
            getPoolList,
            loadPoolDetailByUser,
            getTVLandVolume,
            gralData,
            isStaked,
            setStaked,
            filter,
            getPoolDetailByUser,
            getContractHashAgainstPackageHash
        }}>
            {children}
            <PopupsModule isOpen={progressModal} handleOpen={setProgressModal} progress>
                Check the progress of your <a href={linkExplorer} target='_blank'>deploy</a>.
            </PopupsModule>
            <PopupsModule isOpen={confirmModal} handleOpen={setConfirmModal} progress={false}>
                Your <a href={linkExplorer} target='_blank'>deploy</a> was successful.
            </PopupsModule>
        </ConfigProviderContext.Provider>
    )
}