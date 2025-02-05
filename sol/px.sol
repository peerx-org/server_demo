// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.3/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.3/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.3/contracts/access/Ownable.sol";

contract PXToken is ERC20, ERC20Burnable, Ownable {
    uint256 public immutable maxSupply;
    uint256 public lastRewardTime;
    uint256 public rewardPool; 

    mapping(address => bool) private _isExcludedFromRewards;

    event RewardsDistributed(uint256 amount, uint256 timestamp);

   constructor(uint256 initialSupply) ERC20("PX", "PX") {
    maxSupply = initialSupply * (10 ** decimals());
    _mint(msg.sender, maxSupply);
}


    function depositRewards() external payable onlyOwner {
        require(msg.value > 0, "Deposit must be greater than zero.");
        rewardPool += msg.value;
    }

    function distributeRewards() external onlyOwner {
        require(block.timestamp >= lastRewardTime + 30 days, "Rewards can be distributed monthly.");
        require(rewardPool > 0, "No rewards available.");

        uint256 totalSupplyWithoutExcluded = totalSupply();
        uint256 totalRewards = rewardPool;
        rewardPool = 0; // Reset reward pool

        for (uint256 i = 0; i < getHoldersCount(); i++) {
            address holder = getHolderAt(i);
            if (!_isExcludedFromRewards[holder]) {
                uint256 reward = (balanceOf(holder) * totalRewards) / totalSupplyWithoutExcluded;
                payable(holder).transfer(reward);
            }
        }

        lastRewardTime = block.timestamp;
        emit RewardsDistributed(totalRewards, block.timestamp);
    }

    function excludeFromRewards(address account) external onlyOwner {
        _isExcludedFromRewards[account] = true;
    }

    function includeInRewards(address account) external onlyOwner {
        _isExcludedFromRewards[account] = false;
    }

    function getHoldersCount() public view returns (uint256) {
        return _holders.length;
    }

    function getHolderAt(uint256 index) public view returns (address) {
        return _holders[index];
    }

    address[] private _holders;
    
    function _transfer(address sender, address recipient, uint256 amount) internal override {
        super._transfer(sender, recipient, amount);

        if (!_isExcludedFromRewards[recipient]) {
            _holders.push(recipient);
        }
    }
}
