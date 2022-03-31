import React, { useContext } from 'react'
import { CasperProviderContext } from '../../../contexts/CasperContext'
import { NavBar, Hero } from '../../organisms'
import { Container } from './styles'
import { Signer } from 'casper-js-sdk';

export const HomeTemplate = ({ title, url, content, isAnchor = false, to = '/', insideMessage = 'Analytics', handler, heroImage }) => {
  const InfoBoxArrayCopy = [
    { infoBoxTitle: '$ 3.81', infoBoxSmall: '$CSPR Price' },
    { infoBoxTitle: '$ 2.04b', infoBoxSmall: 'Total Liquidity' },
    { infoBoxTitle: '$ 171.15b', infoBoxSmall: 'Total Volume' },
    { infoBoxTitle: '2,601', infoBoxSmall: 'Total Pairs' }
  ]

  return (
    <Container>
      <NavBar title={title} url={url} content={content} isAnchor={isAnchor} to={to} insideMessage={insideMessage} handler={handler} />
      <Hero HeroTitle='Discover your DeFi treasure!' HeroMarkedword='DeFi' InfoBoxArray={InfoBoxArrayCopy} heroImage={heroImage} />
    </Container>
  )
}
