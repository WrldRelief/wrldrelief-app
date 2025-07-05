// src/entities/disaster/types.ts

/**
 * Disaster 엔티티 타입 정의
 * 스마트 컨트랙트 DisasterRegistry.sol의 Disaster 구조체와 정확히 일치
 */

// 스마트 컨트랙트의 enum과 일치하는 타입 정의
export enum DisasterStatus {
  ACTIVE = 0,
  RESOLVED = 1,
  ARCHIVED = 2
}

// 스마트 컨트랙트의 Disaster 구조체와 일치하는 인터페이스
export interface DisasterData {
  id: string;
  name: string;
  description: string;
  location: string;
  startDate: number; // uint256 in Solidity, Unix timestamp
  endDate: number; // uint256 in Solidity, Unix timestamp
  imageUrl: string;
  externalSource: string;
  status: DisasterStatus; // enum in Solidity
  createdAt: number; // uint256 in Solidity, Unix timestamp
  updatedAt: number; // uint256 in Solidity, Unix timestamp
  createdBy: string; // address in Solidity, 이더리움 주소 형식의 문자열
}

/**
 * 프론트엔드 확장 타입 - 원래 사용하던 DisasterLocation 인터페이스
 * 스마트 컨트랙트와 일치하지 않지만 UI 표시 등에 필요한 추가 정보 포함
 */
export interface DisasterLocationExtended {
  id: string; // 고유 ID (예: UUID 또는 숫자)
  name: string; // 재난 지역명 (예: "Cannes Earthquake Zone A")
  latitude: number; // 위도
  longitude: number; // 경도
  type:
    | "earthquake"
    | "flood"
    | "wildfire"
    | "famine"
    | "conflict"
    | "drought"
    | "typhoon"
    | "volcano"
    | "tsunami"
    | "cyclone"
    | "storm"
    | "heatwave"
    | "drought"
    | "economic"
    | "other";
  urgency: "critical" | "high" | "medium" | "low"; // 긴급도 (AI 분석 결과에 따라 달라질 수 있음)
  affectedPeople: number; // 예상 피해 인구 수
  predictedNeeds: {
    // AI가 예측한 필요 자원 (가장 중요한 부분)
    foodPacks?: number; // 식량 패키지
    medicalKits?: number; // 의료 키트
    shelterUnits?: number; // 임시 거처 유닛
    waterSupply?: number; // 식수 공급 (리터 등)
    // 기타 필요한 물품 추가 가능
  };
  description: string; // 재난 상황에 대한 간략한 설명
  imageUrl?: string; // 해당 지역의 재난 상황 이미지 URL (선택 사항)
  
  // 스마트 컨트랙트 필드와 매핑할 수 있는 추가 필드
  status?: DisasterStatus;
  startDate?: number;
  endDate?: number;
  externalSource?: string;
  createdAt?: number;
  updatedAt?: number;
  createdBy?: string;
}
