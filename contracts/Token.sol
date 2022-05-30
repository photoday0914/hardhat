//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import "hardhat/console.sol";

contract Token {
    string public name = "My Hardhat Token";
    string public symbol = "MTH";

    uint256 public totalSupply = 1000000;

    address public owner;

    mapping(address => uint256) balances;

    constructor () {
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

   

    function transfer(address to, uint256 amount) external{
        require(balances[msg.sender] >= amount, "Not enough tokens");
        console.log(
            "Transferring from %s to %s %s tokens",
            msg.sender,
            to,
            amount
        );
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    function balanceOf(address account) external view  returns (uint256){
        return balances[account];
    }
}