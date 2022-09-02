import Torus from '@toruslabs/casper-embed';
import axios from 'axios';
import { AccessRights, CasperServiceByJsonRPC, CLByteArray, CLKey, CLOption, CLPublicKey, CLValueBuilder, RuntimeArgs, Signer } from 'casper-js-sdk';
import React, { createContext, ReactNode, useCallback, useEffect, useReducer, useState } from 'react'
import toast from 'react-hot-toast';
import { CLBArray, convertToString, createRecipientAddress, createRuntimeArgs, createSwapRuntimeArgs, getDeploy, getswapPath, makeDeploy, makeDeployLiquidity, makeDeployLiquidityWasm, makeDeployWasm, putdeploy, putdeploySigner, removeLiquidityArgs, removeLiquidityPutDeploy, signdeploywithcaspersigner, signDeployWithTorus, updateBalances } from '../../commons/swap';
import { createRuntimeeArgsPool } from '../../components/pages/Liquidity/study';
import { BASE_URL, CHAINS, DEADLINE, NODE_ADDRESS, ROUTER_CONTRACT_HASH, ROUTER_PACKAGE_HASH, SUPPORTED_NETWORKS, URL_DEPLOY } from '../../constant';

import { initialConfigState, ConfigReducer, ConfigActions } from '../../reducers'
import { initialPairsState, PairsReducer } from '../../reducers/PairsReducer';
import { initialStateToken, TokenReducer, tokenReducerEnum } from '../../reducers/TokenReducers';
import { initialStateWallet, reducerWallet } from '../../reducers/WalletReducers';
import { entryPointEnum } from '../../types';

export const ConfigProviderContext = createContext<any>({})
let torus;
function convertToStr(x){return x.toString()}
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
        let _paths = await getswapPath(tokenASymbol, tokenBSymbol);
        if (tokenASymbol !== "WCSPR" && tokenBSymbol !== "WCSPR") {
            return createSwapRuntimeArgs(
                amount_in,
                slippSwapToken,
                _paths,
                publicKey,
                mainPurse,
                deadline)
        } else {
            const runtimeArgs = createRuntimeArgs(
                amount_in,
                slippSwapToken,
                _paths,
                publicKey,
                mainPurse,
                deadline
            );

            return await makeDeployWasm(
                publicKey,
                runtimeArgs,
                paymentAmount,
            );
        }

    } catch (error) {
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
        const response = await axios.post(`${BASE_URL}/getpathreserves`, {
            path: [
                firstTokenSelected.symbolPair,
                secondTokenSelected.symbolPair,
            ]
        })
        if (response.data.success) {

            const liquidityA = response.data.reserve0
            const liquidityB = response.data.reserve1
            const poolExchangeRate = liquidityB / liquidityA

            const constantProduct = liquidityA * liquidityB

            const newLiquidityAPool = liquidityA + parseFloat(value) * (1 - fee)

            const newLiquidityBPool = constantProduct / newLiquidityAPool

            const tokensToTransfer = liquidityB - newLiquidityBPool

            const exchangeRateA = tokensToTransfer / parseFloat(value) * (1 - fee)

            const exchangeRateB = parseFloat(value) * (1 - fee) / tokensToTransfer

            const priceImpact = ((1 - parseFloat(value) / (liquidityA + parseFloat(value))) * 100).toFixed(2)

            return { tokensToTransfer: tokensToTransfer.toFixed(8), priceImpact, exchangeRateA, exchangeRateB }
        }
        throw Error()
    } catch (error) {
        console.log(__filename, "getSwapDetail", error)
        return { tokensToTransfer: 0, tokenPrice: 0, priceImpact: 0, exchangeRateA: 0, exchangeRateB: 0 }
    }
}

