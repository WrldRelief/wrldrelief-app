// src/entities/sbt/mockData.ts
import { SBTData, SBTType } from "./types";

/**
 * 온체인 데이터 구조와 일치하는 SBT 목업 데이터
 * WrldReliefSBT.sol의 SBTData 구조체와 정확히 일치하는 형태
 */
export const MOCK_ONCHAIN_SBTS: SBTData[] = [
  {
    tokenId: 1,
    holder: "0x1234567890123456789012345678901234567890", // 이더리움 주소 형식
    sbtType: SBTType.DONOR,
    campaignId: 0,
    disasterId: "la-wildfire-001",
    amount: 1000000000, // wei 단위 (1 ETH)
    supportItem: "",
    issuedAt: 1717027200, // 2024-06-01 (Unix timestamp)
    metadataURI: "ipfs://QmXyZ123456789abcdef/1"
  },
  {
    tokenId: 2,
    holder: "0x2345678901234567890123456789012345678901", // 이더리움 주소 형식
    sbtType: SBTType.RECIPIENT,
    campaignId: 0,
    disasterId: "la-wildfire-001",
    amount: 500000000, // wei 단위 (0.5 ETH)
    supportItem: "Food Packages",
    issuedAt: 1717113600, // 2024-06-02 (Unix timestamp)
    metadataURI: "ipfs://QmXyZ123456789abcdef/2"
  },
  {
    tokenId: 3,
    holder: "0x3456789012345678901234567890123456789012", // 이더리움 주소 형식
    sbtType: SBTType.DONOR,
    campaignId: 1,
    disasterId: "israel-iran-war-001",
    amount: 2000000000, // wei 단위 (2 ETH)
    supportItem: "",
    issuedAt: 1717200000, // 2024-06-03 (Unix timestamp)
    metadataURI: "ipfs://QmXyZ123456789abcdef/3"
  }
];
