"use client";

import React from "react";
import { MOCK_CAMPAIGNS } from "@/entities/campaign";
import { useRouter } from "next/navigation";

interface WalletConfirmProps {
  campaignId: number;
  amount: number;
  onCancel?: () => void;
}

export const WalletConfirm: React.FC<WalletConfirmProps> = ({
  campaignId,
  amount,
  onCancel,
}) => {
  const router = useRouter();
  const campaign = MOCK_CAMPAIGNS.find((c) => c.id === campaignId);

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

  const handleConfirm = () => {
    // In a real app, this would trigger a wallet transaction
    // For now, we'll just navigate to the thank you page
    router.push(
      `/explore/donate/thank-you?campaignId=${campaignId}&amount=${amount}`
    );
  };

  // Calculate estimated gas fee (mock value)
  const estimatedGasFee = 0.002;

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-blue-50 border-b">
        <h2 className="text-xl font-semibold text-center">
          Confirm Transaction
        </h2>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <div className="mb-4">
            <span className="block text-sm text-gray-600 mb-1">Amount:</span>
            <span className="block text-lg font-semibold">{amount} USDC</span>
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
              Estimated Gas Fee:
            </span>
            <span className="block text-sm">{estimatedGasFee} ETH</span>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onCancel}
            className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            aria-label="Cancel transaction"
            tabIndex={0}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            aria-label="Confirm transaction"
            tabIndex={0}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
