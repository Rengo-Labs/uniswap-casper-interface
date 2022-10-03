import React from 'react'
import { AiOutlineSearch } from "react-icons/ai";

const FloatMenu = () => {
    return (
        <Container>
            <ContainerCenter>
                <HeaderStyled>
                    <div>Select Token</div>
                    <div>Close</div>
                </HeaderStyled>
                <SearchAndFavoritesStyled>
                    <SearchStyle>
                        <input type="text" name="" id="" />
                        <AiOutlineSearch />
                    </SearchStyle>
                    <div>Popular Token</div>
                    <FavoritesTokensStyles>
                        <LeToken>Icon - Symbol</LeToken>
                        <LeToken>Icon - Symbol</LeToken>
                        <LeToken>Icon - Symbol</LeToken>
                        <LeToken>Icon - Symbol</LeToken>
                    </FavoritesTokensStyles>
                </SearchAndFavoritesStyled>
                <TokenListContainerStyled>
                    <SpacerStyled>
                        <div></div>
                        <div>Balance</div>
                    </SpacerStyled>
                    {[1, 2, 3, 4].map((x) => {
                        return (
                            <SpacerStyled key={x.toString()}>
                                <TokenShortStyle>
                                    <div>X</div>
                                    <div>
                                        <div>Y</div>
                                        <div>Z</div>
                                    </div>
                                </TokenShortStyle>
                                <div>balance</div>
                            </SpacerStyled>
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
const TokenShortStyle = styled.div`
    display: flex;
    align-items: center;
`
const SpacerStyled = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`
const ContainerCenter = styled.div`
    border: 1px solid black;
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
    padding: 10px;
    border-radius: 10px;
`

const TokenListContainerStyled = styled.div<any>``
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