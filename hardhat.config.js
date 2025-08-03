require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    version: "0.8.22",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      viaIR: true  // This enables the IR compilation pipeline to avoid stack depth issues
    }
  },
  defaultNetwork: "testnet",
  networks: {
    testnet: {
      url: process.env.RPC_URL,
      accounts: [process.env.OPERATOR_KEY],
    }
  }
};