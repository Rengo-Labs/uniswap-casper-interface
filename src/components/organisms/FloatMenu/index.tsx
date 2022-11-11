import React from 'react'
import styled from 'styled-components'

import { AiOutlineSearch, AiFillCloseCircle } from "react-icons/ai";
import { IconContainer } from '../../atoms/IconContainer';
import { TokenShort } from '../../atoms/TokenShort';
import { Spacer } from '../../atoms/Spacer';
import { ContainerSwapModuleNew } from '../../atoms/ContainerSwapModuleNew';
import SpacerWithToken from '../../atoms/SpacerWithToken';
import Underline from '../../atoms/Underline';
import { ContainerCenter } from '../../atoms/ContainerCenter';
import { HeaderSwapNewModule } from '../../atoms/HeaderSwapNewModule';
import { SearchAndFavorites } from '../../atoms/SearchAndFavorites';
import { Search } from '../../atoms/Search';
import { SearchInput } from '../../atoms/SearchInput';
import { PopularContainer } from '../../atoms/PopularContainer';
import { SearchIcon } from '../../atoms/SearchIcon';
import { FavoritesTokens } from '../../atoms/FavoritesTokens';
import { LeToken } from '../../atoms/LeToken';
import { LeTokenImage } from '../../atoms/LeTokenImage';
import { LeTokenTitle } from '../../atoms/LeTokenTitle';
import { TokenListContainer } from '../../atoms/TokenListContainer';
import { SelectTokenImage } from '../../atoms/SelectTokenImage';
import { FooterSwapModuleNew } from '../../atoms/FooterSwapModuleNew';


const FloatMenu = ({ tokens, selectToken, onClick, lefilter = false, lesymbol = "" }) => {
    let leTokens = Object.keys(tokens)
    if (lefilter) {
        const filter = new RegExp(lesymbol)
        const filtered = leTokens.filter((value) => {
            if (!filter.test(value)) {
                return lesymbol
            }
        })
        leTokens = filtered
    }

    const [filteredTokens, setFilteredTokens] = React.useState(leTokens)
    const [filter, setFilter] = React.useState('')

    function useFilter(e) {
        const inputUser = e.target.value.toUpperCase().trim()
        if (inputUser.length === 0) { return setFilteredTokens(leTokens) }
        const filter = new RegExp(inputUser)
        const filtered = leTokens.filter((value) => {
            if (filter.test(value)) {
                return inputUser
            }
        })
        //filter added
        console.log("filtered", filtered)
        setFilteredTokens(filtered)
    }

    return (
        <ContainerSwapModuleNew>
            <ContainerCenter>
                <HeaderSwapNewModule>
                    <div>Select Token</div>
                    <IconContainer onClick={onClick}><AiFillCloseCircle /></IconContainer>
                </HeaderSwapNewModule>
                <Underline />
                <SearchAndFavorites>
                    <Search>
                        <SearchInput type="text" name="" id="" placeholder="Search name or Mint address" onChange={(e) => { useFilter(e) }} />
                        <SearchIcon>
                            <AiOutlineSearch />
                        </SearchIcon>
                    </Search>
                    <PopularContainer>
                        <div>Popular Token</div>
                        <FavoritesTokens>
                            {filteredTokens.map((x) => {
                                return (
                                    <LeToken key={tokens[x].name} onClick={() => { selectToken(tokens[x]) }}>
                                        <LeTokenImage src={tokens[x].logoURI} />
                                        <LeTokenTitle>{tokens[x].symbol}</LeTokenTitle>
                                    </LeToken>
                                )
                            })}
                        </FavoritesTokens>
                    </PopularContainer>
                </SearchAndFavorites>
                <Underline />
                <TokenListContainer>
                    <Spacer>
                        <div></div>
                        <div>Balance</div>
                    </Spacer>
                    {filteredTokens.map((x) => {
                        return (
                            <SpacerWithToken key={tokens[x].name} onClick={() => { selectToken(tokens[x]) }}>
                                <TokenShort >
                                    <SelectTokenImage src={tokens[x].logoURI} />
                                    <div>
                                        <div>{tokens[x].symbol}</div>
                                        <div>{tokens[x].name}</div>
                                    </div>
                                </TokenShort>
                                <div>{tokens[x].amount}</div>
                            </SpacerWithToken>
                        )
                    })}
                </TokenListContainer>
                <Underline />
                <FooterSwapModuleNew>
                    View token list
                </FooterSwapModuleNew>
            </ContainerCenter>
        </ContainerSwapModuleNew>
    )
}

export default FloatMenu