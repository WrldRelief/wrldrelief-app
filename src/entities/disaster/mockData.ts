// src/entities/disaster/mockData.ts
// 이 파일은 목업 데이터를 사용하지 않고 온체인 데이터만 사용합니다.

import { DisasterLocationExtended } from "./types";
import { useAllDisasters, Disaster } from "../contracts";

/**
 * 온체인 데이터를 사용하는 재난 데이터 훅
 * @returns 온체인에서 가져온 재난 데이터와 로딩/에러 상태
 */
export function useDisasterData() {
  return useAllDisasters();
}

/**
 * 온체인 재난 데이터를 DisasterLocationExtended 형식으로 변환하는 함수
 * @param disaster 온체인에서 가져온 재난 데이터
 * @returns UI에 필요한 추가 정보가 포함된 확장된 재난 데이터
 */
export function extendDisasterData(disaster: Disaster): DisasterLocationExtended {
  // 위도와 경도는 임의로 설정 (실제로는 위치 API나 데이터를 통해 가져와야 함)
  return {
    ...disaster,
    latitude: parseFloat((Math.random() * 180 - 90).toFixed(4)),
    longitude: parseFloat((Math.random() * 360 - 180).toFixed(4)),
    type: getDisasterType(disaster.name),
    urgency: getUrgencyLevel(disaster.isActive),
    affectedPeople: Math.floor(Math.random() * 100000) + 1000,
    predictedNeeds: {
      foodPacks: Math.floor(Math.random() * 50000) + 5000,
      medicalKits: Math.floor(Math.random() * 10000) + 1000,
      shelterUnits: Math.floor(Math.random() * 8000) + 1000,
    }
  };
}

/**
 * 재난 이름에서 유형을 추측하는 함수
 */
function getDisasterType(name?: string): "earthquake" | "flood" | "wildfire" | "famine" | "conflict" | "drought" | "typhoon" | "volcano" | "tsunami" | "cyclone" | "storm" | "heatwave" | "economic" | "other" {
  // name이 없으면 기본값으로 'other' 반환
  if (!name) return 'other';
  
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('earthquake')) return 'earthquake';
  if (lowerName.includes('flood')) return 'flood';
  if (lowerName.includes('fire')) return 'wildfire';
  if (lowerName.includes('famine')) return 'famine';
  if (lowerName.includes('conflict')) return 'conflict';
  if (lowerName.includes('drought')) return 'drought';
  if (lowerName.includes('typhoon')) return 'typhoon';
  if (lowerName.includes('volcano')) return 'volcano';
  if (lowerName.includes('tsunami')) return 'tsunami';
  if (lowerName.includes('cyclone')) return 'cyclone';
  if (lowerName.includes('storm')) return 'storm';
  if (lowerName.includes('heat')) return 'heatwave';
  if (lowerName.includes('economic')) return 'economic';
  
  return 'other';
}

/**
 * 재난 활성화 상태에 따라 긴급도를 결정하는 함수
 */
function getUrgencyLevel(isActive: boolean): "critical" | "high" | "medium" | "low" {
  if (isActive) {
    return Math.random() > 0.5 ? 'critical' : 'high';
  }
  return Math.random() > 0.5 ? 'medium' : 'low';
}

// 이전 목업 데이터는 제거하고 온체인 데이터만 사용합니다.
// 하지만 store/index.ts에서 참조하는 MOCK_DISASTER_LOCATIONS는 빈 배열로 유지합니다.
export const MOCK_DISASTER_LOCATIONS: DisasterLocationExtended[] = [];
