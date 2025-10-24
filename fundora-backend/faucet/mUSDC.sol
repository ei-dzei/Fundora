// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract mUSDC is ERC20, Ownable {
    uint8 private  constant _decimals = 6; // uses 6 decimals to match real USDC

    constructor(string memory name_, string memory symbol_) ERC20("Mock USDC", "mUSDC") {
        _mint(msg.sender, 1_000_000 * (10 ** _decimals)); // 1,000,000 mUSDC
    }

    function decimals() public pure override returns (uint8) {
        return _decimals;
    }

    function generateTokens(address destination, uint256 amount) external onlyOwner {
        _mint(destination, amount);
    }
}