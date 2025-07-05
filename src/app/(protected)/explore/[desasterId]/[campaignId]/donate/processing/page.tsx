"use client";

import { TransactionProcessing } from "@/features/donation/ui/TransactionProcessing";
import { DonationLayout } from "@/features/donation/ui/DonationLayout";
import { useDonation } from "@/features/donation/model/DonationContext";
import { MOCK_CAMPAIGNS } from "@/entities/campaign";

const ProcessingPage = () => {
  const { donationState } = useDonation();
  const campaign = MOCK_CAMPAIGNS.find((c) => c.id === donationState.campaignId);
  
  if (!campaign) return null;

  // No back button during processing
  const handleBack = () => {
    // No-op - we don't want users to go back during processing
  };

  return (
    <DonationLayout 
      title="Processing"
      step={3}
      totalSteps={3}
      onBack={handleBack}
      campaignName={campaign.name}
    >
      <TransactionProcessing />
    </DonationLayout>
  );
};

export default ProcessingPage;
