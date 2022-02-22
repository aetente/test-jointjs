import { tokensTypes } from "../types";

import wbtc from "../assets/images/wbtc.png";
import ftm from "../assets/images/ftm.png";
import eth from "../assets/images/eth.png";
import dai from "../assets/images/dai.png";


const tokensDefaults = [
        {
            id: "0",
            name: "WBTC",
            image: wbtc
        },
        {
            id: "1",
            name: "FTM",
            image: ftm
        },
        {
            id: "2",
            name: "ETH",
            image: eth
        },
        {
            id: "3",
            name: "DAI",
            image: dai
        }
    ];


const INITIAL_STATE = { tokens: tokensDefaults};

const tokens = (state = INITIAL_STATE, action) => {
  let { tokens } = state;
  switch (action.type) {
    case tokensTypes.SET_TOKENS:
      return { ...state, tokens: [...action.payload] };
    default:
      return state;
  }
};

export default tokens;
