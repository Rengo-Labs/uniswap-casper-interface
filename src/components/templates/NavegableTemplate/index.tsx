import React from 'react'
import { AiFillSetting } from 'react-icons/ai'
import { useAtom } from 'jotai'

import { Container } from './styles'
import { NavBar } from '@organisms/NavBar'
import { Brand } from '@molecules/Brand'
import { ImgRender } from '@atoms/ImgRender'
import { Title } from '@atoms/Title'
import { NavigationBar } from '@molecules/NavigationBar'
import { ActionsBar } from '@molecules/ActionsBar'
import { Anchor } from '@atoms/Anchor'
import { Button } from '@atoms/Button'

import { setConfig } from 'contexts/ConfigAtom'

export const NavegableTemplate = ({ title, url, content, isAnchor, to, insideMessage, handler, listOfLinks, children }: any) => {
  const [, setConfigAtomSet] = useAtom(setConfig)
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
      {children}
    </Container>
  )
}
