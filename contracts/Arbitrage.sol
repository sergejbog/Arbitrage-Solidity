// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './libraries/UniswapV2Library.sol';
import './interfaces/IUniswapV2Router02.sol';
import './interfaces/IUniswapV2Pair.sol';
import './interfaces/IERC20.sol';
import "hardhat/console.sol";

contract Arbitrage {
  address public owner = 0x01d9A713849a4600d927496e9C8295879239F756;

  modifier onlyOwner() {
    require(msg.sender == owner, "Not owner");
    _;
  }

  function changeOwner(address newOwner) onlyOwner public {
    owner = newOwner;
  }
  
  function startArbitrage(
    uint amount0, 
    uint amount1,
    bytes calldata data,
    address pairAddress
  ) external {
    IUniswapV2Pair(pairAddress).swap(
      amount0,
      amount1,
      address(this), 
      data
    );
  }

  fallback (
    bytes calldata _input
  ) external returns (bytes memory) {
    (, uint _amount0, uint _amount1, bytes memory _data) = abi.decode(_input[4:], (address, uint, uint, bytes));
    require(_amount0 == 0 || _amount1 == 0, "1");
    uint amountLoaned = _amount0 == 0 ? _amount1 : _amount0;

    (address[] memory path, address swapRouter, uint fee) = abi.decode(_data, (address[], address, uint));
    
    (uint reserveIn, uint reserveOut) = UniswapV2Library.myGetReserves(msg.sender, path[1], path[0]);
    console.log(reserveIn, reserveOut);
    uint amountRequired = UniswapV2Library.getAmountIn(
        amountLoaned, 
        reserveIn, 
        reserveOut,
        fee
    );

    if(IERC20(path[0]).allowance(address(this), swapRouter) < amountLoaned) {
      IERC20(path[0]).approve(swapRouter, amountLoaned);
    }
    
    uint amountReceived = IUniswapV2Router02(swapRouter).swapExactTokensForTokens(
      amountLoaned, 
      0,
      path,
      address(this), 
      block.timestamp + 100
    )[1];

    console.log("Amount received: ", amountReceived);
    console.log("Amount to return: ", amountRequired);
    
    // require(amountReceived > amountRequired, "2");

    IERC20 swapToken = IERC20(path[1]);
    console.log("Balance of contract: " , swapToken.balanceOf(address(this)));
    swapToken.transfer(msg.sender, amountRequired);
    swapToken.transfer(tx.origin, swapToken.balanceOf(address(this)));
    // swapToken.transfer(owner, amountReceived - amountRequired);

    return "";
  }

  function buyTokens(address[] calldata path) public payable {
    console.log(path[0]);
    console.log(path[1]);
    IUniswapV2Router02 pancakeRouter = IUniswapV2Router02(0xF491e7B69E4244ad4002BC14e878a34207E38c29);
    pancakeRouter.swapExactETHForTokens{value: address(this).balance}(0, path, address(this), block.timestamp + 100);
    console.log(IERC20(path[1]).balanceOf(address(this)));
  }

  receive() external payable {}
}
