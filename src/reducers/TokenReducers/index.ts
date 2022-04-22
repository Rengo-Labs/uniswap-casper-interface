import casprIcon from '../../assets/swapIcons/casprIcon.png'
import wcasprIcon from '../../assets/swapIcons/wcasprIcon.png'
import wiseIcon from '../../assets/swapIcons/wiseIcon.png'
import wethIcon from '../../assets/swapIcons/wethIcon.svg'

export const initialStateToken = {
    tokens: {
        "CSPR": {
            icon: casprIcon,
            fullname: {
                name: "Casper",
                acron: "CSPR"
            },
            amount: "0.0000"
        },
        "WCSPR": {
            icon: wcasprIcon,
            fullname: {
                name: "Wrapped Casper",
                acron: "WCSPR"
            },
            amount: "0.0000"
        },
        "WISER": {
            icon: wiseIcon,
            fullname: {
                name: "WISE-R",
                acron: "WISER"
            },
            amount: "0.0000"
        },
        "WETH": {
            icon: wethIcon,
            fullname: {
                name: "Wrapped Ether",
                acron: "WETH"
            },
            amount: "0.0000"
        },
    },
    firstTokenSelected: "",
    secondTokenSelected: ""
};

export function TokenReducer(state, action) {
    switch (action.type) {
        case 'SELECT_FIRST_TOKEN':
            return { ...state, firstTokenSelected: action.payload };
        case 'SELECT_SECOND_TOKEN':
            return { ...state, secondTokenSelected: action.payload };
        case 'SWITCH_TOKENS':
            return { ...state, firstTokenSelected: state.secondTokenSelected, secondTokenSelected: state.firstTokenSelected };
        default:
            return state;
    }
}