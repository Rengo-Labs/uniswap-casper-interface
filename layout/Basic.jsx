import { NavegableTemplate } from '../components/templates/NavegableTemplate'
import { usUS } from '../components/i11n'
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
    </NavegableTemplate>
  );
};