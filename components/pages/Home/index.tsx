import React from 'react'
import { useRouter } from 'next/router'
// CSS-In-JSS
// import { Container, NavBarArea, NavBarContainer, NavBarConnect, MainArea, FooterArea, FooterContainer, FooterBox } from './styles'

import { HomeTemplate } from '../../templates/HomeTemplate'
import { usUS } from '../../../i18n'
export function Home () {
  const router = useRouter()
  const handleClick = (e) => {
    e.preventDefault()
    router.push('/swap')
  }
  const { brandName, brandIMG, mainButton,heroImage } = usUS

  return (
    <HomeTemplate title={brandName} url={brandIMG} content={mainButton} handler={handleClick} heroImage={heroImage}/>
  )
}
