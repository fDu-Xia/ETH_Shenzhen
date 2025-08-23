import { sepolia } from "wagmi/chains";

// Monad Testnet Configuration
export const monadTestnetConfig = {
  ...sepolia,
} as const;
