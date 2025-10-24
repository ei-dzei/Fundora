// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Faucet is Ownable {
    IERC20 public token;
    uint256 public amountPerClaim;
    uint256 public cooldownSeconds;

    mapping(address => uint256) public lastClaim;
    event Claimed(address indexed who, uint256 amount);

    constructor(IERC20 tokenAddress, uint256 _amountPerClaim, uint256 _cooldownSeconds) {
        token = tokenAddress;
        amountPerClaim = _amountPerClaim;
        cooldownSeconds = _cooldownSeconds;
    }

    function claim() external {
        require(block.timestamp >= lastClaim[msg.sender] + cooldownSeconds, "Faucet: wait for cooldown");
        require(token.balanceOf(address(this)) >= amountPerClaim, "Faucet: empty");

        lastClaim[msg.sender] = block.timestamp;
        require(token.transfer(msg.sender, amountPerClaim), "Faucet: transfer failed");

        emit Claimed(msg.sender, amountPerClaim);
    }

    function withdrawTokens(address destination, uint256 amount) external onlyOwner {
        require(token.transfer(destination, amount), "withdraw failed");
    }
}