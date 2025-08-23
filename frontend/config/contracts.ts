// Contract addresses configuration
export const CONTRACT_ADDRESSES = {
  CONTENT_FACTORY: "0xEc845F3f96481BCfEc70A3f4118D000499985600",
} as const;

// Contract configuration
export const CONTRACT_CONFIG = {
  CONTENT_FACTORY: {
    address: CONTRACT_ADDRESSES.CONTENT_FACTORY as `0x${string}`,
    name: "ContentFactory",
  },
} as const;
