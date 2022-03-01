import React from 'react'
import { NavBar, Hero } from '../../organisms'
import { Container } from './styles'
export const HomeTemplate = ({ title, url = 'https://via.placeholder.com/50', content, isAnchor = false, to = '/', insideMessage = "Analytics",handler }) => {
  const InfoBoxArrayCopy = [
    { infoBoxTitle: "$ 3.81", infoBoxSmall: "$CSPR Price" },
    { infoBoxTitle: "$ 2.04b", infoBoxSmall: "Total Liquidity" },
    { infoBoxTitle: "$ 171.15b", infoBoxSmall: "Total Volume" },
    { infoBoxTitle: "2,601", infoBoxSmall: "Total Pairs" },
  ]
  return (
    <Container>
      <NavBar title={title} url={url} content={content} isAnchor={isAnchor} to={to} insideMessage={insideMessage} handler={handler}/>
      <Hero HeroTitle={"Discover your DeFi treasure!"} HeroMarkedword="DeFi" InfoBoxArray={InfoBoxArrayCopy} />
    </Container>
  )
}
