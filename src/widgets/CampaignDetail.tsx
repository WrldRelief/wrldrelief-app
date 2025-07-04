"use client";

import React from "react";
import { MOCK_CAMPAIGNS } from "@/entities/campaign";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CampaignDetailProps {
  campaignId: string;
  onBack?: () => void;
}

export const CampaignDetail: React.FC<CampaignDetailProps> = ({
  campaignId,
  onBack,
}) => {
  const router = useRouter();

  // Find the campaign by ID
  const campaign = MOCK_CAMPAIGNS.find((c) => c.id.toString() === campaignId);

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
        <button
          onClick={() => router.push("/explore")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          aria-label="Return to explore page"
          tabIndex={0}
        >
          Return to Explore
        </button>
      </div>
    );
  }

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

      {/* Campaign header */}
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
        <div className="flex items-center mt-2 text-gray-600">
          <span className="text-sm">
            By <span className="font-medium">{campaign.organizer}</span> (
            {campaign.organizer})
          </span>
        </div>
      </div>

      {/* Campaign image */}
      <div className="relative w-full h-64">
        {campaign.imageUrl ? (
          <Image
            src={campaign.imageUrl}
            alt={campaign.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
      </div>

      {/* Campaign description */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-2">Campaign Description</h2>
        <p className="text-gray-700">{campaign.description}</p>
      </div>

      {/* AI Predicted Resource Needs */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-4">
          AI Predicted Resource Needs
        </h2>
        {/* <ResourceNeeds resourceNeeds={campaign.resourceNeeds || {}} /> */}
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

      {/* Donation progress */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-2">Funding Progress</h2>
        {/* <FundingProgress
          currentFunding={campaign.currentFunding}
          targetFunding={campaign.targetFunding}
          currency={campaign.currency}
          className="mb-4"
        /> */}

        {/* Time remaining */}
        <div className="text-sm text-gray-600">
          {new Date(campaign.endDate) > new Date() ? (
            <>
              <span className="font-medium">
                {Math.ceil(
                  (new Date(campaign.endDate).getTime() -
                    new Date().getTime()) /
                    (1000 * 60 * 60 * 24)
                )}
              </span>{" "}
              days left
            </>
          ) : (
            <>Campaign ended</>
          )}
        </div>
      </div>

      {/* Make a donation */}
      <div className="p-4">
        {/* <DonationForm
          campaignId={campaignId}
          campaignName={campaign.name}
          currency={campaign.currency}
        /> */}
      </div>
    </div>
  );
};
