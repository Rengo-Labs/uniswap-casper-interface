export const initialStateWallet: any = {
    isUserLogged: false,
    walletAddress: '',
}

export function reducerWallet(state, action) {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state,
                isUserLogged: true,
                walletAddress: action.payload.walletAddress
            }
        case "LOGOUT":
            return {
                ...state,
                isUserLogged: false,
                walletAddress: "",
            }
        default:
            return state
    }
}