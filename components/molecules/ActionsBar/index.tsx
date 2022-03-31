import React from 'react'
import { AiFillSliders } from "react-icons/ai";
import { useAtom } from 'jotai'
import { Button, Anchor } from '../../atoms'

import { setConfig } from '../../../contexts/ConfigAtom'

import { ActionsStyles } from './styles'


export const ActionsBar = ({ isAnchor, to, content, insideMessage, handler }) => {
  const [, setConfigAtomSet] = useAtom(setConfig)
  return (
    <ActionsStyles>
      <Anchor isAnchor={isAnchor} to={to} insideMessage={insideMessage} />
      <Button content={content} handler={handler} />
      <button onClick={() => { setConfigAtomSet() }}> <AiFillSliders /></button>
    </ActionsStyles>
  )
}
