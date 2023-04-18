import { useNavigate } from 'react-router-dom'

import { HomeTemplate } from '../../templates/HomeTemplate'
import { usUS } from '../../../../i18n'
export function Home() {
  const router = useNavigate()
  const { mainButton } = usUS

  return (
    <HomeTemplate content={mainButton} handler={() => {router("/swap")}} />
  )
}
