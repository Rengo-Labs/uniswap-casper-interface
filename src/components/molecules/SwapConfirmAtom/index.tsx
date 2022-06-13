import styled from 'styled-components'

const ContainerStyled = styled.div`
    background-color:red;
`

const BorderStyled = styled.div`
    background-color:green;
`

const TokenStyled = styled.div`
    background-color:yellow;
`

export const SwapConfirmAtom = ({ firstTokenSelected, secondTokenSelected, children, amoutSwapTokenA, amoutSwapTokenB }) => {
    return (
        <ContainerStyled>
            <BorderStyled>
                <TokenStyled>
                    <Tokens Token={firstTokenSelected} amoutSwapToken={amoutSwapTokenA} />
                </TokenStyled>
                <span>flecha</span>
                <TokenStyled>
                    <Tokens Token={secondTokenSelected} amoutSwapToken={amoutSwapTokenB} />
                </TokenStyled>
            </BorderStyled>
            <div>output is estimated. you will receive at least 6.92697 CSPR or the transaction will revert</div>
            <div>
                <div>
                    <p>Price</p>
                    <p>{`67.6765 ${firstTokenSelected.symbol}/${secondTokenSelected.symbol}`}</p>
                </div>
            </div>
            {children}
        </ContainerStyled>
    )
}

const ContainerTokenStyled = styled.div`
    padding: 10px;
    background-color:blue;
`

const LinerTokenStyled = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const Tokens = ({ Token, amoutSwapToken }) => {
    return (
        <ContainerTokenStyled>
            <LinerTokenStyled>
                <img src={Token.logoURI} width="50" height="50" />
                <p>{Token.name} </p>

            </LinerTokenStyled>
            <p>{amoutSwapToken}</p>
        </ContainerTokenStyled>
    )
}
