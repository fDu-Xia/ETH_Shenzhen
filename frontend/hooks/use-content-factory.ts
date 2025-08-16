import { useCallback, useEffect, useState } from 'react';
import { useReadContract, useAccount } from 'wagmi';
import { monadTestnetConfig } from '@/config/monad';
import { CONTRACT_CONFIG } from '@/config/contracts';
import ContentFactoryABI from '@/lib/contracts/ContentFactory.json';
import { publicClient } from '../lib/wagmi';

// IPFS gateway URLs - we'll try multiple gateways for better reliability
const IPFS_GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://dweb.link/ipfs/',
  'https://gateway.ipfs.io/ipfs/'
];

// Function to convert IPFS hash to viewable URL
function getIpfsUrl(ipfsHash: string): string {
  if (!ipfsHash || ipfsHash === '') return '/placeholder.jpg';
  
  // Remove 'ipfs://' prefix if present
  const cleanHash = ipfsHash.replace('ipfs://', '');
  
  // Use the first gateway (ipfs.io is usually reliable)
  return `${IPFS_GATEWAYS[0]}${cleanHash}`;
}

export interface ContentData {
  id: string;
  title: string;
  description: string;
  image: string;
  price: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  stats: {
    investors: number;
    views: string;
    likes: number;
  };
  tags: string[];
  trending: boolean;
  contractAddress: string;
  creator: string;
  ipfsUrl: string;
  createdAt: number;
  // IPFS metadata
  ipfsData?: {
    title: string;
    summary: string;
    timestamp: string;
    author: string;
    version: string;
    contentType: string;
    coverImage?: string;
  };
}

