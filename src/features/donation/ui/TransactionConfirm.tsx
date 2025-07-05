"use client";

import React from "react";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import { useDonation } from "../model/DonationContext";
import { MOCK_CAMPAIGNS } from "@/entities/campaign";

export const TransactionConfirm: React.FC = () => {
  const { donationState, goToStep } = useDonation();
  const campaign = MOCK_CAMPAIGNS.find((c) => c.id === donationState.campaignId);

  if (!campaign) {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-center text-red-600 mb-4">
            Campaign Not Found
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            The campaign you're trying to donate to doesn't exist or has been removed.
          </p>
          <Button
            onClick={() => goToStep("amount")}
            className="w-full"
            aria-label="Go back"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Calculate estimated gas fee (mock value)
  const estimatedGasFee = 0.002;

  const handleConfirm = () => {
    goToStep("processing");
  };

  const handleBack = () => {
    goToStep("amount");
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-blue-50 border-b">
        <h2 className="text-xl font-semibold text-center">Confirm Transaction</h2>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <div className="mb-4">
            <span className="block text-sm text-gray-600 mb-1">Amount:</span>
            <span className="block text-lg font-semibold">{donationState.amount} USDC</span>
          </div>

          <div className="mb-4">
            <span className="block text-sm text-gray-600 mb-1">Recipient:</span>
            <span className="block font-medium">{campaign.name}</span>
            <span className="block text-sm text-gray-500 truncate">
              {campaign.organizer}
            </span>
          </div>

          <div className="mb-4">
            <span className="block text-sm text-gray-600 mb-1">
              Your Wallet:
            </span>
            <span className="block text-sm font-mono">{donationState.walletAddress}</span>
          </div>

          <div className="mb-4">
            <span className="block text-sm text-gray-600 mb-1">
              Estimated Gas Fee:
            </span>
            <span className="block text-sm">{estimatedGasFee} ETH</span>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <Button
            onClick={handleConfirm}
            className="w-full py-3"
            aria-label="Confirm transaction"
            size="lg"
          >
            Confirm
          </Button>
          
          <Button
            variant="tertiary"
            onClick={handleBack}
            className="w-full"
            aria-label="Go back to amount selection"
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};
