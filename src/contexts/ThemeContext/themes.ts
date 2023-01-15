import { createGlobalStyle } from "styled-components";
import "../../index.css";

interface LightThemeInterface {
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
  PrimaryColor: "rgba(255,255,255,1)",
  PrimaryColor2: "rgba(255,255,255,.5)",
  MainColor: "rgba(0,62,145,1)",
  StrongColor: "rgba(3,46,121,1)",
  StrongColor2: "rgba(3,70,166,1)",
  StrongColor3: "rgba(3,52,138,1)",
  StrongColor4: "rgba(3,52,138,.3)",
  StrongColor5: "rgba(3,52,138,.8)",
  SecondaryColor: "rgba(0,187,233,1)",
  TertiaryColor: "rgba(255,204,0,1)",
  TertiaryColor2: "rgba(255,204,0,.5)",
  TertiaryColor3: "rgba(255,204,0,.8)",
  backgroundColor:
    "linear-gradient(to bottom, rgba(0,187,233,.8), rgba(0,62,145,1))",
  mainBackgroundColor: "rgba(247,252,253,255)",
  secondBackgroundColor: "rgba(120, 100, 244, 1)",
  thirdBackgroundColor: "rgba(112, 236, 212, 1)",
  NewAquamarineColor: "rgba(110, 235, 208, 1)",
  NewPurpleColor: "rgba(113, 95, 245, 1)",
  NewGrayColor: "#999999",
  NewGreyColor: "#CCCCCC",
  NewGreenColor: "#1DC90A",
  NewBlackColor: "#080808",
  SecondBlackColor: "#545454",
  OPEN_WIDTH: "280px",
  CLOSED_WIDTH: "108px",
  NewNavigationCCBG:"rgb(120,100,244)"
};

export const darkTheme = {
  PrimaryColor: "rgba(255,255,255,1)",
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
