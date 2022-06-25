import styled from 'styled-components'
import { AiOutlineArrowDown } from "react-icons/ai";



const ContainerStyled = styled.div`
    display:grid;
    gap:10px;
`

const BorderStyled = styled.div`
`

const TokenStyled = styled.div`
`


const ContainerTokenStyled = styled.div`
    padding: 10px;
`

const LinerTokenStyled = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`
const InnerTokenStyled = styled.div`
    display: flex;
    align-items: center;
    gap:10px;
`

export const SwapConfirmAtom = ({ firstTokenSelected, secondTokenSelected, children, amoutSwapTokenA, amoutSwapTokenB, slippSwapToken }) => {
    return (
        <ContainerStyled>
            <BorderStyled>
                <TokenStyled>
                    <Tokens Token={firstTokenSelected} amoutSwapToken={amoutSwapTokenA} />
                </TokenStyled>
                <div style={{ marginLeft: "50%" }}><AiOutlineArrowDown></AiOutlineArrowDown></div>
                <TokenStyled>
                    <Tokens Token={secondTokenSelected} amoutSwapToken={amoutSwapTokenB} />
                </TokenStyled>
            </BorderStyled>
            <div>output is estimated. you will receive at least {slippSwapToken} {secondTokenSelected.symbol} or the transaction will revert</div>
            <div style={{ marginLeft: "20%" }}>{children}</div>

        </ContainerStyled>
    )
}


const Tokens = ({ Token, amoutSwapToken }) => {
    return (
        <ContainerTokenStyled>
            <LinerTokenStyled>
                <InnerTokenStyled>
                    <img src={Token.logoURI} width="50" height="50" />
                    <p>{amoutSwapToken}</p>
                </InnerTokenStyled>

                <p>{Token.name} </p>

            </LinerTokenStyled>

        </ContainerTokenStyled>
    )
}
