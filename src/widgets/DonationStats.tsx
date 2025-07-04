"use client";

import { User, Gift, Activity, WarningTriangle } from "iconoir-react";
import {
  DonationData,
  formatDonationAmount,
  getDefaultDonationData,
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
          value={data.totalDonations.amount}
        />

        {/* Total Disasters */}
        <StatCard
          icon={WarningTriangle}
          label="Active Disasters"
          value={data.totalDonations.amount}
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
 * Default DonationStats with preset values
 * Can be used directly in the home page
 */
export const DefaultDonationStats = () => {
  // Get default donation data from the features module
  const defaultData = getDefaultDonationData();
  return <DonationStats data={defaultData} />;
};
