import React from 'react'
import { Anchor } from '../../atoms'
import { NavigationBarStyled } from './styles'

export const NavigationBar = ({ listOfLinks }) => {
    return (
        <NavigationBarStyled>
            {
                listOfLinks.map(link => {
                    const { to, insideMessage } = link
                    return (<Anchor id={link} isAnchor={false} to={to} insideMessage={insideMessage} />)
                })
            }
        </NavigationBarStyled>
    )
}
