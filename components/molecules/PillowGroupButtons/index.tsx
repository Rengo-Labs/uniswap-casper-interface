import React from 'react'

import { PillowButton } from '../../atoms'

export const PillowGroupButtons = ({ options }) => {

    return (
        <div>{options.map((option, index) => <PillowButton key={index} text={option} />)}</div>
    )

}
