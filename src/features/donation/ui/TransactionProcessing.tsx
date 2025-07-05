"use client";

import React, { useEffect } from "react";
import { Spinner } from "@worldcoin/mini-apps-ui-kit-react";
import { useDonation } from "../model/DonationContext";

export const TransactionProcessing: React.FC = () => {
  const { donationState, setTransactionId, goToStep } = useDonation();

  // 자동 타이머 제거 - 실제 결제 처리는 DonationContext의 processWorldAppPayment 함수에서 처리함
  // 이 화면은 단순히 결제 처리 중임을 표시하는 화면으로만 사용

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
