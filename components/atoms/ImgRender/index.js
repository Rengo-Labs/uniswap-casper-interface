import React from 'react'
import Image from 'next/image';
export const ImgRender = ({ url }) => {
  return (
    <>
      <img src={url.src} alt='' width="50"/>
    </>
  )
}
