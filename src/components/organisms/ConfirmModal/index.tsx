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
const ContainerStyled = styled.div<any>`
    background-color: ${props => props.theme.StrongColor};
    width:30%;
    height:50%;
    padding:20px;
    display: grid;
    place-items: center;
    border-radius: 10px;
`

const MidModalStyled = styled.div<any>`
    width:100%;
    height:100%;
    color: "white";
    background-color: ${props => props.theme.StrongColor2};
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

const TotalCenterStyled = styled.div`
    justify-self: center;
    align-self: center;
    font-size:5rem;
`

const AnchorStyled = styled.a`
    color:white;
    &:visited{
        color:white;
    }
`



const ConfirmModal = ({ display, handleModal, linkExplorer }) => {
    return (
        <PopupStyled display={display}>
            <ContainerStyled>
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
                    <MiddleStyled><AnchorStyled href={linkExplorer} target="_blank"> View on Explorer</AnchorStyled></MiddleStyled>
                </MidModalStyled>
            </ContainerStyled>
        </PopupStyled>
    )
}

export default ConfirmModal