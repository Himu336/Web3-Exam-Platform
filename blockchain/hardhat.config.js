require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Load environment variables

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      chainId: 1337, // Set Chain ID for MetaMask
      accounts: {
        count: 20, // Generate 20 accounts
        initialBalance: "10000000000000000000000", // 10,000 ETH per account
      },
    },
  },
};
