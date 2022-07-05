import React, { useContext, useEffect, useState } from 'react'
import { CloseButtonAtom, HeaderModalAtom, SearchSectionAtom, SwapButton, SwapContainer, SwapContainerAtom, SwapHeaderAtom, SwapTokenBalance, SwapTokenSelect, SwitchIcon } from '../../atoms'
import { SwapSelection } from '../../molecules/SwapSelection'
import { SwapModal } from '../../molecules/SwapModal'
import { SwapModulesStyled } from './styles'
import { LiquidityProviderContext } from '../../../contexts/LiquidityContext'
import { AiOutlineClose } from 'react-icons/ai'
import { SearchInputAtom } from '../../atoms/SearchInputAtom'
import { SwapTokens } from '../../molecules'
import casprIcon from '../../../assets/swapIcons/casprIcon.png'
import { TokensProviderContext } from '../../../contexts/TokensContext'
import { getStatus, putdeploy, signdeploywithcaspersigner, updateBalances } from '../../../commons/swap'
import { SwapProviderContext } from '../../../contexts/SwapContext'
import { CasperServiceByJsonRPC, Signer } from 'casper-js-sdk'
import axios from 'axios'
import toast from 'react-hot-toast';
import { clientDispatcher } from '../../../reducers/WalletReducers/signerFunctions'
import { addLiquidityMakeDeploy } from '../../pages/Liquidity/study'
import { BASE_URL, CHAINS, ROUTER_PACKAGE_HASH, SUPPORTED_NETWORKS } from '../../../constant'
import Torus from '@toruslabs/casper-embed'
import { ConfigProviderContext } from '../../../contexts/ConfigContext'

const errorToast = (msg) => toast.error(msg);
const successToast = (msg) => toast.success(msg);
const loadingToast = (msg) => toast.loading(msg);

export const LiquidityModule = ({ tokenOne }: any) => {

    const [activeModalPrimary, setActiveModalPrimary] = useState(false)
    const [activeModalSecondary, setActiveModalSecondary] = useState(false)


    const [activeModalSwap, setActiveModalSwap] = useState(false)
    const [amoutSwapTokenA, amoutSwapTokenASetter] = useState<any>(0)
    const [amoutSwapTokenB, amoutSwapTokenBSetter] = useState<any>(0)
    const [slippSwapToken, slippSwapTokenSetter] = useState<any>(0)


    let torus;

    const handleModalPrimary = () => {
        setActiveModalPrimary(!activeModalPrimary)
    }
    const handleModalSecondary = () => {
        setActiveModalSecondary(!activeModalSecondary)
    }
    function switchTokens() {

    }
    let balanceLoad;
    const {
        onConnectConfig,
        configState,
        tokenState,
        onSelectFirstToken,
        onSelectSecondToken,
        onSwitchTokens,
        tokens,
        firstTokenSelected,
        secondTokenSelected,
        isConnected,
        onConfirmSwapConfig,
        slippageToleranceSelected,
        onCalculateReserves,
        onIncreaseAllow,
        onAddLiquidity
    } = useContext(ConfigProviderContext)

    const { walletAddress, mainPurse } = configState
    function onConnect() {
        onConnectConfig()
    }

    async function onLiquidiy() {
        const algo = await onIncreaseAllow(10_000_000_000)
        // const algo = await onAddLiquidity(10, 10)
    }

    async function onLiquitityTorus() {
        const toastLoading = loadingToast("Waiting for confirmation...")
        torus = new Torus();
        console.log("torus", torus);
        await torus.init({
            buildEnv: "testing",
            showTorusButton: true,
            network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
        });
        console.log("Torus123", torus);
        console.log("torus", torus.provider);
        const casperService = new CasperServiceByJsonRPC(torus?.provider);
        // const deploy = addLiquidityMakeDeploy(
        //     axios,
        //     walletAddress,
        //     firstTokenSelected,
        //     secondTokenSelected,
        //     10,
        //     10,
        //     slippageToleranceSelected,
        //     mainPurse,
        //     ROUTER_PACKAGE_HASH,
        //     countSetter,
        //     toastLoading,
        //     casperService
        // )
        // //const deployRes = await casperService.deploy(deploy);
        // //console.log("deployRes", deployRes.deploy_hash);
        // countSetter((c) => c + 1);
        toast.dismiss(toastLoading);
    }


    async function onChangeValueToken(value) {
        amoutSwapTokenASetter(value)
        const { secondTokenReturn, minAmountReturn } = await onCalculateReserves(value)
        amoutSwapTokenBSetter(secondTokenReturn)
        slippSwapTokenSetter(minAmountReturn)
    }

    return (
        <SwapModulesStyled>
            <SwapContainer>
                <SwapTokenSelect onClickHandler={handleModalPrimary} token={firstTokenSelected}></SwapTokenSelect>
                <SwapTokenBalance token={firstTokenSelected} amoutSwapTokenSetter={onChangeValueToken} />
                {/*<SwapTokenBalance token={primaryToken} />*/}
            </SwapContainer>
            {
                activeModalPrimary &&
                <SwapModal >
                    <SwapContainerAtom >
                        <SwapHeaderAtom>
                            <HeaderModalAtom>Select Token</HeaderModalAtom>
                            <CloseButtonAtom onClick={handleModalPrimary}>
                                <AiOutlineClose />
                            </CloseButtonAtom>
                        </SwapHeaderAtom>
                        <SearchSectionAtom>
                            <SearchInputAtom
                                placeholder="Search name"
                            />
                        </SearchSectionAtom>
                        <SwapTokens >
                            {/**
                                Object.keys(tokens)
                                    .map((key) => {
                                        return <SwapToken key={key} token={tokens[key]} setToken={dispatch("SELECT_FIRST_TOKEN")} handleModal={handleModalPrimary} />
                                    })
                                     */
                            }
                        </SwapTokens>
                    </SwapContainerAtom>
                </SwapModal>
            }
            <SwitchIcon switchHandler={switchTokens} />
            <SwapContainer>
                <SwapTokenSelect onClickHandler={() => { handleModalSecondary() }} token={secondTokenSelected}></SwapTokenSelect>
                <SwapTokenBalance disabled={true} token={secondTokenSelected} amoutSwapTokenSetter={amoutSwapTokenBSetter} amoutSwapToken={amoutSwapTokenB} />

                {/*<SwapTokenBalance token={primaryToken} />*/}

            </SwapContainer>
            {
                activeModalSecondary &&
                <SwapModal >
                    <SwapContainerAtom >
                        <SwapHeaderAtom>
                            <HeaderModalAtom>Select Token</HeaderModalAtom>
                            <CloseButtonAtom onClick={handleModalSecondary}>
                                <AiOutlineClose />
                            </CloseButtonAtom>
                        </SwapHeaderAtom>
                        <SearchSectionAtom>
                            <SearchInputAtom
                                placeholder="Search name"
                            />
                        </SearchSectionAtom>
                        <SwapTokens >
                            {/**
                                fileteredTokens.map((token: any) => {
                                    return <SwapToken key={token} icon={token.icon} token={token} amount={token.amount} setToken={() => { }} handleModal={handleModalSecondary} />
                                })
                             */}
                        </SwapTokens>
                    </SwapContainerAtom>
                </SwapModal>
            }
            {!isConnected && <SwapButton content="Connect to Wallet" handler={() => { onConnect() }} />}
            {isConnected && <p>Slippage Tolerance: {slippageToleranceSelected}%</p>}
            {isConnected && <SwapButton content="Add Liquidity" handler={async () => { onLiquidiy(); setActiveModalSwap(true) }} />}
        </SwapModulesStyled>
    )
}