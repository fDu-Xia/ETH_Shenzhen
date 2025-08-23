import { useCallback, useEffect, useState } from 'react';
import { CONTRACT_CONFIG } from '@/config/contracts';
import ContentFactoryABI from '@/lib/contracts/ContentFactory.json';
import { publicClient } from '../lib/wagmi';

export interface ContentDetailData {
  id: string;
  title: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  publishedAt: string;
  previewImage: string;
  description: string;
  price: number;
  currency: string;
  isUnlocked: boolean;
  stats: {
    views: number;
    likes: number;
    comments: number;
    investors: number;
  };
  tags: string[];
  fullContent: string;
  images: string[];
  downloadUrl: string;
  // Blockchain data
  contractAddress: string;
  creator: string;
  ipfsUrl: string;
  totalSupply: number;
  currentPrice: number;
  averageRating: number;
  ratingsCount: number;
  // IPFS metadata
  ipfsData?: {
    title: string;
    summary: string;
    timestamp: string;
    author: string;
    version: string;
    contentType: string;
    coverImage?: string;
    body?: string;
  };
}

export function useContentById(contentId: string) {
  const [content, setContent] = useState<ContentDetailData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch IPFS data from the URL
  const fetchIpfsData = async (ipfsUrl: string) => {
    try {
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

  // Fetch content by ID
  const fetchContent = useCallback(async () => {
    if (!contentId) return;

    setLoading(true);
    setError(null);

    try {
      // Get detailed content info from the contract
      const detailedInfo = await publicClient.readContract({
        address: CONTRACT_CONFIG.CONTENT_FACTORY.address,
        abi: ContentFactoryABI,
        functionName: 'getDetailedContentInfo',
        args: [parseInt(contentId)],
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
        contractAddress,
        ipfsUrl,
        creator,
        totalSupply,
        currentPrice,
        averageRating,
        ratingsCount
      ] = detailedInfoArray;

      // Fetch IPFS data if we have an IPFS URL
      let ipfsData = null;
      let title = `Content #${contentId}`;
      let description = `Content created by ${creator.slice(0, 6)}...${creator.slice(-4)}`;
      let coverImage = '/placeholder.jpg';
      let fullContent = 'Content not available';
      let images: string[] = [];

      if (ipfsUrl) {
        ipfsData = await fetchIpfsData(ipfsUrl);
        if (ipfsData) {
          title = ipfsData.metadata?.title || title;
          description = ipfsData.metadata?.summary || description;
          if (ipfsData.content?.coverImage) {
            coverImage = ipfsData.content.coverImage;
            images = [ipfsData.content.coverImage];
          }
          if (ipfsData.content?.body) {
            fullContent = ipfsData.content.body;
          }
        }
      }

      // Create content object with real data
      const contentData: ContentDetailData = {
        id: contentId,
        title: title,
        author: {
          name: creator.slice(0, 6) + '...' + creator.slice(-4),
          avatar: '/placeholder-user.jpg',
          verified: true,
        },
        publishedAt: ipfsData?.metadata?.timestamp ? new Date(ipfsData.metadata.timestamp).toLocaleDateString() : 'Unknown',
        previewImage: coverImage,
        description: description,
        price: Number(currentPrice) / 1e18,
        currency: 'MON',
        isUnlocked: false, // Default to locked
        stats: {
          views: 0, // Not available from contract
          likes: Number(ratingsCount),
          comments: 0, // Not available from contract
          investors: Number(totalSupply),
        },
        tags: ['Content', 'Blockchain'],
        fullContent: fullContent,
        images: images,
        downloadUrl: '', // Not available from contract
        contractAddress,
        creator,
        ipfsUrl: ipfsUrl || '',
        totalSupply: Number(totalSupply),
        currentPrice: Number(currentPrice),
        averageRating: Number(averageRating),
        ratingsCount: Number(ratingsCount),
        ipfsData,
      };

      setContent(contentData);
      console.log(`Content ${contentId} loaded:`, contentData);

    } catch (error) {
      console.error('Error fetching content:', error);
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  }, [contentId]);

  // Effect to fetch content when ID changes
  useEffect(() => {
    if (contentId) {
      fetchContent();
    }
  }, [contentId, fetchContent]);

  // Manual refresh function
  const refreshContent = useCallback(() => {
    fetchContent();
  }, [fetchContent]);

  return {
    content,
    loading,
    error,
    refreshContent,
  };
}
