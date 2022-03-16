import { createGlobalStyle } from 'styled-components'

export const lightTheme = {
  PrimaryColor: 'rgba(255,255,255,1)',
  PrimaryColor2: 'rgba(255,255,255,.5)',
  MainColor: 'rgba(0,62,145,1)',
  StrongColor: 'rgba(3,46,121,1)',
  StrongColor2: 'rgba(3,70,166,1)',
  StrongColor3: 'rgba(3,52,138,1)',
  StrongColor4: 'rgba(3,52,138,.3)',
  SecondaryColor: 'rgba(0,187,233,1)',
  TertiaryColor: 'rgba(255,204,0,1)',
  TertiaryColor2: 'rgba(255,204,0,.5)',
  backgroundColor: 'linear-gradient(to bottom, rgba(0,187,233,.8), rgba(0,62,145,1))'
}
export const darkTheme = {
  PrimaryColor: 'rgba(255,255,255,1)'
}

export const GlobalStyles = createGlobalStyle`
    * {
      font-family: 'Baloo 2', regular;
    }
    #__next{
        height: 100%;
        width: 100%;
        color:${props => props.theme.PrimaryColor};
    }
    body{
        min-height: 100vh;
        height: 100%;
        width: 100%;
        margin: 0;
        box-sizing: border-box;
        color:${props => props.theme.PrimaryColor};
        background-image: ${props => props.theme.backgroundColor} ;
    }
`
