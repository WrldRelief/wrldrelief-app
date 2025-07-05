// src/entities/disaster/onChainData.ts
// 이 파일은 목업 데이터를 사용하지 않고 온체인 데이터만 사용합니다.

import { DisasterData, DisasterStatus } from "./types";
import { useAllDisasters, Disaster } from "../contracts";
import { useState, useEffect } from "react";

/**
 * 온체인 데이터를 DisasterData 형식으로 변환하여 제공하는 훅
 * @returns 온체인에서 가져온 재난 데이터와 로딩/에러 상태
 */
export function useOnChainDisasterData() {
  const { disasters, loading, error } = useAllDisasters();
  const [formattedDisasters, setFormattedDisasters] = useState<DisasterData[]>([]);
  
  useEffect(() => {
    if (disasters && disasters.length > 0) {
      const formatted = disasters.map(mapOnChainToUIData);
      setFormattedDisasters(formatted);
    }
  }, [disasters]);
  
  return { disasters: formattedDisasters, loading, error };
}

/**
 * 온체인 데이터를 UI 데이터 형식으로 변환하는 함수
 * @param disaster 온체인에서 가져온 재난 데이터
 * @returns UI에 필요한 형식으로 변환된 재난 데이터
 */
function mapOnChainToUIData(disaster: Disaster): DisasterData {
  return {
    id: disaster.id,
    name: disaster.name,
    description: disaster.description,
    location: disaster.location,
    startDate: Number(disaster.startDate),
    endDate: 0, // 온체인 데이터에 endDate가 없으므로 0으로 설정
    imageUrl: disaster.imageUrl,
    externalSource: `https://example.com/${disaster.id}`, // 실제 외부 소스는 온체인에 저장되지 않으므로 예시로 생성
    status: disaster.isActive ? DisasterStatus.ACTIVE : DisasterStatus.RESOLVED,
    createdAt: Number(disaster.registeredAt),
    updatedAt: Number(disaster.registeredAt), // 온체인 데이터에 updatedAt이 없으므로 registeredAt으로 대체
    createdBy: "0x0000000000000000000000000000000000000000" // 온체인 데이터에 createdBy가 없으므로 기본값 설정
  };
}

// 목업 데이터는 제거하고 온체인 데이터만 사용합니다.
// 하지만 기존 코드와의 호환성을 위해 빈 배열로 유지합니다.
export const MOCK_ONCHAIN_DISASTERS: DisasterData[] = [];
