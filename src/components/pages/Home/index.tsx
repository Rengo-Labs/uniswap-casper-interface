import { useNavigate } from 'react-router-dom'

import { HomeTemplate } from '../../templates/HomeTemplate'
import { usUS } from '../../../i18n'
export function Home() {
  const router = useNavigate()
  const { brandName, brandIMG, mainButton, heroImage } = usUS

  return (
    <HomeTemplate title={brandName} url={brandIMG} content={mainButton} handler={() => {router("/swap")}} heroImage={heroImage} />
  )
}
