export const initialStateWallet: any = {
    isUserLogged: false,
    walletAddress: '',
    casperService: '',
    csprBalance: '',
    slippageTolerance: '0.5',
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
        case "SLIPPAGE_TOLERANCE_SETTER":
            return {
                ...state,
                slippageTolerance: action.payload.slippageTolerance
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