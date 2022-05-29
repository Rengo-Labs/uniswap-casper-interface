import React from 'react'

import { TokenContainerStyled, PoolSeachButtonStyled } from './styles'

import { PoolInputFilter, PillowButton, RoundedButton } from '../../atoms'
import { PillowGroupButtons } from '../PillowGroupButtons'
import { RoundGroupButtons } from '../RoundGroupButtons'

import { AiOutlineSearch } from "react-icons/ai";
export const TokenSearch = () => {
    const options = ["All assets", "Tradable", "Gainers", "Losers"]
    const timeOptions = ["1H", "1D", "1W", "1M", "1Y",]
    return (
        <TokenContainerStyled>
            <PillowGroupButtons options={options} />
            <PoolSeachButtonStyled>
                <AiOutlineSearch />
                <PoolInputFilter />
            </PoolSeachButtonStyled>
            <RoundGroupButtons options={timeOptions} />
        </TokenContainerStyled>
    )
}
