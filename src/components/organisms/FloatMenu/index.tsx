import { Token } from '../../../commons/api'

import React from 'react'

import { AiOutlineSearch, AiFillCloseCircle } from "react-icons/ai";

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
        <Container>
            <ContainerCenter>
                <HeaderStyled>
                    <div>Select Token</div>
                    <IconContainerStyled onClick={onClick}><AiFillCloseCircle /></IconContainerStyled>
                </HeaderStyled>
                <UnderlineStyled />
                <SearchAndFavoritesStyled>
                    <SearchStyle>
                        <SearchInputStyle type="text" name="" id="" placeholder="Search name or Mint address" onChange={(e) => { useFilter(e) }} />
                        <SearchIconStyle>
                            <AiOutlineSearch />
                        </SearchIconStyle>
                    </SearchStyle>
                    <PopularContainer>
                        <div style={{fontSize: "16px"}}>Popular Tokens</div>
                        <FavoritesTokensStyles>
                            {filteredTokens.map((t) => {
                                return (
                                    <LeToken key={t.symbol} onClick={() => { onSelectToken(t) }}>
                                        <LeTokenImage src={t.logoURI} alt="" />
                                        <LeTokenTitle>{t.symbol}</LeTokenTitle>
                                    </LeToken>
                                )
                            })}
                        </FavoritesTokensStyles>
                    </PopularContainer>
                    <FavoritesTokensStyles>
                        {filteredTokens.map((x) => {
                            return (
                                <LeToken key={x.name} onClick={() => { onSelectToken(x) }}>
                                    <LeTokenImage src={x.logoURI} alt="" />
                                    <LeTokenTitle>{x.symbol}</LeTokenTitle>
                                </LeToken>
                            )
                        })}
                    </FavoritesTokensStyles>
                </SearchAndFavoritesStyled>
                <UnderlineStyled />
                <TokenListContainerStyled>
                    <div style={{
                        paddingRight: "15px"
                    }}>
                        <SpacerStyled>
                            <div></div>
                            <div>Balance</div>
                        </SpacerStyled>
                        {filteredTokens.map((t) => {
                            return (
                                <SpacerWithTokenStyled key={t.name} onClick={() => { onSelectToken(t) }}>
                                    <TokenShortStyle >
                                        <SelectTokenImage src={t.logoURI} alt="" />
                                        <div>
                                            <div style={{fontSize: "16px", paddingLeft: "5px"}}>{t.symbol}</div>
                                            <div style={{fontSize: "13px", paddingLeft: "5px"}}>{t.name}</div>
                                        </div>
                                    </TokenShortStyle>
                                    <div>{t.amount}</div>
                                </SpacerWithTokenStyled>
                            )
                        })}
                    </div>
                </TokenListContainerStyled>
                <UnderlineStyled />
                <FooterStyled>
                    View token list
                </FooterStyled>
            </ContainerCenter>
        </Container>
    )
}

import styled from 'styled-components'
const IconContainerStyled = styled.div`
    cursor: pointer;
`
const TokenShortStyle = styled.div`
    display: flex;
    align-items: center;
    justify-content:center;
`
const SpacerStyled = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 2rem 0 2rem;
    font-size: 16px;
    color: ${props => props.theme.NewPurpleColor};
`
const SpacerWithTokenStyled = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 42px;
    padding: 5px 2rem;
    transition: all .6;
    &:hover{
        background-color:#E6E6E6;
        cursor: pointer;
    }
`

const SpacerEvenlyStyled = styled.div`
    display: flex;
    justify-content: space-evenly;
    align-items: center;
`
const UnderlineStyled = styled.div`
    box-sizing: border-box;
    position: relative;
    border-bottom: 1px solid black;
`

const ContainerCenter = styled.div`
    box-sizing: border-box;
    border: 2px solid black;
    width: 28.2rem;
    /*padding: 2rem;*/
    border-radius: 20px;
    background-color: white;
    display: flex;
    flex-direction: column;
    height: 36.64rem;
    z-index: 2;
`
const HeaderStyled = styled.div`
    display: flex;
    justify-content: space-between;
    color: ${props => props.theme.NewPurpleColor};
    padding: 10px 2rem;
    align-items: center;
    height: 34px;
`
const SearchAndFavoritesStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap:12px;
    padding: 12px 2rem 0 2rem;
    height: 155px;
`
const SearchStyle = styled.div`
    border: 1px solid black;
    padding: 10px;
    height: 22px;
    border-radius: 10px;
    display: flex;
    justify-content:space-between;
    align-items:center;
`
const SearchInputStyle = styled.input`
    all:unset;
    width: 100%;
`
const PopularContainer = styled.div`
    padding-top: 12px;
    color:${props => props.theme.NewPurpleColor};
`

const SearchIconStyle = styled.div`
    color:${props => props.theme.NewPurpleColor};
    background-color: ${props => props.theme.NewAquamarineColor};
    display:grid;
    place-items:center;
    border-radius:50%;
    font-size:1.5rem;
`


const FavoritesTokensStyles = styled.div`
    display: flex;
    gap:10px;
    font-size: 2rem;
    justify-content:space-between;
    align-items:center;
`
const LeToken = styled.div`
    display: flex;
    gap:5px;
    align-items: center;
    font-size: 1rem;
    &:hover{
        background-color:aquamarine;
        cursor: pointer;
    }
`
const LeTokenImage = styled.img`
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
`

const LeTokenTitle = styled.h1`
    font-size: .8rem;
    color: #4D4D4D;
`

const TokenListContainerStyled = styled.div<any>`
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    height: 332px;
    display: grid;
    gap:10px;
`
const SelectTokenImage = styled.img`
    border-radius: 50%;
    width: 35px;
    height: 35px;
`
const FooterStyled = styled.div`
    justify-self: center;
    display: flex;
    align-items: center;
    padding: 10px;
    color: ${props => props.theme.NewPurpleColor};
    height: 34px;
`

const Container = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: grid;
    place-items: center;
    font-family: 'Epilogue'; 
`



export default FloatMenu