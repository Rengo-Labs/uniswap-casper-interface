import React, { useContext, useEffect, useState } from 'react'
import { CloseButtonAtom, ConfirmSwapButton, HeaderModalAtom, SearchSectionAtom, SwapButton, SwapContainer, SwapContainerAtom, SwapHeaderAtom, SwapTokenBalance, SwapTokenSelect, SwitchIcon } from '../../atoms'
import { SwapSelection } from '../../molecules/SwapSelection'
import { SwapModal } from '../../molecules/SwapModal'
import { SwapModulesStyled } from './styles'
import { LiquidityProviderContext } from '../../../contexts/LiquidityContext'
import { AiOutlineClose } from 'react-icons/ai'
import { SearchInputAtom } from '../../atoms/SearchInputAtom'
import { SwapConfirmAtom, SwapTokens } from '../../molecules'
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
        onAddLiquidity,
        fillPairs
    } = useContext(ConfigProviderContext)

    const [activeModalPrimary, setActiveModalPrimary] = useState(false)
    const [activeModalSecondary, setActiveModalSecondary] = useState(false)
    const [activeModalSwap, setActiveModalSwap] = useState(false)
    const [amoutSwapTokenA, amoutSwapTokenASetter] = useState<any>(0)
    const [amoutSwapTokenB, amoutSwapTokenBSetter] = useState<any>(0)
    const [slippSwapToken, slippSwapTokenSetter] = useState<any>(0)
    useEffect(() => {
    }, [])

    const handleModalPrimary = () => {
        setActiveModalPrimary(!activeModalPrimary)
    }
    const handleModalSecondary = () => {
        setActiveModalSecondary(!activeModalSecondary)
    }
    function switchTokens() {
    }

    function onConnect() {
        onConnectConfig()
    }

    async function onLiquidiy() {
        if (await onIncreaseAllow(amoutSwapTokenB)) {
            await onAddLiquidity(amoutSwapTokenA, amoutSwapTokenB)
        }
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
            {isConnected && amoutSwapTokenB > secondTokenSelected.amount && <p>you don't have enough {secondTokenSelected.symbol} to add</p>}
            {isConnected && amoutSwapTokenA > firstTokenSelected.amount && <p>you don't have enough {firstTokenSelected.symbol} to add</p>}
            {isConnected && <p>Slippage Tolerance: {slippageToleranceSelected}%</p>}
            {isConnected && <SwapButton content="Add Liquidity" handler={async () => { setActiveModalSwap(true) }} />}
            {
                activeModalSwap &&
                <SwapModal >
                    <SwapContainerAtom >
                        <SwapHeaderAtom>
                            <HeaderModalAtom>Confirm Add Liquidity</HeaderModalAtom>
                            <CloseButtonAtom onClick={() => { setActiveModalSwap(false) }}>
                                <AiOutlineClose />
                            </CloseButtonAtom>
                        </SwapHeaderAtom>
                        <SwapConfirmAtom
                            firstTokenSelected={firstTokenSelected}
                            secondTokenSelected={secondTokenSelected}
                            amoutSwapTokenA={amoutSwapTokenA}
                            amoutSwapTokenB={amoutSwapTokenB}
                            slippSwapToken={slippSwapToken}
                            liquidity={true}
                        >
                            <ConfirmSwapButton content="Confirm Add Liquidity" handler={async () => { await onLiquidiy();setActiveModalSwap(false) }} />
                        </SwapConfirmAtom>

                    </SwapContainerAtom>
                </SwapModal>
            }
        </SwapModulesStyled>
    )
}