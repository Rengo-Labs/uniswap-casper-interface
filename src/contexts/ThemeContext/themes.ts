import { createGlobalStyle } from "styled-components";
import { theme } from 'rengo-ui-kit'
import { CsprClickThemes } from '@make-software/csprclick-ui'
import "../../index.css";

export interface LightThemeInterface {
  PrimaryColor: string;
  PrimaryColor2: string;
  MainColor: string;
  StrongColor: string;
  StrongColor2: string;
  StrongColor3: string;
  StrongColor4: string;
  StrongColor5: string;
  SecondaryColor: string;
  TertiaryColor: string;
  TertiaryColor2: string;
  backgroundColor: string;
  mainBackgroundColor: string;
  secondBackgroundColor: string;
  thirdBackgroundColor: string;
  NewAquamarineColor: string;
  NewPurpleColor: string;
  NewGrayColor: string;
  NewGreyColor: string;
}

export const lightTheme = {
  ...theme.default,
  ...CsprClickThemes.light
};

export const darkTheme = {
  ...theme.dark,
  ...CsprClickThemes.dark
};

 const sizeScreen = {
  mobileS: '320px',
  mobileM: '375px',
  mobileL: '425px',
  tablet: '768px',
  laptop: '1024px',
  laptopL: '1440px',
  desktop: '2560px'
}

export const device = {
  mobileS: `(min-width: ${sizeScreen.mobileS})`,
  mobileM: `(min-width: ${sizeScreen.mobileM})`,
  mobileL: `(min-width: ${sizeScreen.mobileL})`,
  tablet: `(min-width: ${sizeScreen.tablet})`,
  laptop: `(min-width: ${sizeScreen.laptop})`,
  laptopL: `(min-width: ${sizeScreen.laptopL})`,
  desktop: `(min-width: ${sizeScreen.desktop})`,
  desktopL: `(min-width: ${sizeScreen.desktop})`
};

export const deviceMax = {
  mobileS: `(max-width: ${sizeScreen.mobileS})`,
  mobileM: `(max-width: ${sizeScreen.mobileM})`,
  mobileL: `(max-width: ${sizeScreen.mobileL})`,
  tablet: `(max-width: ${sizeScreen.tablet})`,
  laptop: `(max-width: ${sizeScreen.laptop})`,
  laptopL: `(max-width: ${sizeScreen.laptopL})`,
  desktop: `(max-width: ${sizeScreen.desktop})`,
  desktopL: `(max-width: ${sizeScreen.desktop})`
};

export const GlobalStyles = createGlobalStyle<{ theme: LightThemeInterface }>`
/* http://meyerweb.com/eric/tools/css/reset/ 
   v2.0 | 20110126
   License: none (public domain)
*/

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}
    * {
      font-family: 'Epilogue', regular;
    }
    #__next{
        height: 100%;
        width: 100%;
        color:${(props) => props.theme.PrimaryColor};
    }
    body{
        min-height: 100vh;
        height: 100%;
        width: 100%;
        margin: 0;
        box-sizing: border-box;
        color:${(props) => props.theme.PrimaryColor};
        background-color: #F7FCFE;
    }
`;
