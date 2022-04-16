import { NavegableTemplate } from '../components/templates/NavegableTemplate'
import { ConfigModal } from '../components/molecules'
import { usUS } from '../i18n'
import { useRouter } from 'next/router'
export const BasicLayout = ({ children }) => {
  const router = useRouter()
  const handleClick = (e) => {
    e.preventDefault()
    router.push('/swap')
  }
  const { brandName, brandIMG, mainButton, listOfLinks } = usUS

  return (
    <NavegableTemplate title={brandName} url={brandIMG} content={mainButton} handler={handleClick} listOfLinks={listOfLinks}>
      {children}
      <ConfigModal></ConfigModal>
    </NavegableTemplate>
  );
};