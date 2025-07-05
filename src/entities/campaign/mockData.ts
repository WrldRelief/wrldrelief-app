import { CampaignData } from "./types";
import { useAllCampaigns } from "../contracts";

/**
 * 온체인 데이터를 사용하는 캠페인 데이터 훅
 * 이전의 목업 데이터를 대체합니다.
 * 
 * @returns 온체인에서 가져온 캠페인 데이터와 로딩/에러 상태
 */
export function useCampaignData() {
  return useAllCampaigns();
}

// 목업 데이터는 제거되었습니다.
// 실제 데이터는 contracts/hooks.ts의 useAllCampaigns()를 통해 가져옵니다.
// 하지만 기존 코드와의 호환성을 위해 빈 배열로 유지합니다.
export const MOCK_CAMPAIGNS: CampaignData[] = [];
