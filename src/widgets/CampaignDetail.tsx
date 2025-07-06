"use client";

import React, { useState, useEffect } from "react";
import { CampaignStatus } from "@/entities/campaign/types";
import { useCampaign, Campaign } from "@/entities/contracts";
import { useRouter } from "next/navigation";
import { Button, Progress } from "@worldcoin/mini-apps-ui-kit-react";
import { useUserRole } from "@/context/UserRoleContext";
import WorldcoinVerification from "@/shared/components/WorldcoinVerification";

// Extended campaign data with additional properties for UI
interface ExtendedCampaignData extends Campaign {
  resourceNeeds?: Record<string, string | number>;
  currentFunding?: number;
  targetFunding?: number;
  currency?: string;
  isRegistered?: boolean; // Added property for recipient registration status
  registrationStatus?: "pending" | "approved" | "rejected"; // Status of the registration process
  worldcoinVerified?: boolean; // Whether the user has verified with Worldcoin
  location?: string; // Location of the campaign for distribution details
}

interface CampaignDetailProps {
  campaignId: number;
}

export const CampaignDetail: React.FC<CampaignDetailProps> = ({
  campaignId,
}) => {
  const router = useRouter();
  const { userRole } = useUserRole();

  // Fetch campaign data from blockchain
  const { campaign, loading, error } = useCampaign(campaignId);

  // Add UI-specific properties for the campaign and store in state
  const [enhancedCampaign, setEnhancedCampaign] = useState<
    ExtendedCampaignData | undefined
  >();

  // Update enhanced campaign when blockchain data changes
  useEffect(() => {
    if (campaign) {
      setEnhancedCampaign({
        ...campaign,
        resourceNeeds: {
          Water: "1000 liters",
          Food: "500 kg",
          Medicine: "200 kits",
          Shelter: "50 units",
        },
        currentFunding: campaign.currentFunding || 75000,
        targetFunding: campaign.targetFunding || 100000,
        currency: campaign.currency || "USDC",
        isRegistered: campaign.isRegistered || false,
        registrationStatus: campaign.registrationStatus || "pending",
        worldcoinVerified: campaign.worldcoinVerified || false,
        location: campaign.location || "Central Distribution Center",
      });
    } else {
      setEnhancedCampaign(undefined);
    }
  }, [campaign]);

  // State for modals and donation will be implemented in future updates
  // Currently removed to fix ESLint unused variable warnings

  // If campaign is loading
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Loading Campaign...
        </h2>
      </div>
    );
  }

  // If campaign not found or error
  if (!enhancedCampaign || error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Campaign Not Found
        </h2>
        <p className="text-gray-500 mb-4">
          {error
            ? `Error: ${error.message}`
            : "The campaign you are looking for does not exist or has been removed."}
        </p>
        <Button onClick={() => router.back()} variant="secondary" size="lg">
          Go Back
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

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      {/* Campaign header */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-gray-900">
          {enhancedCampaign.name}
        </h1>
        <div className="flex items-center mt-2 text-gray-600">
          <span className="text-sm">
            By{" "}
            <span className="font-medium" title={enhancedCampaign.organizer}>
              {enhancedCampaign.organizer.length > 8
                ? `${enhancedCampaign.organizer.substring(0, 8)}...`
                : enhancedCampaign.organizer}
            </span>
          </span>
          <span className="mx-2 text-gray-400">•</span>
          <span className="text-sm text-gray-500">
            {enhancedCampaign.status === CampaignStatus.ACTIVE ? (
              <span className="text-green-600 font-medium">
                Active Campaign
              </span>
            ) : enhancedCampaign.status === CampaignStatus.ENDED ? (
              <span className="text-blue-600 font-medium">Completed</span>
            ) : enhancedCampaign.status === CampaignStatus.PAUSED ? (
              <span className="text-yellow-600 font-medium">Paused</span>
            ) : (
              <span className="text-red-600 font-medium">Cancelled</span>
            )}
          </span>
        </div>
      </div>

      {/* Campaign image */}
      <div className="relative w-full h-[300px]">
        <img
          src={enhancedCampaign.imageUrl || "/images/default.jpg"}
          alt={enhancedCampaign.name}
          className="object-cover rounded-lg"
          onError={(e) => {
            e.currentTarget.src = "/images/default.jpg";
          }}
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
            <p className="truncate">{enhancedCampaign.organizer}</p>
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
          <h2 className="text-lg font-semibold mb-4">
            Aid Registration & Verification
          </h2>

          {/* Step 1: Register as affected person */}
          {!enhancedCampaign.isRegistered && (
            <div className="bg-white border rounded-lg p-4 mb-4">
              <h3 className="font-medium text-gray-800 mb-2">
                Step 1: Register as Affected Person
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Register yourself as affected by this disaster to receive aid
                supplies. Your information will be securely stored and verified.
              </p>
              <Button
                onClick={() => {
                  // Simulate registration
                  setEnhancedCampaign((prev) => ({
                    ...prev,
                    isRegistered: true,
                    registrationStatus: "pending",
                  }));
                }}
                className="w-full"
                size="lg"
              >
                Register for Aid
              </Button>
            </div>
          )}

          {/* Step 2: Verification status */}
          {enhancedCampaign.isRegistered &&
            enhancedCampaign.registrationStatus === "pending" && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h3 className="font-medium text-blue-800 mb-2">
                  Step 2: Verification Pending
                </h3>
                <p className="text-sm text-blue-600 mb-3">
                  Your registration has been received. The organization will
                  verify your eligibility.
                </p>
                <div className="flex items-center text-sm text-blue-700">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Verification usually takes 24-48 hours</span>
                </div>

                {/* For demo purposes, add a button to simulate approval */}
                <Button
                  variant="tertiary"
                  onClick={() => {
                    setEnhancedCampaign((prev) => ({
                      ...prev,
                      registrationStatus: "approved",
                    }));
                  }}
                  className="mt-4 text-xs"
                  size="sm"
                >
                  (Demo: Simulate Approval)
                </Button>
              </div>
            )}

          {/* Step 3: Worldcoin verification for approved registrations */}
          {enhancedCampaign.isRegistered &&
            enhancedCampaign.registrationStatus === "approved" &&
            !enhancedCampaign.worldcoinVerified && (
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <h3 className="font-medium text-green-800 mb-2">
                  Step 3: Identity Verification Required
                </h3>
                <p className="text-sm text-green-600 mb-4">
                  Your aid request has been approved! To prevent duplicate
                  claims and ensure fair distribution, please verify your
                  identity with Worldcoin before collecting supplies.
                </p>
                {/* Worldcoin Incognito Actions Verification */}
                <WorldcoinVerification
                  campaignId={campaignId}
                  onSuccess={() => {
                    console.log("Verification successful! Moving to Step 3...");
                    // 검증 성공 시 worldcoinVerified를 true로 설정하여 Step 3에서 Step 4로 넘어가도록 함
                    setEnhancedCampaign((prev) => ({
                      ...prev,
                      worldcoinVerified: true,
                    }));

                    // Step 3로 명시적으로 스크롤
                    setTimeout(() => {
                      const step4Element =
                        document.getElementById("step-4-claim-aid");
                      if (step4Element) {
                        step4Element.scrollIntoView({ behavior: "smooth" });
                      }
                    }, 500);
                  }}
                  onError={(error) => {
                    console.error("Worldcoin verification failed:", error);
                    // Optionally show an error message to the user
                  }}
                  className="w-full"
                />
              </div>
            )}

          {/* Step 4: Claim aid with QR code */}
          {enhancedCampaign.isRegistered &&
            enhancedCampaign.registrationStatus === "approved" &&
            enhancedCampaign.worldcoinVerified && (
              <div
                id="step-4-claim-aid"
                className="bg-green-50 p-4 rounded-lg mb-4"
              >
                <div className="flex items-center mb-2">
                  <svg
                    className="w-5 h-5 text-green-600 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h3 className="font-medium text-green-800">
                    Identity Verified!
                  </h3>
                </div>

                <p className="text-sm text-green-600 mb-4">
                  You are now eligible to receive aid supplies. Show the QR code
                  below at the distribution center.
                </p>

                <div className="bg-white p-4 rounded-lg mb-4 flex flex-col items-center">
                  {/* Mock QR code */}
                  <div className="w-48 h-48 bg-gray-100 border flex items-center justify-center mb-2">
                    <svg
                      className="w-40 h-40"
                      viewBox="0 0 100 100"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect x="10" y="10" width="30" height="30" fill="black" />
                      <rect x="60" y="10" width="30" height="30" fill="black" />
                      <rect x="10" y="60" width="30" height="30" fill="black" />
                      <rect x="50" y="50" width="10" height="10" fill="black" />
                      <rect x="70" y="50" width="10" height="10" fill="black" />
                      <rect x="50" y="70" width="10" height="10" fill="black" />
                      <rect x="70" y="70" width="10" height="10" fill="black" />
                      <rect x="90" y="70" width="10" height="10" fill="black" />
                      <rect x="70" y="90" width="10" height="10" fill="black" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-500">
                    Aid Claim Code: WC-
                    {Math.floor(Math.random() * 10000)
                      .toString()
                      .padStart(4, "0")}
                  </p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-green-200">
                  <h4 className="font-medium text-gray-800 text-sm mb-1">
                    Distribution Details:
                  </h4>
                  <p className="text-xs text-gray-600 mb-1">
                    Location: {campaign.location} Relief Center
                  </p>
                  <p className="text-xs text-gray-600 mb-1">
                    Available: Daily, 9:00 AM - 5:00 PM
                  </p>
                  <p className="text-xs text-gray-600">
                    Items: Food, Water, Medical Supplies, Shelter Kits
                  </p>
                </div>
              </div>
            )}
        </div>
      ) : (
        <>
          <div className="p-6 border-t mt-4">
            <h2 className="text-xl font-semibold mb-4">Make a Donation</h2>

            <div className="flex flex-col items-center gap-4">
              <p className="text-gray-700 mb-6">
                Your donation helps provide essential resources to those
                affected by this disaster. All donations are processed securely
                through blockchain technology for maximum transparency.
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
                  USDC is a stablecoin pegged to the US dollar, allowing for
                  secure and transparent donations. Your contribution will be
                  recorded on the blockchain and directly transferred to the
                  campaign.
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
              All donations are recorded on the blockchain for full
              transparency. You can track how funds are being used and verify
              the impact of your contribution.
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
        </>
      )}
    </div>
  );
};
