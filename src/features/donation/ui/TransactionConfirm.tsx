"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import { useDonation } from "../model/DonationContext";
import { MOCK_CAMPAIGNS } from "@/entities/campaign";
import { TokenType } from "../model/types";
import { Coins, MessageAlert } from "iconoir-react";

export const TransactionConfirm: React.FC = () => {
  const {
    donationState,
    goToStep,
    setPaymentMethod,
    setSelectedToken,
    processWorldAppPayment,
  } = useDonation();
  // World App만 결제 방법으로 사용
  const [paymentTab, setPaymentTab] = useState<"worldapp">("worldapp");
  const [selectedToken, setTokenSelection] = useState<TokenType>(
    donationState.selectedToken
  );
  const [isWorldAppAvailable, setIsWorldAppAvailable] = useState<
    boolean | null
  >(null);

  // Check if World App is available
  useEffect(() => {
    const checkWorldApp = async () => {
      try {
        const { MiniKit } = await import("@worldcoin/minikit-js");
        setIsWorldAppAvailable(MiniKit.isInstalled());
      } catch (error) {
        console.error("Failed to check World App availability:", error);
        setIsWorldAppAvailable(false);
      }
    };

    checkWorldApp();
  }, []);

  const campaign = MOCK_CAMPAIGNS.find(
    (c) => c.id === donationState.campaignId
  );

  if (!campaign) {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-center text-red-600 mb-4">
            Campaign Not Found
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            The campaign you&apos;re trying to donate to doesn&apos;t exist or
            has been removed.
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
  // const estimatedGasFee = 0.002;

  const handleConfirm = () => {
    // Update context with selected payment method and token
    setPaymentMethod("worldapp");
    setSelectedToken(selectedToken);

    // Process payment through World App
    processWorldAppPayment();
  };

  const handleBack = () => {
    goToStep("amount");
  };

  // // World App만 결제 방법으로 사용하미로 핸들러는 고정 값만 처리
  // const handlePaymentMethodChange = (value: "worldapp") => {
  //   setPaymentTab(value);
  //   setPaymentMethod(value);
  // };

  const handleTokenChange = (token: TokenType) => {
    setTokenSelection(token);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <h2 className="text-xl font-semibold text-center">
          Confirm Transaction
        </h2>
      </div>

      <div className="p-6">
        {/* Error message display */}
        {donationState.error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <MessageAlert className="text-red-500 mr-2" />
              <p className="text-sm text-red-700">{donationState.error}</p>
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="mb-4">
            <span className="block text-sm text-gray-600 mb-1">Amount:</span>
            <span className="block text-lg font-semibold">
              {donationState.amount} {selectedToken}
            </span>
          </div>

          <div className="mb-4">
            <span className="block text-sm text-gray-600 mb-1">Recipient:</span>
            <span className="block font-medium">{campaign.name}</span>
            <span className="block text-sm text-gray-500 truncate">
              {campaign.organizer}
            </span>
          </div>
        </div>

        {/* Payment Method - World App Only */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Payment Method
          </h3>
          <div className="flex items-center p-3 border rounded-lg bg-gray-50 border-black">
            <div className="flex items-center justify-center w-5 h-5 mr-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="font-medium">World App</span>
          </div>

          {/* World App availability warning */}
          {paymentTab === "worldapp" && isWorldAppAvailable === false && (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
              World App is not detected. Please open this app in World App to
              use this payment method.
            </div>
          )}
        </div>

        {/* World App specific token selection */}
        {paymentTab === "worldapp" && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Select Token
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => handleTokenChange("USDC")}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedToken === "USDC"
                    ? "border-black bg-gray-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="w-6 h-6 mr-2">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="12" r="12" fill="#2775CA" />
                    <path
                      d="M15.6 12C15.6 10.01 14.09 8.4 12.1 8.4C10.11 8.4 8.6 10.01 8.6 12C8.6 13.99 10.11 15.6 12.1 15.6C14.09 15.6 15.6 13.99 15.6 12Z"
                      fill="white"
                    />
                    <path
                      d="M7.8 9.75V14.25L12 16.5L16.2 14.25V9.75L12 7.5L7.8 9.75Z"
                      stroke="white"
                      strokeWidth="0.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="font-medium">USDC</span>
              </div>
              <div
                onClick={() => handleTokenChange("WLD")}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedToken === "WLD"
                    ? "border-black bg-gray-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="w-6 h-6 mr-2">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="12" r="12" fill="#000000" />
                    <path d="M12 6L7 12L12 18L17 12L12 6Z" fill="white" />
                  </svg>
                </div>
                <span className="font-medium">WLD</span>
              </div>
            </div>
          </div>
        )}

        {/* Standard payment method details removed */}

        {/* World App payment method details */}
        {paymentTab === "worldapp" && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center mb-2">
              <Coins className="mr-2 text-gray-600" />
              <span className="text-sm font-medium">World App Benefits</span>
            </div>
            <ul className="text-xs text-gray-600 space-y-1 pl-6 list-disc">
              <li>No gas fees for transactions</li>
              <li>Fast and secure payments</li>
              <li>Verified by World ID</li>
            </ul>
          </div>
        )}

        <div className="flex flex-col space-y-3 mt-6">
          <Button
            onClick={handleConfirm}
            className="w-full py-3"
            aria-label="Confirm transaction"
            size="lg"
            variant="primary"
            disabled={
              paymentTab === "worldapp" && isWorldAppAvailable === false
            }
          >
            {paymentTab === "worldapp" ? "Pay with World App" : "Confirm"}
          </Button>

          <Button
            onClick={handleBack}
            className="w-full py-3"
            aria-label="Go back"
            size="lg"
            variant="secondary"
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};
