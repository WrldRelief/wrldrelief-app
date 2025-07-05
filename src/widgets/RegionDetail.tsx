"use client";

import React, { useState } from "react";
import { DisasterLocation } from "@/entities/disaster/types";
import { MOCK_CAMPAIGNS } from "@/entities/campaign";
import Image from "next/image";
import CampaignList from "@/features/CampaignList";
import { Tabs, TabItem } from "@worldcoin/mini-apps-ui-kit-react";
import { CheckSquare, Donate } from "iconoir-react";

interface RegionDetailProps {
  region: DisasterLocation;
}

export const RegionDetail: React.FC<RegionDetailProps> = ({ region }) => {
  const [activeTab, setActiveTab] = useState<
    "active-campaigns" | "completed-campaigns"
  >("active-campaigns");

  // Filter campaigns by the selected disaster region
  const campaigns = MOCK_CAMPAIGNS.filter(
    (campaign) => campaign.disasterId === region.id
  );
  const activeCampaigns = campaigns.filter(
    (campaign) => campaign.status === "ACTIVE"
  );
  const completedCampaigns = campaigns.filter(
    (campaign) => campaign.status === "ENDED"
  );

  return (
    <div className="flex flex-col w-full bg-white rounded-lg shadow-md overflow-hidden">
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
      <div className="relative w-full h-[300px]">
        <Image
          src={region.imageUrl || "/images/default.jpg"}
          alt={`Disaster situation in ${region.name}`}
          fill
          className="object-cover rounded-lg"
          priority
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
        {/* Active Campaigns Tab Content */}
        {activeTab === "active-campaigns" && (
          <div>
            <CampaignList disasterId={region.id} campaigns={activeCampaigns} />
          </div>
        )}

        {/* Completed Campaigns Tab Content */}
        {activeTab === "completed-campaigns" && (
          <div>
            <CampaignList
              disasterId={region.id}
              campaigns={completedCampaigns}
            />
          </div>
        )}
      </div>
    </div>
  );
};
