import React from 'react'
import styled, { keyframes } from 'styled-components'
import { ButtonClose } from '../../atoms'
import { AiOutlineArrowUp, AiOutlineCloseCircle } from "react-icons/ai";


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

const TotalCenterStyled = styled.div`
    justify-self: center;
    align-self: center;
    font-size:5rem;
`


const ConfirmModal = ({ display, handleModal, linkExplorer }) => {
    return (
        <PopupStyled display={display}>
            <MidModalStyled>
                <CloseStyled>
                    <ButtonClose onClickHandler={() => { handleModal(false) }}>
                        <AiOutlineCloseCircle />
                    </ButtonClose>
                </CloseStyled>

                <TotalCenterStyled>
                    <AiOutlineArrowUp />
                </TotalCenterStyled>
                <MiddleStyled>Transaction Submitted</MiddleStyled>
                <MiddleStyled><a href={linkExplorer} target="_blank"> View on Explorer</a></MiddleStyled>
            </MidModalStyled>
        </PopupStyled>
    )
}

export default ConfirmModal