// import ethereum from "./assets/images/ethereum.png";
// import compound from "./assets/images/compound.png";
// import yearnfin from "./assets/images/yearnfin.png";
// import uniswap from "./assets/images/uniswap.png";

module.exports = () => {
    const baseURL = "http://localhost";
    const ethereum = baseURL + ":8080/assets/images/ethereum.png";
    const compound = baseURL + ":8080/assets/images/compound.png";
    const yearnfin = baseURL + ":8080/assets/images/yearnfin.png";
    const uniswap = baseURL + ":8080/assets/images/uniswap.png";
    const data = {
        protocols: [
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
        ]
    };
    return data;
}