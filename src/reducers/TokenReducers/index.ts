import casprIcon from '../../assets/swapIcons/casprIcon.png'
import wcasprIcon from '../../assets/swapIcons/wcasprIcon.png'
import wiseIcon from '../../assets/swapIcons/wiseIcon.png'
import wethIcon from '../../assets/swapIcons/wethIcon.svg'

interface FullnameInterface {
    name: string,
    acron: string
}
export interface TokensInterface {
    icon: string,
    fullname: FullnameInterface,
    amount: string
}

export interface TokensListInterface {
    name: string,
    chainId: number,
    symbol: string,
    decimals: number,
    contractHash: string,
    packageHash: string,
    logoURI: string,
    amount: string,
}

export const initialStateToken = {
    tokens: {
        "CSPR": {
            name: "Casper",
            chainId: 1,
            symbol: "CSPR",
            decimals: 9,
            contractHash: "",
            packageHash: "",
            logoURI: casprIcon,
            amount: "0.0000"
        }
    },
    firstTokenSelected: {
        name: "Casper",
        chainId: 1,
        symbol: "CSPR",
        decimals: 9,
        contractHash: "",
        packageHash: "",
        logoURI: casprIcon,
        amount: "0.0000"
    },
    secondTokenSelected: {
        name: "Casper",
        chainId: 1,
        symbol: "CSPR",
        decimals: 9,
        contractHash: "",
        packageHash: "",
        logoURI: casprIcon,
        amount: "0.0000"
    }
};

export function TokenReducer(state, action) {
    switch (action.type) {
        case 'UPDATE_TOKENS':
            return { ...state, tokens: { ...state.tokens, ...action.payload.tokens } };
        case 'SELECT_FIRST_TOKEN':
            return { ...state, firstTokenSelected: action.payload };
        case 'SELECT_SECOND_TOKEN':
            return { ...state, secondTokenSelected: action.payload };
        case 'LOAD_BALANCE':
            return {
                ...state,
                tokens: {
                    ...state.tokens,
                    [action.payload.name]: {
                        ...state.tokens[action.payload.name],
                        amount: action.payload.data
                    }
                },
                firstTokenSelected: {
                    ...state.tokens[action.payload.name],
                    amount: action.payload.data
                }
            };
        case 'SWITCH_TOKENS':
            return { ...state, firstTokenSelected: action.payload.secondTokenSelected, secondTokenSelected: action.payload.firstTokenSelected };
        default:
            return state;
    }
}