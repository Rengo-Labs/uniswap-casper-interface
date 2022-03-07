import React from 'react'
import { SwapInputStyled, InputStyled, InputContainerStyled, SelectStyled } from './styles'
import { SwapModal } from '../SwapModal'

export const SwapInput = () => {
    const [activeModal, setActiveModal] = React.useState(false)
    const handleModal = () => {
        setActiveModal(!activeModal)
    }
    return (
        <SwapInputStyled>
            <InputContainerStyled>
                <label htmlFor="amount">From</label>
                <InputStyled id="amount" placeholder="0.00" type="number" />
            </InputContainerStyled>
            {!activeModal ? <SwapModal handleModal={handleModal} /> : <button onClick={handleModal}>Select Token</button>}

        </SwapInputStyled>
    )
}
