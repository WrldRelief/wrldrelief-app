"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MOCK_CAMPAIGNS } from "@/entities/campaign";
import Image from "next/image";
import { useUserRole } from "@/context/UserRoleContext";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";

export const RoleBasedThankYou = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userRole } = useUserRole();

  // Get campaign ID, donation amount and transaction ID from URL params
  const campaignId = searchParams.get("campaignId");
  const amount = searchParams.get("amount")
    ? parseFloat(searchParams.get("amount")!)
    : 0;
  const txId = searchParams.get("txId") || "";

  // State for confetti animation
  const [showConfetti, setShowConfetti] = useState(true);

  // Find campaign details
  const campaign = MOCK_CAMPAIGNS.find((c) => c.id.toString() === campaignId);

  // Hide confetti after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // If campaign not found
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
        >
          Return to Explore
        </button>
      </div>
    );
  }

  // Role-specific content
  const renderRoleSpecificContent = () => {
    if (userRole === "organization") {
      return (
        <div className="p-4 bg-blue-50 rounded-lg mb-6">
          <h3 className="font-medium text-blue-800 mb-2">
            Organization Dashboard
          </h3>
          <p className="text-sm text-blue-700 mb-4">
            As an organization, you can track all donations and manage aid
            distribution.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={() =>
                router.push(`/organization/campaigns/${campaignId}/analytics`)
              }
            >
              View Analytics
            </button>
            <button
              className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={() =>
                router.push(`/organization/campaigns/${campaignId}/manage`)
              }
            >
              Manage Campaign
            </button>
          </div>
        </div>
      );
    }

    if (userRole === "recipient") {
      return (
        <div className="p-4 bg-green-50 rounded-lg mb-6">
          <h3 className="font-medium text-green-800 mb-2">
            Aid Recipient Information
          </h3>
          <p className="text-sm text-green-700 mb-4">
            This donation will help provide aid to affected areas. As a
            recipient, you can track aid distribution.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              onClick={() => router.push(`/recipient/aid-status/${campaignId}`)}
            >
              Check Aid Status
            </button>
            <button
              className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              onClick={() => router.push(`/recipient/register-needs`)}
            >
              Register Needs
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="p-4 bg-amber-50 rounded-lg mb-6">
        <h3 className="font-medium text-amber-800 mb-2">Donor Impact</h3>
        <p className="text-sm text-amber-700 mb-4">
          Your donation will help provide essential aid to those affected by
          this disaster. Thank you for your generosity!
        </p>
        {/* <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="tertiary"
            onClick={() => router.push(`/explore/campaign/${campaignId}`)}
          >
            Track Impact
          </Button>
          <Button
            size="sm"
            variant="tertiary"
            onClick={() => router.push("/explore")}
          >
            Explore More Campaigns
          </Button>
        </div> */}
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden relative">
      {/* Confetti animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden -mt-10">
          <div className="confetti-container">
            {Array.from({ length: 50 }).map((_, i) => {
              const size = Math.random() * 10 + 5;
              const left = Math.random() * 100;
              const animationDuration = Math.random() * 3 + 2;
              const delay = Math.random() * 2;
              const color = [
                "#FFC700",
                "#FF0000",
                "#2E3191",
                "#41C0F0",
                "#FF8300",
                "#9253A1",
                "#3B8C3B",
                "#F06292",
              ][Math.floor(Math.random() * 8)];

              return (
                <div
                  key={i}
                  className="absolute animate-fall"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${left}%`,
                    backgroundColor: color,
                    animationDuration: `${animationDuration}s`,
                    animationDelay: `${delay}s`,
                    transform: `rotate(${Math.random() * 360}deg)`,
                    top: `-${size}px`,
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Thank you message */}
      <div className="p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-green-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Donation Successful!
        </h2>
        <p className="text-gray-600 mb-4">
          Your donation of <span className="font-semibold">{amount}</span> to{" "}
          <span className="font-semibold">{campaign.name}</span> has been
          processed successfully.
        </p>
      </div>

      {/* Role-specific content */}
      {renderRoleSpecificContent()}

      {/* Transaction details */}
      <div className="p-4 border-t border-b">
        <h3 className="font-medium mb-3">Transaction Details</h3>
        <div className="bg-gray-50 p-3 rounded-md text-sm">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Transaction ID:</span>
            <span className="font-mono text-gray-800 truncate max-w-[200px]">
              {txId.substring(0, 10)}...{txId.substring(txId.length - 10)}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Date:</span>
            <span className="text-gray-800">
              {new Date().toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="text-green-600 font-medium">Confirmed</span>
          </div>
        </div>
      </div>

      {/* Campaign info */}
      <div className="p-4 border-b">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-md overflow-hidden mr-4 flex-shrink-0">
            <Image
              src={campaign.imageUrl || "/images/default.jpg"}
              alt={campaign.name}
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
            <p className="text-sm text-gray-600">
              Organized by {campaign.organizer}
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="p-4 flex space-x-4">
        <Button
          variant="tertiary"
          fullWidth
          onClick={() => router.push(`/explore/campaign/${campaignId}`)}
        >
          View Campaign
        </Button>
        <Button
          variant="primary"
          fullWidth
          onClick={() => router.push("/explore")}
        >
          Explore More
        </Button>
      </div>
    </div>
  );
};

export default RoleBasedThankYou;
