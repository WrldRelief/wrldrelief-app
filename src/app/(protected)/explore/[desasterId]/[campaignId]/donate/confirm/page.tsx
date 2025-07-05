"use client";

import { TransactionConfirm } from "@/features/donation/ui/TransactionConfirm";
import { DonationLayout } from "@/features/donation/ui/DonationLayout";
import { useDonation } from "@/features/donation/model/DonationContext";
import { MOCK_CAMPAIGNS } from "@/entities/campaign";

const ConfirmPage = () => {
  const { donationState, goToStep } = useDonation();
  const campaign = MOCK_CAMPAIGNS.find((c) => c.id === donationState.campaignId);
  
  if (!campaign) return null;
  
  const handleBack = () => {
    goToStep("amount");
  };

  return (
    <DonationLayout 
      title="Confirm Transaction"
      step={2}
      totalSteps={3}
      onBack={handleBack}
      campaignName={campaign.name}
    >
      <TransactionConfirm />
    </DonationLayout>
  );
};

export default ConfirmPage;
