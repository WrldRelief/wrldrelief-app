export interface CampaignData {
  id: number;
  disasterId: string;
  organizer: string;
  name: string;
  description: string;
  startDate: number;
  endDate: number;
  supportItems: string[];
  imageUrl: string;
  status: "ACTIVE" | "PAUSED" | "ENDED" | "CANCELLED";
  totalDonations: number;
  createdAt: number;
  canEdit: boolean;
}
