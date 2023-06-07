import React from 'react'
import { Anchor } from '../../atoms'
import { NavigationBarStyled } from './styles'

import { v4 as uuidv4 } from 'uuid';

export const NavigationBar = ({ listOfLinks }) => {
  return (
    <NavigationBarStyled>
      {
        listOfLinks.map(link => {
          const { to, insideMessage } = link
          return (<Anchor key={uuidv4()} isAnchor={false} to={to} insideMessage={insideMessage} />)
        })
      }
    </NavigationBarStyled>
  )
}
