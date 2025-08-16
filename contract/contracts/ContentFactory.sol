// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ContentCoin.sol";

/**
 * @title ContentFactory
 * @dev Factory合约用于创建和管理ContentCoin合约
 */
contract ContentFactory is ReentrancyGuard, Ownable(msg.sender) {
    
    struct ContentInfo {
        address contractAddress;    // ContentCoin合约地址
        string ipfsUrl;           // IPFS内容哈希
        address creator;           // 创作者地址
        uint256 createdAt;         // 创建时间
    }
    
    struct UserRating {
        uint256 contentId;
        uint256 rating;
        uint256 tokensMinted;
        uint256 timestamp;
    }
    
    mapping(uint256 => ContentInfo) public contents;
    mapping(address => uint256[]) public userContents;      // 用户创建的内容列表
    mapping(address => UserRating[]) public userRatings;   // 用户评分历史
    mapping(address => bool) public isContentContract;     // 验证ContentCoin合约
    
    uint256 public nextContentId = 1;
    uint256 public constant BASE_PRICE = 0.001 ether;      // 基础价格 0.001 ETH
    address public platformWallet;
    
    event ContentCreated(
        uint256 indexed contentId, 
        address indexed contractAddress,
        string ipfsUrl, 
        address indexed creator
    );
    event ContentDeactivated(uint256 indexed contentId);
    event PlatformWalletUpdated(address oldWallet, address newWallet);
    
    constructor(address _platformWallet) {
        platformWallet = _platformWallet;
    }
    
    /**
     * 创建新内容
     */
    function createContent(
        string memory _ipfsUrl
    ) external nonReentrant {
        require(bytes(_ipfsUrl).length > 0, "IPFS hash cannot be empty");
        
        uint256 contentId = nextContentId++;
        
        // 如果没有提供name和symbol，使用默认值
        string memory name =
            string(abi.encodePacked("Content Token #", toString(contentId)));
        string memory symbol =
            string(abi.encodePacked("CT", toString(contentId)));
        
        // 部署新的ContentCoin合约
        ContentCoin contentContract = new ContentCoin(
            name,
            symbol,
            _ipfsUrl,
            msg.sender,
            platformWallet,
            address(this)
        );
        
        // 记录内容信息
        contents[contentId] = ContentInfo({
            contractAddress: address(contentContract),
            ipfsUrl: _ipfsUrl,
            creator: msg.sender,
            createdAt: block.timestamp
        });
        
        userContents[msg.sender].push(contentId);
        isContentContract[address(contentContract)] = true;
        
        emit ContentCreated(contentId, address(contentContract), _ipfsUrl, msg.sender);
    }
    
    /**
     * 记录用户评分（由ContentCoin合约调用）
     */
    function recordUserRating(
        address user, 
        uint256 contentId, 
        uint256 rating, 
        uint256 tokensMinted
    ) external {
        require(isContentContract[msg.sender], "Only content contracts can call");
        
        userRatings[user].push(UserRating({
            contentId: contentId,
            rating: rating,
            tokensMinted: tokensMinted,
            timestamp: block.timestamp
        }));
    }
    
    /**
     * 查询相关函数
     */
    function getContentInfo(uint256 contentId) external view returns (
        address contractAddress,
        string memory ipfsUrl,
        address creator,
        uint256 createdAt
    ) {
        ContentInfo memory content = contents[contentId];
        require(content.contractAddress != address(0), "Content does not exist");
        
        return (
            content.contractAddress,
            content.ipfsUrl,
            content.creator,
            content.createdAt
        );
    }
    
    function getContentContract(uint256 contentId) external view returns (address) {
        require(contents[contentId].contractAddress != address(0), "Content does not exist");
        return contents[contentId].contractAddress;
    }
    
    function getUserContents(address user) external view returns (uint256[] memory) {
        return userContents[user];
    }
    
    function getUserRatings(address user) external view returns (UserRating[] memory) {
        return userRatings[user];
    }
    
    function getUserRatingsCount(address user) external view returns (uint256) {
        return userRatings[user].length;
    }
    
    /**
     * 获取内容的详细信息（包括来自ContentCoin合约的信息）
     */
    function getDetailedContentInfo(uint256 contentId) external view returns (
        address contractAddress,
        string memory ipfsUrl,
        address creator,
        uint256 totalSupply,
        uint256 currentPrice,
        uint256 averageRating,
        uint256 ratingsCount
    ) {
        ContentInfo memory content = contents[contentId];
        require(content.contractAddress != address(0), "Content does not exist");
        
        ContentCoin contentContract = ContentCoin(content.contractAddress);
        
        // 获取ContentCoin合约中的信息
        (, , uint256 supply, , uint256 price, uint256 avgRating) = contentContract.getContentInfo();
    
        return (
            content.contractAddress,
            content.ipfsUrl,
            content.creator,
            supply,
            price,
            avgRating,
            contentContract.getRatingsCount()
        );
    }
    
    /**
     * 获取内容列表
     */
    function getContents(uint256 offset, uint256 limit) external view returns (
        uint256[] memory contentIds,
        address[] memory contractAddresses,
        address[] memory creators
    ) {
        require(limit > 0 && limit <= 100, "Invalid limit");
        
        uint256 Count = nextContentId - 1;
       
        uint256 resultCount = Count > offset ? 
            (Count - offset > limit ? limit : Count - offset) : 0;
        
        contentIds = new uint256[](resultCount);
        contractAddresses = new address[](resultCount);
        creators = new address[](resultCount);
        
        uint256 currentIndex = 0;
        uint256 resultIndex = 0;
        
        for (uint256 i = 1; i < nextContentId && resultIndex < resultCount; i++) {
            if (currentIndex >= offset) {
                contentIds[resultIndex] = i;
                contractAddresses[resultIndex] = contents[i].contractAddress;
                creators[resultIndex] = contents[i].creator;
                resultIndex++;
            }
            currentIndex++;
        }
    }
    
    /**
     * 工具函数 - 数字转字符串
     */
    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
    
    /**
     * 管理函数
     */
    function updatePlatformWallet(address _newWallet) external onlyOwner {
        require(_newWallet != address(0), "Invalid address");
        address oldWallet = platformWallet;
        platformWallet = _newWallet;
        
        emit PlatformWalletUpdated(oldWallet, _newWallet);
    }
    
    
    /**
     * 紧急函数 - 批量更新所有ContentCoin合约的平台钱包
     */
    function updateAllContentsPlatformWallet(uint256[] memory contentIds, address _newWallet) external onlyOwner {
        require(_newWallet != address(0), "Invalid address");
        
        for (uint256 i = 0; i < contentIds.length; i++) {
            uint256 contentId = contentIds[i];
            if (contents[contentId].contractAddress != address(0)) {
                ContentCoin(contents[contentId].contractAddress).updatePlatformWallet(_newWallet);
            }
        }
    }
    
    /**
     * 统计函数
     */
    function getContentsCount() external view returns (uint256) {
        return nextContentId - 1;
    }

}