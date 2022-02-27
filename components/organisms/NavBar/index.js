import React from 'react'

import { Brand, ActionsBar, NavigationBar, } from '../../molecules'

import { NavBarStyle } from './styles'
export const NavBar = ({ title, url, isAnchor, to, content, isHome = true, insideMessage, listOfLinks = [] }) => {

    return (
        <NavBarStyle>
            <Brand title={title} url={url} />
            {listOfLinks.length > 1 ? <NavigationBar listOfLinks={listOfLinks} /> : <></>}
            <ActionsBar content={content} isAnchor={isAnchor} to={to} insideMessage={insideMessage} />
        </NavBarStyle>
    )
}
