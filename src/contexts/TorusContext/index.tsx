import Torus from "@toruslabs/casper-embed";
import { createContext, ReactNode, useState } from "react";

import { CHAINS, SUPPORTED_NETWORKS } from '../../constant'

export const TorusProviderContext = createContext<any>({})
export const TorusContext = ({ children }: { children: ReactNode }) => {
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
