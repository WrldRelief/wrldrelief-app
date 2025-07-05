"use client";

import React, { useEffect } from "react";
import { Spinner } from "@worldcoin/mini-apps-ui-kit-react";
import { useDonation } from "../model/DonationContext";

export const TransactionProcessing: React.FC = () => {
  const { donationState, setTransactionId, goToStep } = useDonation();

  useEffect(() => {
    // Simulate transaction processing
    const timer = setTimeout(() => {
      // Generate a mock transaction ID
      const mockTransactionId =
        "0x" + Math.random().toString(16).substring(2, 62);
      setTransactionId(mockTransactionId);
      goToStep("success");
    }, 3000);

    return () => clearTimeout(timer);
  }, [goToStep, setTransactionId]);

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col items-center justify-center py-10">
          <Spinner className="mb-4 h-16 w-16" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Processing Your Donation
          </h3>
          <p className="text-gray-600 text-center">
            Please wait while your transaction of {donationState.amount} USDC is
            being processed on the blockchain. This may take a moment.
          </p>
        </div>
      </div>
    </div>
  );
};
