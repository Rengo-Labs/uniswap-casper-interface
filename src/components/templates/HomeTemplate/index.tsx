import React, { useContext } from 'react'
import { AiFillSetting } from "react-icons/ai";
import { useAtom } from 'jotai'

import { ImgRender, Title, Button, Anchor, HeroImage } from '../../atoms';
import { Brand, NavigationBar, ActionsBar, MarkedTitle, ConfigModal } from '../../molecules';
import { NavBar, Hero, InfoBoxes } from '../../organisms'
import { Container } from './styles'

import { setConfig } from '../../../contexts/ConfigAtom';
import { InitialProviderContext } from '../../../contexts/InitialContext';

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
  const { InfoBoxArray } = useContext(InitialProviderContext)
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
        <HeroImage heroImage={heroImage} />
        <InfoBoxes InfoBoxArray={InfoBoxArray} />
      </Hero>
      <ConfigModal></ConfigModal>
    </Container>
  )
}
