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
import { getStatus, updateBalances } from '../../../commons/swap'
import { SwapProviderContext } from '../../../contexts/SwapContext'
import { Signer } from 'casper-js-sdk'
import axios from 'axios'
import toast from 'react-hot-toast';
import { clientDispatcher } from '../../../reducers/WalletReducers/signerFunctions'
import { addLiquidityMakeDeploy } from '../../pages/Liquidity/study'

const errorToast = (msg) => toast.error(msg);
const successToast = (msg) => toast.success(msg);
const loadingToast = (msg) => toast.loading(msg);

export const LiquidityModule = ({ tokenOne }: any) => {

    const [activeModalPrimary, setActiveModalPrimary] = useState(false)
    const [activeModalSecondary, setActiveModalSecondary] = useState(false)

    let [mainPurse, setMainPurse] = useState();
    let [count, countSetter] = useState(0);
    const [activeModalSwap, setActiveModalSwap] = useState(false)


    const { tokenState, tokenDispatch } = useContext(TokensProviderContext)
    const { tokens, firstTokenSelected, secondTokenSelected } = tokenState
    const { swapState, swapDispatch } = useContext(SwapProviderContext)
    const { isUserLogged, walletAddress, casperService, slippageTolerance } = swapState


    const handleModalPrimary = () => {
        setActiveModalPrimary(!activeModalPrimary)
    }
    const handleModalSecondary = () => {
        setActiveModalSecondary(!activeModalSecondary)
    }
    function switchTokens() {

    }
    let balanceLoad;
    function onConnect() {
        Signer.getActivePublicKey().then((walletAddress) => {
            updateBalances(walletAddress, tokens, axios, tokenDispatch, successToast, secondTokenSelected)
            swapDispatch({ type: 'LOGIN', payload: { walletAddress, casperService: clientDispatcher() } })
            successToast("Wallet is connected")
            balanceLoad = loadingToast("Your balance will be load...")
        }).catch(err => {
            errorToast("Allow the site or unlock your wallet first!")
            Signer.sendConnectionRequest()
        })
    }

    function onLiquidiy(){
        addLiquidityMakeDeploy(axios,walletAddress,firstTokenSelected,secondTokenSelected,10,10,slippageTolerance,mainPurse,)
    }
    useEffect(() => {
        getStatus(casperService, walletAddress, setMainPurse)
            .then(balance => {
                tokenDispatch({ type: 'LOAD_BALANCE', payload: { name: "CSPR", data: balance } })
                toast.dismiss(balanceLoad)
                successToast("Balance load successfully")
                updateBalances(walletAddress, tokens, axios, tokenDispatch, successToast, secondTokenSelected)
            })
            .catch(err => console.log)
    }, [casperService, count])

    return (
        <SwapModulesStyled>
            <SwapContainer>
                <SwapTokenSelect onClickHandler={handleModalPrimary} token={firstTokenSelected}></SwapTokenSelect>
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
            {!isUserLogged && <SwapButton content="Connect to Wallet" handler={() => { onConnect() }} />}
            {isUserLogged && <p>Slippage Tolerance: {slippageTolerance}%</p>}
            {isUserLogged && <SwapButton content="Add Liquidity" handler={async () => { setActiveModalSwap(true) }} />}
        </SwapModulesStyled>
    )
}
