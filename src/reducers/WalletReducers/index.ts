import { torusLogin, torusLogout } from "./functions"

export const initialStateWallet: any = {
    isUserLogged: false,
    walletAddress: '',
    profileImage: '',
    torus: null,
}

export async function reducerWallet(state, action: any) {
    console.log("reducer")
    switch (action.type) {
        case "LOGIN":
            console.log("login")
            torusLogin()
                .then(({ torus, walletAddress, profileImage }) => {
                    console.log("login success")
                    return {
                        ...state,
                        isUserLogged: true,
                        walletAddress: "walletAddress",
                        profileImage: "profileImage",
                        torus: "torus"
                    }
                })
                .catch(err => { })
            break;
        case "LOGOUT":
            async () => {
                await torusLogout(state.torus)
                return {
                    ...state,
                    isUserLogged: false,
                    walletAddress: "",
                    profileImage: "",
                    torus: null
                }
            }
            break;
        default:
            return state
    }
}