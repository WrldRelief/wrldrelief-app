/**
 * Campaign 엔티티 타입 정의
 * 스마트 컨트랙트 Campaign.sol의 Campaign 구조체와 정확히 일치
 */

// 스마트 컨트랙트의 enum과 일치하는 타입 정의
export enum CampaignStatus {
  ACTIVE = 0,
  PAUSED = 1,
  ENDED = 2,
  CANCELLED = 3
}

// 스마트 컨트랙트의 Campaign 구조체와 일치하는 인터페이스
export interface CampaignData {
  id: number; // uint256 in Solidity
  disasterId: string;
  organizer: string; // address in Solidity, 이더리움 주소 형식의 문자열
  name: string;
  description: string;
  startDate: number; // uint256 in Solidity, Unix timestamp
  endDate: number; // uint256 in Solidity, Unix timestamp
  supportItems: string[];
  imageUrl: string;
  status: CampaignStatus; // enum in Solidity
  totalDonations: number; // uint256 in Solidity
  createdAt: number; // uint256 in Solidity, Unix timestamp
  updatedAt: number; // uint256 in Solidity, Unix timestamp
}

// 프론트엔드 전용 확장 인터페이스 (UI 표시용)
export interface CampaignDataExtended extends CampaignData {
  canEdit: boolean; // 프론트엔드 전용 필드, 사용자가 편집 가능한지 여부
}
