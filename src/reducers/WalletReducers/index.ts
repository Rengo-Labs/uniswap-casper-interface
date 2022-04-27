export const initialStateWallet: any = {
    isUserLogged: false,
    walletAddress: '',
    profileImage: '',
    torus: null,
}

export function reducerWallet(state, action) {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state,
                isUserLogged: true,
                walletAddress: action.payload.walletAddress,
                profileImage: action.payload.profileImage,
                torus: action.payload.torus
            }
        case "LOGOUT":
            return {
                ...state,
                isUserLogged: false,
                walletAddress: "",
                profileImage: "",
                torus: null
            }
        default:
            return state
    }
}