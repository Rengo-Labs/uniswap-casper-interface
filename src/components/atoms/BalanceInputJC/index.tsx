import React from 'react'
import styled from 'styled-components'
const BalanceInput = styled.input`
    all: unset;
    width: 100%;
    height: 100%;
    text-align: right;
    font-size: 22px;
    &:active{
        border: none;
    }
`
export const BalanceInputJC = ({min,onChange,value}) => {
    return (
        <BalanceInput
            min={min}
            onChange={onChange}
            type="number"
            name=""
            id=""
            value={value} />
    )
}
