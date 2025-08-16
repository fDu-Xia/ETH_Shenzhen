/**
 * ContentFactory Contract Test Script
 * 
 * This script tests the connection to the ContentFactory smart contract
 * and verifies that all functions are working correctly.
 * 
 * Usage: node test-contract.js
 * 
 * @author Monad Beijing Project
 * @version 1.0.0
 */

const { createPublicClient, http } = require('viem');

// Contract address
const CONTRACT_ADDRESS = '0x369Cdba534Aac0Ce3E9F73607d36BAfB7a31428A';

// Monad testnet configuration
const monadTestnetConfig = {
  id: 10143,
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MONAD',
  },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.monad.xyz'] },
    public: { http: ['https://testnet-rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { 
      name: 'Monad Explorer', 
      url: 'https://explorer.testnet.monad.xyz'
    },
  },
  testnet: true,
};

// ContentFactory ABI (just the functions we need)
const ContentFactoryABI = [
  {
    "inputs": [],
    "name": "getContentsCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "offset", "type": "uint256"},
      {"internalType": "uint256", "name": "limit", "type": "uint256"}
    ],
    "name": "getContents",
    "outputs": [
      {"internalType": "uint256[]", "name": "contentIds", "type": "uint256[]"},
      {"internalType": "address[]", "name": "contractAddresses", "type": "address[]"},
      {"internalType": "address[]", "name": "creators", "type": "address[]"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "contentId", "type": "uint256"}],
    "name": "getDetailedContentInfo",
    "outputs": [
      {"internalType": "address", "name": "contractAddress", "type": "address"},
      {"internalType": "string", "name": "ipfsUrl", "type": "string"},
      {"internalType": "address", "name": "creator", "type": "address"},
      {"internalType": "uint256", "name": "totalSupply", "type": "uint256"},
      {"internalType": "uint256", "name": "currentPrice", "type": "uint256"},
      {"internalType": "uint256", "name": "averageRating", "type": "uint256"},
      {"internalType": "uint256", "name": "ratingsCount", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Create a public client for reading from the blockchain
const publicClient = createPublicClient({
  chain: monadTestnetConfig,
  transport: http(),
});

async function testContract() {
  console.log('🔍 Testing ContentFactory contract connection...');
  console.log('Contract Address:', CONTRACT_ADDRESS);
  console.log('Chain ID:', monadTestnetConfig.id);
  console.log('RPC URL:', monadTestnetConfig.rpcUrls.default.http[0]);
  console.log('');

  try {
    // Test 1: Get content count
    console.log('📊 Test 1: Getting content count...');
    const contentCount = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: ContentFactoryABI,
      functionName: 'getContentsCount',
    });
    console.log('✅ Content count:', Number(contentCount));
    console.log('');

    if (Number(contentCount) === 0) {
      console.log('ℹ️  No content found in the contract.');
      return;
    }

    // Test 2: Get first 10 contents
    console.log('📋 Test 2: Getting first 10 contents...');
    const contents = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: ContentFactoryABI,
      functionName: 'getContents',
      args: [0, 10], // offset: 0, limit: 10
    });

    const [contentIds, contractAddresses, creators] = contents;
    console.log('✅ Contents found:', contentIds.length);
    console.log('');

    // Test 3: Display content details
    console.log('📝 Test 3: Content details...');
    for (let i = 0; i < contentIds.length; i++) {
      const contentId = contentIds[i];
      const contractAddress = contractAddresses[i];
      const creator = creators[i];

      console.log(`Content #${contentId}:`);
      console.log(`  Contract: ${contractAddress}`);
      console.log(`  Creator: ${creator}`);
      console.log('');

      // Test 4: Get detailed content info
      try {
        console.log(`  🔍 Getting detailed info for content #${contentId}...`);
        const detailedInfo = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: ContentFactoryABI,
          functionName: 'getDetailedContentInfo',
          args: [contentId],
        });

        const [
          detailedContractAddress,
          ipfsUrl,
          detailedCreator,
          totalSupply,
          currentPrice,
          averageRating,
          ratingsCount
        ] = detailedInfo;

        console.log(`    IPFS URL: ${ipfsUrl}`);
        console.log(`    Total Supply: ${Number(totalSupply)}`);
        console.log(`    Current Price: ${Number(currentPrice) / 1e18} ETH`);
        console.log(`    Average Rating: ${Number(averageRating)}`);
        console.log(`    Ratings Count: ${Number(ratingsCount)}`);
        console.log('');
      } catch (detailError) {
        console.log(`    ❌ Error getting detailed info: ${detailError.message}`);
        console.log('');
      }
    }

  } catch (error) {
    console.error('❌ Error testing contract:', error);
    
    if (error.message.includes('network')) {
      console.log('💡 Tip: Check if the RPC endpoint is accessible');
    } else if (error.message.includes('contract')) {
      console.log('💡 Tip: Check if the contract address is correct');
    } else if (error.message.includes('function')) {
      console.log('💡 Tip: Check if the ABI matches the deployed contract');
    }
  }
}

// Run the test
testContract()
  .then(() => {
    console.log('🎉 Contract test completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Test failed:', error);
    process.exit(1);
  });
