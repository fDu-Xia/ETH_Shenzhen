const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    console.log("Starting content creation...");
    
    // ContentFactory 合约地址（你刚才部署的）
    const CONTENT_FACTORY_ADDRESS = "0x9c3ac318C512bF729Efc249937Ed0d33FFBB95A5";
    
    // 获取签名者（部署者账户）
    const [signer] = await ethers.getSigners();
    console.log("Using account:", signer.address);
    console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(signer.address)), "ETH");
    
    // 连接到已部署的 ContentFactory 合约
    const ContentFactory = await ethers.getContractFactory("ContentFactory");
    const contentFactory = ContentFactory.attach(CONTENT_FACTORY_ADDRESS);
    
    // 内容信息
    const contentData = {
        ipfsUrl: "QmYourContentHashHere123456789",  // 替换为实际的 IPFS 哈希
        name: "My First Article",                   // 内容代币名称
        symbol: "MFA1",                            // 内容代币符号
        imageUrl: "QmYourImageHashHere987654321"   // 封面图片 IPFS 哈希
    };
    
    try {
        console.log("Creating content with data:", contentData);
        
        // 调用 createContent 函数
        const tx = await contentFactory.createContent(
            contentData.ipfsUrl,
            contentData.name,
            contentData.symbol,
            contentData.imageUrl
        );
        
        console.log("Transaction sent:", tx.hash);
        console.log("Waiting for confirmation...");
        
        // 等待交易确认
        const receipt = await tx.wait();
        console.log("Transaction confirmed in block:", receipt.blockNumber);
        
        // 从事件日志中获取创建的内容信息
        const contentCreatedEvent = receipt.logs.find(
            log => {
                try {
                    const parsed = contentFactory.interface.parseLog(log);
                    return parsed.name === "ContentCreated";
                } catch (e) {
                    return false;
                }
            }
        );
        
        if (contentCreatedEvent) {
            const parsed = contentFactory.interface.parseLog(contentCreatedEvent);
            const contentId = parsed.args.contentId.toString();
            const contractAddress = parsed.args.contractAddress;
            const creator = parsed.args.creator;
            
            console.log("\n✅ Content created successfully!");
            console.log("Content ID:", contentId);
            console.log("ContentCoin Contract Address:", contractAddress);
            console.log("Creator:", creator);
            console.log("IPFS URL:", contentData.ipfsUrl);
        }
        
        // 查询刚创建的内容信息
        console.log("\n📊 Querying content info...");
        const totalContents = await contentFactory.getContentsCount();
        console.log("Total contents created:", totalContents.toString());
        
        // 获取最新内容的详细信息
        if (totalContents > 0) {
            const latestContentId = totalContents;
            const detailedInfo = await contentFactory.getDetailedContentInfo(latestContentId);
            
            console.log("\n📋 Latest content details:");
            console.log("Contract Address:", detailedInfo[0]);
            console.log("IPFS URL:", detailedInfo[1]);
            console.log("Image URL:", detailedInfo[2]);
            console.log("Creator:", detailedInfo[3]);
            console.log("Total Supply:", detailedInfo[4].toString());
            console.log("Current Price:", ethers.formatEther(detailedInfo[5]), "ETH");
            console.log("Average Rating:", detailedInfo[6].toString());
            console.log("Ratings Count:", detailedInfo[7].toString());
        }
        
    } catch (error) {
        console.error("❌ Error creating content:", error);
        
        // 解析具体错误信息
        if (error.reason) {
            console.error("Reason:", error.reason);
        }
        if (error.data) {
            console.error("Data:", error.data);
        }
    }
}

// 处理脚本错误
main()
    .then(() => {
        console.log("\n🎉 Script completed successfully!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("💥 Script failed:", error);
        process.exit(1);
    });