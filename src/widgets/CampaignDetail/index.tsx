"use client";

import React from "react";
import { MOCK_CAMPAIGNS } from "@/entities/campaign";
import { CampaignData } from "@/entities/campaign/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUserRole } from "@/context/UserRoleContext";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import DonationForm from "../DonationForm";

// Extended campaign data with additional properties for UI
interface ExtendedCampaignData extends CampaignData {
  resourceNeeds?: Record<string, string | number>;
  currentFunding?: number;
  targetFunding?: number;
  currency?: string;
}

interface CampaignDetailProps {
  campaignId: number;
}

export const CampaignDetail: React.FC<CampaignDetailProps> = ({
  campaignId,
}) => {
  const router = useRouter();
  const { userRole } = useUserRole();

  // Find the campaign by ID and extend with UI-specific properties
  const baseCampaign = MOCK_CAMPAIGNS.find((c) => c.id === campaignId);

  // Create extended campaign with UI-specific properties
  const campaign: ExtendedCampaignData | undefined = baseCampaign
    ? {
        ...baseCampaign,
        resourceNeeds: {
          water: "500 liters",
          food: "200 kg",
          medicine: "50 kits",
          shelter: "30 units",
        },
        currentFunding: 2500,
        targetFunding: 10000,
        currency: "USDC",
      }
    : undefined;

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Campaign Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          The campaign you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Button
          onClick={() => router.push("/explore")}
          aria-label="Return to explore page"
        >
          Return to Explore
        </Button>
      </div>
    );
  }

  // Calculate days remaining
  const daysRemaining = Math.ceil(
    (new Date(campaign.endDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div className="w-full">
      <div className="relative w-full h-64">
        <Image
          src={campaign.imageUrl || "/images/default.jpg"}
          alt={campaign.name}
          fill
          className="object-cover rounded-lg"
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <h1 className="text-2xl font-bold text-white">{campaign.name}</h1>
          <div className="flex items-center mt-2">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                campaign.status === "ACTIVE"
                  ? "bg-green-100 text-green-800"
                  : campaign.status === "ENDED"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {campaign.status.charAt(0).toUpperCase() +
                campaign.status.slice(1).toLowerCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Campaign details */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-4">Campaign Details</h2>
        <p className="text-gray-700 mb-4">{campaign.description}</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-600">Organization</p>
            <p>{campaign.organizer}</p>
          </div>
          <div>
            <p className="font-medium text-gray-600">Organization DID</p>
            <p className="truncate">{campaign.organizer}</p>
          </div>
          <div>
            <p className="font-medium text-gray-600">Start Date</p>
            <p>{new Date(campaign.startDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="font-medium text-gray-600">End Date</p>
            <p>{new Date(campaign.endDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* AI Predicted Resource Needs */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-4">
          AI Predicted Resource Needs
        </h2>
        <div className="space-y-2">
          {campaign.resourceNeeds &&
            Object.entries(campaign.resourceNeeds).map(([need, amount]) => (
              <div
                key={need}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
              >
                <span className="font-medium">
                  {need.charAt(0).toUpperCase() + need.slice(1)}
                </span>
                <span className="text-gray-600">{String(amount)}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Donation progress */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-2">Funding Progress</h2>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{
              width: `${Math.min(
                100,
                ((campaign.currentFunding || 0) /
                  (campaign.targetFunding || 1)) *
                  100
              )}%`,
            }}
          ></div>
        </div>
        <div className="flex justify-between text-sm mb-4">
          <span>
            {campaign.currentFunding || 0} {campaign.currency || "USDC"}
          </span>
          <span>
            {campaign.targetFunding || 0} {campaign.currency || "USDC"}
          </span>
        </div>

        {/* Time remaining */}
        <div className="text-sm text-gray-600">
          {daysRemaining > 0 ? (
            <span>{daysRemaining} days remaining in campaign</span>
          ) : (
            <span>Campaign has ended</span>
          )}
        </div>
      </div>

      {/* Organization-specific analytics (only visible to organizations) */}
      {userRole === "organization" && (
        <div className="p-4 border-b bg-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Campaign Analytics</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">Total Donors</p>
              <p className="text-xl font-bold">
                {Math.floor(Math.random() * 100) + 50}
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">Avg. Donation</p>
              <p className="text-xl font-bold">
                {Math.floor(Math.random() * 50) + 20} USDC
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-xl font-bold">
                {Math.floor(Math.random() * 30) + 10}%
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">Recurring Donors</p>
              <p className="text-xl font-bold">
                {Math.floor(Math.random() * 40) + 5}
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              className="w-full"
              onClick={() => {
                console.log("View Full Analytics Dashboard");
                // router.push(`/organization/campaign/${campaignId}/analytics`)
              }}
            >
              View Full Analytics Dashboard
            </Button>
          </div>
        </div>
      )}

      {/* Recipient-specific aid status (only visible to recipients) */}
      {userRole === "recipient" && (
        <div className="p-4 border-b bg-green-50">
          <h2 className="text-lg font-semibold mb-4">
            Aid Distribution Status
          </h2>
          <div className="space-y-3 mb-4">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Food Packages</p>
                  <p className="text-sm text-gray-600">
                    Next delivery:{" "}
                    {new Date(Date.now() + 86400000 * 2).toLocaleDateString()}
                  </p>
                </div>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                  In Progress
                </span>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Medical Supplies</p>
                  <p className="text-sm text-gray-600">
                    Delivered:{" "}
                    {new Date(Date.now() - 86400000 * 3).toLocaleDateString()}
                  </p>
                </div>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  Completed
                </span>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Shelter Materials</p>
                  <p className="text-sm text-gray-600">
                    Scheduled:{" "}
                    {new Date(Date.now() + 86400000 * 5).toLocaleDateString()}
                  </p>
                </div>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  Scheduled
                </span>
              </div>
            </div>
          </div>
          <Button
            className="w-full"
            onClick={() => router.push(`/recipient/aid-status/${campaignId}`)}
          >
            View Complete Aid Status
          </Button>
        </div>
      )}

      {/* Make a donation - uses role-based form */}
      <div className="mt-4">
        <DonationForm campaignId={Number(campaignId)} />
      </div>
    </div>
  );
};

export default CampaignDetail;
