import React from 'react'
import { CloseButtonAtom, HeaderModalAtom, SearchSectionAtom, SwapButton, SwapContainer, SwapContainerAtom, SwapHeaderAtom, SwapTokenBalance, SwapTokenSelect, SwitchIcon } from '../../atoms'
import { SwapSelection } from '../../molecules/SwapSelection'
import { SwapModal } from '../../molecules/SwapModal'
import { SwapModulesStyled } from './styles'
import { LiquidityProviderContext } from '../../../contexts/LiquidityContext'
import { AiOutlineClose } from 'react-icons/ai'
import { SearchInputAtom } from '../../atoms/SearchInputAtom'
import { SwapTokens } from '../../molecules'

export const LiquidityModule = ({ tokenOne }: any) => {

    const [activeModalPrimary, setActiveModalPrimary] = React.useState(false)
    const [activeModalSecondary, setActiveModalSecondary] = React.useState(false)

    const handleModalPrimary = () => {
        setActiveModalPrimary(!activeModalPrimary)
        filterCriteriaSet("")
    }
    const handleModalSecondary = () => {
        setActiveModalSecondary(!activeModalSecondary)
        filterCriteriaSet("")
    }
    const { fileteredTokens, 
        filterCriteriaSet, filterCriteria,
         primaryToken, secondaryToken, switchTokens, 
         setPrimaryToken, setSecondaryToken } = React.useContext(LiquidityProviderContext)


    return (
        <SwapModulesStyled>
            <SwapContainer>
                <SwapTokenSelect onClickHandler={handleModalPrimary} token={primaryToken}></SwapTokenSelect>
                {/*<SwapTokenBalance token={primaryToken} />*/}
            </SwapContainer>
            {
                activeModalPrimary &&
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
                <SwapTokenSelect onClickHandler={() => { handleModalPrimary() }} token={primaryToken}></SwapTokenSelect>
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
            <SwapButton content="Connect to Wallet"></SwapButton>
        </SwapModulesStyled>
    )
}
