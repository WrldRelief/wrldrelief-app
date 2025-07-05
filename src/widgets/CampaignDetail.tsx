"use client";

import React, { useState } from "react";
import { MOCK_CAMPAIGNS } from "@/entities/campaign";
import { CampaignData } from "@/entities/campaign/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, Progress } from "@worldcoin/mini-apps-ui-kit-react";
import { useUserRole } from "@/context/UserRoleContext";

// Extended campaign data with additional properties for UI
interface ExtendedCampaignData
  extends Omit<CampaignData, "totalDonations" | "canEdit"> {
  resourceNeeds?: Record<string, string | number>;
  currentFunding?: number;
  targetFunding?: number;
  currency?: string;
  canEdit: boolean;
  totalDonations: number;
}

interface CampaignDetailProps {
  campaignId: number;
  onBack?: () => void;
}

export const CampaignDetail: React.FC<CampaignDetailProps> = ({
  campaignId,
  onBack,
}) => {
  const router = useRouter();
  const { userRole } = useUserRole();
  const [donationAmount, setDonationAmount] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [donationStep, setDonationStep] = useState<
    "amount" | "confirm" | "processing" | "success"
  >("amount");
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>("");

  // Find the campaign by ID
  const campaign = MOCK_CAMPAIGNS.find((c) => c.id === campaignId) as
    | ExtendedCampaignData
    | undefined;

  // Add UI-specific properties for the campaign
  const enhancedCampaign: ExtendedCampaignData | undefined = campaign
    ? {
        ...campaign,
        resourceNeeds: {
          Water: "1000 liters",
          Food: "500 kg",
          Medicine: "200 kits",
          Shelter: "50 units",
        },
        currentFunding: 3500,
        targetFunding: 10000,
        currency: "USDC",
      }
    : undefined;

  if (!enhancedCampaign) {
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

  // Format date helper function
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  // Calculate days remaining
  const getDaysRemaining = () => {
    if (new Date(enhancedCampaign.endDate) > new Date()) {
      return Math.ceil(
        (new Date(enhancedCampaign.endDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      );
    }
    return 0;
  };

  // Calculate funding progress percentage
  const getFundingPercentage = () => {
    if (!enhancedCampaign.targetFunding) return 0;
    return Math.min(
      100,
      Math.round(
        ((enhancedCampaign.currentFunding || 0) /
          enhancedCampaign.targetFunding) *
          100
      )
    );
  };

  // Handle donation amount selection
  const handleDonationAmountSelect = (amount: number) => {
    setDonationAmount(amount);
    setCustomAmount("");
  };

  // Handle custom amount input
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimals
    if (/^\d*\.?\d*$/.test(value)) {
      setCustomAmount(value);
      if (value) {
        setDonationAmount(parseFloat(value));
      }
    }
  };

  // Handle wallet connection
  const connectWallet = () => {
    // Simulate wallet connection
    setWalletConnected(true);
    // Generate a mock wallet address
    const mockAddress =
      "0x" +
      Math.random().toString(16).substring(2, 14) +
      "..." +
      Math.random().toString(16).substring(2, 6);
    setWalletAddress(mockAddress);
    setDonationStep("confirm");
  };

  // Handle donation submission
  const handleDonate = () => {
    if (!walletConnected) {
      connectWallet();
      return;
    }

    // If already connected, move to processing step
    setDonationStep("processing");

    // Simulate processing time
    setTimeout(() => {
      setDonationStep("success");
    }, 2000);
  };

  // Reset donation flow
  const resetDonation = () => {
    setDonationStep("amount");
    setDonationAmount(10);
    setCustomAmount("");
  };

  // Format wallet address for display
  const formatWalletAddress = (address: string) => {
    if (!address) return "";
    return address;
  };

  console.log("campaign", campaign);

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      {/* Campaign header */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-gray-900">
          {enhancedCampaign.name}
        </h1>
        <div className="flex items-center mt-2 text-gray-600">
          <span className="text-sm">
            By <span className="font-medium">{enhancedCampaign.organizer}</span>
          </span>
          <span className="mx-2 text-gray-400">•</span>
          <span className="text-sm text-gray-500">
            {enhancedCampaign.status === "ACTIVE" ? (
              <span className="text-green-600 font-medium">
                Active Campaign
              </span>
            ) : enhancedCampaign.status === "ENDED" ? (
              <span className="text-blue-600 font-medium">Completed</span>
            ) : enhancedCampaign.status === "PAUSED" ? (
              <span className="text-yellow-600 font-medium">Paused</span>
            ) : (
              <span className="text-red-600 font-medium">Cancelled</span>
            )}
          </span>
        </div>
      </div>

      {/* Campaign image */}
      <div className="relative w-full h-[300px]">
        <Image
          src={enhancedCampaign.imageUrl || "/images/default.jpg"}
          alt={enhancedCampaign.name}
          fill
          className="object-cover rounded-lg"
          priority
        />
      </div>

      {/* Funding progress */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Funding Progress</h2>
          <span className="text-sm font-medium text-gray-700">
            {getFundingPercentage()}% Complete
          </span>
        </div>

        <Progress value={getFundingPercentage()} className="mb-4" />

        <div className="flex justify-between items-center text-sm">
          <span>
            <span className="font-medium">
              {enhancedCampaign.currentFunding?.toLocaleString()}
            </span>{" "}
            {enhancedCampaign.currency} raised
          </span>
          <span>
            Goal:{" "}
            <span className="font-medium">
              {enhancedCampaign.targetFunding?.toLocaleString()}
            </span>{" "}
            {enhancedCampaign.currency}
          </span>
        </div>

        {/* Time remaining */}
        <div className="mt-4 text-sm text-gray-600">
          {getDaysRemaining() > 0 ? (
            <>
              <span className="font-medium">{getDaysRemaining()}</span> days
              left
            </>
          ) : (
            <>Campaign ended</>
          )}
        </div>
      </div>

      {/* Campaign description */}
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold mb-3">About This Campaign</h2>
        <p className="text-gray-700">{enhancedCampaign.description}</p>
      </div>

      {/* AI Predicted Resource Needs */}
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold mb-4">
          AI Predicted Resource Needs
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {enhancedCampaign.resourceNeeds &&
            Object.entries(enhancedCampaign.resourceNeeds).map(
              ([resource, amount]) => (
                <div key={resource} className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-800">{resource}</p>
                  <p className="text-gray-600">{amount}</p>
                </div>
              )
            )}
        </div>
      </div>

      {/* Campaign details */}
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold mb-4">Campaign Details</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-600">Organization</p>
            <p>{enhancedCampaign.organizer}</p>
          </div>
          <div>
            <p className="font-medium text-gray-600">Support Items</p>
            <p>{enhancedCampaign.supportItems.join(", ")}</p>
          </div>
          <div>
            <p className="font-medium text-gray-600">Start Date</p>
            <p>{formatDate(enhancedCampaign.startDate)}</p>
          </div>
          <div>
            <p className="font-medium text-gray-600">End Date</p>
            <p>{formatDate(enhancedCampaign.endDate)}</p>
          </div>
          <div>
            <p className="font-medium text-gray-600">Created</p>
            <p>{formatDate(enhancedCampaign.createdAt)}</p>
          </div>
          <div>
            <p className="font-medium text-gray-600">Total Donations</p>
            <p>{enhancedCampaign.totalDonations}</p>
          </div>
        </div>
      </div>

      {/* Role-based content */}
      {userRole === "organization" ? (
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold mb-4">Campaign Analytics</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-700">
                {enhancedCampaign.totalDonations}
              </p>
              <p className="text-sm text-blue-600">Total Donations</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-700">
                {enhancedCampaign.currentFunding}
              </p>
              <p className="text-sm text-green-600">Funds Raised</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-purple-700">
                {getDaysRemaining()}
              </p>
              <p className="text-sm text-purple-600">Days Left</p>
            </div>
          </div>

          {enhancedCampaign.canEdit && (
            <div className="mt-6">
              <Button
                onClick={() =>
                  router.push(`/campaigns/edit/${enhancedCampaign.id}`)
                }
              >
                Edit Campaign
              </Button>
            </div>
          )}
        </div>
      ) : userRole === "recipient" ? (
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold mb-4">Aid Status</h2>
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <p className="font-medium text-blue-800 mb-1">
              Your aid request is being processed
            </p>
            <p className="text-sm text-blue-600">
              You will be notified when resources are available for
              distribution.
            </p>
          </div>
        </div>
      ) : null}

      {/* Make a Donation Section */}
      <div className="p-6 border-t mt-4">
        <h2 className="text-xl font-semibold mb-4">Make a Donation</h2>

        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-700 mb-6">
            Your donation helps provide essential resources to those affected by
            this disaster. All donations are processed securely through
            blockchain technology for maximum transparency.
          </p>

          <Button
            className="w-full py-3"
            onClick={() =>
              router.push(
                `/explore/${enhancedCampaign.disasterId}/${enhancedCampaign.id}/donate`
              )
            }
            size="lg"
            aria-label="Donate to this campaign"
          >
            Donate Now
          </Button>

          {/* Info section */}
          <div className="bg-gray-50 p-4 rounded-lg mt-4">
            <div className="flex items-center mb-2">
              <svg
                className="w-5 h-5 text-blue-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <h3 className="font-medium text-gray-700">
                About USDC Donations
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              USDC is a stablecoin pegged to the US dollar, allowing for secure
              and transparent donations. Your contribution will be recorded on
              the blockchain and directly transferred to the campaign.
            </p>
          </div>
        </div>
      </div>

      {/* Donation transparency section */}
      <div className="p-6">
        <h3 className="font-medium text-gray-800 mb-3">
          Donation Transparency
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          All donations are recorded on the blockchain for full transparency.
          You can track how funds are being used and verify the impact of your
          contribution.
        </p>

        <div className="flex items-center space-x-2">
          <svg
            className="w-5 h-5 text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
          </svg>
          <a
            href="#"
            className="text-blue-600 text-sm hover:underline"
            tabIndex={0}
          >
            View Transactions on Explorer
          </a>
        </div>
      </div>
    </div>
  );
};
