import { ThemeContext } from "../contexts/ThemeContext";
import { TokensContext } from "../contexts/TokensContext";
import Head from 'next/head';

const MyApp = ({ Component, pageProps, auth }) => {
  return (
    <ThemeContext>
      <TokensContext>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Baloo+2&display=swap" rel="stylesheet" />
        </Head>
        <Component {...pageProps} />
      </TokensContext>
    </ThemeContext>
  );
};
export default MyApp;
