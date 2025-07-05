"use client";

import React from "react";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import { useDonation } from "../model/DonationContext";
import { useRouter } from "next/navigation";
import { MOCK_CAMPAIGNS } from "@/entities/campaign";

export const TransactionSuccess: React.FC = () => {
  const { donationState, resetDonation } = useDonation();
  const router = useRouter();
  const campaign = MOCK_CAMPAIGNS.find(
    (c) => c.id === donationState.campaignId
  );

  if (!campaign) {
    return null;
  }

  const handleViewCampaign = () => {
    router.push(
      `/explore/${donationState.disasterId}/${donationState.campaignId}`
    );
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-green-50 border-b">
        <h2 className="text-xl font-semibold text-center text-green-700">
          Donation Successful!
        </h2>
      </div>

      <div className="p-6">
        <div className="flex flex-col items-center justify-center py-6">
          <div className="bg-green-100 rounded-full p-3 mb-4 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>

          <p className="text-gray-600 text-center mb-6">
            Thank you for your donation of {donationState.amount} USDC to
            support
            <span className="font-medium"> {campaign.name}</span>.
          </p>

          <div className="bg-gray-50 p-4 rounded-lg w-full mb-6">
            <h4 className="font-medium text-gray-700 mb-2">
              Transaction Details
            </h4>
            <div className="flex justify-between mb-1 text-sm">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-mono text-xs truncate max-w-[200px]">
                {donationState.transactionId}
              </span>
            </div>
            <div className="flex justify-between mb-1 text-sm">
              <span className="text-gray-600">Status:</span>
              <span className="text-green-600">Confirmed</span>
            </div>
            <div className="flex justify-between mb-1 text-sm">
              <span className="text-gray-600">Amount:</span>
              <span>{donationState.amount} USDC</span>
            </div>
          </div>

          <div className="flex flex-col space-y-3 w-full">
            <Button
              onClick={handleViewCampaign}
              className="w-full"
              aria-label="View campaign"
            >
              View Campaign
            </Button>

            <Button
              variant="tertiary"
              onClick={resetDonation}
              className="w-full"
              aria-label="Make another donation"
            >
              Make Another Donation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
