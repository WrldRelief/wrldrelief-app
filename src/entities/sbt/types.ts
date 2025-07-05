/**
 * SBT 엔티티 타입 정의
 * 스마트 컨트랙트 WrldReliefSBT.sol의 SBTData 구조체와 정확히 일치
 */

// 스마트 컨트랙트의 enum과 일치하는 타입 정의
export enum SBTType {
  DONOR = 0,
  RECIPIENT = 1
}

// 스마트 컨트랙트의 SBTData 구조체와 일치하는 인터페이스
export interface SBTData {
  tokenId: number; // uint256 in Solidity
  holder: string; // address in Solidity, 이더리움 주소 형식의 문자열
  sbtType: SBTType; // enum in Solidity
  campaignId: number; // uint256 in Solidity
  disasterId: string;
  amount: number; // uint256 in Solidity
  supportItem: string; // For recipient SBT
  issuedAt: number; // uint256 in Solidity, Unix timestamp
  metadataURI: string;
}

// 프론트엔드 확장 타입 - UI 표시 등에 필요한 추가 정보 포함
export interface SBTDataExtended extends SBTData {
  // UI에 표시할 추가 정보
  displayName?: string;
  imageUrl?: string;
  description?: string;
  attributes?: Record<string, string | number>;
}
