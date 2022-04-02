import React from 'react'
import { AiFillSetting } from "react-icons/ai";
import { useAtom } from 'jotai'
import { Button, Anchor } from '../../atoms'

import { setConfig } from '../../../contexts/ConfigAtom'

import { ActionsStyles } from './styles'


export const ActionsBar = ({ children }) => {
  const [, setConfigAtomSet] = useAtom(setConfig)
  return (
    <ActionsStyles>
      { children }
    </ActionsStyles>
  )
}
