// src/entities/campaign/campaignData.ts
// This file uses on-chain data from smart contracts

import { CampaignData } from "./types";
import { useAllCampaigns, Campaign } from "../contracts/hooks";
import { useCampaignsByDisaster } from "../contracts/hooks";

/**
 * Campaign 타입을 CampaignData 타입으로 변환하는 어댑터 함수
 * 온체인 데이터(Campaign)를 UI 컴포넌트에서 사용하는 타입(CampaignData)으로 변환
 * 
 * @param campaign Campaign 타입의 온체인 데이터
 * @returns CampaignData 타입으로 변환된 데이터
 */
export function adaptCampaignToCampaignData(campaign: Campaign): CampaignData {
  return {
    ...campaign,
    updatedAt: campaign.createdAt, // updatedAt 필드가 Campaign에 없으므로 createdAt으로 대체
    status: campaign.status as number, // 타입 호환성을 위한 명시적 캐스팅
    // CampaignData에는 없지만 Campaign에 필요한 필드는 무시됨
    // 타입 호환성을 위해 as unknown as CampaignData로 캐스팅
  } as unknown as CampaignData;
}

/**
 * Campaign 배열을 CampaignData 배열로 변환하는 어댑터 함수
 * 
 * @param campaigns Campaign 타입의 온체인 데이터 배열
 * @returns CampaignData 타입으로 변환된 데이터 배열
 */
export function adaptCampaignsToCampaignData(campaigns: Campaign[]): CampaignData[] {
  return campaigns.map(adaptCampaignToCampaignData);
}

/**
 * 온체인 데이터를 사용하는 캠페인 데이터 훅
 * 
 * @returns 온체인에서 가져온 캠페인 데이터와 로딩/에러 상태
 */
export function useCampaignData() {
  const { campaigns, loading, error } = useAllCampaigns();
  const adaptedCampaigns = adaptCampaignsToCampaignData(campaigns);
  
  return { campaigns: adaptedCampaigns, loading, error };
}

/**
 * 특정 재난 ID에 해당하는 캠페인 데이터를 가져오는 훅
 * 
 * @param disasterId 재난 ID
 * @returns 해당 재난에 대한 캠페인 데이터와 로딩/에러 상태
 */
export function useDisasterCampaigns(disasterId: string) {
  const { campaigns, loading, error } = useCampaignsByDisaster(disasterId);
  const adaptedCampaigns = adaptCampaignsToCampaignData(campaigns);
  
  return { campaigns: adaptedCampaigns, loading, error };
}

// 온체인 데이터만 사용하지만 기존 코드와의 호환성을 위해 빈 배열로 유지합니다.
export const MOCK_CAMPAIGNS: CampaignData[] = [];
