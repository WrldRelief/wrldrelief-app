// src/entities/disaster/types.ts

/**
 * @interface DisasterLocation
 * @description 재난이 발생한 지역의 위치와 관련 정보를 정의합니다.
 */
export interface DisasterLocation {
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
}
