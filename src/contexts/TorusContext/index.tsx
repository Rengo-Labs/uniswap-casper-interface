import Torus from "@toruslabs/casper-embed";
import { createContext, ReactNode, useState } from "react";


export const TorusProviderContext = createContext<any>({})
export const TorusContext = ({ children }: { children: ReactNode }) => {

  const CHAINS = {
    CASPER_MAINNET: "casper",
    CASPER_TESTNET: "casper-test",
  };

  const SUPPORTED_NETWORKS = {
    [CHAINS.CASPER_MAINNET]: {
      blockExplorerUrl: "https://cspr.live",
      chainId: "0x1",
      displayName: "Casper Mainnet",
      logo: "https://cspr.live/assets/icons/logos/cspr-live-full.svg",
      rpcTarget: "https://casper-node.tor.us",
      ticker: "CSPR",
      tickerName: "Casper Token",
      networkKey: CHAINS.CASPER_MAINNET,
    },
    [CHAINS.CASPER_TESTNET]: {
      blockExplorerUrl: "https://testnet.cspr.live",
      chainId: "0x2",
      displayName: "Casper Testnet",
      logo: "https://testnet.cspr.live/assets/icons/logos/cspr-live-full.svg",
      rpcTarget: "https://testnet.casper-node.tor.us",
      ticker: "CSPR",
      tickerName: "Casper Token",
      networkKey: CHAINS.CASPER_TESTNET,
    },
  };

  const [userState, userStateSetter] = useState({
    isUserLogged: false,
    walletAddress: '',
    profileImage: ''
  })
  const onChainChange = (torus: any) => {
    torus.provider.on('chainChanged', (resp: any) => {
      console.log(resp, 'chainchanged');
      //setChainId(parseInt(resp.toString(), 10))
    });
  }

  const onAccountsChanged = (torus: any) => {
    torus.provider.on('accountsChanged', (accounts: any) => {
      console.log(accounts, 'accountsChanged');
      //setPublicAddress((Array.isArray(accounts) && accounts[0]) || '');
    });
  }

  async function torusLogout() {
    await torus?.logout();
    userStateSetter({ ...userState, isUserLogged: false })
  }
  let torus: Torus | null;
  // const login = async ()=>{
  //     torus = new Torus();
  //     await torus.init();
  //     await torus.login();
  // }
  const torusLogin = async () => {
    try {
      torus = new Torus();
      await torus.init({
        buildEnv: "testing",
        showTorusButton: true,
        network: SUPPORTED_NETWORKS[CHAINS.CASPER_MAINNET],
      });
      const loginaccs = await torus?.login();
      const userInfo = await torus.getUserInfo();
      userStateSetter({ isUserLogged: true, walletAddress: loginaccs[0], profileImage: userInfo.profileImage })
      onChainChange(torus);
      onAccountsChanged(torus);
    } catch (error) {
      console.error(error);
      await torus?.clearInit();
      userStateSetter({ ...userState, isUserLogged: false })
    }
  };


  return (
    <TorusProviderContext.Provider value={{ torusLogin, torusLogout, userState }}>
      {children}
    </TorusProviderContext.Provider>
  )
}


//         props.setTorus("");
//         props.setSelectedWallet();
//         localStorage.removeItem("Address")
//         localStorage.removeItem("selectedWallet")
//         await torus?.logout();
//         window.location.reload();
//       } catch (error) {
//         console.log("logout error", error);
//         let variant = "Error";
//       }
//     }
//   };


//   const login = async () => {
//     try {
//       setIsLoading(true);
//       torus = new Torus();
//       console.log("torus", torus);
//       await torus.init({
//         buildEnv: "testing",
//         showTorusButton: true,
//         network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
//       });
//       const loginaccs = await torus?.login();
//       props.setTorus(torus);
//       localStorage.setItem("torus", JSON.stringify(torus));
//       localStorage.setItem("Address", (loginaccs || [])[0]);
//       props.setActivePublicKey((loginaccs || [])[0]);
//       setAccount((loginaccs || [])[0] || "");
//       handleCloseWalletModal();
//     } catch (error) {
//       console.error(error);
//       await torus?.clearInit();
//       let variant = "Error";
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   const logout = async () => {
//     try {
//       console.log("logout", torus);
//       await torus?.logout();
//       setAccount("");
//       props.setTorus("");
//       props.setSelectedWallet();
//       localStorage.removeItem("Address");
//       localStorage.removeItem("selectedWallet");
//       window.location.reload();
//     } catch (error) {
//       console.log("logout error", error);
//       let variant = "Error";
//     }
//   };

//   return (
//     <></>
//   );
// }

// export default HeaderHome;