import { ThemeContext } from "../contexts/ThemeContext";
const MyApp = ({ Component, pageProps, auth }) => {
  return (
    <ThemeContext>
      <Component {...pageProps} />
    </ThemeContext>
  );
};
export default MyApp;
