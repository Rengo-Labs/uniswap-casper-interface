import styled from 'styled-components'
import {device} from "../../../../contexts/ThemeContext/themes";

export const SocialMediaStyles = styled.section`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap:.8rem;

  @media ${device.mobileS} {
    gap:.8rem;
  }

  @media ${device.mobileM} {
    gap:.8rem;
  }

  @media ${device.mobileL} {
    gap: 0.8rem;
  }

  @media ${device.tablet} {
    gap: 2rem;
  }
  
  @media ${device.laptop} {
    gap: 2rem;
  }
  
  @media ${device.laptopL} {
    gap: 2rem;
  }
`
