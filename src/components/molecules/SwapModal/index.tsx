import React, { ReactNode } from 'react'

import { SwapModalStyled, SwapContainerStyled, SwapHeaderStyled, CloseButtonStyled, SearchSectionStyled, SearchInputStyled, HeaderModalStyled } from './styles'
import { SwapTokens } from '../SwapTokens'
import { AiOutlineClose } from "react-icons/ai";
import { CloseButtonAtom, HeaderModalAtom, SearchSectionAtom, SwapContainerAtom, SwapHeaderAtom } from '../../atoms';
import { SearchInputAtom } from '../../atoms/SearchInputAtom';

export const SwapModal = ({ children, onClick }: { children: ReactNode, onClick?: () => void }) => {

    return (
        <SwapModalStyled>
            {children}
        </SwapModalStyled>
    )
}
