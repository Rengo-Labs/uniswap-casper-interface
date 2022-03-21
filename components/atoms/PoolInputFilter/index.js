import React from 'react'

import { InputStyled } from './styles'

export const PoolInputFilter = ({ value, setValue, count, onChange }) => {
    return (
        <InputStyled value={value || ""}
            onChange={e => {
                setValue(e.target.value);
                onChange(e.target.value);
            }}
            placeholder={`${count} records...`} />
    )
}
