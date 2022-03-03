import React from 'react'
import { useRouter } from 'next/router'

import { NavegableTemplate } from '../../components/templates/NavegableTemplate'
import { usUS } from '../../components/i11n'
const Swap = () => {
  const router = useRouter()
  const handleClick = (e) => {
    e.preventDefault()
    router.push('/swap')
  }

  const { brandName, brandIMG, mainButton, listOfLinks } = usUS

  return (
    <NavegableTemplate title={brandName} url={brandIMG} content={mainButton} handler={handleClick} listOfLinks={listOfLinks}>
      <h1>SWAP [W.I.P]</h1>
    </NavegableTemplate>
  )
}

export default Swap
