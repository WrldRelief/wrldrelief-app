"use client";

import React, { useState } from "react";
import { DisasterLocationExtended } from "@/entities/disaster/types";
import { CampaignStatus } from "@/entities/campaign/types";
import { useDisasterCampaigns } from "@/entities/campaign/campaignData";
import CampaignList from "@/features/CampaignList";
import { Tabs, TabItem, Spinner } from "@worldcoin/mini-apps-ui-kit-react";
import { CheckSquare, Donate, WarningCircle } from "iconoir-react";

interface RegionDetailProps {
  region: DisasterLocationExtended;
}

export const RegionDetail: React.FC<RegionDetailProps> = ({ region }) => {
  const [activeTab, setActiveTab] = useState<
    "active-campaigns" | "completed-campaigns"
  >("active-campaigns");

  // Fetch campaigns for this disaster using the contract hook with type adapter
  const { campaigns, loading, error } = useDisasterCampaigns(region.id);

  // Filter campaigns by status
  const activeCampaigns = campaigns.filter(
    (campaign) => campaign.status === CampaignStatus.ACTIVE
  );

  const completedCampaigns = campaigns.filter(
    (campaign) => campaign.status === CampaignStatus.ENDED
  );

  return (
    <div className="flex flex-col w-full bg-white rounded-lg shadow-md">
      {/* Region header */}
      <div className="border-b">
        <h1 className="text-2xl font-bold text-gray-900">{region.name}</h1>
        <div className="flex items-center mt-2 text-gray-600">
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
            {region.type.charAt(0).toUpperCase() + region.type.slice(1)}
          </span>
          <span className="text-sm p-4">
            AI Analysis: Approximately {region.affectedPeople.toLocaleString()}{" "}
            people affected
          </span>
        </div>
      </div>

      {/* Region image */}
      <div className="relative w-full min-h-[300px] h-[300px]">
        <img
          src={region.imageUrl || "/images/default.jpg"}
          alt={`Disaster situation in ${region.name}`}
          className="object-cover rounded-lg"
          onError={(e) => {
            e.currentTarget.src = "/images/default.jpg";
          }}
        />
      </div>

      {/* Region description */}
      <div className="py-4 border-b">
        <h2 className="text-lg font-semibold mb-2">Situation Overview</h2>
        <p className="text-gray-700">{region.description}</p>
      </div>

      {/* Tabs using Worldcoin Mini-Apps UI Kit */}
      <div className="pt-6 pb-2">
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "active-campaigns" | "completed-campaigns")
          }
        >
          <TabItem
            value="active-campaigns"
            label="Active Campaigns"
            icon={<Donate />}
          />
          <TabItem
            value="completed-campaigns"
            label="Completed Campaigns"
            icon={<CheckSquare />}
          />
        </Tabs>
      </div>

      {/* Tab content */}
      <div>
        {loading ? (
          <div className="flex flex-col items-center justify-center p-8">
            <Spinner />
            <p className="mt-4 text-gray-600">Loading campaigns...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-8 text-red-500">
            <WarningCircle width={48} height={48} />
            <p className="mt-4">Error loading campaigns: {error.message}</p>
          </div>
        ) : (
          <>
            {/* Active Campaigns Tab Content */}
            {activeTab === "active-campaigns" && (
              <div>
                {activeCampaigns.length > 0 ? (
                  <CampaignList
                    disasterId={region.id}
                    campaigns={activeCampaigns}
                  />
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <p>No active campaigns found for this disaster.</p>
                  </div>
                )}
              </div>
            )}

            {/* Completed Campaigns Tab Content */}
            {activeTab === "completed-campaigns" && (
              <div>
                {completedCampaigns.length > 0 ? (
                  <CampaignList
                    disasterId={region.id}
                    campaigns={completedCampaigns}
                  />
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <p>No completed campaigns found for this disaster.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
