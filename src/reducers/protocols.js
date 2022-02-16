import { protocolTypes } from "../types";

import ethereum from "../assets/images/ethereum.png";
import compound from "../assets/images/compound.png";
import yearnfin from "../assets/images/yearnfin.png";
import uniswap from "../assets/images/uniswap.png";


const protocolsDefaults = [
        {
            id: "0",
            name: "Ethereum",
            backgroundColor: "#f6f6f6",
            borderColor: "#8c8c8c",
            image: ethereum
        },
        {
            id: "1",
            name: "Compound",
            backgroundColor: "#F2FBF8",
            borderColor: "#00D395",
            image: compound
        },
        {
            id: "2",
            name: "Yearn.finance",
            backgroundColor: "#EEF1F4",
            borderColor: "#307FD2",
            image: yearnfin
        },
        {
            id: "3",
            name: "Uniswap",
            backgroundColor: "#FFEFF7",
            borderColor: "#FF5DAC",
            image: uniswap
        }
    ];


const INITIAL_STATE = { protocols: protocolsDefaults};

const ui = (state = INITIAL_STATE, action) => {
  let { protocols } = state;
  switch (action.type) {
    case protocolTypes.SET_PROTOCOLS:
      return { ...state, protocols: [...action.payload] };
    default:
      return state;
  }
};

export default ui;
