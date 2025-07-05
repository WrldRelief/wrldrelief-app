"use client";

import React, { useState } from "react";
import { Button, Input } from "@worldcoin/mini-apps-ui-kit-react";
import { useDonation } from "../model/DonationContext";

export const DonationAmountSelector: React.FC = () => {
  const { donationState, setAmount, setWalletAddress, goToStep } =
    useDonation();
  const [customAmount, setCustomAmount] = useState<string>("");

  const handleDonationAmountSelect = (amount: number) => {
    setAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimals
    if (/^\d*\.?\d*$/.test(value)) {
      setCustomAmount(value);
      if (value) {
        setAmount(parseFloat(value));
      }
    }
  };

  const handleContinue = () => {
    if (donationState.amount > 0) {
      // Since Worldcoin mini-app already has wallet connected, go directly to confirm step
      // Set a default wallet address for the connected user
      setWalletAddress("0x71C7656EC7ab88b098defB751B7401B5f6d8976F");
      goToStep("confirm");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-blue-50 border-b">
        <h2 className="text-xl font-semibold text-center">
          Select Donation Amount
        </h2>
      </div>

      <div className="p-6">
        <div className="mb-6">
          {/* Donation amount selection */}
          <div className="flex flex-row gap-3 mb-4">
            <Button
              variant={donationState.amount === 10 ? "primary" : "secondary"}
              onClick={() => handleDonationAmountSelect(10)}
              className="flex-1 py-3"
              aria-label="Donate 10 USDC"
            >
              10 USDC
            </Button>
            <Button
              variant={donationState.amount === 50 ? "primary" : "secondary"}
              onClick={() => handleDonationAmountSelect(50)}
              className="flex-1 py-3"
              aria-label="Donate 50 USDC"
            >
              50 USDC
            </Button>
            <Button
              variant={donationState.amount === 100 ? "primary" : "secondary"}
              onClick={() => handleDonationAmountSelect(100)}
              className="flex-1 py-3"
              aria-label="Donate 100 USDC"
            >
              100 USDC
            </Button>
          </div>

          {/* Custom amount input */}
          <div className="mt-4 mb-6">
            <Input
              variant="default"
              className="bg-white"
              label="Enter custom amount..."
              value={customAmount}
              onChange={handleCustomAmountChange}
              aria-label="Custom donation amount"
            />
          </div>
        </div>

        {/* Info section */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
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
            <h3 className="font-medium text-gray-700">About USDC Donations</h3>
          </div>
          <p className="text-sm text-gray-600">
            USDC is a stablecoin pegged to the US dollar, allowing for secure
            and transparent donations. Your contribution will be recorded on the
            blockchain and directly transferred to the campaign.
          </p>
        </div>

        <Button
          className="w-full py-3"
          onClick={handleContinue}
          disabled={!donationState.amount || donationState.amount <= 0}
          size="lg"
          aria-label="Continue to wallet connection"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
