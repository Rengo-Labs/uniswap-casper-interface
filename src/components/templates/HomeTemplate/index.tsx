import React, { useContext } from 'react'
import { AiFillSetting } from "react-icons/ai";
import { useAtom } from 'jotai'

import { ImgRender, Title, Button, Anchor, HeroImage } from '../../atoms';
import { Brand, NavigationBar, ActionsBar, MarkedTitle, ConfigModal } from '../../molecules';
import { NavBar, Hero, InfoBoxes } from '../../organisms'
import { Container } from './styles'

import styled from 'styled-components'
import { ReactComponent as WordMarkIcon } from '../../../assets/newIcons/casperswap-wordmark.svg'
import { ReactComponent as CasperIcon } from '../../../assets/newIcons/casperIcon.svg'
import { /*ButtonConnection,*/ NewIcons } from '../../../components/atoms'

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

const HeroTitle = styled.h1`
  font-family: Epilogue;
  font-size: 85.25px;
  padding: 15px 0;
`

const HeroSubtitle = styled.h2`
  font-family: EpilogueLight;
  font-size: 30px;
`

const Highlight = styled.span`
  color: ${props => props.theme.NewAquamarineColor};
`

export const HomeTemplate = ({ title, url, content, isAnchor = false, to = '/', insideMessage = 'Analytics', handler, heroImage }: HomePropsInterface) => {
  const { InfoBoxArray } = useContext(InitialProviderContext)
  const [, setConfigAtomSet] = useAtom(setConfig)
  const listOfLinks: any[] = []
  return (
    <Container>
      <NavBar>
        <a href='/'>
          {/* TODO: remove inline css*/}
          <WordMarkIcon style={{ fill: '#FFF' }}/>
        </a>
        <a href='/'>
          {/* TODO: remove inline css*/}
          <NewIcons Icon={CasperIcon} size={64} style={{ fill: '#FFF' }}/>
        </a>
        {listOfLinks.length > 1 ? <NavigationBar listOfLinks={listOfLinks} /> : <></>}
        <ActionsBar>
          <Button content={content} handler={handler} />
        </ActionsBar>
      </NavBar>
      <Hero>
        <HeroTitle>Next Generation <Highlight>Defi</Highlight></HeroTitle>
        <HeroSubtitle>Fast swaps. Deep liquidity. Big yield.</HeroSubtitle>
      </Hero>
    </Container>
  )
}
