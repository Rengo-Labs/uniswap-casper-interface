import { ReactNode } from 'react';

import { NavegableTemplate } from '../components/templates/NavegableTemplate'
import { ConfigModal } from '../components/molecules'
import { usUS } from '../i18n'
import { useNavigate } from 'react-router-dom'


export const BasicLayout = ({ children }: { children: ReactNode }) => {
  const router = useNavigate()
  const handleClick = (e: any) => {
    e.preventDefault()
    router('/')
  }
  const { brandName, brandIMG, mainButton, listOfLinks } = usUS

  return (
    <NavegableTemplate title={brandName} url={brandIMG} content={mainButton} handler={handleClick} listOfLinks={listOfLinks}>
      {children}
      <ConfigModal></ConfigModal>
    </NavegableTemplate>
  );
};