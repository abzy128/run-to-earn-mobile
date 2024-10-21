// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RunToEarn {
    struct User {
        uint256 totalDistance;
        uint256 totalRewards;
    }

    mapping(address => User) public users;
    mapping(address => bool) public registeredUsers;
    
    uint256 public rewardRate = 0.0001 ether;
    uint256 public totalRewardsDistributed;

    event UserRegistered(address indexed user);
    event RewardsDistributed(address indexed user, uint256 distance, uint256 rewards);

    modifier onlyRegistered() {
        require(registeredUsers[msg.sender], "User not registered");
        _;
    }

    function register() external {
        require(!registeredUsers[msg.sender], "User already registered");
        registeredUsers[msg.sender] = true;
        emit UserRegistered(msg.sender);
    }

    function recordRun(uint256 distance) external onlyRegistered {
        require(distance > 0, "Distance must be greater than zero");

        users[msg.sender].totalDistance += distance;
        uint256 rewards = distance * rewardRate;
        users[msg.sender].totalRewards += rewards;
        totalRewardsDistributed += rewards;

        emit RewardsDistributed(msg.sender, distance, rewards);
    }

    function withdrawRewards() external onlyRegistered {
        uint256 rewards = users[msg.sender].totalRewards;
        require(rewards > 0, "No rewards to withdraw");

        users[msg.sender].totalRewards = 0;
        payable(msg.sender).transfer(rewards);
    }

    function updateRewardRate(uint256 newRate) external {
        rewardRate = newRate;
    }
}