export function useContentFactory() {
  const [contents, setContents] = useState<ContentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount();

  // Fetch content count
  const { data: contentCount, error: countError } = useReadContract({
    address: CONTRACT_CONFIG.CONTENT_FACTORY.address,
    abi: ContentFactoryABI,
    functionName: 'getContentsCount',
    chainId: monadTestnetConfig.id,
  });

  // Fetch contents with limit of 10
  const { data: contentsData, error: contentsError, refetch: refetchContents } = useReadContract({
    address: CONTRACT_CONFIG.CONTENT_FACTORY.address,
    abi: ContentFactoryABI,
    functionName: 'getContents',
    args: [0, 10], // offset: 0, limit: 10
    chainId: monadTestnetConfig.id,
  });

  // Log any errors from contract calls
  useEffect(() => {
    if (countError) {
      console.error('Error fetching content count:', countError);
    }
    if (contentsError) {
      console.error('Error fetching contents:', contentsError);
    }
  }, [countError, contentsError]);

  // Fetch IPFS data from the URL
  const fetchIpfsData = async (ipfsUrl: string) => {
    try {
      // Convert IPFS hash to gateway URL
      const gatewayUrl = `https://muddy-moccasin-worm.myfilebase.com/ipfs/${ipfsUrl}`;
      const response = await fetch(gatewayUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch IPFS data: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching IPFS data:', error);
      return null;
    }
  };

  // Transform raw contract data to ContentData format
  const transformContentData = useCallback(async (contentIds: bigint[], contractAddresses: string[], creators: string[]) => {
    if (!contentIds || contentIds.length === 0) return [];

    const transformedContents: ContentData[] = [];

    for (let i = 0; i < contentIds.length; i++) {
      const contentId = contentIds[i];
      const contractAddress = contractAddresses[i];
      const creator = creators[i];

      try {
        // Get detailed content info from the contract
        const detailedInfo = await publicClient.readContract({
          address: CONTRACT_CONFIG.CONTENT_FACTORY.address,
          abi: ContentFactoryABI,
          functionName: 'getDetailedContentInfo',
          args: [contentId],
        });

        // Type assertion for the detailed info
        const detailedInfoArray = detailedInfo as [
          string, // contractAddress
          string, // ipfsUrl
          string, // creator
          bigint, // totalSupply
          bigint, // currentPrice
          bigint, // averageRating
          bigint  // ratingsCount
        ];

        const [
          detailedContractAddress,
          ipfsUrl,
          detailedCreator,
          totalSupply,
          currentPrice,
          averageRating,
          ratingsCount
        ] = detailedInfoArray;

        // Fetch IPFS data if we have an IPFS URL
        let ipfsData = null;
        let coverImage = '/placeholder.jpg';
        let title = `Content #${contentId.toString()}`;
        let description = `Content created by ${creator.slice(0, 6)}...${creator.slice(-4)}`;

        if (ipfsUrl) {
          ipfsData = await fetchIpfsData(ipfsUrl);
          if (ipfsData) {
            title = ipfsData.metadata?.title || title;
            description = ipfsData.metadata?.summary || description;
            if (ipfsData.content?.coverImage) {
              coverImage = ipfsData.content.coverImage;
            }
          }
        }

        // Create a transformed content object with real data
        const content: ContentData = {
          id: contentId.toString(),
          title: title,
          description: description,
          image: coverImage,
          price: `${Number(currentPrice) / 1e18} ETH`,
          author: {
            name: creator.slice(0, 6) + '...' + creator.slice(-4),
            avatar: '/placeholder-user.jpg',
            verified: true,
          },
          stats: {
            investors: Number(totalSupply),
            views: '0',
            likes: Number(ratingsCount),
          },
          tags: ['Content', 'Blockchain'],
          trending: false,
          contractAddress,
          creator,
          ipfsUrl: ipfsUrl || '',
          createdAt: Date.now(),
          ipfsData: ipfsData,
        };

        console.log(`Content ${contentId} - IPFS Data:`, ipfsData);
        transformedContents.push(content);
      } catch (error) {
        console.error(`Error fetching detailed info for content ${contentId}:`, error);
        
        // Fallback content with basic info
        const fallbackContent: ContentData = {
          id: contentId.toString(),
          title: `Content #${contentId.toString()}`,
          description: `Content created by ${creator.slice(0, 6)}...${creator.slice(-4)}`,
          image: '/placeholder.jpg',
          price: '0.001 ETH',
          author: {
            name: creator.slice(0, 6) + '...' + creator.slice(-4),
            avatar: '/placeholder-user.jpg',
            verified: true,
          },
          stats: {
            investors: 0,
            views: '0',
            likes: 0,
          },
          tags: ['Content', 'Blockchain'],
          trending: false,
          contractAddress,
          creator,
          ipfsUrl: '',
          createdAt: Date.now(),
        };
        transformedContents.push(fallbackContent);
      }
    }

    return transformedContents;
  }, []);

  // Fetch and transform contents
  const fetchContents = useCallback(async () => {
    if (!contentsData) return;

    setLoading(true);
    setError(null);

    try {
      // Check if contentsData is an array and has the expected structure
      if (Array.isArray(contentsData) && contentsData.length >= 3) {
        const [contentIds, contractAddresses, creators] = contentsData;
        
        const transformedContents = await transformContentData(contentIds, contractAddresses, creators);
        setContents(transformedContents);
      } else {
        console.error('Invalid contents data structure:', contentsData);
        setError('Invalid content data structure');
      }
    } catch (err) {
      console.error('Error transforming contents:', err);
      setError('Failed to process content data');
    } finally {
      setLoading(false);
    }
  }, [contentsData, transformContentData]);

  // Effect to fetch contents when data changes
  useEffect(() => {
    if (contentsData) {
      fetchContents();
    }
  }, [contentsData, fetchContents]);

  // Manual refresh function
  const refreshContents = useCallback(() => {
    refetchContents();
  }, [refetchContents]);

  return {
    contents,
    loading,
    error,
    contentCount: contentCount ? Number(contentCount) : 0,
    refreshContents,
  };
}
