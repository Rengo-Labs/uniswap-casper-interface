import axios from 'axios';
import BigNumber from 'bignumber.js'
import {
    CLPublicKey,
} from 'casper-js-sdk';
import React, { createContext, ReactNode, useCallback, useEffect, useReducer, useState } from 'react'
import toast from 'react-hot-toast';

import {
    getDeploy,
    makeDeploy,
    putdeploySigner,
    removeLiquidityArgs,
    signdeploywithcaspersigner,
    signDeployWithTorus,
    updateBalances,
} from '../../commons/swap';

import { PopupsModule } from '../../components/organisms';
import { BASE_URL, DEADLINE, NODE_ADDRESS, ROUTER_CONTRACT_HASH } from '../../constant';

import { initialConfigState, ConfigReducer, ConfigActions } from '../../reducers'
import { initialPairsState, PairsReducer } from '../../reducers/PairsReducer';
import { initialStateToken, TokenReducer, tokenReducerEnum } from '../../reducers/TokenReducers';
import { entryPointEnum } from '../../types';

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
    balance: string,
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

    const csprBalance = convertBigNumberToUIString(balance)
    return { balance: csprBalance, mainPurse };
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

async function allowanceAgainstOwnerAndSpenderPaircontract(contractHash, activePublicKey) {
    if (!contractHash || !activePublicKey) {
        return 0
    }

    try {
        const res = await apiClient.getAllowanceAgainstOwnerAndSpenderPairContract(contractHash, CLPublicKey.fromHex(activePublicKey).toAccountHashStr())
        console.log(res)
        return res.allowance;            
    } catch(error) {
        console.log(error);
        console.log(error.response);
    }
}

async function RemoveLiquidityMakeDeploy(publicKeyHex, tokenAAmountPercent, tokenBAmountPercent, runtimeArgs) {
    const publicKey = CLPublicKey.fromHex(publicKeyHex);
    const caller = ROUTER_CONTRACT_HASH;
    const paymentAmount = 5_000_000_000;


    const contractHashAsByteArray = Uint8Array.from(Buffer.from(caller, "hex"));
    const entryPoint = entryPointEnum.Remove_liquidity_js_client

    // Set contract installation deploy (unsigned).
    return await makeDeploy(
        publicKey,
        contractHashAsByteArray,
        entryPoint,
        runtimeArgs,
        paymentAmount
    );
}

