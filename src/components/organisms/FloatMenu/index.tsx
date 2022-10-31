import React from 'react'
import { AiOutlineSearch, AiFillCloseCircle } from "react-icons/ai";

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
                        <div>Popular Token</div>
                        <FavoritesTokensStyles>
                            {filteredTokens.map((x) => {
                                return (
                                    <LeToken key={tokens[x].name} onClick={() => { selectToken(tokens[x]) }}>
                                        <LeTokenImage src={tokens[x].logoURI} alt="" />
                                        <LeTokenTitle>{tokens[x].symbol}</LeTokenTitle>
                                    </LeToken>
                                )
                            })}
                        </FavoritesTokensStyles>
                    </PopularContainer>
                </SearchAndFavoritesStyled>
                <UnderlineStyled />
                <TokenListContainerStyled>
                    <SpacerStyled>
                        <div></div>
                        <div>Balance</div>
                    </SpacerStyled>
                    {filteredTokens.map((x) => {
                        return (
                            <SpacerWithTokenStyled key={tokens[x].name} onClick={() => { selectToken(tokens[x]) }}>
                                <TokenShortStyle >
                                    <SelectTokenImage src={tokens[x].logoURI} alt="" />
                                    <div>
                                        <div>{tokens[x].symbol}</div>
                                        <div>{tokens[x].name}</div>
                                    </div>
                                </TokenShortStyle>
                                <div>{tokens[x].amount}</div>
                            </SpacerWithTokenStyled>
                        )
                    })}
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
`
const SpacerWithTokenStyled = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
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
    left:calc(-2rem + -3px);
    width: 29rem;
    border-bottom: 1px solid black;
`

const ContainerCenter = styled.div`
    box-sizing: border-box;
    border: 3px solid black;
    width: 29rem;
    padding: 2rem;
    border-radius: 20px;
    background-color: white;
    display: flex;
    flex-direction: column;
    gap:10px;
    z-index: 2;
`
const HeaderStyled = styled.div`
    display: flex;
    justify-content: space-between;
    color: ${props => props.theme.NewPurpleColor};
`
const SearchAndFavoritesStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap:10px;

`
const SearchStyle = styled.div`
    border: 1px solid black;
    padding: 10px;
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
    padding: 10px;
    display: grid;
    gap:10px;
`
const SelectTokenImage = styled.img`
    border-radius: 50%;
    width: 3rem;
    height: 3rem;
`
const FooterStyled = styled.div`
    justify-self:center;
    align-self:center;
    color: ${props => props.theme.NewPurpleColor};
`

const Container = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: grid;
    place-items: center;
`



export default FloatMenu