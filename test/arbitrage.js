const { expect } = require("chai");

// describe("Token contract", function () {
//    it("Deployment should assign the total supply of tokens to the owner", async function () {
//       const [owner] = await ethers.getSigners();

//       const Arbitrage = await ethers.getContractFactory("FlashyLoans");

//       const hardhatArbitrage = await Arbitrage.deploy();

//       let borrowToken = "0xe9e7cea3dedca5984780bafc599bd69add087d56";
//       borrowToken = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
//       let borrowAmount = "1000000000000000000";
//       // let data =
//       //    "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000300000000000000000000000010ed43c718714eb63d5aa57b78b54704e256024e0000000000000000000000003a6d8ca21d1cf76f653a67577fa0d27453350dd8000000000000000000000000e9e7cea3dedca5984780bafc599bd69add087d56";
//       console.log(await hardhatArbitrage.doFlashloan(borrowToken, borrowAmount, data));

//       // const Testing = await ethers.getContractFactory("Testing");

//       // const hardhatTesting = await Testing.deploy();

//       // let lp = "0x10ed43c718714eb63d5aa57b78b54704e256024e";
//       // let data =
//       //    "0x38ed1739000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000007505E9c2e608D9ED08Aa1D2C1E43B01cD579c8Bc000000000000000000000000000000000000000000000000000000009e35a6ae00000000000000000000000000000000000000000000000000000000000000020000000000000000000000003a6d8ca21d1cf76f653a67577fa0d27453350dd8000000000000000000000000bb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
//       // console.log(hardhatTesting.address);

//       // await owner.sendTransaction({
//       //    to: hardhatTesting.address,
//       //    value: ethers.utils.parseEther("1"), // 1 ether
//       // });

//       // let data =
//       //    "0xfb3bdb4100000000000000000000000000000000000000000e8a5010cf2a4112140000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000962171bbfac08079bbb9105dfc81a060429075a60000000000000000000000000000000000000000000000000000000061f410de0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c000000000000000000000000a49f7e4c67d62d11b0867079f5c63cf4a600b55c";

//       // console.log(await hardhatTesting.swap(lp, data, "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"));

//       //   const ownerBalance = await hardhatArbitrage.balanceOf(owner.address);
//       //   owner.sendTransaction({from: owner.address, to: hardhatArbitrage.address, });
//    });
// });

describe("Token contract", function () {
   it("Deployment should assign the total supply of tokens to the owner", async function () {
      const [owner] = await ethers.getSigners();

      const Arbitrage = await ethers.getContractFactory("Arbitrage");

      const hardhatArbitrage = await Arbitrage.deploy();

      let token1 = "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83";
      let token2 = "0x5cc61a78f164885776aa610fb0fe1257df78e59b";
      let amount1 = "100000000000000000";
      let amount2 = 0;

      let loanLpAddress = "0x30748322b6e34545dbe0788c421886aeb5297789";
      let swapRouter = "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506";

      let abiCoder = new ethers.utils.AbiCoder();

      let path = [token1, token2];

      let encodedData = abiCoder.encode(["address[]", "address", "uint"], [path, swapRouter, 997]);

      console.log(encodedData);

      let pathForBuying = ["0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83", "0x5cc61a78f164885776aa610fb0fe1257df78e59b"];

      for (let i = 0; i < 5; i++) {
         await owner.sendTransaction({
            to: hardhatArbitrage.deployTransaction.creates,
            value: ethers.utils.parseEther("1.0"),
         });
         await hardhatArbitrage.buyTokens(pathForBuying);
         let flashLoanTx = await hardhatArbitrage.startArbitrage(amount1, amount2, encodedData, loanLpAddress);
         console.log(flashLoanTx);

         let flashLoanTxWait = await flashLoanTx.wait();

         console.log(flashLoanTxWait.gasUsed.toNumber());
         console.log();
      }
   });
});
