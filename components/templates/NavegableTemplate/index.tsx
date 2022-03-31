import React from 'react'

import { Container } from './styles'
import { NavBar } from '../../organisms'

export const NavegableTemplate = ({ title, url, content, isAnchor, to, insideMessage, handler, listOfLinks, children }:any) => {
  return (
    <Container>
      <NavBar title={title} url={url} content={content} isAnchor={isAnchor} to={to} insideMessage={insideMessage} handler={handler} listOfLinks={listOfLinks} />
      {children}
    </Container>
  )
}
