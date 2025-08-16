// Contract addresses configuration
export const CONTRACT_ADDRESSES = {
  CONTENT_FACTORY: '0xf2BCA2F38f715f3e86A5eD06413087082a2406DF',
} as const;

// Contract configuration
export const CONTRACT_CONFIG = {
  CONTENT_FACTORY: {
    address: CONTRACT_ADDRESSES.CONTENT_FACTORY as `0x${string}`,
    name: 'ContentFactory',
  },
} as const;
