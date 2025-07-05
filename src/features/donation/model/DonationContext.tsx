"use client";

import React, { createContext, useContext, useState } from "react";
import { DonationState, DonationStep, PaymentMethod, TokenType } from "./types";
import { useRouter } from "next/navigation";

interface DonationContextType {
  donationState: DonationState;
  setAmount: (amount: number) => void;
  setWalletAddress: (address: string) => void;
  setTransactionId: (id: string) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setSelectedToken: (token: TokenType) => void;
  setPaymentReference: (reference: string) => void;
  goToStep: (step: DonationStep) => void;
  resetDonation: () => void;
  processWorldAppPayment: () => Promise<void>;
}

const DonationContext = createContext<DonationContextType | undefined>(
  undefined
);

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
    paymentMethod: "standard",
    selectedToken: "USDC",
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

  const setPaymentMethod = (paymentMethod: PaymentMethod) => {
    setDonationState((prev) => ({ ...prev, paymentMethod }));
  };

  const setSelectedToken = (selectedToken: TokenType) => {
    setDonationState((prev) => ({ ...prev, selectedToken }));
  };

  const setPaymentReference = (paymentReference: string) => {
    setDonationState((prev) => ({ ...prev, paymentReference }));
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
      paymentMethod: "standard",
      selectedToken: "USDC",
    });
    router.push(`/explore/${disasterId}/${campaignId}/donate`);
  };

  // Process World App payment using MiniKit
  const processWorldAppPayment = async () => {
    try {
      console.log("Starting World App payment process");

      // Import MiniKit dynamically (client-side only)
      const { MiniKit, tokenToDecimals, Tokens } = await import(
        "@worldcoin/minikit-js"
      );

      // Check if MiniKit is installed (running in World App)
      if (!MiniKit.isInstalled()) {
        console.error("World App is not installed");
        setDonationState((prev) => ({
          ...prev,
          step: "confirm",
          error:
            "World App is not installed. Please open this app in World App to continue.",
        }));
        router.push(`/explore/${disasterId}/${campaignId}/donate/confirm`);
        return;
      }

      // Set to processing state
      setDonationState((prev) => ({
        ...prev,
        step: "processing",
        error: undefined,
      }));
      router.push(`/explore/${disasterId}/${campaignId}/donate/processing`);

      // Initiate payment by calling our API to get a reference ID
      console.log("Initiating payment with API");
      const response = await fetch("/api/initiate-payment", {
        method: "POST",
      });

      const data = await response.json();
      console.log("Initiate payment response:", data);

      if (!data.success) {
        throw new Error(data.error || "Failed to initiate payment");
      }

      // Store the payment reference (using 'id' as per pay.md example)
      const reference = data.id;
      setPaymentReference(reference);

      // Get the recipient address from the campaign (in a real app, this would come from your backend)
      // For now, using a test address
      const recipientAddress = "0x4072ca2A7DFa6C1865aA6165ddA3e2a4dcad1D8F";

      // Prepare the payment payload
      const tokenSymbol =
        donationState.selectedToken === "WLD" ? Tokens.WLD : Tokens.USDC;
      
      // 중요: reference 키를 올바르게 설정
      const payload = {
        reference: reference, // data.reference 대신 reference 변수 사용
        to: recipientAddress,
        tokens: [
          {
            symbol: tokenSymbol,
            token_amount: tokenToDecimals(
              donationState.amount,
              tokenSymbol
            ).toString(),
          },
        ],
        description: `Donation to campaign ${campaignId} for disaster relief`,
      };

      console.log("Sending payment command to World App", payload);

      // Send the payment command to World App
      const { finalPayload } = await MiniKit.commandsAsync.pay(payload);
      console.log("Payment command response:", finalPayload);

      if (finalPayload.status === "success") {
        // Verify the payment with our backend
        console.log("Verifying payment with backend");
        const verifyResponse = await fetch("/api/confirm-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payload: finalPayload,
            reference: reference, // data.reference 대신 reference 변수 사용
            campaignId,
            amount: donationState.amount,
            token: donationState.selectedToken,
          }),
        });

        const verifyData = await verifyResponse.json();
        console.log("Payment verification response:", verifyData);

        if (verifyData.success) {
          // Payment successful
          setTransactionId(finalPayload.transaction_id);
          goToStep("success");
        } else {
          throw new Error(verifyData.error || "Payment verification failed");
        }
      } else {
        // Handle payment error - status will be 'failed' or 'canceled'
        console.error("Payment failed or was canceled", finalPayload);
        throw new Error("Payment failed or was canceled by user");
      }
    } catch (error) {
      console.error("World App payment error:", error);
      // Handle error - return to confirm page with error message
      setDonationState((prev) => ({
        ...prev,
        step: "confirm",
        error: error instanceof Error ? error.message : "Unknown payment error",
      }));
      router.push(`/explore/${disasterId}/${campaignId}/donate/confirm`);
    }
  };

  return (
    <DonationContext.Provider
      value={{
        donationState,
        setAmount,
        setWalletAddress,
        setTransactionId,
        setPaymentMethod,
        setSelectedToken,
        setPaymentReference,
        goToStep,
        resetDonation,
        processWorldAppPayment,
      }}
    >
      {children}
    </DonationContext.Provider>
  );
};

export const useDonation = () => {
  const context = useContext(DonationContext);
  if (!context) {
    throw new Error("useDonation must be used within a DonationProvider");
  }
  return context;
};
