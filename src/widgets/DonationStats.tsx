"use client";

import { User, Gift, Activity, WarningTriangle } from "iconoir-react";
import {
  DonationData,
  formatDonationAmount,
  useDonationData,
} from "@/features/DonationStats";
import { ListItem } from "@worldcoin/mini-apps-ui-kit-react";

/**
 * @interface DonationStatsProps
 * @description Props for the DonationStats component
 */
interface DonationStatsProps {
  data: DonationData;
  className?: string;
}

/**
 * StatCard component for consistent stat display with icon, label and value
 */
interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  className?: string;
  iconClassName?: string;
}

const StatCard = ({ icon: Icon, label, value }: StatCardProps) => (
  <ListItem
    label={value.toString()}
    description={label}
    startAdornment={<Icon className="w-5 h-5" />}
  />
);

/**
 * DonationStats component displays donation statistics
 * Shows the total donations, active campaigns, total raised, and donors count
 */
export const DonationStats = ({ data, className = "" }: DonationStatsProps) => {
  // Early return for null data
  if (!data) {
    return null;
  }

  // Format the amounts with commas as thousands separators
  const formattedTotal = formatDonationAmount(data.totalDonations.amount);

  return (
    <div
      className={`w-full ${className}`}
      role="region"
      aria-label="Donation statistics"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 w-full">
        {/* Total Donations */}
        <StatCard
          icon={Gift}
          label="Total Donations"
          value={`${formattedTotal} ${data.totalDonations.currency}`}
        />

        {/* Total Donors */}
        <StatCard
          icon={User}
          label="Total Donors"
          value={data.totalDonationsCount}
        />

        {/* Total Disasters */}
        <StatCard
          icon={WarningTriangle}
          label="Active Disasters"
          value={data.activeDonations}
        />

        {/* Active Campaigns */}
        <StatCard
          icon={Activity}
          label="Active Campaigns"
          value={data.activeCampaigns}
        />
      </div>
    </div>
  );
};

/**
 * Default DonationStats with on-chain data
 * Can be used directly in the home page
 */
export const DefaultDonationStats = () => {
  // Get donation data from on-chain sources
  const { data, loading, error } = useDonationData();
  
  if (loading) {
    return (
      <div className="w-full p-4 text-center">
        <div className="w-6 h-6 border-4 border-t-blue-500 border-b-blue-700 border-l-blue-500 border-r-blue-700 rounded-full animate-spin mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600">Loading donation stats...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="w-full p-4 text-center text-red-500">
        <p>Error loading donation stats.</p>
      </div>
    );
  }
  
  return <DonationStats data={data} />;
};
