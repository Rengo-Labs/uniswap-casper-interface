import React, { useContext } from 'react'
import { AiFillSetting } from "react-icons/ai";
import { useAtom } from 'jotai'

import { ImgRender, Title, Button, Anchor, HeroImage } from '../../atoms';
import { Brand, NavigationBar, ActionsBar, MarkedTitle, ConfigModal } from '../../molecules';
import { NavBar, Hero, InfoBoxes } from '../../organisms'
import { Container } from './styles'

import { setConfig } from 'src/contexts/ConfigAtom';
interface HomePropsInterface {
  title: any,
  url: any,
  content: any,
  isAnchor?: any,
  to?: any,
  insideMessage?: any,
  handler: any,
  heroImage: any
}
export const HomeTemplate = ({ title, url, content, isAnchor = false, to = '/', insideMessage = 'Analytics', handler, heroImage }: HomePropsInterface) => {
  const InfoBoxArrayCopy = [
    { infoBoxTitle: '$ 3.81', infoBoxSmall: '$CSPR Price' },
    { infoBoxTitle: '$ 2.04b', infoBoxSmall: 'Total Liquidity' },
    { infoBoxTitle: '$ 171.15b', infoBoxSmall: 'Total Volume' },
    { infoBoxTitle: '2,601', infoBoxSmall: 'Total Pairs' }
  ]
  const [, setConfigAtomSet] = useAtom(setConfig)
  const listOfLinks: any[] = []
  return (
    <Container>
      <NavBar>
        <Brand>
          <ImgRender url={url} />
          <Title title={title} />
        </Brand>
        {listOfLinks.length > 1 ? <NavigationBar listOfLinks={listOfLinks} /> : <></>}
        <ActionsBar>
          <Anchor isAnchor={isAnchor} to={to} insideMessage={insideMessage} />
          <Button content={content} handler={handler} />
          <Button handler={setConfigAtomSet} content={<AiFillSetting size="1.5em" />} />
        </ActionsBar>
      </NavBar>
      <Hero>
        <MarkedTitle title='Discover your DeFi treasure!' markedword='DeFi' />
        <HeroImage heroImage={heroImage.src} />
        <InfoBoxes InfoBoxArray={InfoBoxArrayCopy} />
      </Hero>
      <ConfigModal></ConfigModal>
    </Container>
  )
}
