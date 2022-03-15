import { ThemeContext } from "../contexts/ThemeContext";
import { TokensContext } from "../contexts/TokensContext";
const MyApp = ({ Component, pageProps, auth }) => {
  return (
    <ThemeContext>
      <TokensContext>
        <Component {...pageProps} />
      </TokensContext>
    </ThemeContext>
  );
};
export default MyApp;
