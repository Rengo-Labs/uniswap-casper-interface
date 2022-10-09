import Torus from '@toruslabs/casper-embed';
import axios from 'axios';
import {
    AccessRights,
    CasperServiceByJsonRPC, CLAccountHash,
    CLByteArray,
    CLKey,
    CLList,
    CLOption,
    CLPublicKey,
    CLValueBuilder,
    RuntimeArgs,
    Signer
} from 'casper-js-sdk';
import React, { createContext, ReactNode, useCallback, useEffect, useReducer, useState } from 'react'
import toast from 'react-hot-toast';

import {
    CLBArray,
    convertToString,
    createRecipientAddress,
    createRuntimeArgs,
    createSwapRuntimeArgs, createSwapRuntimeArgs2, createSwapToReceiveCSPRRuntimeArgs,
    getDeploy,
    getswapPath,
    makeDeploy,
    makeDeployLiquidity,
    makeDeployLiquidityWasm,
    makeDeployWasm,
    putdeploy,
    putdeploySigner,
    removeLiquidityArgs,
    removeLiquidityPutDeploy,
    selectEntryPoint,
    signdeploywithcaspersigner,
    signDeployWithTorus,
    updateBalances,
    withPutDeploy
} from '../../commons/swap';

import ConfirmModal from '../../components/organisms/ConfirmModal';
import PopupModal from '../../components/organisms/PopupModal';
import { createRuntimeeArgsPool } from '../../components/pages/Liquidity/study';
import { BASE_URL, CHAINS, DEADLINE, NODE_ADDRESS, ROUTER_CONTRACT_HASH, ROUTER_PACKAGE_HASH, SUPPORTED_NETWORKS, URL_DEPLOY } from '../../constant';

import { initialConfigState, ConfigReducer, ConfigActions } from '../../reducers'
import { initialPairsState, PairsReducer } from '../../reducers/PairsReducer';
import { initialStateToken, TokenReducer, tokenReducerEnum } from '../../reducers/TokenReducers';
import { initialStateWallet, reducerWallet } from '../../reducers/WalletReducers';
import { entryPointEnum } from '../../types';
import wethIcon from "../../assets/swapIcons/wethIcon.svg";
import casprIcon from "../../assets/swapIcons/casprIcon.png";
import {convertNumber} from "../PoolsContext";

export const ConfigProviderContext = createContext<any>({})
let torus;

function convertToStr(x) { return x.toString() }

async function tryToConnectSigner() {
    try {
        return await Signer.getActivePublicKey()
    } catch (error) {
        await Signer.sendConnectionRequest()
        return false
    }
}
export function clientDispatcher() {
    return new CasperServiceByJsonRPC(NODE_ADDRESS);
}

export async function getStatus(walletAddress) {
    const casperService = clientDispatcher()
    const stateRootHash = await casperService.getStateRootHash();
    const result = await casperService.getBlockState(
        stateRootHash,
        CLPublicKey.fromHex(walletAddress).toAccountHashStr(),
        []
    );
    const mainPurse = result.Account.mainPurse
    const balance: any = await casperService.getAccountBalance(
        stateRootHash,
        result.Account.mainPurse
    );
    const csprBalance = balance / 10 ** 9;
    return { csprBalance, mainPurse };
}

function loadTokens(dispatch) {
    fetch(`${BASE_URL}/tokensList`)
        .then(data => data.json())
        .then(tokenList => {
            dispatch({ type: "UPDATE_TOKENS", payload: { tokens: tokensToObject(tokenList.tokens) } })
        })
        .catch(err => console.error(err))
}

