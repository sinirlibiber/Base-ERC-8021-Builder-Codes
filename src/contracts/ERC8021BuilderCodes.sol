// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ERC8021BuilderCodes
 * @dev Implementation of ERC-8021 Builder Codes standard
 * @notice This contract manages builder codes and revenue sharing for applications
 */
contract ERC8021BuilderCodes is Ownable, ReentrancyGuard {
    
    // Builder code information
    struct BuilderInfo {
        address payable revenueWallet;
        string builderCode;
        uint256 totalRevenue;
        uint256 totalTransactions;
        bool isActive;
        uint256 registeredAt;
    }
    
    // Transaction information
    struct Transaction {
        string builderCode;
        address user;
        uint256 amount;
        uint256 builderFee;
        uint256 timestamp;
        string transactionHash;
    }
    
    // Mappings
    mapping(string => BuilderInfo) public builders;
    mapping(address => string[]) public walletToBuilderCodes;
    mapping(string => Transaction[]) public builderTransactions;
    
    // Platform fee (in basis points, e.g., 50 = 0.5%)
    uint256 public platformFeeRate = 50; // 0.5%
    uint256 public constant MAX_FEE_RATE = 1000; // 10% max
    address payable public platformWallet;
    
    // Events
    event BuilderCodeRegistered(string indexed builderCode, address indexed revenueWallet, uint256 timestamp);
    event BuilderCodeUpdated(string indexed builderCode, address indexed newWallet, uint256 timestamp);
    event TransactionRecorded(string indexed builderCode, address indexed user, uint256 amount, uint256 builderFee, uint256 timestamp);
    event RevenueWithdrawn(string indexed builderCode, address indexed wallet, uint256 amount, uint256 timestamp);
    event PlatformFeeUpdated(uint256 oldRate, uint256 newRate, uint256 timestamp);
    
    constructor(address payable _platformWallet) Ownable(msg.sender) {
        require(_platformWallet != address(0), "Invalid platform wallet");
        platformWallet = _platformWallet;
    }
    
    /**
     * @dev Register a new builder code
     * @param _builderCode Unique builder code identifier
     * @param _revenueWallet Wallet address to receive revenue
     */
    function registerBuilderCode(string memory _builderCode, address payable _revenueWallet) external {
        require(bytes(_builderCode).length > 0, "Builder code cannot be empty");
        require(_revenueWallet != address(0), "Invalid revenue wallet");
        require(!builders[_builderCode].isActive, "Builder code already exists");
        
        builders[_builderCode] = BuilderInfo({
            revenueWallet: _revenueWallet,
            builderCode: _builderCode,
            totalRevenue: 0,
            totalTransactions: 0,
            isActive: true,
            registeredAt: block.timestamp
        });
        
        walletToBuilderCodes[_revenueWallet].push(_builderCode);
        
        emit BuilderCodeRegistered(_builderCode, _revenueWallet, block.timestamp);
    }
    
    /**
     * @dev Update revenue wallet for a builder code
     * @param _builderCode Builder code to update
     * @param _newWallet New revenue wallet address
     */
    function updateRevenueWallet(string memory _builderCode, address payable _newWallet) external {
        require(_newWallet != address(0), "Invalid wallet address");
        BuilderInfo storage builder = builders[_builderCode];
        require(builder.isActive, "Builder code does not exist");
        require(msg.sender == builder.revenueWallet || msg.sender == owner(), "Not authorized");
        
        builder.revenueWallet = _newWallet;
        walletToBuilderCodes[_newWallet].push(_builderCode);
        
        emit BuilderCodeUpdated(_builderCode, _newWallet, block.timestamp);
    }
    
    /**
     * @dev Record a transaction with builder code
     * @param _builderCode Builder code associated with transaction
     * @param _transactionHash External transaction hash
     */
    function recordTransaction(string memory _builderCode, string memory _transactionHash) external payable nonReentrant {
        require(msg.value > 0, "Transaction amount must be greater than 0");
        BuilderInfo storage builder = builders[_builderCode];
        require(builder.isActive, "Invalid builder code");
        
        // Calculate fees
        uint256 builderFee = (msg.value * platformFeeRate) / 10000;
        uint256 platformFee = builderFee / 10; // Platform gets 10% of builder fee
        uint256 netBuilderFee = builderFee - platformFee;
        
        // Update builder stats
        builder.totalRevenue += netBuilderFee;
        builder.totalTransactions += 1;
        
        // Record transaction
        builderTransactions[_builderCode].push(Transaction({
            builderCode: _builderCode,
            user: msg.sender,
            amount: msg.value,
            builderFee: netBuilderFee,
            timestamp: block.timestamp,
            transactionHash: _transactionHash
        }));
        
        // Transfer fees
        if (netBuilderFee > 0) {
            (bool builderSuccess, ) = builder.revenueWallet.call{value: netBuilderFee}("");
            require(builderSuccess, "Builder fee transfer failed");
        }
        
        if (platformFee > 0) {
            (bool platformSuccess, ) = platformWallet.call{value: platformFee}("");
            require(platformSuccess, "Platform fee transfer failed");
        }
        
        emit TransactionRecorded(_builderCode, msg.sender, msg.value, netBuilderFee, block.timestamp);
    }
    
    /**
     * @dev Get builder information
     * @param _builderCode Builder code to query
     */
    function getBuilderInfo(string memory _builderCode) external view returns (
        address revenueWallet,
        uint256 totalRevenue,
        uint256 totalTransactions,
        bool isActive,
        uint256 registeredAt
    ) {
        BuilderInfo memory builder = builders[_builderCode];
        return (
            builder.revenueWallet,
            builder.totalRevenue,
            builder.totalTransactions,
            builder.isActive,
            builder.registeredAt
        );
    }
    
    /**
     * @dev Get transaction count for a builder
     * @param _builderCode Builder code to query
     */
    function getTransactionCount(string memory _builderCode) external view returns (uint256) {
        return builderTransactions[_builderCode].length;
    }
    
    /**
     * @dev Get transaction details
     * @param _builderCode Builder code
     * @param _index Transaction index
     */
    function getTransaction(string memory _builderCode, uint256 _index) external view returns (
        address user,
        uint256 amount,
        uint256 builderFee,
        uint256 timestamp,
        string memory transactionHash
    ) {
        require(_index < builderTransactions[_builderCode].length, "Invalid index");
        Transaction memory txn = builderTransactions[_builderCode][_index];
        return (txn.user, txn.amount, txn.builderFee, txn.timestamp, txn.transactionHash);
    }
    
    /**
     * @dev Get all builder codes for a wallet
     * @param _wallet Wallet address
     */
    function getBuilderCodesByWallet(address _wallet) external view returns (string[] memory) {
        return walletToBuilderCodes[_wallet];
    }
    
    /**
     * @dev Update platform fee rate (only owner)
     * @param _newRate New fee rate in basis points
     */
    function updatePlatformFeeRate(uint256 _newRate) external onlyOwner {
        require(_newRate <= MAX_FEE_RATE, "Fee rate too high");
        uint256 oldRate = platformFeeRate;
        platformFeeRate = _newRate;
        emit PlatformFeeUpdated(oldRate, _newRate, block.timestamp);
    }
    
    /**
     * @dev Update platform wallet (only owner)
     * @param _newWallet New platform wallet address
     */
    function updatePlatformWallet(address payable _newWallet) external onlyOwner {
        require(_newWallet != address(0), "Invalid wallet address");
        platformWallet = _newWallet;
    }
    
    /**
     * @dev Deactivate a builder code (only owner or builder)
     * @param _builderCode Builder code to deactivate
     */
    function deactivateBuilderCode(string memory _builderCode) external {
        BuilderInfo storage builder = builders[_builderCode];
        require(builder.isActive, "Builder code already inactive");
        require(msg.sender == builder.revenueWallet || msg.sender == owner(), "Not authorized");
        
        builder.isActive = false;
    }
    
    /**
     * @dev Emergency withdrawal (only owner)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        
        (bool success, ) = platformWallet.call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    // Receive function to accept ETH
    receive() external payable {}
}
