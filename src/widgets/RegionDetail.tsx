"use client";

import React, { useState } from "react";
import { DisasterLocation } from "@/entities/disaster/types";
import { MOCK_CAMPAIGNS } from "@/entities/campaign";
import Image from "next/image";
import CampaignList from "@/features/CampaignList";

interface RegionDetailProps {
  region: DisasterLocation;
  onBack?: () => void;
}

export const RegionDetail: React.FC<RegionDetailProps> = ({
  region,
  onBack,
}) => {
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
      {/* Back button */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 p-4 hover:underline"
          aria-label="Go back"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onBack()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
      )}

      {/* Region header */}
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold text-gray-900">{region.name}</h1>
        <div className="flex items-center mt-2 text-gray-600">
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
            {region.type.charAt(0).toUpperCase() + region.type.slice(1)}
          </span>
          <span className="text-sm">
            AI Analysis: Approximately {region.affectedPeople.toLocaleString()}{" "}
            people affected
          </span>
        </div>
      </div>

      {/* Region image */}
      <div className="relative w-full h-64">
        {region.imageUrl ? (
          <Image
            src={region.imageUrl}
            alt={`Disaster situation in ${region.name}`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
      </div>

      {/* Region description */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-2">Situation Overview</h2>
        <p className="text-gray-700">{region.description}</p>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex">
          <button
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === "active-campaigns"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("active-campaigns")}
            aria-label="Show active campaigns"
            tabIndex={0}
          >
            Active Campaigns
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === "completed-campaigns"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("completed-campaigns")}
            aria-label="Show completed campaigns"
            tabIndex={0}
          >
            Completed Campaigns
          </button>
        </nav>
      </div>

      {/* Tab content */}
      <div className="p-4">
        {/* Active Campaigns Tab Content */}
        {activeTab === "active-campaigns" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Active Relief Campaigns
            </h2>
            <CampaignList campaigns={activeCampaigns} />
          </div>
        )}

        {/* Completed Campaigns Tab Content */}
        {activeTab === "completed-campaigns" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Completed Campaigns</h2>
            <CampaignList campaigns={completedCampaigns} />
          </div>
        )}
      </div>
    </div>
  );
};
