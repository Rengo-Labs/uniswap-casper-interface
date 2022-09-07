import React from 'react'
import styled, { keyframes } from 'styled-components'
import { ButtonClose } from '../../atoms'
import { AiOutlineLoading3Quarters, AiOutlineCloseCircle } from "react-icons/ai";


const PopupStyled = styled.div<any>`
    display: ${prop => prop.display ? "grid" : "none"};
    position: absolute;
    top:0;
    left:0;
    width:100vw;
    height:100vh;
    place-items: center;
`
const MidModalStyled = styled.div<any>`
    width:30%;
    height:50%;
    background-color:rgba(230,230,230,1);
    display:grid;
    grid-template: auto 1fr auto auto auto / 1fr;
    border-radius: 10px;
    padding:10px;
    gap:10px;
    color:rgba(10,10,10,1);
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


const PopupModal = ({ display, handleModal }) => {
    return (
        <PopupStyled display={display}>
            <MidModalStyled>
                <CloseStyled>
                    <ButtonClose onClickHandler={() => { handleModal(false) }}>
                        <AiOutlineCloseCircle />
                    </ButtonClose>
                </CloseStyled>

                <TotalCenterStyled>
                    <AiOutlineLoading3Quarters />
                </TotalCenterStyled>
                <MiddleStyled>Waiting for Confirmation</MiddleStyled>
                <MiddleStyled>Swapping X Y for X Y</MiddleStyled>
                <MiddleStyled>Confirm this transaction in your wallet</MiddleStyled>
            </MidModalStyled>
        </PopupStyled>
    )
}

export default PopupModal