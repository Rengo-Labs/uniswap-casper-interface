import React, { useContext } from 'react'
import { useAtom } from 'jotai'

import { Button, HeroTitleDD, HighlightDD, HeroSubtitleDD, ContainerDD, HeroHeaderDD, HeroFooterDD, CircularButton, SquareButton, SquareGrayButton, HomeFooterDD } from '../../atoms';
import { NavigationBar, ActionsBar, } from '../../molecules';
import { NavBar, Hero, GridNavbar } from '../../organisms'

import { ReactComponent as WordMarkIcon } from '../../../assets/newIcons/casperswap-wordmark.svg'
import { ReactComponent as CasperIcon } from '../../../assets/newIcons/casperIcon.svg'
import { /*ButtonConnection,*/ NewIcons } from '../../../components/atoms'


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
  const listOfLinks: any[] = []
  return (
    <ContainerDD>
      <GridNavbar>
        <a href='/' style={{display:"grid",justifyItems:"start",alignItems:"center"}}>
          <WordMarkIcon style={{ fill: '#FFF' }} />
        </a>
        <a href='/' style={{display:"grid",placeItems:"center"}}>
          <NewIcons Icon={CasperIcon} size={64} style={{ fill: '#FFF' }} />
        </a>
        <ActionsBar>
          <></>
        </ActionsBar>
      </GridNavbar>
      <Hero>
        <HeroHeaderDD>
          <HeroTitleDD>The evolution of <HighlightDD>Defi</HighlightDD></HeroTitleDD>
          <HeroSubtitleDD>Light-speed swaps. Next-level liquidity. Friction-less yield.</HeroSubtitleDD>
        </HeroHeaderDD>
        <HeroFooterDD>
          <SquareButton content={content} handler={handler} />
          <CircularButton content={"Read Document"} handler={handler} />
        </HeroFooterDD>

      </Hero>
      <HomeFooterDD>
        <SquareGrayButton content={"$ 192.173.768"} title={"TOTAL VALUE LOCKED"} handler={handler} />
        <SquareGrayButton content={"$ 50.870.295.291"} title={"TOTAL TRADING VOLUME"} handler={handler} />
      </HomeFooterDD>
    </ContainerDD>
  )
}