const calculateMinimumTokenReceived = (tokensToTransfer, slippage) => {
    return (tokensToTransfer - tokensToTransfer * slippage / 100).toFixed(8)
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
    let allowanceParam = {
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


    let contractHashAsByteArray = Uint8Array.from(Buffer.from(caller, "hex"));
    let entryPoint = entryPointEnum.Remove_liquidity_js_client

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
        let contractHashAsByteArray = Uint8Array.from(
            Buffer.from(contractHash.slice(5), "hex")
        );
        let entryPoint = increase ? entryPointEnum.Increase_allowance : entryPointEnum.Decrease_allowance;
        // Set contract installation deploy (unsigned).
        let deploy = await makeDeployLiquidity(
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
    let deploy = makeDeployWasm(
        publicKey,
        runtimeArgs,
        paymentAmount
    );
    return deploy;
}

async function liquidityAgainstUserAndPair(activePublicKey, pairId) {
    let param = {
        to: Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex"),
        pairid: pairId
    }
    return await axios.post(`${BASE_URL}/liquidityagainstuserandpair`, param)
}

async function getPairAgainstUser(activePublicKey) {
    let param = {
        user: Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")
    }
    console.log(JSON.stringify(param))
    const resp = await axios.post(`${BASE_URL}/getpairagainstuser`, param)
    return resp
}

async function getPathReserves(resp) {
    for (let i = 0; i < resp.data.userpairs.length; i++) {
        let pathParamsArr = [
            resp.data.pairsdata[i].token0.symbol,
            resp.data.pairsdata[i].token1.symbol,
        ]
        let pathResParam = {
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
    const {
        isConnected,
        walletAddress,
        walletSelected,
        languagesSelected,
        visualModeSelected,
        slippageToleranceSelected,
        gasPriceSelected,
        mainPurse } = state
    useEffect(() => {
        loadTokens(tokenDispatch)
    }, [])

    async function fillPairs(walletAddress) {
        try {
            // const respuesta = await getPairAgainstUser(walletAddress)
            // console.log("getPairAgainstUser", respuesta)
            // const otraresp = await getPathReserves(respuesta)
            // console.log("getPathReserves", otraresp)
            const pairList = Object.keys(pairState).map(x => pairState[x])
            for (let pair of pairList) {
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
    async function onConnectConfig() {
        const ToasLoading = toast.loading("Try to connect your wallet")
        if (walletSelected === 'casper') {
            const walletAddress = await tryToConnectSigner()
            if (!walletAddress) {
                toast.dismiss(ToasLoading)
                toast.error("Ooops we have an error")
            }
            else {
                const { csprBalance, mainPurse } = await getStatus(walletAddress)
                tokenDispatch({ type: tokenReducerEnum.LOAD_BALANCE, payload: { name: "CSPR", data: csprBalance } })
                await updateBalances(walletAddress,
                    tokens,
                    tokenDispatch,
                    secondTokenSelected)
                console.log("csprBalance", csprBalance)
                dispatch({ type: ConfigActions.SELECT_MAIN_PURSE, payload: { mainPurse } })
                dispatch({ type: ConfigActions.CONNECT_WALLET, payload: { walletAddress } })
                fillPairs(walletAddress)
                toast.dismiss(ToasLoading)
                toast.success("your wallet is mounted and ready to ride!")
            }
        } else {
            torus = new Torus();
            await torus.init({
                buildEnv: "testing",
                showTorusButton: true,
                network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
            });
            const walletAddress = (await torus?.login())[0];
            const { csprBalance, mainPurse } = await getStatus(walletAddress)
            tokenDispatch({ type: tokenReducerEnum.LOAD_BALANCE, payload: { name: "CSPR", data: csprBalance } })
            await updateBalances(walletAddress,
                tokens,
                tokenDispatch,
                secondTokenSelected)
            console.log("csprBalance", csprBalance)
            dispatch({ type: ConfigActions.SELECT_MAIN_PURSE, payload: { mainPurse } })
            dispatch({ type: ConfigActions.CONNECT_WALLET, payload: { walletAddress } })
            fillPairs(walletAddress)
            toast.dismiss(ToasLoading)
            toast.success("your wallet is mounted and ready to ride!")
        }
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

    async function onConfirmSwapConfig(amoutSwapTokenA, amoutSwapTokenB) {
        const loadingToast = toast.loading("let me try to swap! be patient!")
        try {
            const deploy = await swapMakeDeploy(walletAddress,
                DEADLINE,
                gasPriceSelected,
                amoutSwapTokenA,
                amoutSwapTokenB,
                firstTokenSelected.symbolPair,
                secondTokenSelected.symbolPair,
                slippageToleranceSelected,
                mainPurse,
            );
            if (walletSelected === 'torus') {
                const signedDeploy = await signDeployWithTorus(deploy)
                console.log("deploy_hash", signedDeploy.deploy_hash)
                let result = await getDeploy(signedDeploy.deploy_hash);
                toast.dismiss(loadingToast)
                toast.success(`Got it! take your swap!`)
                console.log(result)
                return true
            }
            if (walletSelected === 'casper') {
                const signedDeploy = await signdeploywithcaspersigner(deploy, walletAddress)
                let result = await putdeploySigner(signedDeploy);
                toast.dismiss(loadingToast)
                toast.success(`Got it! take your swap!`)
                console.log(result)
                return true
            }
        } catch (error) {
            toast.dismiss(loadingToast)
            console.log("onConfirmSwapConfig")
            toast.error("Ooops, we have a problem")
            return false
        }
    }

    async function onDisconnectWallet() {
        if (isConnected && walletSelected === "casper") {
            try {
                const wallet = await tryToConnectSigner()
                dispatch({ type: ConfigActions.DISCONNECT_WALLET })
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

    async function onIncreaseAllow(amount) {
        const loadingToast = toast.loading("let me try to allow liquidity! be patient!")
        try {
            const valueTotal = amount * 10 ** 9
            const deploy = await increaseAndDecreaseAllowanceMakeDeploy(walletAddress, secondTokenSelected.contractHash, valueTotal, true)
            if (walletSelected === 'casper') {
                const signedDeploy = await signdeploywithcaspersigner(deploy, walletAddress)
                let result = await putdeploySigner(signedDeploy);
                toast.dismiss(loadingToast)
                toast.success("Got it! token was allowed!")
                return true
            }
            if (walletSelected === 'torus') {
                const signedDeploy = await signDeployWithTorus(deploy)
                console.log("deploy_hash", signedDeploy.deploy_hash)
                let result = await getDeploy(signedDeploy.deploy_hash);
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
                let result = await putdeploySigner(signedDeploy);
                toast.dismiss(loadingToast)
                toast.success("Got it! token was allowed!")
                return true
            }
            if (walletSelected === 'torus') {
                const signedDeploy = await signDeployWithTorus(deploy)
                console.log("deploy_hash", signedDeploy.deploy_hash)
                let result = await getDeploy(signedDeploy.deploy_hash);
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
                let result = await putdeploySigner(signedDeploy);
                toast.dismiss(loadingToast)
                toast.success("Got it! both token were added!!")
                console.log(result)
                return true
            }
            if (walletSelected === 'torus') {
                console.log("signing add liquidity")
                const signedDeploy = await signdeploywithcaspersigner(deploy, walletAddress)
                let result = await putdeploySigner(signedDeploy);
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
                let result = await removeLiquidityPutDeploy(signedDeploy, walletAddress);
                toast.dismiss(loadingToast)
                toast.success("Got it! both token were added!!")
                console.log(result)
                return true
            }
            if (walletSelected === 'torus') {
                console.log("signing add liquidity")
                const signedDeploy = await signdeploywithcaspersigner(deploy, walletAddress)
                let result = await putdeploySigner(signedDeploy);
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
    return (
        <ConfigProviderContext.Provider value={{
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
            calculateMinimumTokenReceived,
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
            onRemoveLiquidity
        }}>
            {children}
        </ConfigProviderContext.Provider>
    )
}