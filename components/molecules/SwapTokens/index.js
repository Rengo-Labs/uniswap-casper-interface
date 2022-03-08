import React from 'react'

import casprIcon from '../../../public/swapIcons/casprIcon.png'
import wcasprIcon from '../../../public/swapIcons/wcasprIcon.png'
import wiseIcon from '../../../public/swapIcons/wiseIcon.png'
import wethIcon from '../../../public/swapIcons/wethIcon.svg'

import { SwapToken } from '../SwapToken'

export const SwapTokens = () => {
    const tokens = [
        {
            icon: casprIcon,
            fullname: {
                name: "Casper",
                acron: "CSPR"
            },
            amount:"0.0000"
        },
        {
            icon: wcasprIcon,
            fullname: {
                name: "Wrapped Casper",
                acron: "WCSPR"
            },
            amount: "0.0000"
        },
        {
            icon: wiseIcon,
            fullname: {
                name: "WISE-R",
                acron: "WISER"
            },
            amount: "0.0000"
        },
        {
            icon: wethIcon,
            fullname: {
                name: "Wrapped Ether",
                acron: "WETH"
            },
            amount: "0.0000"
        },
    ]
    return (
        <div>
            {
                tokens.map((token,index) => {
                    return <SwapToken key={index} icon={token.icon.src} token={token.fullname} amount={token.amount}/>
                })
            }
        </div>
    )
}
