import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { SnackbarProvider } from 'notistack';
import React, { useEffect } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import AdminDashboard from "../Pages/Dashboard/AdminDashboard";
import UserDashboard from "../Pages/Dashboard/UserDashboard";
import AuctionDrops from "../Pages/Users/AuctionDrops";
// import ExporterDashboard from "../Pages/Dashboard/ExporterDashboard";
// import ImporterDashboard from "../Pages/Dashboard/ImporterDashboard";
import EmailVerification from "../Pages/Users/EmailVerification";
import ForgotPassword from "../Pages/Users/ForgotPassword";
import HomeScreen from "../Pages/Users/HomeScreen";
import KYCScreen from "../Pages/Users/KYCScreen";
import LoginScreen from "../Pages/Users/LoginScreen";
import MarketPlace from "../Pages/Users/MarketPlace";
import PrivacyPolicy from "../Pages/Users/PrivacyPolicy";
import RegisterScreen from "../Pages/Users/RegisterScreen";
import TermsAndConditions from "../Pages/Users/TermsAndConditions";

function App() {
  let isLoggedIn;
  let jwtDecoded;
  let checkLoginStatus = () => {
    // Cookies.remove("Authorization");
    let jwt = Cookies.get("Authorization");
    if (jwt) {
      console.log(jwtDecode(jwt));
      // setjwtDecoded(jwtDecode(jwt));
      jwtDecoded = jwtDecode(jwt);
      console.log("jwtDecoded", jwtDecoded);
      isLoggedIn = true;
      // setIsLoggedIn(true);
    } else {
      // setIsLoggedIn(false);
      isLoggedIn = false;
    }
  };

  useEffect(() => {

    checkLoginStatus();// eslint-disable-next-line
  }, []);

  const PrivateRoute = ({ path, ...rest }) => {
    // checkLoginStatus();
    if (jwtDecoded && isLoggedIn) {
      if (jwtDecoded.roles === "admin") {
        return (
          <Route
            {...rest}
            render={(props) =>
              isLoggedIn ? (
                <AdminDashboard {...props} jwtDecoded={jwtDecoded} />
              ) : (
                <Redirect to="/" />
              )
            }
          />
        );
      }
      else if (jwtDecoded.roles === "user") {
        return (
          <Route
            {...rest}
            render={(props) =>
              isLoggedIn ? (
                <UserDashboard {...props} jwtDecoded={jwtDecoded} />
              ) : (
                <Redirect to="/" />
              )
            }
          />
        );
      }
      // else if (jwtDecoded.roles === "exporter") {
      //   return (
      //     <Route
      //       {...rest}
      //       render={(props) =>
      //         isLoggedIn ? (
      //           <ExporterDashboard {...props} jwtDecoded={jwtDecoded} />
      //         ) : (
      //             <Redirect to="/login" />
      //           )
      //       }
      //     />
      //   );
      // }
    }
    else {
      return <Redirect to="/" />;
    }
  };

  const LoginRegisterRedirectCheck = ({ path, ...rest }) => {
    checkLoginStatus();
    if (jwtDecoded && isLoggedIn && jwtDecoded.roles === "admin") {
      return <Redirect to="/dashboard" />;
    } else {
      return <Route component={HomeScreen} />;
    }
  };

  return (
    <SnackbarProvider maxSnack={3}>
      <BrowserRouter>
        <Switch>
          <LoginRegisterRedirectCheck exact path="/" />
          <LoginRegisterRedirectCheck exact path="/login" />
          <LoginRegisterRedirectCheck exact path="/register" />
          <Route path="/forgotpassword" component={ForgotPassword} />
          <Route
            path="/emailverification/:email/:token"
            render={(routeProps) => <EmailVerification {...routeProps} />}
          />
          <Route path="/marketPlace" component={MarketPlace} />
          <Route path="/auctionDrops" component={AuctionDrops} />

          <Route path="/termsandconditions" component={TermsAndConditions} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          {/* {jwtDecoded.roles === "user" ? (
            <Route path="/dasboard" component={UserDashboard} />
          ) : (null)} */}

          <PrivateRoute path="/dashboard" />
        </Switch>
      </BrowserRouter>
    </SnackbarProvider>
  );
}

export default App;
