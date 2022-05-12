export const initialStateWallet: any = {
    isUserLogged: false,
    walletAddress: '',
    casperService: '',
    csprBalance: ''
}

export function reducerWallet(state, action) {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state,
                isUserLogged: true,
                walletAddress: action.payload.walletAddress,
                casperService: action.payload.casperService
            }
        case "LOGOUT":
            return {
                ...state,
                isUserLogged: false,
                walletAddress: "",
                casperService: ""
            }
        case "CASPER_SERVICE":
            return {
                ...state,
                casperService: action.payload.casperService
            }
        case "CSPR_BALANCE":
            return {
                ...state,
                csprBalance: action.payload.csprBalance
            }
        default:
            return state
    }
}