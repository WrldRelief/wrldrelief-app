"use client";

/**
 * @interface DonationData
 * @description Donation statistics data structure
 */
export interface DonationData {
  totalDonations: {
    amount: number;
    currency: string;
  };
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
 * @function getDefaultDonationData
 * @description Returns default donation data for demonstration
 */
export const getDefaultDonationData = (): DonationData => {
  return {
    totalDonations: {
      amount: 125000,
      currency: "USDC",
    },
    activeCampaigns: 12,
  };
};

// In a real application, you would likely have API calls here
// For example:

/**
 * @function fetchDonationStats
 * @description Fetches donation statistics from API
 */
export const fetchDonationStats = async (): Promise<DonationData> => {
  // This would be replaced with an actual API call
  // const response = await fetch('/api/donation-stats');
  // const data = await response.json();
  // return data;

  // For now, return mock data
  return getDefaultDonationData();
};
