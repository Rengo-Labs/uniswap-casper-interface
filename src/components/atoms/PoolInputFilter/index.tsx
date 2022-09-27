import React from 'react'

import { InputStyled } from './styles'

export const PoolInputFilter = ({ value, setValue, count, onChange }:{ value?:any, setValue?:any, count?:any, onChange?:any }) => {
    return (
        <InputStyled value={value || ""}
            onChange={e => {
                setValue(e.target.value);
                onChange(e.target.value);
            }}
            placeholder={`Search all`} />
    )
}
