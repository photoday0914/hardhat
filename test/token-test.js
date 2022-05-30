const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token contract Test", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const [deployer] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token"); //param: contract name
    const hardhatToken = await Token.deploy();
    const balance = await hardhatToken.balanceOf(deployer.address);
    console.log(balance);
    expect(await hardhatToken.totalSupply()).to.equal(balance);
  });
});