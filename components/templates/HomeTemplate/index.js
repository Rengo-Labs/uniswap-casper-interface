import React from 'react'
import { NavBar,Hero } from '../../organisms'
import { Container } from './styles'
export const HomeTemplate = ({ title = 'inside title', url = 'https://via.placeholder.com/50', content = 'inside button', isAnchor = false, to = '/',insideMessage="anchor" }) => {
  return (
    <Container>
      <NavBar title={title} url={url} content={content} isAnchor={isAnchor} to={to} insideMessage={insideMessage}/>
      <Hero />
      <NavBar title={title} url={url} content={content} isAnchor={isAnchor} to={to} />
    </Container>
  )
}
