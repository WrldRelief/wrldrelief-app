// src/entities/disaster/disasterData.ts
// This file uses on-chain data from smart contracts

import { useAllDisasters, Disaster } from "../contracts";
import { DisasterLocationExtended } from "./types";
import { getLocationCoordinatesFromDisaster, getLocationCoordinatesFromDisasterSync } from "@/shared/lib/location-extractor";
import { useState, useEffect } from "react";

/**
 * 온체인 데이터를 사용하는 재난 데이터 훅
 * @returns 온체인에서 가져온 재난 데이터와 로딩/에러 상태
 */
export function useDisasterData() {
  const { disasters, loading, error } = useAllDisasters();
  const [extendedDisasters, setExtendedDisasters] = useState<DisasterLocationExtended[]>([]);
  const [isExtending, setIsExtending] = useState(false);

  useEffect(() => {
    async function extendDisasters() {
      if (!disasters || disasters.length === 0) return;
      
      setIsExtending(true);
      try {
        console.log(`${disasters.length}개의 재난 데이터 확장 시작`);
        const extended = await Promise.all(
          disasters.map(disaster => extendDisasterData(disaster))
        );
        console.log(`${extended.length}개의 재난 데이터 확장 완료`);
        setExtendedDisasters(extended);
      } catch (error) {
        console.error("재난 데이터 확장 오류:", error);
      } finally {
        setIsExtending(false);
      }
    }

    extendDisasters();
  }, [disasters]);

  return {
    data: extendedDisasters,
    isLoading: loading || isExtending,
    isError: !!error
  };
}

/**
 * 온체인 재난 데이터를 DisasterLocationExtended 형식으로 변환하는 함수
 * @param disaster 온체인에서 가져온 재난 데이터
 * @returns UI에 필요한 추가 정보가 포함된 확장된 재난 데이터와 로딩 상태
 */
export async function extendDisasterData(
  disaster: Disaster
): Promise<DisasterLocationExtended> {
  // 재난 유형 결정
  const type = getDisasterType(disaster.name);
  const urgency = getUrgencyLevel(disaster.isActive);

  // 재난 이름과 설명에서 위치 정보 추출 (비동기)
  const { latitude, longitude } = await extractLocationFromDisasterName(
    disaster.name || "",
    disaster.description || ""
  );
  
  console.log(`위치 추출 결과: ${disaster.name} -> [${latitude}, ${longitude}]`);

  // 영향받은 인구 추정 (재난 유형에 따라 다르게 설정)
  let affectedPeople = 0;
  switch (type) {
    case "earthquake":
    case "tsunami":
      affectedPeople = Math.floor(Math.random() * 500000) + 50000;
      break;
    case "flood":
    case "typhoon":
    case "cyclone":
    case "storm":
      affectedPeople = Math.floor(Math.random() * 300000) + 30000;
      break;
    case "wildfire":
    case "volcano":
      affectedPeople = Math.floor(Math.random() * 100000) + 10000;
      break;
    case "famine":
    case "drought":
      affectedPeople = Math.floor(Math.random() * 1000000) + 100000;
      break;
    case "conflict":
      affectedPeople = Math.floor(Math.random() * 800000) + 80000;
      break;
    default:
      affectedPeople = Math.floor(Math.random() * 100000) + 10000;
  }

  // 필요한 자원 추정 (영향받은 인구에 비례)
  const predictedNeeds = {
    foodPacks: Math.floor(affectedPeople * 0.8),
    medicalKits: Math.floor(affectedPeople * 0.2),
    shelterUnits: Math.floor(affectedPeople * 0.05),
  };

  return {
    ...disaster,
    latitude,
    longitude,
    type,
    urgency,
    affectedPeople,
    predictedNeeds,
  };
}

/**
 * 재난 이름과 설명에서 위치 정보를 추출하는 함수
 * LangChain과 OpenAI를 사용하여 재난 설명에서 위치 정보를 추출합니다.
 */
async function extractLocationFromDisasterName(
  name: string,
  description: string
): Promise<{ latitude: number; longitude: number }> {
  try {
    console.log(`AI 위치 추출 시작: ${name}, ${description}`);
    // OpenAI API 키 확인
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    console.log(`OpenAI API 키 존재 여부: ${!!apiKey}`);
    
    // LangChain과 OpenAI를 사용하여 위치 정보 추출 (비동기)
    const result = await getLocationCoordinatesFromDisaster(name, description);
    console.log(`AI 위치 추출 성공: ${result.location} -> [${result.latitude}, ${result.longitude}]`);
    return { latitude: result.latitude, longitude: result.longitude };
  } catch (error) {
    console.error("AI 위치 추출 실패:", error);
    // API 키가 없거나 오류 발생 시 fallback 사용
    console.log("Fallback 위치 추출 사용");
    const fallback = getLocationCoordinatesFromDisasterSync(name, description);
    return { latitude: fallback.latitude, longitude: fallback.longitude };
  }
}

/**
 * 재난 이름에서 유형을 추측하는 함수
 */
function getDisasterType(
  name?: string
):
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
  | "economic"
  | "other" {
  // name이 없으면 기본값으로 'other' 반환
  if (!name) return "other";

  const lowerName = name.toLowerCase();

  if (lowerName.includes("earthquake")) return "earthquake";
  if (lowerName.includes("flood")) return "flood";
  if (lowerName.includes("fire")) return "wildfire";
  if (lowerName.includes("famine")) return "famine";
  if (lowerName.includes("conflict")) return "conflict";
  if (lowerName.includes("drought")) return "drought";
  if (lowerName.includes("typhoon")) return "typhoon";
  if (lowerName.includes("volcano")) return "volcano";
  if (lowerName.includes("tsunami")) return "tsunami";
  if (lowerName.includes("cyclone")) return "cyclone";
  if (lowerName.includes("storm")) return "storm";
  if (lowerName.includes("heat")) return "heatwave";
  if (lowerName.includes("economic")) return "economic";

  return "other";
}

/**
 * 재난 활성화 상태에 따라 긴급도를 결정하는 함수
 */
function getUrgencyLevel(
  isActive: boolean
): "critical" | "high" | "medium" | "low" {
  if (isActive) {
    return Math.random() > 0.5 ? "critical" : "high";
  }
  return Math.random() > 0.5 ? "medium" : "low";
}

// 온체인 데이터만 사용하지만 기존 코드와의 호환성을 위해 빈 배열로 유지합니다.
export const MOCK_DISASTER_LOCATIONS: DisasterLocationExtended[] = [];