async function liquidityAgainstUserAndPair(activePublicKey, pairId) {
    const param = {
        to: Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex"),
        pairid: pairId
    }
    return await axios.post(`${BASE_URL}/liquidityagainstuserandpair`, param)
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
    const [tokenState, tokenDispatch] = useReducer(TokenReducer, initialStateToken);
    const [pairState, pairDispatch] = useReducer(PairsReducer, initialPairsState);
    const { tokens, firstTokenSelected, secondTokenSelected } = tokenState;
    const [progressModal, setProgressModal] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const columns = getColumns()
    const poolColumns = React.useMemo(() => columns, [])
    const [poolList, setPoolList] = useState([])
    const [gralData, setGralData] = useState({})
    const [isStaked, setStaked] = useState(false)

    const [wallet, setWallet] = useState<MaybeWallet>(undefined)

    let debounceConnect = false

    async function connect() {
        if (debounceConnect) {
            return []
        }

        debounceConnect = true
        let w: MaybeWallet

        if (walletSelected === 'casper') {
            try {
                if (wallet) {
                    wallet.disconnect()
                }

                w = new CasperSignerWallet()
                await w.connect()
                setWallet(w)
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
        return [balance, mainPurse, w.publicKeyHex]
    }

    async function onConnectWallet(ignoreError = false) {
        if (wallet?.isConnected) {
            return
        }
        
        if (debounceConnect) {
            return
        }

        const toastLoading = toast.loading("Try to connect your wallet")
        try {
            const [ csprBalance, mainPurse, walletAddress ] = await connect()

            dispatch({ type: ConfigActions.SELECT_MAIN_PURSE, payload: { mainPurse } })
            dispatch({ type: ConfigActions.CONNECT_WALLET, payload: { walletAddress } })
            await fillPairs(walletAddress)
            await updateBalances(walletAddress,
                tokens,
                tokenDispatch,
                secondTokenSelected,
                firstTokenSelected,
                csprBalance
            )

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
            const data = await apiClient.getTokenList()
            const tokens = tokensToObject(data.tokens)
            console.log('TOKENS', tokens)
            dispatch({ type: "UPDATE_TOKENS", payload: { tokens } })
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

    const getPoolList = async () => {
        const result = await axios.get(`${BASE_URL}/getpairlist`)

        if (result.data.success) {

            const pairList = result.data.pairList
            const newList = pairList.map(d => {
                const token0Decimals = initialStateToken.tokens[d.token0.symbol].decimals
                const token1Decimals = initialStateToken.tokens[d.token1.symbol].decimals
                return {
                    tokeIcon1: wethIcon,
                    tokeIcon2: casprIcon,
                    tokenName: d.token0.symbol + "-" + d.token1.symbol,
                    tokenLiquidity: normalizeAmount(d.reserve0, token0Decimals) * parseFloat(d.token0Price) + normalizeAmount(d.reserve1, token1Decimals) * parseFloat(d.token1Price),
                    volume7d: normalizeAmount(d.volumeUSD, 9).toFixed(2),
                    fees24h: 0,
                    oneYFees: 0,
                    volume: normalizeAmount(d.volumeUSD, 9),
                    reserve0: parseFloat(d.reserve0) > 0 ? normalizeAmount(d.reserve0, token0Decimals) : 0.00001,
                    reserve1: parseFloat(d.reserve1) > 0 ? normalizeAmount(d.reserve1, token0Decimals) : 0.00001,
                    totalSupply: parseFloat(d.totalSupply) > 0 ? normalizeAmount(d.totalSupply, token0Decimals) : 0.00001,
                    token0Price: parseFloat(d.token0Price),
                    token1Price: parseFloat(d.token1Price),
                    pair: {
                        token0: d.token0.symbol,
                        token1: d.token1.symbol,
                        token0Liquidity: 0,
                        token1Liquidity: 0,
                        totalLiquidityPool: 0,
                        totalLiquidityUSD: 0,
                        volumePercentage: 0,
                        totalPool: 0
                    }
                }
            })

            return newList
        }

        return []
    }

    const getPoolDetailByUser = async (hash: string, wa: string | number | boolean | void = null) => {

        const result = await axios.post(`${BASE_URL}/getpairagainstuser`, {user: hash})

        if (result.data.success) {
            const pairList = result.data.pairsdata
            const userPairs = result.data.userpairs

            const list = await Promise.all(pairList.map(async d => {
                const data = userPairs.filter(u => u.pair === d.id)
                const token0Decimals = initialStateToken.tokens[d.token0.symbol].decimals
                const token1Decimals = initialStateToken.tokens[d.token1.symbol].decimals

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

    async function fillPairs(walletAddress) {
        try {
            // const respuesta = await getPairAgainstUser(walletAddress)
            // console.log("getPairAgainstUser", respuesta)
            // const otraresp = await getPathReserves(respuesta)
            // console.log("getPathReserves", otraresp)
            const pairList = Object.keys(pairState).map(x => pairState[x])
            for (const pair of pairList) {
                const result: any = await liquidityAgainstUserAndPair(walletAddress, pair.id)
                pairDispatch({ type: "ADD_BALANCE_TO_PAIR", payload: { pair: pair.name, balance: (result.data.liquidity / 10 ** 9).toString() } })
            }
        } catch (error) {
            console.log("fillPairs", error.message)
        }
    }

    function cleanPairs() {
        return PairsWithBalance(pairState)
    }
    function onSelectFirstToken(token) {
        tokenDispatch({ type: tokenReducerEnum.SELECT_FIRST_TOKEN, payload: token })
    }

    function onSelectSecondToken(token) {
        tokenDispatch({ type: tokenReducerEnum.SELECT_SECOND_TOKEN, payload: token })
    }

    function onSwitchTokens() {
        tokenDispatch({ type: tokenReducerEnum.SWITCH_TOKENS, payload: { secondTokenSelected, firstTokenSelected } })
    }

    const [linkExplorer, setLinkExplorer] = useState("")
    const [deployExplorer, setDeployExplorer] = useState("")

    async function onConfirmSwapConfig(amountA: number | string, amountB: number | string, slippage: number) {
        const loadingToast = toast.loading("Swapping.")

        try {
            const [deployHash, deployResult] = await signAndDeploySwap(
                apiClient,
                casperClient,
                wallet,
                DEADLINE,
                convertUIStringToBigNumber(amountA),
                convertUIStringToBigNumber(amountB),
                firstTokenSelected.symbolPair,
                secondTokenSelected.symbolPair,
                slippage / 100,
                mainPurse,
            );

            setProgressModal(true)
            setLinkExplorer(`https://testnet.cspr.live/deploy/${deployHash}`)

            const result = await casperClient.waitForDeployExecution(deployHash)
            setProgressModal(false)
            setConfirmModal(true)

            toast.dismiss(loadingToast)
            return true
        } catch (err) {
            setProgressModal(false)
            toast.dismiss(loadingToast)
            console.log("onConfirmSwapConfig")
            toast.error(`${err}`)
            return false
        }
    }

    async function onIncreaseAllow(amount: number | string, contractHash) {
        const loadingToast = toast.loading("Increasing allowance.")

        try {
            const [deployHash, deployResult] = await signAndDeployAllowance(
                casperClient,
                wallet,
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
            return true
        } catch (err) {
            setProgressModal(false)
            toast.dismiss(loadingToast)
            console.log("onIncreaseAllow")
            toast.error(`${err}`)
            return false
        }
    }
    

    async function onAddLiquidity(amountA: number | string, amountB: number | string, slippage: number) {
        const loadingToast = toast.loading("Adding liquidity.")
        try {
            const [deployHash, deployResult] = await signAndDeployAddLiquidity(
                apiClient,
                casperClient,
                wallet,
                DEADLINE,
                convertUIStringToBigNumber(amountA),
                convertUIStringToBigNumber(amountB),
                firstTokenSelected,
                secondTokenSelected,
                slippage / 100,
                mainPurse,
            )

            setProgressModal(true)
            setLinkExplorer(`https://testnet.cspr.live/deploy/${deployHash}`)

            const result = await getDeploy(deployHash);
            setProgressModal(false)
            setConfirmModal(true)

            toast.dismiss(loadingToast)
            toast.success("Success.")
            return true
        } catch (err) {
            setProgressModal(false)
            toast.dismiss(loadingToast)
            console.log("onAddLiquidity")
            toast.error(`${err}`)
            return false
        }
    }  

    async function onRemoveLiquidity(liquidity: number | string, tokenA: Token, tokenB: Token, amountA: number | string, amountB: number | string, slippage: number) {
        const loadingToast = toast.loading("Removing liquidity.")
        try {
            const [deployHash, deployResult] = await signAndDeployRemoveLiquidity(
                apiClient,
                casperClient,
                wallet,
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

            const result = await getDeploy(deployHash)
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
            if (wallet) {
                wallet.disconnect()
                
                dispatch({ type: ConfigActions.DISCONNECT_WALLET })

                toast.success("Your wallet is disconnected")
            }
        } catch (error) {
            toast.error("Error disconnecting wallet")
        }
    }

    function onChangeWallet() {
        if (walletSelected === "casper") {
            dispatch({ type: ConfigActions.SELECT_WALLET, payload: { walletSelected: 'torus' } })
        } else {
            dispatch({ type: ConfigActions.SELECT_WALLET, payload: { walletSelected: 'casper' } })
        }
    }

    async function onAllowanceAgaintPair(pair) {
        await allowanceAgainstOwnerAndSpenderPaircontract(pair, walletAddress)
    }

    function getAccountHash(wa: string | number | boolean | void = null): string {
        return Buffer.from(CLPublicKey.fromHex(wa as any ?? wallet.publicKeyHex).toAccountHash()).toString("hex")
    }

    return (
        <ConfigProviderContext.Provider value={{
            getAccountHash,
            onConnectWallet,
            onDisconnectWallet,
            onChangeWallet,
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
            firstTokenSelected,
            secondTokenSelected,
            isConnected,
            onConfirmSwapConfig,
            slippageToleranceSelected,
            onIncreaseAllow,
            onAllowanceAgaintPair,
            onAddLiquidity,
            fillPairs,
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