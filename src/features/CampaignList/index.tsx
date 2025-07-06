"use client";

import { ListItem } from "@worldcoin/mini-apps-ui-kit-react";
import { useRouter } from "next/navigation";
import React from "react";
import { CampaignData, CampaignStatus } from "@/entities/campaign";

interface CampaignListProps {
  campaigns: CampaignData[];
  disasterId?: string;
}

const CampaignList: React.FC<CampaignListProps> = ({
  campaigns,
  disasterId,
}) => {
  const router = useRouter();

  const handleCampaignSelect = (campaignId: number) => {
    router.push(`/explore/${disasterId}/${campaignId}`);
  };

  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 text-center text-gray-500">
        No campaigns available for this disaster
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-600";
      case "PAUSED":
        return "text-yellow-600";
      case "ENDED":
        return "text-blue-600";
      case "CANCELLED":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusString = (status: CampaignStatus): string => {
    return CampaignStatus[status];
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Active";
      case "PAUSED":
        return "Paused";
      case "ENDED":
        return "Completed";
      case "CANCELLED":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      {campaigns.map((campaign) => (
        <ListItem
          key={campaign.id}
          label={campaign.name}
          description={`${campaign.organizer} · ${formatDate(
            campaign.startDate
          )} - ${formatDate(campaign.endDate)}`}
          onClick={() => handleCampaignSelect(campaign.id)}
          startAdornment={
            <div className="w-12 h-12 rounded-lg overflow-hidden relative">
              <img
                src={campaign.imageUrl || "/images/default.jpg"}
                alt={campaign.name}
                className="object-cover w-full h-full"
                onError={(e) => {
                  e.currentTarget.src = "/images/default.jpg";
                }}
              />
            </div>
          }
          endAdornment={
            <div className="flex flex-col items-end">
              <span
                className={`text-xs font-medium ${getStatusColor(
                  getStatusString(campaign.status)
                )}`}
              >
                {getStatusLabel(getStatusString(campaign.status))}
              </span>
              <span className="text-xs text-gray-500">
                {campaign.supportItems.length} items needed
              </span>
            </div>
          }
        />
      ))}
    </div>
  );
};

export default CampaignList;
