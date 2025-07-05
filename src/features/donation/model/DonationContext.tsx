"use client";

import React, { createContext, useContext, useState } from "react";
import { DonationState, DonationStep } from "./types";
import { useRouter } from "next/navigation";

interface DonationContextType {
  donationState: DonationState;
  setAmount: (amount: number) => void;
  setWalletAddress: (address: string) => void;
  setTransactionId: (id: string) => void;
  goToStep: (step: DonationStep) => void;
  resetDonation: () => void;
}

const DonationContext = createContext<DonationContextType | undefined>(undefined);

export const DonationProvider: React.FC<{
  children: React.ReactNode;
  campaignId: number;
  disasterId: string;
}> = ({ children, campaignId, disasterId }) => {
  const router = useRouter();
  const [donationState, setDonationState] = useState<DonationState>({
    campaignId,
    disasterId,
    amount: 10,
    walletAddress: "",
    step: "amount",
  });

  const setAmount = (amount: number) => {
    setDonationState((prev) => ({ ...prev, amount }));
  };

  const setWalletAddress = (walletAddress: string) => {
    setDonationState((prev) => ({ ...prev, walletAddress }));
  };

  const setTransactionId = (transactionId: string) => {
    setDonationState((prev) => ({ ...prev, transactionId }));
  };

  const goToStep = (step: DonationStep) => {
    setDonationState((prev) => ({ ...prev, step }));
    
    // Navigate to the appropriate page based on the step
    switch (step) {
      case "amount":
        router.push(`/explore/${disasterId}/${campaignId}/donate`);
        break;
      case "confirm":
        router.push(`/explore/${disasterId}/${campaignId}/donate/confirm`);
        break;
      case "processing":
        router.push(`/explore/${disasterId}/${campaignId}/donate/processing`);
        break;
      case "success":
        router.push(`/explore/${disasterId}/${campaignId}/donate/success`);
        break;
    }
  };

  const resetDonation = () => {
    setDonationState({
      campaignId,
      disasterId,
      amount: 10,
      walletAddress: "",
      step: "amount",
    });
    router.push(`/explore/${disasterId}/${campaignId}/donate`);
  };

  return (
    <DonationContext.Provider
      value={{
        donationState,
        setAmount,
        setWalletAddress,
        setTransactionId,
        goToStep,
        resetDonation,
      }}
    >
      {children}
    </DonationContext.Provider>
  );
};

export const useDonation = () => {
  const context = useContext(DonationContext);
  if (context === undefined) {
    throw new Error("useDonation must be used within a DonationProvider");
  }
  return context;
};
