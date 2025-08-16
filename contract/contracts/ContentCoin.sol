// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ContentCoin
 * @dev 代表单个内容的代币合约
 */
contract ContentCoin is ERC20, ReentrancyGuard, Ownable(msg.sender) {
    
    struct Rating {
        address rater;
        uint256 rating;
        uint256 timestamp;
    }
    
    // 内容信息
    string public ipfsUrl;           // IPFS内容哈希
    address public creator;           // 创作者地址
    uint256 public basePrice;         // 基础价格 (wei)
    uint256 public createdAt;         // 创建时间
   
    
    // 评分系统
    mapping(address => uint256) public userRatings;   // 用户评分 (1-10)
    Rating[] public ratings;          // 所有评分记录
    uint256 public totalRatingScore;  // 总评分
    
    // 常量
    uint256 public constant MAX_SUPPLY = 1000000000 * 10**18; // 最大10亿代币
    uint256 public constant BASE_PRICE = 0;      // 基础价格
    
    // 分成比例
    uint256 public constant CREATOR_SHARE = 70;    // 创作者分成70%
    uint256 public constant SUPPORTER_SHARE = 25;  // 支持者分成25%
    uint256 public constant PLATFORM_SHARE = 5;    // 平台分成5%
    
    address public platformWallet;
    address public factoryContract;   // Factory合约地址
    
    event TokenMinted(address indexed user, uint256 amount, uint256 price);
    event ContentRated(address indexed rater, uint256 rating);
    event RevenueDistributed(uint256 creatorAmount, uint256 supporterAmount, uint256 platformAmount);
    
    modifier onlyFactory() {
        require(msg.sender == factoryContract, "Only factory can call");
        _;
    }
    
    constructor(
        string memory _name,
        string memory _symbol,
        string memory _ipfsUrl,
        address _creator,
        address _platformWallet,
        address _factoryContract
    ) ERC20(_name, _symbol) {
        ipfsUrl = _ipfsUrl;
        creator = _creator;
        platformWallet = _platformWallet;
        factoryContract = _factoryContract;
        basePrice = BASE_PRICE;
        createdAt = block.timestamp;
        
        // 将所有权转移给creator
        _transferOwnership(_creator);
    }
    
    /**
     * 计算当前mint价格 - 使用平方根函数确保增长缓慢
     * 价格 = sqrt(totalSupply) / 1000)
     */
    function calculatePrice() public view returns (uint256) {

        uint256 currentSupply = totalSupply() / 10**18; // 转换为实际数量
        
        if (currentSupply == 0) {
            return basePrice;
        }
        
        uint256 sqrtSupply = sqrt(currentSupply);
        
        return sqrtSupply / 1000;
    }
    
    /**
     * 计算特定供应量时的价格
     */
    function calculatePriceAtSupply(uint256 supply) internal view returns (uint256) {
        if (supply == 0) {
            return basePrice;
        }
        
        uint256 sqrtSupply = sqrt(supply);
    
        return sqrtSupply / 1000;
    }
    
    /**
     * Mint内容代币以获得阅读权限
     */
    function mintTokens(uint256 amount) external payable nonReentrant {
        uint256 tokensToMint = amount * 10**18; // 转换为wei单位
        require(totalSupply() + tokensToMint <= MAX_SUPPLY, "Exceeds max supply");
        
        uint256 totalCost = 0;
        uint256 currentSupply = totalSupply() / 10**18;
        
        // 计算总成本（考虑价格在mint过程中的变化）
        for (uint256 i = 0; i < amount; i++) {
            uint256 price = calculatePriceAtSupply(currentSupply + i);
            totalCost += price;
        }
        
        require(msg.value >= totalCost, "Insufficient payment");
        
        // Mint代币给用户
        _mint(msg.sender, tokensToMint);
        
        // 分配收益
        distributeRevenue(totalCost);
        
        // 退还多余的ETH
        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);
        }
        
        emit TokenMinted(msg.sender, amount, totalCost);
    }
    
    /**
     * 对内容进行评分
     */
    function rateContent(uint256 rating) external payable nonReentrant {
        require(balanceOf(msg.sender) > 0, "Must own tokens to rate");
        require(userRatings[msg.sender] == 0, "Already rated this content");
        
        if (rating > 0) {
            uint256 bonusCost = 0;
            uint256 currentSupply = totalSupply() / 10**18;
            
            // 计算bonus代币成本
            for (uint256 i = 0; i < rating; i++) {
                bonusCost += calculatePriceAtSupply(currentSupply + i);
            }
            
            require(msg.value >= bonusCost, "Insufficient payment for bonus tokens");
            
            _mint(msg.sender, rating * 10**18);
            distributeRevenue(bonusCost);
            
            // 退还多余ETH
            if (msg.value > bonusCost) {
                payable(msg.sender).transfer(msg.value - bonusCost);
            }
        }
        
        // 记录评分
        userRatings[msg.sender] = rating;
        ratings.push(Rating({
            rater: msg.sender,
            rating: rating,
            timestamp: block.timestamp
        }));
        totalRatingScore += rating;
        
        emit ContentRated(msg.sender, rating);
    }
    
    /**
     * 分配收益
     */
    function distributeRevenue(uint256 totalRevenue) internal {
        uint256 creatorAmount = (totalRevenue * CREATOR_SHARE) / 100;
        uint256 supporterAmount = (totalRevenue * SUPPORTER_SHARE) / 100;
        uint256 platformAmount = (totalRevenue * PLATFORM_SHARE) / 100;
        
        // 给创作者分成
        payable(creator).transfer(creatorAmount);
        
        // 给平台分成
        payable(platformWallet).transfer(platformAmount);
        
        // 给支持者分成（分配给评分用户）
        if (ratings.length > 0) {
            distributeSupporterRewards(supporterAmount);
        }
        
        emit RevenueDistributed(creatorAmount, supporterAmount, platformAmount);
    }
    
    /**
     * 分配支持者奖励
     */
    function distributeSupporterRewards(uint256 totalAmount) internal {
        if (ratings.length == 0) return;
        
        uint256 rewardPerRater = totalAmount / ratings.length;
        
        for (uint256 i = 0; i < ratings.length; i++) {
            address rater = ratings[i].rater;
            if (balanceOf(rater) > 0) {
                payable(rater).transfer(rewardPerRater);
            }
        }
    }
    
    /**
     * 查询相关函数
     */
    function getContentInfo() external view returns (
        string memory _ipfsUrl,
        address _creator,
        uint256 _totalSupply,
        uint256 _maxSupply,
        uint256 _currentPrice,
        uint256 _averageRating
    ) {
        
        uint256 avgRating = ratings.length > 0 ? totalRatingScore / ratings.length : 0;
        
        return (
            ipfsUrl,
            creator,
            totalSupply() / 10**18,
            MAX_SUPPLY / 10**18,
            calculatePrice(),
            avgRating
        );
    }
    
    function getRatingsCount() external view returns (uint256) {
        return ratings.length;
    }
    
    function getRating(uint256 index) external view returns (address rater, uint256 rating, uint256 timestamp) {
        require(index < ratings.length, "Index out of bounds");
        Rating memory r = ratings[index];
        return (r.rater, r.rating, r.timestamp);
    }
    
    /**
     * 平方根函数实现
     */
    function sqrt(uint256 x) internal pure returns (uint256) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }
    
    function updatePlatformWallet(address _newWallet) external onlyFactory {
        platformWallet = _newWallet;
    }
}