import React from 'react'

import { AiOutlineSearch, AiFillCloseCircle } from "react-icons/ai";
import { ContainerSwapModuleNew, ContainerCenter, HeaderSwapNewModule, IconContainer, Underline, SearchAndFavorites, SearchInput, SearchIcon, PopularContainer, FavoritesTokens, LeToken, LeTokenImage, LeTokenTitle, TokenListContainer, Spacer, SpacerWithToken, TokenShort, SelectTokenImage, FooterSwapModuleNew, Search } from '../../atoms';



const FloatMenuFloatMenu = ({ tokens, selectToken, onClick, lefilter = false, lesymbol = "" }) => {
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