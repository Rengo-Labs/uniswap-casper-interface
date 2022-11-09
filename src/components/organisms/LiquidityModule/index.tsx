import React, { useContext, useEffect, useState } from 'react'
import { CloseButtonAtom, ConfirmSwapButton, HeaderModalAtom, SearchSectionAtom, SwapButton, SwapContainer, SwapContainerAtom, SwapHeaderAtom, SwapTokenBalance, SwapTokenSelect, SwitchIcon } from '../../atoms'
import { SwapSelection } from '../../molecules/SwapSelection'
import { SwapModal } from '../../molecules/SwapModal'
import { SwapModulesStyled } from './styles'
import { LiquidityProviderContext } from '../../../contexts/LiquidityContext'
import { AiFillPlusCircle, AiOutlineClose, AiOutlinePlus } from 'react-icons/ai'
import { SearchInputAtom } from '../../atoms/SearchInputAtom'
import { SwapConfirmAtom, SwapTokens, LPDetail } from '../../molecules'
import casprIcon from '../../../assets/swapIcons/casprIcon.png'
import { TokensProviderContext } from '../../../contexts/TokensContext'
import { getStatus, putdeploy, signdeploywithcaspersigner, updateBalances } from '../../../commons/swap'
import { SwapProviderContext } from '../../../contexts/SwapContext'
import { CasperServiceByJsonRPC, Signer } from 'casper-js-sdk'
import axios from 'axios'
import toast from 'react-hot-toast';
import { clientDispatcher } from '../../../reducers/WalletReducers/signerFunctions'
import { BASE_URL, CHAINS, ROUTER_PACKAGE_HASH, SUPPORTED_NETWORKS } from '../../../constant'
import Torus from '@toruslabs/casper-embed'
import { ConfigProviderContext } from '../../../contexts/ConfigContext'
import { SwapToken } from '../../molecules/SwapToken'
import {useSearchParams} from "react-router-dom";

const errorToast = (msg) => toast.error(msg);
const successToast = (msg) => toast.success(msg);
const loadingToast = (msg) => toast.loading(msg);

export const LiquidityModule = ({ tokenOne }: any) => {

    const [searchParams, setSearchParams] = useSearchParams();

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
        fillPairs,
        getSwapDetail
    } = useContext(ConfigProviderContext)

    const [activeModalPrimary, setActiveModalPrimary] = useState(false)
    const [activeModalSecondary, setActiveModalSecondary] = useState(false)
    const [activeModalSwap, setActiveModalSwap] = useState(false)
    const [amountSwapTokenA, amountSwapTokenASetter] = useState<any>(0)
    const [amountSwapTokenB, amountSwapTokenBSetter] = useState<any>(0)
    const [slippSwapToken, slippSwapTokenSetter] = useState<any>(0)
    useEffect(() => {
        const t0 = searchParams.get("token0")
        const t1 = searchParams.get("token1")
        if (t0) {
            onSelectFirstToken(tokens[t0])
            onSelectSecondToken(tokens[t1])
        }
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
        if (await onIncreaseAllow(amountSwapTokenB)) {
            console.log("Paso pagina")
            await onAddLiquidity(amountSwapTokenA, amountSwapTokenB)
            onConnectConfig()
        }
    }

    async function onChangeValueToken(value) {
        amountSwapTokenASetter(value)
        const { secondTokenReturn, minAmountReturn } = await onCalculateReserves(value)
        const { tokensToTransfer, tokenPrice, priceImpact, exchangeRateA, exchangeRateB } = await getSwapDetail(firstTokenSelected, secondTokenSelected)
        amountSwapTokenBSetter(secondTokenReturn)
        slippSwapTokenSetter(minAmountReturn)
    }

    return (
        <SwapModulesStyled>
            <SwapContainer>
                <SwapTokenSelect onClickHandler={handleModalPrimary} token={firstTokenSelected}></SwapTokenSelect>
                <SwapTokenBalance token={firstTokenSelected} amountSwapTokenSetter={onChangeValueToken} />
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
                            {
                                Object.keys(tokens)
                                    .map((key) => {
                                        const handleToken = () => { onSelectFirstToken(tokens[key]), handleModalPrimary() }

                                        return <SwapToken key={key.toString()} token={tokens[key]} handleToken={handleToken} />
                                    })
                            }
                        </SwapTokens>

                    </SwapContainerAtom>
                </SwapModal>
            }
            <SwitchIcon icon={<AiOutlinePlus size="2rem"/>} isIcon={false} switchHandler={()=>{}} secondTokenSelected={secondTokenSelected} firstTokenSelected={firstTokenSelected} />
            <SwapContainer>
                <SwapTokenSelect onClickHandler={() => { handleModalSecondary() }} token={secondTokenSelected}></SwapTokenSelect>
                <SwapTokenBalance disabled={true} token={secondTokenSelected} amountSwapTokenSetter={amountSwapTokenBSetter} amountSwapToken={amountSwapTokenB} />

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
                            {
                                Object.keys(tokens)
                                    .map((key) => {
                                        const filter = new RegExp(firstTokenSelected.symbol)
                                        if (filter.test(key)) { return }
                                        const handleToken = () => { onSelectSecondToken(tokens[key]), handleModalSecondary() }
                                        return <SwapToken key={key.toString()} token={tokens[key]} handleToken={handleToken} />
                                    })
                            }
                        </SwapTokens>
                    </SwapContainerAtom>
                </SwapModal>
            }
            {!isConnected && <SwapButton content="Connect to Wallet" handler={() => { onConnect() }} />}
            {isConnected && amountSwapTokenB > secondTokenSelected.amount && <p>you don't have enough {secondTokenSelected.symbol} to add</p>}
            {isConnected && amountSwapTokenA > firstTokenSelected.amount && <p>you don't have enough {firstTokenSelected.symbol} to add</p>}
            {isConnected && <p>Slippage Tolerance: {slippageToleranceSelected}%</p>}
            {isConnected && <SwapButton content="Add Liquidity" handler={async () => { onLiquidiy() }} />}
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
                            amountSwapTokenA={amountSwapTokenA}
                            amountSwapTokenB={amountSwapTokenB}
                            slippSwapToken={slippSwapToken}
                            liquidity={true}
                        >
                            <ConfirmSwapButton content="Confirm Add Liquidity" handler={async () => { await onLiquidiy(); setActiveModalSwap(false) }} />
                        </SwapConfirmAtom>

                    </SwapContainerAtom>
                </SwapModal>
            }
        </SwapModulesStyled>
    )
}