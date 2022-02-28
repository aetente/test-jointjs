import { uiTypes } from "../types";

const INITIAL_STATE = {
    tokenOptions: [
        {
            value: "BTC",
            img: "https://s2.coinmarketcap.com/static/img/coins/32x32/1.png"
        },
        {
            value: "ETH",
            img: "https://s2.coinmarketcap.com/static/img/coins/32x32/1027.png"
        },
        {
            value: "BUSD",
            img: "https://s2.coinmarketcap.com/static/img/coins/32x32/4687.png"
        },
        {
            value: "USDT",
            img: "https://s2.coinmarketcap.com/static/img/coins/32x32/825.png"
        },
        {
            value: "BNB",
            img: "https://s2.coinmarketcap.com/static/img/coins/32x32/1839.png"
        },
    ],
    editAllowed: false
};

const ui = (state = INITIAL_STATE, action) => {
    let { tokenOptions } = state;
    switch (action.type) {
        case uiTypes.PUSH_TOKEN_OPTION:
            return { ...state, tokenOptions: [...tokenOptions, action.payload] };
        case uiTypes.UNSHIFT_TOKEN_OPTION:
            return { ...state, tokenOptions: [action.payload, ...tokenOptions] };
        case uiTypes.SET_EDIT_ACCESS:
            return { ...state, editAllowed: action.payload };
        default:
            return state;
    }
};

export default ui;
