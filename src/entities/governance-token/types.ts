/**
 * GovernanceToken 엔티티 타입 정의
 * 스마트 컨트랙트 WRLFGovernanceToken.sol의 구조와 정확히 일치
 */

// 스마트 컨트랙트의 주요 상태 변수와 일치하는 인터페이스
export interface GovernanceTokenData {
  // 주요 상태 변수
  treasuryContract: string; // address in Solidity, 이더리움 주소 형식의 문자열
  totalMintedFromDonations: number; // uint256 in Solidity
  
  // 매핑 데이터 (특정 주소나 ID에 대한 조회 결과)
  mintedFromDonations?: Record<string, number>; // mapping(address => uint256) in Solidity
  donationToTokenMapping?: Record<number, number>; // mapping(uint256 => uint256) in Solidity
}

// 토큰 민팅 이벤트 데이터 구조
export interface TokenMintEvent {
  recipient: string; // address in Solidity, 이더리움 주소 형식의 문자열
  donationId: number; // uint256 in Solidity
  amount: number; // uint256 in Solidity
  timestamp: number; // uint256 in Solidity, Unix timestamp
}

// 트레저리 컨트랙트 업데이트 이벤트 데이터 구조
export interface TreasuryUpdateEvent {
  oldTreasury: string; // address in Solidity, 이더리움 주소 형식의 문자열
  newTreasury: string; // address in Solidity, 이더리움 주소 형식의 문자열
  timestamp: number; // uint256 in Solidity, Unix timestamp
}

// 프론트엔드 확장 타입 - UI 표시 등에 필요한 추가 정보 포함
export interface GovernanceTokenExtended extends GovernanceTokenData {
  // ERC20 기본 정보
  name: string; // "Wrld Relief Foundation Token"
  symbol: string; // "WRLF"
  decimals: number; // 18
  totalSupply: number; // uint256 in Solidity
  
  // 사용자별 정보
  userBalance?: number; // 현재 사용자의 토큰 잔액
  userVotingPower?: number; // 현재 사용자의 투표 권한
}
