"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button, CircularIcon } from "@worldcoin/mini-apps-ui-kit-react";
import { useUserRole } from "@/context/UserRoleContext";
import { useUserModel } from "@/features/user/model";
import { MOCK_CAMPAIGNS } from "@/entities/campaign";
import { Wallet } from "iconoir-react";

export const RoleBasedWalletConfirm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userRole } = useUserRole();
  const { user } = useUserModel();

  // Get campaign ID and donation amount from URL params
  const campaignId = searchParams.get("campaignId");
  const amount = searchParams.get("amount")
    ? parseFloat(searchParams.get("amount")!)
    : 0;

  // State for transaction processing - 단순화됨
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState<string>("");

  // Find campaign details
  const campaign = MOCK_CAMPAIGNS.find((c) => c.id.toString() === campaignId);

  // Generate a random transaction ID
  useEffect(() => {
    const generateTransactionId = () => {
      const chars = "0123456789abcdef";
      let id = "0x";
      for (let i = 0; i < 64; i++) {
        id += chars[Math.floor(Math.random() * chars.length)];
      }
      return id;
    };

    setTransactionId(generateTransactionId());
  }, []);

  // Handle cancel donation
  const handleCancel = () => {
    router.back();
  };

  // Handle confirm donation - 단순화된 액션 버튼 처리
  const handleConfirm = () => {
    setIsProcessing(true);

    // 이미 지갑이 연결된 상태로 가정하고 바로 트랜잭션 처리
    setTimeout(() => {
      // 성공 페이지로 이동
      router.push(
        `/explore/donate/thank-you?campaignId=${campaignId}&amount=${amount}&txId=${transactionId}`
      );
    }, 1500);
  };

  // If campaign not found
  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Campaign Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          The campaign you&apos;re trying to donate to doesn&apos;t exist or has
          been removed.
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
          <h3 className="font-medium text-blue-800 mb-2">Organization View</h3>
          <p className="text-sm text-blue-700 mb-4">
            You&apos;re viewing this as an organization. In a real application,
            organizations would have a different interface for managing
            donations.
          </p>
          <div className="flex space-x-2">
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
          <h3 className="font-medium text-green-800 mb-2">Recipient View</h3>
          <p className="text-sm text-green-700 mb-4">
            You&apos;re viewing this as an aid recipient. In a real application,
            recipients would see information about how donations are being used.
          </p>
          <div className="flex space-x-2">
            <button
              className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              onClick={() => router.push(`/recipient/aid-status/${campaignId}`)}
            >
              View Aid Status
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div className="flex flex-col w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Role-specific content */}
        {renderRoleSpecificContent()}

        {/* Campaign info */}
        <div className="p-4 border-b">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 rounded-md overflow-hidden mr-4 flex-shrink-0">
              <Image
                src={campaign.imageUrl || "/images/default.jpg"}
                alt={campaign.name}
                width={64}
                height={64}
                className="object-cover"
              />
            </div>

            <div>
              <h2 className="font-semibold text-gray-900">{campaign.name}</h2>
              <p className="text-sm text-gray-600">
                Organized by {campaign.organizer}
              </p>
            </div>
          </div>
        </div>

        {/* Transaction details */}
        <div className="p-4 border-b">
          <h2 className="font-semibold mb-3">Transaction Details</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Amount</span>
              <span className="font-medium">{amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Network Fee</span>
              <span className="font-medium">0.001</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-gray-600">Total</span>
              <span className="font-bold">{amount + 0.001}</span>
            </div>
          </div>
        </div>

        {/* Wallet info */}
        <div className="p-4 border-b">
          <h2 className="font-semibold mb-3">Wallet Information</h2>
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CircularIcon className="bg-blue-50" size="sm">
                  <Wallet className="w-6 h-6" />
                </CircularIcon>
                <div>
                  <p className="font-medium">Connected Wallet</p>
                  <p className="text-sm text-gray-600 truncate w-48">
                    {user?.address ||
                      "0x7F5EB5bB5cF88cfcEe9613368636f458800e62CB"}
                  </p>
                </div>
              </div>
              <div className="text-green-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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
            </div>
          </div>
        </div>

        {/* 간소화된 처리 오버레이 */}
        {isProcessing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-sm w-full">
              <div className="flex flex-col items-center">
                <div className="mb-4">
                  <svg
                    className="animate-spin h-10 w-10 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Processing...
                </h3>
                <p className="text-center text-gray-600 mb-4">
                  Your donation is being processed...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="p-4 flex space-x-4">
          <Button
            variant="secondary"
            fullWidth
            onClick={handleCancel}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={handleConfirm}
            disabled={isProcessing}
          >
            Confirm
          </Button>
        </div>
      </div>
    </>
  );
};

export default RoleBasedWalletConfirm;
