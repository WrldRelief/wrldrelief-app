import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

// Contract addresses - actual deployed contract addresses
export const CONTRACT_ADDRESSES = {
  campaignFactory: '0x342A263506Bc33c6807eA1217d39C894A1bF5D51', // CampaignFactory deployed address
  disasterRegistry: '0x554C56B7b1EaF1715D2FE919f23Dcb65AEcdB86f', // DisasterRegistry deployed address
  // Additional contract addresses
  wrldReliefUser: '0x9f4465127027adAca3dd612BaE32BF927EFFFaF8',
  wrlfGovernanceToken: '0x037310a48929DC952Ed3dED952fF1A0D88E41bF3',
  wrldReliefSBT: '0xbfD7C27BfF9Da4B2858DE1CE79Ef59ebCbA5d98F',
  campaignImplementation: '0x42d377Ebb2B13399bDE92640CBBf17Fa7e15fA3c'
};

// Create public client
export const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});
