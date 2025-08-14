// Monad Testnet Configuration
export const monadTestnetConfig = {
  id: 10143, // Monad testnet chain ID
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
} as const 