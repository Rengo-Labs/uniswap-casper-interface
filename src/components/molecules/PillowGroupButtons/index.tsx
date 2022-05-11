import React from 'react'

import { PillowButton } from '../../atoms'
import { v4 as uuidv4 } from 'uuid';

export const PillowGroupButtons = ({ options }) => {

    return (
        <div>{options.map((option, index) => <PillowButton key={uuidv4()} text={option} />)}</div>
    )

}
