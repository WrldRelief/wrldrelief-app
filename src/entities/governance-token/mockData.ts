// src/entities/governance-token/mockData.ts
// 이 파일은 목업 데이터를 사용하지 않고 온체인 데이터만 사용합니다.

import { GovernanceTokenData, TokenMintEvent, TreasuryUpdateEvent } from "./types";

// 목업 데이터는 제거하고 온체인 데이터만 사용합니다.
// 하지만 기존 코드와의 호환성을 위해 빈 객체/배열로 유지합니다.
export const MOCK_GOVERNANCE_TOKEN_DATA: GovernanceTokenData = {
  treasuryContract: "0x0000000000000000000000000000000000000000",
  totalMintedFromDonations: 0,
  mintedFromDonations: {},
  donationToTokenMapping: {}
};

export const MOCK_TOKEN_MINT_EVENTS: TokenMintEvent[] = [];
export const MOCK_TREASURY_UPDATE_EVENTS: TreasuryUpdateEvent[] = [];

// 실제 거버넌스 토큰 데이터는 contracts/hooks.ts에서 가져와야 합니다.
