"use client";

import { useDisasterData } from "@/entities/disaster/disasterData";
import { useCampaignData } from "@/entities/campaign/campaignData";

/**
 * @interface DonationData
 * @description Donation statistics data structure
 */
export interface DonationData {
  totalDonations: {
    amount: number;
    currency: string;
  };
  totalDonationsCount: number;
  activeDonations: number;
  activeCampaigns: number;
}

/**
 * @function formatDonationAmount
 * @description Formats donation amount with proper separators
 */
export const formatDonationAmount = (amount: number): string => {
  return amount.toLocaleString();
};

/**
 * @function useDonationData
 * @description Returns donation data from on-chain sources
 */
export const useDonationData = (): { data: DonationData, loading: boolean, error: boolean } => {
  const { data: disasters, isLoading: disastersLoading, isError: disastersError } = useDisasterData();
  const { campaigns, loading: campaignsLoading, error: campaignsError } = useCampaignData();
  
  const loading = disastersLoading || campaignsLoading;
  // Only set error to true if we're not loading and there's an actual error
  const error = !loading && (disastersError || !!campaignsError);
  
  const data: DonationData = {
    totalDonations: {
      amount: 32, // This would ideally come from on-chain data as well
      currency: "USDC",
    },
    totalDonationsCount: 4, // This would ideally come from on-chain data as well
    activeDonations: disasters?.length || 0,
    activeCampaigns: campaigns?.length || 0,
  };
  
  return { data, loading, error };
};

// In a real application, you would likely have API calls here
// For example:

/**
 * @function fetchDonationStats
 * @description Fetches donation statistics from API
 * @deprecated Use useDonationData hook instead for React components
 */
export const fetchDonationStats = async (): Promise<DonationData> => {
  // This would be replaced with an actual API call
  // const response = await fetch('/api/donation-stats');
  // const data = await response.json();
  // return data;

  // For now, return a static object that mimics the structure
  // In a real app, this would fetch from an API endpoint
  return {
    totalDonations: {
      amount: 32,
      currency: "USDC",
    },
    totalDonationsCount: 4,
    activeDonations: 3, // This would come from actual disaster count
    activeCampaigns: 5, // This would come from actual campaign count
  };
};
