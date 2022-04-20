import Torus, { TORUS_BUILD_ENV_TYPE, TorusInPageProvider } from "@toruslabs/casper-embed";
import { createContext, ReactNode } from "react";
import Web3 from 'web3';
import { AbstractProvider } from 'web3-core';


// type Web3Object = {
//   web3: Web3;
//   torus: Torus | null;
//   setweb3: (provider: TorusInPageProvider) => void;
// };

// const web3Obj: Web3Object = {
//     web3: new Web3(),
//     torus: null,
//     setweb3(provider): void {
//       web3Obj.web3.setProvider(provider as AbstractProvider);
//     },
//   };

//



// const onChainChange = (torus:any) => {
//     torus.provider.on('chainChanged', (resp:any) => {
//       console.log(resp, 'chainchanged');
//       //setChainId(parseInt(resp.toString(), 10))
//     });
//   }
  
// const onAccountsChanged = (torus:any) => {
//     torus.provider.on('accountsChanged', (accounts:any) => {
//       console.log(accounts, 'accountsChanged');
//       //setPublicAddress((Array.isArray(accounts) && accounts[0]) || '');
//     });
// }

// const onLogout = async (torus:any)=>{
//     await torus?.logout()
// }
  
// const torusLogin = async () => {
//   try {
//     const torus = new Torus();
//     console.log("torus", torus);
//     await torus.init({
//       buildEnv: "testing",
//       showTorusButton: true,
//       //network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
//     });
//     const loginaccs = await torus?.login();
//     const setActivePublicKey = (loginaccs || [])[0];
//     //onChainChange(torus);
//     //onAccountsChanged(torus);
//   } catch (error) {
//     console.error(error);
//     //await torus?.clearInit();
//   }
// };

export const TorusProviderContext = createContext<any>({})
export const TorusContext = ({ children }:{children:ReactNode}) => {

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

    let torus: Torus | null;
    const login = async ()=>{
        torus = new Torus();
        await torus.init();
        await torus.login();
    }
//     const torusLogin = async () => {
//     try {
//         torus = new Torus();
//         console.log("torus", torus);
//         await torus.init({
//         buildEnv: "testing",
//         showTorusButton: true,
//         network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
//     });
//     //const loginaccs = await torus?.login();
//     //const setActivePublicKey = (loginaccs || [])[0];
//     //onChainChange(torus);
//     //onAccountsChanged(torus);
//   } catch (error) {
//     console.error(error);
//     //await torus?.clearInit();
//   }
// };
    return (
        <TorusProviderContext.Provider value={{login }}>
            {children}
        </TorusProviderContext.Provider>
  )
}




// import Torus from "@toruslabs/casper-embed";
// import Cookies from "js-cookie";
// import React, { useEffect, useState } from "react";

// export const CHAINS = {
//   CASPER_MAINNET: "casper",
//   CASPER_TESTNET: "casper-test",
// };

// export const SUPPORTED_NETWORKS = {
//   [CHAINS.CASPER_MAINNET]: {
//     blockExplorerUrl: "https://cspr.live",
//     chainId: "0x1",
//     displayName: "Casper Mainnet",
//     logo: "https://cspr.live/assets/icons/logos/cspr-live-full.svg",
//     rpcTarget: "https://casper-node.tor.us",
//     ticker: "CSPR",
//     tickerName: "Casper Token",
//     networkKey: CHAINS.CASPER_MAINNET,
//   },
//   [CHAINS.CASPER_TESTNET]: {
//     blockExplorerUrl: "https://testnet.cspr.live",
//     chainId: "0x2",
//     displayName: "Casper Testnet",
//     logo: "https://testnet.cspr.live/assets/icons/logos/cspr-live-full.svg",
//     rpcTarget: "https://testnet.casper-node.tor.us",
//     ticker: "CSPR",
//     tickerName: "Casper Token",
//     networkKey: CHAINS.CASPER_TESTNET,
//   },
// };

// let torus = null;
// console.log("torus", torus);

// function HeaderHome(props) {
//   let [menuOpenedClass, setMenuOpenedClass] = useState();
//   let [signerLocked, setSignerLocked] = useState();
//   let [signerConnected, setSignerConnected] = useState(false);
//   let [isLoading, setIsLoading] = useState(false);
//   let [, setAccount] = useState("");

//   const [openWalletModal, setOpenWalletModal] = useState(false);
//   const handleCloseWalletModal = () => {
//     setOpenWalletModal(false);
//   };
//   const handleShowWalletModal = () => {
//     setOpenWalletModal(true);
//   };
//   
//   const alertUser = async (e) => {
//     if (localStorage.getItem("selectedWallet") === "Torus") {
//       try {
//         console.log("logout", torus);
        
//         setAccount("");
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