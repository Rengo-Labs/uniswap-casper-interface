import React from 'react'
import { useRouter } from 'next/router'

import { NavegableTemplate } from '../../components/templates/NavegableTemplate'
import { CardContainer } from '../../components/atoms'
import { PoolModule } from '../../components/organisms'

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
      <CardContainer cardTitle="Top Pools" width="68%">
        <PoolModule></PoolModule>
      </CardContainer >
    </NavegableTemplate>
  )
}

export default Swap
