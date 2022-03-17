import { ThemeContext } from "../contexts/ThemeContext";
import { TokensContext } from "../contexts/TokensContext";
import { LiquidityContext } from "../contexts/LiquidityContext";
import { PoolsContext } from "../contexts/PoolsContext";

import Head from 'next/head';
const MyApp = ({ Component, pageProps, auth }) => {
  return (
    <ThemeContext>
      <PoolsContext>
        <LiquidityContext>
          <TokensContext>
            <Head>
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link rel="preconnect" href="https://fonts.gstatic.com" />
              <link href="https://fonts.googleapis.com/css2?family=Baloo+2&display=swap" rel="stylesheet" />
            </Head>
            <Component {...pageProps} />
          </TokensContext>
        </LiquidityContext>
      </PoolsContext>

    </ThemeContext>
  );
};
export default MyApp;
