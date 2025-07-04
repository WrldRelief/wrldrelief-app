"use client";

import React from "react";
import { MOCK_CAMPAIGNS } from "@/entities/campaign";
import { useRouter } from "next/navigation";

interface ThankYouTrackingProps {
  campaignId: string;
  amount: number;
  txId?: string;
}

export const ThankYouTracking: React.FC<ThankYouTrackingProps> = ({
  campaignId,
  amount: donationAmount,
  txId = "0x7a9a8c0e1e2f3d4b5c6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9",
}) => {
  const router = useRouter();
  const campaign = MOCK_CAMPAIGNS.find((c) => c.id.toString() === campaignId);

  // Mock blockchain transaction ID
  const blockchainTxId = txId;

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
      {/* Thank you header */}
      <div className="p-6 text-center border-b">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Thank you for your donation!
        </h1>
        <p className="text-gray-600">
          Your {donationAmount} USDC donation to the {campaign.name} campaign
          has been successfully processed. Your contribution will make a real
          difference!
        </p>
      </div>

      {/* Real-time donation tracking */}
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold mb-4">
          Real-time Donation Tracking
        </h2>

        <div className="mb-4">
          <span className="block text-sm text-gray-600 mb-1">
            Blockchain Transaction ID:
          </span>
          <div className="flex items-center">
            <span className="block font-mono text-sm bg-gray-100 p-2 rounded overflow-x-auto max-w-full">
              {blockchainTxId}
            </span>
            <button
              className="ml-2 text-blue-600 hover:text-blue-800"
              aria-label="Copy transaction ID"
              tabIndex={0}
              onClick={() => navigator.clipboard.writeText(blockchainTxId)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Donation journey visualization */}
        <div className="py-4">
          <ol className="relative border-l border-gray-200">
            <li className="mb-10 ml-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white">
                <span className="text-blue-800 font-bold">1</span>
              </span>
              <h3 className="font-medium text-gray-900">
                Transaction Recorded
              </h3>
              <p className="text-sm text-gray-500">
                Your donation has been recorded on the blockchain
              </p>
              <span className="text-xs text-blue-600 mt-1 block">Just now</span>
            </li>

            <li className="mb-10 ml-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white">
                <span className="text-blue-800 font-bold">2</span>
              </span>
              <h3 className="font-medium text-gray-900">
                Smart Contract Activated
              </h3>
              <p className="text-sm text-gray-500">
                Smart contract automatically transferred funds to the campaign
              </p>
              <span className="text-xs text-blue-600 mt-1 block">
                Processing...
              </span>
            </li>

            <li className="mb-10 ml-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white">
                <span className="text-gray-500 font-bold">3</span>
              </span>
              <h3 className="font-medium text-gray-500">
                Relief Organization Purchase
              </h3>
              <p className="text-sm text-gray-500">
                Pending: Relief organization will purchase supplies
              </p>
            </li>

            <li className="mb-10 ml-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white">
                <span className="text-gray-500 font-bold">4</span>
              </span>
              <h3 className="font-medium text-gray-500">
                Aid Delivered to Recipients
              </h3>
              <p className="text-sm text-gray-500">
                Pending: Aid will be delivered to disaster victims
              </p>
            </li>
          </ol>
        </div>
      </div>

      {/* AI Analysis */}
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold mb-4">
          AI Analysis of Disaster Recovery
        </h2>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Recovery Progress</span>
            <span className="text-sm font-medium text-blue-600">10%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: "10%" }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Based on AI analysis of relief efforts and resource distribution
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-600 mr-2 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="font-medium text-gray-900">
                Recipient Notification
              </h3>
              <p className="text-sm text-gray-600">
                You will be notified when your donation has directly helped
                disaster victims.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="p-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
        <button
          onClick={() => router.push("/explore")}
          className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          aria-label="Return to explore page"
          tabIndex={0}
        >
          Explore More Campaigns
        </button>
        <button
          onClick={() => router.push("/activity")}
          className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          aria-label="View donation history"
          tabIndex={0}
        >
          View My Donation History
        </button>
      </div>
    </div>
  );
};
