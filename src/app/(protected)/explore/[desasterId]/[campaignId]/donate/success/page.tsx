"use client";

import { TransactionSuccess } from "@/features/donation/ui/TransactionSuccess";
import { DonationLayout } from "@/features/donation/ui/DonationLayout";
import { useDonation } from "@/features/donation/model/DonationContext";
import { MOCK_CAMPAIGNS } from "@/entities/campaign";

const SuccessPage = () => {
  const { donationState } = useDonation();
  const campaign = MOCK_CAMPAIGNS.find((c) => c.id === donationState.campaignId);
  
  if (!campaign) return null;

  // No back button on success page
  const handleBack = () => {
    // No-op - success is the final state
  };

  return (
    <DonationLayout 
      title="Donation Successful"
      step={3}
      totalSteps={3}
      onBack={handleBack}
      campaignName={campaign.name}
    >
      <TransactionSuccess />
    </DonationLayout>
  );
};

export default SuccessPage;
