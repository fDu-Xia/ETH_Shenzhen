import { createPublicClient, http } from 'viem';
import { monadTestnetConfig } from '@/config/monad';

// Create a public client for reading from the blockchain
export const publicClient = createPublicClient({
  chain: monadTestnetConfig,
  transport: http(),
});
