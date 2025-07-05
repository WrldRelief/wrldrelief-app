import { CampaignData } from "./types";

export const MOCK_CAMPAIGNS: CampaignData[] = [
  //   {
  //     disasterId: "la-wildfire-001",
  //     id: "campaign1",
  //     status: "active",
  //     startDate: "2025-06-01",
  //     endDate: "2025-06-29",
  //     name: "la food relief",
  //     description: "la food ",
  //     organizationName: "world relief foundetion",
  //     organizationDid: "did:xxx",
  //     imageUrl: "/images/la_wildfire_food.jpg",
  //     currentFunding: 1,
  //     targetFunding: 10,
  //     currency: "USDC",
  //   },
  {
    id: 0,
    disasterId: "la-wildfire-001",
    organizer: "0xabc",
    name: "LA food relief",
    description: "la food",
    startDate: 17179869121,
    endDate: 17523968000,
    supportItems: ["Water"],
    imageUrl: "/images/la_food.jpg",
    status: "ACTIVE", //ACTIVE, PAUSED, ENDED, CANCELLED
    totalDonations: 10,
    createdAt: 17179869121,
    canEdit: false,
  },
];
