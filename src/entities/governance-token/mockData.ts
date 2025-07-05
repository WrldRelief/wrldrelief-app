// src/entities/governance-token/mockData.ts
import { GovernanceTokenData, TokenMintEvent, TreasuryUpdateEvent } from "./types";

/**
 * 온체인 데이터 구조와 일치하는 거버넌스 토큰 목업 데이터
 * WRLFGovernanceToken.sol의 구조와 정확히 일치하는 형태
 */
export const MOCK_GOVERNANCE_TOKEN_DATA: GovernanceTokenData = {
  treasuryContract: "0x9876543210987654321098765432109876543210", // 이더리움 주소 형식
  totalMintedFromDonations: 10000, // 10,000 WRLF 토큰
  
  // 매핑 데이터 예시
  mintedFromDonations: {
    "0x1234567890123456789012345678901234567890": 500, // 주소 -> 토큰 수량
    "0x2345678901234567890123456789012345678901": 300,
    "0x3456789012345678901234567890123456789012": 200
  },
  
  donationToTokenMapping: {
    1: 100, // 기부 ID -> 토큰 수량
    2: 200,
    3: 300
  }
};

/**
 * 토큰 민팅 이벤트 목업 데이터
 */
export const MOCK_TOKEN_MINT_EVENTS: TokenMintEvent[] = [
  {
    recipient: "0x1234567890123456789012345678901234567890",
    donationId: 1,
    amount: 100,
    timestamp: 1717027200 // 2024-06-01 (Unix timestamp)
  },
  {
    recipient: "0x2345678901234567890123456789012345678901",
    donationId: 2,
    amount: 200,
    timestamp: 1717113600 // 2024-06-02 (Unix timestamp)
  },
  {
    recipient: "0x3456789012345678901234567890123456789012",
    donationId: 3,
    amount: 300,
    timestamp: 1717200000 // 2024-06-03 (Unix timestamp)
  }
];

/**
 * 트레저리 컨트랙트 업데이트 이벤트 목업 데이터
 */
export const MOCK_TREASURY_UPDATE_EVENTS: TreasuryUpdateEvent[] = [
  {
    oldTreasury: "0x0000000000000000000000000000000000000000",
    newTreasury: "0x9876543210987654321098765432109876543210",
    timestamp: 1714435200 // 2024-05-01 (Unix timestamp)
  }
];
