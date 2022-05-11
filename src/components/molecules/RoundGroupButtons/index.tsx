import React from 'react'

import { RoundedButton } from '../../atoms'
import { v4 as uuidv4 } from 'uuid';

export const RoundGroupButtons = ({ options }) => {

    return (
        <div>{options.map((option, index) => <RoundedButton key={uuidv4()} text={option} />)}</div>
    )

}
