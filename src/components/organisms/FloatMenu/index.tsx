import React from 'react'
import { AiOutlineSearch, AiFillCloseCircle } from "react-icons/ai";

const FloatMenu = ({ tokens, selectToken, onClick }) => {
    return (
        <Container>
            <ContainerCenter>
                <HeaderStyled>
                    <div>Select Token</div>
                    <IconContainerStyled onClick={onClick}><AiFillCloseCircle /></IconContainerStyled>
                </HeaderStyled>
                <SearchAndFavoritesStyled>
                    <SearchStyle>
                        <input type="text" name="" id="" />
                        <AiOutlineSearch />
                    </SearchStyle>
                    <div>Popular Token</div>
                    <FavoritesTokensStyles>
                        {Object.keys(tokens).map((x) => {
                            return (
                                <LeToken key={tokens[x].name} onClick={() => { selectToken(tokens[x]) }}>
                                    <img src={tokens[x].logoURI} alt="" width="50" height="50" />
                                    <div>{tokens[x].symbol}</div>
                                </LeToken>
                            )
                        })}
                    </FavoritesTokensStyles>
                </SearchAndFavoritesStyled>
                <TokenListContainerStyled>
                    <SpacerStyled>
                        <div></div>
                        <div>Balance</div>
                    </SpacerStyled>
                    {Object.keys(tokens).map((x) => {
                        return (
                            <SpacerWithTokenStyled key={tokens[x].name} onClick={() => { selectToken(tokens[x]) }}>
                                <TokenShortStyle >
                                    <img src={tokens[x].logoURI} alt="" width="50" height="50" />
                                    <div>
                                        <div>{tokens[x].symbol}</div>
                                        <div>{tokens[x].name}</div>
                                    </div>
                                </TokenShortStyle>
                                <div>{tokens[x].balance}</div>
                            </SpacerWithTokenStyled>
                        )
                    })}
                </TokenListContainerStyled>
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
        background-color:aquamarine;
        cursor: pointer;
    }
`

const SpacerEvenlyStyled = styled.div`
    display: flex;
    justify-content: space-evenly;
    align-items: center;
`
const ContainerCenter = styled.div`
    border: 1px solid black;
    min-width: 30%;
    padding: 10px;
    border-radius: 10px;
    background-color: white;
`
const HeaderStyled = styled.div`
    display: flex;
    justify-content: space-between;
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
const FavoritesTokensStyles = styled.div`
    display: flex;
    gap:10px;
`
const LeToken = styled.div`
    border: 1px solid black;
    padding: 5px;
    border-radius: 5px;
    display: flex;
    gap:5px;
    align-items: center;
    &:hover{
        background-color:aquamarine;
        cursor: pointer;
    }
`

const TokenListContainerStyled = styled.div<any>`
    padding: 10px;
    display: grid;
    gap:10px;
`
const FooterStyled = styled.div`
    border-top: 1px solid black;
    padding:10px;
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