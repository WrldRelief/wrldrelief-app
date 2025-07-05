import { CampaignData, CampaignStatus } from "./types";

/**
 * 온체인 데이터 구조와 일치하는 캠페인 목업 데이터
 * Campaign.sol의 Campaign 구조체와 정확히 일치하는 형태
 */
export const MOCK_CAMPAIGNS: CampaignData[] = [
  {
    id: 0,
    disasterId: "la-wildfire-001",
    organizer: "0x1234567890123456789012345678901234567890", // 이더리움 주소 형식
    name: "LA Food Relief",
    description: "Emergency food relief for LA wildfire victims",
    startDate: 1717027200, // 2024-06-01 (Unix timestamp)
    endDate: 1722556800, // 2024-08-01 (Unix timestamp)
    supportItems: ["Water", "Food Packages", "Medical Supplies"],
    imageUrl: "/images/la_food.jpg",
    status: CampaignStatus.ACTIVE, // enum 사용
    totalDonations: 10000000, // wei 단위 (10 ETH)
    createdAt: 1717027200, // 2024-06-01 (Unix timestamp)
    updatedAt: 1717113600, // 2024-06-02 (Unix timestamp)
  },
];
