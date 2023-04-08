/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");

module.exports = {
   gasReporter: {
      enabled: true,
   },
   solidity: {
      compilers: [
         {
            version: "0.5.5",
         },
         {
            version: "0.8.7",
         },
      ],
      overrides: {
         "./contracts/UniswapV2Library.sol": {
            version: "0.5.5",
         },
      },
      settings: {
         optimizer: {
            enabled: true,
            runs: 200,
         },
      },
   },
   networks: {
      hardhat: {
         forking: {
            // url: "https://bsc.getblock.io/mainnet/?api_key=77e8898a-f567-4a2a-9154-3125964f9bbf",
            url: "https://rpc.ftm.tools/",
         },
      },
   },
};
