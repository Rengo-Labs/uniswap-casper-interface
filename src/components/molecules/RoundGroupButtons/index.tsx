import React from 'react'

import { RoundedButton } from '../../atoms'

export const RoundGroupButtons = ({ options }) => {

    return (
        <div>{options.map((option, index) => <RoundedButton key={index} text={option} />)}</div>
    )

}
