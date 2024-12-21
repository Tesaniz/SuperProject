// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleDeposit {
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);

    mapping(address => uint256) private balances;

    // Функция для депозита
    function deposit() external payable {
        require(msg.value > 0, "Must send some Ether");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value); // Событие для депозита
    }

    // Функция для снятия
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdraw(msg.sender, amount); // Событие для снятия
    }

    // Функция для получения баланса
    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }
}
