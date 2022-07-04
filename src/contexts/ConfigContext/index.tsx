import Torus from '@toruslabs/casper-embed';
import { CasperServiceByJsonRPC, CLPublicKey, Signer } from 'casper-js-sdk';
import React, { createContext, ReactNode, useCallback, useEffect, useReducer, useState } from 'react'
import toast from 'react-hot-toast';
import { createRuntimeArgs, getDeploy, getswapPath, makeDeployWasm, putdeploySigner, signdeploywithcaspersigner, signDeployWithTorus, updateBalances } from '../../commons/swap';
import { BASE_URL, CHAINS, DEADLINE, NODE_ADDRESS, ROUTER_PACKAGE_HASH, SUPPORTED_NETWORKS } from '../../constant';

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

// async function calculateReserves(value,axios,firstTokenSelected, secondTokenSelected) {
//     axios.post(`${BASE_URL}/getpathreserves`, {
//         path: [
//             firstTokenSelected.symbolPair,
//             secondTokenSelected.symbolPair,
//         ]
//     }).then(response => {
//         if (response.data.success) {
//             const tokenB = parseFloat((value * parseFloat(response.data.reserve0)).toString().slice(0, 5))
//             const slip = (tokenB - (tokenB * 0.5) / 100).toString().slice(0, 5)
//             amoutSwapTokenBSetter(tokenB)
//             slippSwapTokenSetter(slip)
//         }
//     })
// }

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

    async function onConfirmSwapConfig(amoutSwapTokenA,amoutSwapTokenB) {
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
                console.log("deploy_hash",signedDeploy.deploy_hash)
                let result = await getDeploy(signedDeploy.deploy_hash);
                toast.dismiss(loadingToast)
                toast.success("Got it! take your swap!")
                console.log(result)
                return true
            }
            if (walletSelected === 'casper') {
                console.log("ahora estamos aca")
                const signedDeploy = await signdeploywithcaspersigner(deploy,walletAddress)
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
            tokens,
            firstTokenSelected,
            secondTokenSelected,
            isConnected,
            onConfirmSwapConfig
        }}>
            {children}
        </ConfigProviderContext.Provider>
    )
}