// src/store/index.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DisasterLocation } from "@/entities/disaster";
import { CampaignData } from "@/entities/campaign";
import { UserInfoExtended } from "@/entities/user/types";
import { MOCK_DISASTER_LOCATIONS as MOCK_DISASTERS } from "@/entities/disaster/disasterData";
// MOCK_CAMPAIGNS는 제거되고 실제 온체인 데이터로 대체되었습니다.

// Define missing types
interface Donation {
  id: string;
  campaignId: string;
  donorAddress: string;
  amount: number;
  currency: string;
  timestamp: number;
  transactionHash: string;
}

interface FundReceiptData {
  id: string;
  campaignId: string;
  organizationDid: string;
  amount: number;
  currency: string;
  timestamp: number;
  transactionHash: string;
}

interface AidDistributionData {
  id: string;
  campaign: string;
  organizationDid: string;
  aidType: string;
  quantity: number;
  location: string;
  timestamp: number;
  transactionHash: string;
}

interface AidReceiptData {
  id: string;
  distributionId: string;
  recipientDid: string;
  aidType: string;
  quantity: number;
  timestamp: number;
  transactionHash: string;
}

// Aliases for consistency with naming in the store
type FundReceipt = FundReceiptData;
type AidDistribution = AidDistributionData;
type AidReceipt = AidReceiptData;

// 스토어 상태 타입 정의
interface StoreState {
  // 엔티티 데이터
  users: UserInfoExtended[];
  disasters: DisasterLocation[];
  campaigns: CampaignData[];
  donations: Donation[];
  fundReceipts: FundReceiptData[];
  aidDistributions: AidDistributionData[];
  aidReceipts: AidReceiptData[];

  // 액션: 사용자
  addUser: (user: UserInfoExtended) => void;
  updateUser: (address: string, userData: Partial<UserInfoExtended>) => void;

  // 액션: 재난
  addDisaster: (disaster: DisasterLocation) => void;
  updateDisaster: (id: string, data: Partial<DisasterLocation>) => void;
  getDisasterById: (id: string) => DisasterLocation | undefined;

  // 액션: 캠페인
  addCampaign: (campaign: CampaignData) => void;
  updateCampaign: (id: string, data: Partial<CampaignData>) => void;
  getCampaignById: (id: string) => CampaignData | undefined;
  getCampaignsByDisasterId: (disasterId: string) => CampaignData[];
  getCampaignsByOrganizationDid: (organizationDid: string) => CampaignData[];

  // 액션: 기부
  addDonation: (donation: Donation) => void;
  getDonationsByUser: (address: string) => Donation[];

  // 액션: 자금 수령
  addFundReceipt: (receipt: FundReceipt) => void;
  getFundReceiptsByCampaign: (campaignId: string) => FundReceipt[];

  // 액션: 원조 배포
  addAidDistribution: (distribution: AidDistribution) => void;
  getAidDistributionsByCampaign: (campaignId: string) => AidDistribution[];

  // 액션: 원조 수령
  addAidReceipt: (receipt: AidReceipt) => void;
  getAidReceiptsByRecipient: (recipientDid: string) => AidReceipt[];

  // 블록체인 동기화 관련
  syncWithBlockchain: () => Promise<void>;

  // 리셋 (개발용)
  resetStore: () => void;
}

// 스토어 생성
export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      users: [],
      disasters: [...MOCK_DISASTERS],
      campaigns: [], // 온체인 데이터로 대체됨
      donations: [],
      fundReceipts: [],
      aidDistributions: [],
      aidReceipts: [],

      // 액션: 사용자
      addUser: (user) =>
        set((state) => ({
          users: [...state.users, user],
        })),

      updateUser: (address, userData) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.address === address ? { ...user, ...userData } : user
          ),
        })),

      // 액션: 재난
      addDisaster: (disaster) =>
        set((state) => ({
          disasters: [...state.disasters, disaster],
        })),

      updateDisaster: (id, data) =>
        set((state) => ({
          disasters: state.disasters.map((disaster) =>
            disaster.id === id ? { ...disaster, ...data } : disaster
          ),
        })),

      getDisasterById: (id) => {
        return get().disasters.find((disaster) => disaster.id === id);
      },

      // 액션: 캠페인
      addCampaign: (campaign) =>
        set((state) => ({
          campaigns: [...state.campaigns, campaign],
        })),

      updateCampaign: (id, data) =>
        set((state) => ({
          campaigns: state.campaigns.map((campaign) =>
            campaign.id.toString() === id.toString()
              ? { ...campaign, ...data }
              : campaign
          ),
        })),

      getCampaignById: (id) => {
        return get().campaigns.find(
          (campaign) => campaign.id.toString() === id
        );
      },

      getCampaignsByDisasterId: (disasterId) => {
        return get().campaigns.filter(
          (campaign) => campaign.disasterId === disasterId
        );
      },

      getCampaignsByOrganizationDid: (organizationDid) => {
        return get().campaigns.filter(
          (campaign) => campaign.organizer === organizationDid
        );
      },

      // 액션: 기부
      addDonation: (donation) =>
        set((state) => ({
          donations: [...state.donations, donation],
        })),

      getDonationsByUser: (address) => {
        return get().donations.filter(
          (donation) => donation.donorAddress === address
        );
      },

      // 액션: 자금 수령
      addFundReceipt: (receipt) =>
        set((state) => ({
          fundReceipts: [...state.fundReceipts, receipt],
        })),

      getFundReceiptsByCampaign: (campaignId) => {
        return get().fundReceipts.filter(
          (receipt) => receipt.campaignId === campaignId
        );
      },

      // 액션: 원조 배포
      addAidDistribution: (distribution) =>
        set((state) => ({
          aidDistributions: [...state.aidDistributions, distribution],
        })),

      getAidDistributionsByCampaign: (campaignId) => {
        return get().aidDistributions.filter(
          (distribution) => distribution.campaign === campaignId
        );
      },

      // 액션: 원조 수령
      addAidReceipt: (receipt) =>
        set((state) => ({
          aidReceipts: [...state.aidReceipts, receipt],
        })),

      getAidReceiptsByRecipient: (recipientDid) => {
        return get().aidReceipts.filter(
          (receipt) => receipt.recipientDid === recipientDid
        );
      },

      // 블록체인 동기화
      syncWithBlockchain: async () => {
        // 실제 구현에서는 여기에 블록체인과 동기화하는 로직 추가
        console.log("Syncing with blockchain...");
        // 예: 블록체인에서 데이터를 가져와 스토어 업데이트
      },

      // 스토어 초기화 (개발용)
      resetStore: () =>
        set({
          users: [],
          disasters: [...MOCK_DISASTERS],
          campaigns: [], // 온체인 데이터로 대체됨
          donations: [],
          fundReceipts: [],
          aidDistributions: [],
          aidReceipts: [],
        }),
    }),
    {
      name: "canne-app-storage", // 로컬 스토리지 키 이름
      partialize: (state) => ({
        // 민감하지 않은 데이터만 로컬 스토리지에 저장
        disasters: state.disasters,
        campaigns: state.campaigns,
      }),
    }
  )
);
