import { ethers } from "hardhat";
import { expect } from "chai";
import { SimpleDeposit } from "../typechain-types";

describe("SimpleDeposit Contract", function () {
  let simpleDeposit: SimpleDeposit;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async () => {
    const simpleDepositFactory = await ethers.getContractFactory("SimpleDeposit");
    simpleDeposit = await simpleDepositFactory.deploy();
    await simpleDeposit.waitForDeployment();

    [owner, addr1, addr2] = await ethers.getSigners();
  });

  it("Should allow deposits", async () => {
    const depositAmount = ethers.parseEther("1");
    await simpleDeposit.connect(addr1).deposit({ value: depositAmount });

    const balance = await simpleDeposit.getBalance(addr1.address);
    expect(balance).to.equal(depositAmount);
  });

  it("Should allow withdrawals", async () => {
    const depositAmount = ethers.parseEther("1");
    await simpleDeposit.connect(addr1).deposit({ value: depositAmount });

    await simpleDeposit.connect(addr1).withdraw(depositAmount);
    const balance = await simpleDeposit.getBalance(addr1.address);
    expect(balance).to.equal(0n);
  });

  it("Should prevent withdrawals with insufficient balance", async () => {
    const withdrawAmount = ethers.parseEther("1");
    await expect(simpleDeposit.connect(addr1).withdraw(withdrawAmount)).to.be.revertedWith(
      "Insufficient balance"
    );
  });

  it("Should track total contract balance", async () => {
    const depositAmount1 = ethers.parseEther("1");
    const depositAmount2 = ethers.parseEther("0.5");

    await simpleDeposit.connect(addr1).deposit({ value: depositAmount1 });
    await simpleDeposit.connect(addr2).deposit({ value: depositAmount2 });

    const contractBalance = await ethers.provider.getBalance(simpleDeposit.target);
    expect(contractBalance).to.equal(depositAmount1 + depositAmount2);
  });

  it("Should emit Deposit and Withdraw events", async () => {
    const depositAmount = ethers.parseEther("1");

    // Проверяем событие Deposit
    await expect(simpleDeposit.connect(addr1).deposit({ value: depositAmount }))
      .to.emit(simpleDeposit, "Deposit")
      .withArgs(addr1.address, depositAmount);

    // Проверяем событие Withdraw
    await expect(simpleDeposit.connect(addr1).withdraw(depositAmount))
      .to.emit(simpleDeposit, "Withdraw")
      .withArgs(addr1.address, depositAmount);
  });
});
