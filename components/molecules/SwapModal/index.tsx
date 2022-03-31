import React from 'react'

import { SwapModalStyled, SwapContainerStyled, SwapHeaderStyled, CloseButtonStyled, SearchSectionStyled, SearchInputStyled, HeaderModalStyled } from './styles'
import { SwapTokens } from '../SwapTokens'
import { AiOutlineClose } from "react-icons/ai";
import { useAtom } from 'jotai'

interface SwapModalInterface{ handleModal?:any; tokens?:any; setToken?:any;filterCriteriaSet?:any;filterCriteria?:any; }

export const SwapModal = ({ handleModal, tokens, setToken,filterCriteriaSet,filterCriteria }:SwapModalInterface) => {

    return (
            <SwapModalStyled>
                <SwapContainerStyled >
                    <SwapHeaderStyled>
                        <HeaderModalStyled>Select Token</HeaderModalStyled>
                        <CloseButtonStyled onClick={() => { handleModal() }}>
                            <AiOutlineClose />
                        </CloseButtonStyled>
                    </SwapHeaderStyled>
                    <SearchSectionStyled>
                        <SearchInputStyled
                            placeholder="Search name"
                            value={filterCriteria}
                            onChange={(e) => {{filterCriteriaSet(e.target.value)}} }
                            />
                    </SearchSectionStyled>
                    <SwapTokens tokens={tokens} setToken={setToken} handleModal={handleModal} />
                </SwapContainerStyled>
            </SwapModalStyled>
    )
}
