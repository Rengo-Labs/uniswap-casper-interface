import React from 'react'
import styled, { keyframes } from 'styled-components'
import { ButtonClose } from '../../atoms'
import { AiOutlineLoading3Quarters, AiOutlineCloseCircle } from "react-icons/ai";
import { NewButtonClose } from '../../atoms/NewButtonClose';


const PopupStyled = styled.div<any>`
    display: ${prop => prop.display ? "grid" : "none"};
    position: absolute;
    top:0;
    left:0;
    width:100vw;
    height:100vh;
    place-items: center;
    z-index: 9;
`

const ContainerStyled = styled.div<any>`
    background-color: ${props => props.theme.NewAquamarineColor};
    width:50%;
    height:50%;
    padding:20px;
    display: grid;
    place-items: center;
    border-radius: 10px;
`

const MidModalStyled = styled.div<any>`
    width:100%;
    height:100%;
    color: ${props => props.theme.NewPurpleColor};
    background-color: ${props => props.theme.NewAquamarineColor};
    display:grid;
    grid-template: auto 1fr auto auto auto / 1fr;
    border-radius: 10px;
    padding:10px;
    gap:10px;
`

const CloseStyled = styled.div`
    justify-self: end;
`

const MiddleStyled = styled.div`
    justify-self: center;
`

const SpinEffect = keyframes`
 0% { transform: rotate(0deg); } 
 100% { transform: rotate(360deg); } 
`
const TotalCenterStyled = styled.div`
    justify-self: center;
    align-self: center;
    animation-name: ${SpinEffect};
    animation-duration: 9s;
    animation-iteration-count: infinite;
    font-size:5rem;
`


const PopupModal = ({ display, handleModal, tokenA = 'X Y', tokenB = 'X Y' }) => {
    return (
        <PopupStyled display={display}>
            <ContainerStyled>
                <MidModalStyled>
                    <CloseStyled>
                        <NewButtonClose onClickHandler={() => { handleModal(false) }}>
                            <AiOutlineCloseCircle />
                        </NewButtonClose>
                    </CloseStyled>

                    <TotalCenterStyled>
                        <AiOutlineLoading3Quarters />
                    </TotalCenterStyled>
                    <MiddleStyled>Waiting for Confirmation</MiddleStyled>
                    <MiddleStyled>Swapping {tokenA} for {tokenB}</MiddleStyled>
                    <MiddleStyled>Confirm this transaction in your wallet</MiddleStyled>
                </MidModalStyled>
            </ContainerStyled>
        </PopupStyled>
    )
}

export default PopupModal