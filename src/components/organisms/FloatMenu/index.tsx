import { Token } from '../../../commons/api'

import React from 'react'

import { AiOutlineSearch, AiFillCloseCircle } from "react-icons/ai";
import { ContainerCenterFM, ContainerFM, FavoritesTokensFM, FooterFM, HeaderFM, IconContainerFM, LeTokenFM, LeTokenImageFM, LeTokenTitleFM, PopularContainerFM, PopularTokenFM, SearchAndFavoritesFM, SearchFM, SearchIconFM, SearchInputFM, SelectTokenImageFM, SpacerFM, SpacerWithTokenFM, TokenListContainerFM, TokenShortFM, UnderlineFM } from '../../atoms';

export interface FloatMenuProps{
    tokens: Record<string, Token>,
    onSelectToken: (x: Token) => void,
    onClick: () => void,
    excludedSymbols?: string[],
}

const FloatMenu = ({ 
    tokens, 
    onSelectToken, 
    onClick, 
    excludedSymbols = [] 
} : FloatMenuProps ) => {
    console.log('excluded symbols', excludedSymbols)
    let _filteredTokens = Object.entries(tokens).map((v, k) => v[1])
    if (excludedSymbols.length > 0) {
        excludedSymbols.map((symbol) => {
            _filteredTokens = _filteredTokens.filter((token) => {
                // CSPR <=> WCSPR cases
                if (symbol === 'CSPR' && token.symbol == 'WCSPR') {
                    return
                } 

                if (symbol === 'WCSPR' && token.symbol == 'CSPR') {
                    return
                }

                // main case
                if (symbol !== token.symbol) {
                    return token
                }
            })

        })
    }

    const [filteredTokens, setFilteredTokens] = React.useState(_filteredTokens)
    const [filter, setFilter] = React.useState('')

    function useFilter(e) {
        const inputUser = e.target.value.toUpperCase().trim()

        if (inputUser.length === 0) { 
            return setFilteredTokens(_filteredTokens) 
        }

        const filter = new RegExp(inputUser)
        const filtered = filteredTokens.filter((token) => {
            // symbol
            if (filter.test(token.symbol)) {
                return token
            }

            // contract hash
            if (filter.test(token.contractHash)) {
                return token
            }

            // package hash
            if (filter.test(token.packageHash)) {
                return token
            }
        })
        //filter added
        console.log("filtered", filtered)
        setFilteredTokens(filtered)
    }

    return (
        <ContainerFM>
            <ContainerCenterFM>
                <HeaderFM>
                    <div>Select Token</div>
                    <IconContainerFM onClick={onClick}><AiFillCloseCircle /></IconContainerFM>
                </HeaderFM>
                <UnderlineFM />
                <SearchAndFavoritesFM>
                    <SearchFM>
                        <SearchInputFM placeholder="Search name or Mint address" onChange={(e) => { useFilter(e) }} />
                        <SearchIconFM>
                            <AiOutlineSearch />
                        </SearchIconFM>
                    </SearchFM>
                    <PopularContainerFM>
                        <PopularTokenFM>Popular Tokens</PopularTokenFM>
                    </PopularContainerFM>
                    <FavoritesTokensFM>
                        {filteredTokens.map((t) => {
                            return (
                                <LeTokenFM key={t.symbol} onClick={() => { onSelectToken(t) }}>
                                    <LeTokenImageFM src={t.logoURI}  />
                                    <LeTokenTitleFM>{t.symbol}</LeTokenTitleFM>
                                </LeTokenFM>
                            )
                        })}
                    </FavoritesTokensFM>
                </SearchAndFavoritesFM>
                <UnderlineFM />
                <TokenListContainerFM>
                    {/* TODO: remove inline css*/}
                        <SpacerFM>
                            <div></div>
                            <div>Balance</div>
                        </SpacerFM>
                        {filteredTokens.map((t) => {
                            return (
                                <SpacerWithTokenFM key={t.name} onClick={() => { onSelectToken(t) }}>
                                    <TokenShortFM >
                                        <SelectTokenImageFM src={t.logoURI}  />
                                        <div>
                                            <div style={{fontSize: "16px", paddingLeft: "5px"}}>{t.symbol}</div>
                                            <div style={{fontSize: "13px", paddingLeft: "5px"}}>{t.name}</div>
                                        </div>
                                    </TokenShortFM>
                                    <div >{t.amount}</div>
                                </SpacerWithTokenFM>
                            )
                        })}
                </TokenListContainerFM>
                <UnderlineFM />
                <FooterFM>
                    View token list
                </FooterFM>
            </ContainerCenterFM>
        </ContainerFM>
    )
}

export default FloatMenu