import Torus from '@toruslabs/casper-embed';
import axios from 'axios';
import { AccessRights, CasperServiceByJsonRPC, CLByteArray, CLKey, CLOption, CLPublicKey, CLValueBuilder, RuntimeArgs, Signer } from 'casper-js-sdk';
import React, { createContext, ReactNode, useCallback, useEffect, useReducer, useState } from 'react'
import toast from 'react-hot-toast';
import { convertToString, createRecipientAddress, createRuntimeArgs, getDeploy, getswapPath, makeDeployLiquidity, makeDeployLiquidityWasm, makeDeployWasm, putdeploy, putdeploySigner, signdeploywithcaspersigner, signDeployWithTorus, updateBalances } from '../../commons/swap';
import { createRuntimeeArgsPool } from '../../components/pages/Liquidity/study';
import { BASE_URL, CHAINS, DEADLINE, NODE_ADDRESS, ROUTER_CONTRACT_HASH, ROUTER_PACKAGE_HASH, SUPPORTED_NETWORKS } from '../../constant';

import { initialConfigState, ConfigReducer, ConfigActions } from '../../reducers'
import { initialStateToken, TokenReducer, tokenReducerEnum } from '../../reducers/TokenReducers';
import { initialStateWallet, reducerWallet } from '../../reducers/WalletReducers';

export const ConfigProviderContext = createContext<any>({})

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
    } catch (error) {
        return false
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
        let entryPoint = increase ? "increase_allowance" : "decrease_allowance";
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
    const selectedWallet = "Casper";
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
export const ConfigContextWithReducer = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(ConfigReducer, initialConfigState)
    const [tokenState, tokenDispatch] = useReducer(TokenReducer, initialStateToken);
    const [walletState, walletDispatch] = useReducer(reducerWallet, initialStateWallet)
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
                toast.dismiss(ToasLoading)
                toast.success("your wallet is mounted and ready to ride!")
            }
        } else {
            const torus = new Torus();
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
                toast.success("Got it! take your swap!")
                console.log(result)
                return true
            }
            if (walletSelected === 'casper') {
                console.log("ahora estamos aca")
                const signedDeploy = await signdeploywithcaspersigner(deploy, walletAddress)
                let result = await putdeploySigner(signedDeploy);
                toast.dismiss(loadingToast)
                toast.success("Got it! take your swap!")
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
        const loadingToast = toast.loading("let me try to add liquidity! be patient!")
        try {
            const valueTotal = amount * 10 ** 9
            const deploy = await increaseAndDecreaseAllowanceMakeDeploy(walletAddress, firstTokenSelected.contractHash, valueTotal, true)
            if (walletSelected === 'casper') {
                const signedDeploy = await signdeploywithcaspersigner(deploy, walletAddress)
                let result = await putdeploySigner(signedDeploy);
                toast.dismiss(loadingToast)
                toast.success("Got it! take your swap!")
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

    async function onAddLiquidity(amountA, amountB) {
        const loadingToast = toast.loading("let me try to add liquidity! be patient!")
        try {
            const deploy = await addLiquidityMakeDeploy(walletAddress, secondTokenSelected, amountA, amountB, slippageToleranceSelected, mainPurse)
            if (walletSelected === 'casper') {
                console.log("signing add liquidity")
                const signedDeploy = await signdeploywithcaspersigner(deploy, walletAddress)
                let result = await putdeploySigner(signedDeploy);
                toast.dismiss(loadingToast)
                toast.success("Got it! take your swap!")
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
    async function onCalculateReserves(value) {
        try {
            return await calculateReserves(firstTokenSelected, secondTokenSelected, value)
        } catch (error) {
            console.log(__filename, "onCalculateReserves", error)
            return { secondTokenReturn: 0, minAmountReturn: 0 }
        }
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
            tokens,
            firstTokenSelected,
            secondTokenSelected,
            isConnected,
            onConfirmSwapConfig,
            slippageToleranceSelected,
            onIncreaseAllow,
            onAddLiquidity
        }}>
            {children}
        </ConfigProviderContext.Provider>
    )
}