function tokensToObject(listTokens) {
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

async function swapMakeDeploy(
    publicKeyHex,
    deadline,
    paymentAmount,
    amount_in,
    amount_out_min,
    tokenASymbol,
    tokenBSymbol,
    slippSwapToken,
    mainPurse,
) {
    try {
        const publicKey = CLPublicKey.fromHex(publicKeyHex);
        const _paths = await getswapPath(tokenASymbol, tokenBSymbol);
        const entryPoint = selectEntryPoint(tokenASymbol, tokenBSymbol)
        console.log("EntryPoint", entryPoint, tokenASymbol, tokenBSymbol, amount_out_min)
        if (tokenASymbol !== "WCSPR" && tokenBSymbol !== "WCSPR") {
            return createSwapRuntimeArgs(
                amount_in,
                amount_out_min,
                slippSwapToken,
                _paths,
                publicKey,
                mainPurse,
                deadline,
                entryPoint
            )
        } if (tokenBSymbol === "WCSPR") {
            return createSwapRuntimeArgs2(
                amount_in,
                amount_out_min,
                slippSwapToken,
                _paths,
                publicKey,
                mainPurse,
                deadline,
                entryPoint
            )
        } else {
            const runtimeArgs = createRuntimeArgs(
                amount_in,
                amount_out_min,
                slippSwapToken,
                _paths,
                publicKey,
                mainPurse,
                deadline,
                entryPoint
            );

            return await makeDeployWasm(
                publicKey,
                runtimeArgs,
                paymentAmount,
            );
        }

    } catch (error) {
        console.log("Paso error")
        return false
    }
}

/***
 * it returns tokensToTransfer, priceImpact, minTokenBToTransfer, exchangeRateA and exchangeRateB that belong to the swap detail
 * @param firstTokenSelected
 * @param secondTokenSelected
 * @param value
 * @param slippage
 * @param fee
 */
async function getSwapDetail(firstTokenSelected, secondTokenSelected, value, slippage = 0.005, fee = 0.003) {
    try {
        //const response = await getPairTokenReserve(firstTokenSelected.symbolPair, secondTokenSelected.symbolPair)
        const response = await axios.post(`${BASE_URL}/getpathreserves`, {
            path: [
                firstTokenSelected.symbolPair,
                secondTokenSelected.symbolPair,
            ]
        })
        if (response.data.success) {

            const liquidityA = parseFloat(response.data.reserve0)
            const liquidityB = parseFloat(response.data.reserve1)
            const tokenToTrade = parseFloat(value) * (1 - fee)

            const constantProduct = liquidityA * liquidityB
            console.log("liquidityA", liquidityA, "liquidityB", liquidityB, "constant_product", constantProduct, "tokenToTrade", tokenToTrade)

            const newLiquidityAPool = liquidityA + tokenToTrade
            const newLiquidityBPool = constantProduct / newLiquidityAPool
            console.log("new_liquidity_a_pool", newLiquidityAPool, "new_liquidity_b_pool", newLiquidityBPool)

            const tokensToTransfer = (liquidityB - newLiquidityBPool)
            console.log("tokensToTransfer", tokensToTransfer)

            const exchangeRateA = tokensToTransfer / parseFloat(value)
            const exchangeRateB = parseFloat(value) / tokensToTransfer
            console.log("exchangeRateA", exchangeRateA, "exchangeRateB", exchangeRateB)

            const priceImpact = ((tokenToTrade / (liquidityA + tokenToTrade)) * 100)
            console.log("priceImpact", priceImpact)

            return {
                tokensToTransfer: tokensToTransfer.toFixed(8),
                priceImpact: priceImpact >= 0.01 ? priceImpact.toFixed(2) : '<0.01',
                exchangeRateA,
                exchangeRateB
            }
        }
        throw Error()
    } catch (error) {
        console.log(__filename, "getSwapDetail", error)
        return { tokensToTransfer: 0, tokenPrice: 0, priceImpact: 0, exchangeRateA: 0, exchangeRateB: 0 }
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

async function allowanceAgainstOwnerAndSpenderPaircontract(pair, activePublicKey) {
    const allowanceParam = {
        contractHash: pair,
        owner: CLPublicKey.fromHex(activePublicKey)
            .toAccountHashStr()
            .slice(13),
        spender: ROUTER_PACKAGE_HASH,
    };
    axios
        .post(`${BASE_URL}/allowanceagainstownerandspenderpaircontract`, allowanceParam)
        .then((res) => {
            console.log("allowanceagainstownerandspenderpaircontract", res);
            console.log(res.data);
        })
        .catch((error) => {
            console.log(error);
            console.log(error.response);
        });
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
async function RemoveLiquidityCSPRMakeDeploy(publicKeyHex, tokenA, tokenB, tokenAAmountPercent, tokenBAmountPercent, liquidity, slippage, value) {
    const publicKey = CLPublicKey.fromHex(publicKeyHex);
    let token;
    let cspr_Amount;
    let token_Amount;
    if (tokenA.symbol === "WCSPR") {
        token = tokenB.packageHash;
        cspr_Amount = tokenAAmountPercent.toFixed(9);
        token_Amount = tokenBAmountPercent.toFixed(9);
    } else {
        token = tokenA.packageHash;
        cspr_Amount = tokenBAmountPercent.toFixed(9);
        token_Amount = tokenAAmountPercent.toFixed(9);
    }
    const deadline = 1739598100811;
    const paymentAmount = 8000000000;

    const _token = new CLByteArray(
        Uint8Array.from(Buffer.from(token.slice(5), "hex"))
    );

    const runtimeArgs = RuntimeArgs.fromMap({
        amount: CLValueBuilder.u512(convertToStr(Number(cspr_Amount - (cspr_Amount * slippage) / 100).toFixed(9))),
        destination_entrypoint: CLValueBuilder.string("remove_liquidity_cspr"),
        router_hash: new CLKey(new CLByteArray(Uint8Array.from(Buffer.from(ROUTER_PACKAGE_HASH, "hex")))),
        token: new CLKey(_token),
        liquidity: CLValueBuilder.u256(convertToStr((liquidity * value) / 100)),
        amount_cspr_min: CLValueBuilder.u256(
            convertToStr(
                Number(cspr_Amount - (cspr_Amount * slippage) / 100).toFixed(9)
            )
        ),
        amount_token_min: CLValueBuilder.u256(
            convertToStr(
                Number(token_Amount - (token_Amount * slippage) / 100).toFixed(9)
            )
        ),
        to: createRecipientAddress(publicKey),
        deadline: CLValueBuilder.u256(deadline),
    });

    return await makeDeployWasm(
        publicKey,
        runtimeArgs,
        paymentAmount
    );
}

async function increaseAndDecreaseAllowanceMakeDeploy(activePublicKey, contractHash, amount, increase) {
    try {
        const publicKey = CLPublicKey.fromHex(activePublicKey);
        const spender = ROUTER_PACKAGE_HASH;
        const spenderByteArray = new CLByteArray(
            Uint8Array.from(Buffer.from(spender, "hex"))
        );
        const paymentAmount = 5_000_000_000;
        const runtimeArgs = RuntimeArgs.fromMap({
            spender: createRecipientAddress(spenderByteArray),
            amount: CLValueBuilder.u256(convertToString(amount)),
        });
        const contractHashAsByteArray = Uint8Array.from(
            Buffer.from(contractHash.slice(5), "hex")
        );
        const entryPoint = increase ? entryPointEnum.Increase_allowance : entryPointEnum.Decrease_allowance;
        // Set contract installation deploy (unsigned).
        const deploy = await makeDeployLiquidity(
            publicKey,
            contractHashAsByteArray,
            entryPoint,
            runtimeArgs,
            paymentAmount
        );

        //const deploy = await makeDeployLiquidityWasm(publicKey, runtimeArgs, paymentAmount)
        return deploy
    } catch (error) {
        console.log(__filename, "increaseAndDecreaseAllowanceMakeDeploy", error);
        throw Error()
    }
}

async function addLiquidityMakeDeploy(
    activePublicKey,
    tokenB,
    tokenAAmount,
    tokenBAmount,
    slippage,
    mainPurse,
) {
    const publicKeyHex = activePublicKey;
    const publicKey = CLPublicKey.fromHex(publicKeyHex);
    const tokenBAddress = tokenB?.packageHash;
    const token_AAmount = tokenAAmount;
    const token_BAmount = tokenBAmount;
    const deadline = 1739598100811;
    const paymentAmount = 10000000000;

    const _token_b = new CLByteArray(
        Uint8Array.from(Buffer.from(tokenBAddress.slice(5), "hex"))
    );
    const pair = new CLByteArray(
        Uint8Array.from(Buffer.from(tokenBAddress.slice(5), "hex"))
    );
    const runtimeArgs = createRuntimeeArgsPool(
        token_AAmount,
        _token_b,
        token_BAmount,
        slippage,
        publicKey,
        mainPurse,
        deadline,
        pair,
        ROUTER_PACKAGE_HASH
    );
    const deploy = makeDeployWasm(
        publicKey,
        runtimeArgs,
        paymentAmount
    );
    return deploy;
}

async function liquidityAgainstUserAndPair(activePublicKey, pairId) {
    const param = {
        to: Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex"),
        pairid: pairId
    }
    return await axios.post(`${BASE_URL}/liquidityagainstuserandpair`, param)
}

async function getPairAgainstUser(activePublicKey) {
    const param = {
        user: Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")
    }
    console.log(JSON.stringify(param))
    const resp = await axios.post(`${BASE_URL}/getpairagainstuser`, param)
    return resp
}

async function getPathReserves(resp) {
    for (let i = 0; i < resp.data.userpairs.length; i++) {
        const pathParamsArr = [
            resp.data.pairsdata[i].token0.symbol,
            resp.data.pairsdata[i].token1.symbol,
        ]
        const pathResParam = {
            path: pathParamsArr
        }
        return await axios.post(`${BASE_URL}/getpathreserves`, pathResParam)
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
    const [tokenState, tokenDispatch] = useReducer(TokenReducer, initialStateToken);
    const [pairState, pairDispatch] = useReducer(PairsReducer, initialPairsState);
    const { tokens, firstTokenSelected, secondTokenSelected } = tokenState;
    const [swapModal, setSwapModal] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const columns = getColumns()
    const poolColumns = React.useMemo(() => columns, [])
    const [poolList, setPoolList] = useState([])
    const [gralData, setGralData] = useState({})
    const [isStaked, setStaked] = useState(false)

    let debounceConnect = false

    async function connect() {
        if (debounceConnect) {
            return []
        }

        debounceConnect = true
        let walletAddress: string | false

        if (walletSelected === 'casper') {
            try {
                walletAddress = await tryToConnectSigner()
            } catch (e) {
                debounceConnect = false
                throw e
            }
            if (!walletAddress) {
                debounceConnect = false
                throw new Error("casper signer error")
            }
            //Load user's pool detail
            const poolList = await getPoolList()
            //TODO user's HASH hardcoded
            const accountHash = getAccountHash(walletAddress)
            const list = await loadPoolDetailByUser(accountHash, poolList)
            setPoolList(list)

            console.log("Try to load", list)
        } else {
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
        }

        const { csprBalance, mainPurse } = await getStatus(walletAddress)
        debounceConnect = false
        return [csprBalance, mainPurse, walletAddress ]
    }

    async function onConnectConfig(ignoreError = false) {
        if (debounceConnect) {
            return
        }

        const toastLoading = toast.loading("Try to connect your wallet")
        try {
            const [ csprBalance, mainPurse, walletAddress ] = await connect()

            console.log("csprBalance", csprBalance)

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

            //Load user's pool detail
            const poolList = await getPoolList()
            //TODO user's HASH hardcoded
            const list = await loadPoolDetailByUser("4a2d7b35723a70c69e0f4c01df65df9bf8dced1d1542f11426aed570bcf2cbab", poolList)
            setPoolList(list)

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
        loadTokens(tokenDispatch)
    }, [])

    useEffect(() => {
        // console.log("localStorage.getItem(selectedWallet)", localStorage.getItem("selectedWallet"));
        // if (props.selectedWallet === "Casper" || localStorage.getItem("selectedWallet") === "Casper") {
        window.addEventListener('signer:connected', msg => {
            console.log("signer:connected", msg)
            onConnectConfig()
        });
        window.addEventListener('signer:disconnected', msg => {
            console.log("signer:disconnected", msg)
            onDisconnectWallet()
        });
        window.addEventListener('signer:tabUpdated', msg => {
            console.log("signer:tabUpdated", msg)
            //onConnectConfig()
        });
        window.addEventListener('signer:activeKeyChanged', msg => {
            console.log("signer:activeKeyChanged", msg)
            onConnectConfig()
        });
        window.addEventListener('signer:locked', msg => {
            console.log("signer:locked", msg)
            onDisconnectWallet()
        });
        window.addEventListener('signer:unlocked', msg => {
            console.log("signer:unlocked", msg)
            onConnectConfig()
        });
        window.addEventListener('signer:initialState', msg => {
            console.log("signer:initialState", msg)
            connect()
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
                return {
                    tokeIcon1: wethIcon,
                    tokeIcon2: casprIcon,
                    tokenName: d.token0.symbol + "-" + d.token1.symbol,
                    tokenLiquidity: convertNumber(parseFloat(d.token0.totalLiquidity) + parseFloat(d.token1.totalLiquidity)),
                    volume7d: parseFloat(d.volumeUSD).toFixed(2),
                    fees24h: 0,
                    oneYFees: 0,
                    volume: parseFloat(d.volumeUSD),
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

    const getPoolDetailByUser = async (hash) => {

        const result = await axios.post(`${BASE_URL}/getpairagainstuser`, {user: hash})

        if (result.data.success) {
            const pairList = result.data.pairsdata
            const list = pairList.map(d => {
                return {
                    token0: d.token0.symbol,
                    token1: d.token1.symbol,
                    token0Liquidity: convertNumber(parseFloat(d.token0.totalLiquidity)),
                    token1Liquidity: convertNumber(parseFloat(d.token1.totalLiquidity)),
                    totalLiquidityPool: convertNumber(parseFloat(d.token0.totalLiquidity) + parseFloat(d.token1.totalLiquidity)),
                    totalLiquidityUSD: convertNumber(parseFloat(d.token0.totalLiquidity) * parseFloat(d.token0Price) + parseFloat(d.token1.totalLiquidity) * parseFloat(d.token1Price)),
                    volume: parseFloat(d.volumeUSD),
                    totalPool: parseFloat(d.token0.totalLiquidity) + parseFloat(d.token1.totalLiquidity)
                }
            })

            return list
        }

        return []
    }

    const loadPoolDetailByUser = async (hash, poolList) => {
        const list = await getPoolDetailByUser(hash)

        const newList = poolList.map(d => {
            const data = list.filter(f => d.pair.token0 === f.token0 && d.pair.token1 === f.token1 || d.pair.token1 === f.token0 && d.pair.token0 === f.token1)
            if (data.length > 0) {
                return {...d, pair: data[0]}
            }
            return d
        })

        return newList
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

    async function onConfirmSwapConfig(amoutSwapTokenA, amoutSwapTokenB, slippSwapToken) {
        setSwapModal(true)

        try {
            const deploy = await swapMakeDeploy(walletAddress,
                DEADLINE,
                gasPriceSelected,
                amoutSwapTokenA,
                amoutSwapTokenB,
                firstTokenSelected.symbolPair,
                secondTokenSelected.symbolPair,
                slippSwapToken,
                mainPurse,
            );

            if (walletSelected === 'torus') {
                const signedDeploy = await signDeployWithTorus(deploy)
                const deployHash = `https://testnet.cspr.live/deploy/${signedDeploy.deploy_hash}`
                setDeployExplorer(deployHash || "")
                console.log("deploy_hash", signedDeploy.deploy_hash)
                const result = await getDeploy(signedDeploy.deploy_hash);
                setSwapModal(false)
                setLinkExplorer(`https://testnet.cspr.live/deploy/${result}`)
                setConfirmModal(true)
                console.log("result", result)
                return true
            }
            if (walletSelected === 'casper') {
                const signedDeploy = await signdeploywithcaspersigner(deploy, walletAddress)

                const result = await withPutDeploy(signedDeploy, setDeployExplorer);
                setLinkExplorer(`https://testnet.cspr.live/deploy/${result}`)
                setSwapModal(false)
                setConfirmModal(true)
                console.log(result)
                return true
            }
        } catch (error) {
            setSwapModal(false)
            console.log("onConfirmSwapConfig")
            return false
        }
    }

    async function onDisconnectWallet() {
        if (isConnected && walletSelected === "casper") {
            try {
                const wallet = await tryToConnectSigner()
                dispatch({ type: ConfigActions.DISCONNECT_WALLET })

                const poolList = await getPoolList()
                setPoolList(poolList)
                toast.success("your wallet is unmounted")
            } catch (error) {
                toast.error("Ooops we have an error")
            }
        } else if (isConnected && walletSelected === "torus") {
            await torus.logout();
            dispatch({ type: ConfigActions.DISCONNECT_WALLET })
            toast.success("your wallet is unmounted")
        }
    }

    function onChangeWallet() {
        if (walletSelected === "casper") {
            dispatch({ type: ConfigActions.SELECT_WALLET, payload: { walletSelected: 'torus' } })
        } else {
            dispatch({ type: ConfigActions.SELECT_WALLET, payload: { walletSelected: 'casper' } })
        }
    }

    async function onIncreaseAllow(amount, contractHash, tokenAAmount, balance) {
        console.log("onIncreaseAllow")
        if (tokenAAmount > balance) {
            toast.error("Your balance is more less than the amount that you want to approve")
            return false
        }
        const loadingToast = toast.loading("let me try to allow liquidity! be patient!")

        try {
            const valueTotal = amount * 10 ** 9
            const deploy = await increaseAndDecreaseAllowanceMakeDeploy(walletAddress, contractHash, valueTotal, true)
            if (walletSelected === 'casper') {
                const signedDeploy = await signdeploywithcaspersigner(deploy, walletAddress)
                const result = await putdeploySigner(signedDeploy);
                toast.dismiss(loadingToast)
                toast.success("Got it! token was allowed!")
                return true
            }
            if (walletSelected === 'torus') {
                const signedDeploy = await signDeployWithTorus(deploy)
                console.log("deploy_hash", signedDeploy.deploy_hash)
                const result = await getDeploy(signedDeploy.deploy_hash);
                toast.dismiss(loadingToast)
                toast.success(`Got it! take your swap!`)
                console.log(result)
                return true
            }
        } catch (error) {
            toast.dismiss(loadingToast)
            console.log("onIncreaseAllow")
            toast.error("Ooops, we have a problem")
            return false
        }
    }

    async function onDecreaseAllow(amount) {
        const loadingToast = toast.loading("let me try to remove liquidity! be patient!")
        try {
            const valueTotal = amount * 10 ** 9
            const deploy = await increaseAndDecreaseAllowanceMakeDeploy(walletAddress, secondTokenSelected.contractHash, valueTotal, false)
            if (walletSelected === 'casper') {
                const signedDeploy = await signdeploywithcaspersigner(deploy, walletAddress)
                const result = await putdeploySigner(signedDeploy);
                toast.dismiss(loadingToast)
                toast.success("Got it! token was allowed!")
                return true
            }
            if (walletSelected === 'torus') {
                const signedDeploy = await signDeployWithTorus(deploy)
                console.log("deploy_hash", signedDeploy.deploy_hash)
                const result = await getDeploy(signedDeploy.deploy_hash);
                toast.dismiss(loadingToast)
                toast.success(`Got it! take your swap!`)
                console.log(result)
                return true
            }
        } catch (error) {
            toast.dismiss(loadingToast)
            console.log("onDecreaseAllow")
            toast.error("Ooops, we have a problem")
            return false
        }
    }

    async function onAddLiquidity(amountA, amountB) {
        const loadingToast = toast.loading("let me try to add liquidity! be patient!")
        try {
            const deploy = await addLiquidityMakeDeploy(walletAddress, secondTokenSelected, amountA, amountB, slippageToleranceSelected, mainPurse)
            if (walletSelected === 'casper') {
                console.log("signing add liquidity")
                const signedDeploy = await signdeploywithcaspersigner(deploy, walletAddress)
                const result = await putdeploySigner(signedDeploy);
                toast.dismiss(loadingToast)
                toast.success("Got it! both token were added!!")
                console.log(result)
                return true
            }
            if (walletSelected === 'torus') {
                console.log("signing add liquidity")
                const signedDeploy = await signdeploywithcaspersigner(deploy, walletAddress)
                const result = await putdeploySigner(signedDeploy);
                toast.dismiss(loadingToast)
                toast.success("Got it! both token were added!!")
                console.log(result)
                return true
            }
        } catch (error) {
            toast.dismiss(loadingToast)
            console.log("onAddLiquidity")
            toast.error("Ooops, we have a problem")
            return false
        }
    }

    async function onRemoveLiquidity(amountA, amountB) {
        const loadingToast = toast.loading("let me try to remove liquidity! be patient!")
        try {
            const contractA = firstTokenSelected.contractHash
            const contractB = secondTokenSelected.contractHash
            const runtimeArgs = removeLiquidityArgs(
                contractA,
                contractB,
                1,
                1,
                slippageToleranceSelected,
                1,
                1,
                walletAddress
            )
            const deploy = await RemoveLiquidityMakeDeploy(walletAddress, 0.1, 0.1, runtimeArgs)
            if (walletSelected === 'casper') {
                console.log("signing add liquidity")
                const signedDeploy = await signdeploywithcaspersigner(deploy, walletAddress)
                const result = await removeLiquidityPutDeploy(signedDeploy, walletAddress);
                toast.dismiss(loadingToast)
                toast.success("Got it! both token were added!!")
                console.log(result)
                return true
            }
            if (walletSelected === 'torus') {
                console.log("signing add liquidity")
                const signedDeploy = await signdeploywithcaspersigner(deploy, walletAddress)
                const result = await putdeploySigner(signedDeploy);
                toast.dismiss(loadingToast)
                toast.success("Got it! both token were added!!")
                console.log(result)
                return true
            }
        } catch (error) {
            toast.dismiss(loadingToast)
            console.log("onRemoveLiquidity")
            toast.error("Ooops, we have a problem")
            return false
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

    async function onAllowanceAgaintPair(pair) {
        await allowanceAgainstOwnerAndSpenderPaircontract(pair, walletAddress)
    }

    function getAccountHash(wa: string | boolean = false) {
        console.log('getAccountHash', wa ?? walletAddress)
        //return "4a2d7b35723a70c69e0f4c01df65df9bf8dced1d1542f11426aed570bcf2cbab"
        return Buffer.from(CLPublicKey.fromHex(wa ?? walletAddress).toAccountHash()).toString("hex")
    }

    return (
        <ConfigProviderContext.Provider value={{
            getAccountHash,
            onConnectConfig,
            onDisconnectWallet,
            onChangeWallet,
            configState: state,
            tokenState,
            tokenDispatch,
            onSelectFirstToken,
            onSelectSecondToken,
            onSwitchTokens,
            onCalculateReserves,
            getSwapDetail,
            tokens,
            firstTokenSelected,
            secondTokenSelected,
            isConnected,
            onConfirmSwapConfig,
            slippageToleranceSelected,
            onIncreaseAllow,
            onDecreaseAllow,
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
            getTVLandVolume,
            gralData,
            isStaked,
            setStaked,
            filter
        }}>
            {children}
            <PopupModal display={swapModal ? 1 : 0} handleModal={setSwapModal} tokenA={firstTokenSelected.symbol} tokenB={secondTokenSelected.symbol} />
            <ConfirmModal display={confirmModal ? 1 : 0} handleModal={setConfirmModal} linkExplorer={linkExplorer} />
        </ConfigProviderContext.Provider>
    )
}