"use client";

import { TransactionProcessing } from "@/features/donation/ui/TransactionProcessing";
import { DonationLayout } from "@/features/donation/ui/DonationLayout";
import { useDonation } from "@/features/donation/model/DonationContext";
import { useCampaign } from "@/entities/contracts/hooks";
import { Spinner } from "@worldcoin/mini-apps-ui-kit-react";

const ProcessingPage = () => {
  const { donationState } = useDonation();
  const { campaign, loading, error } = useCampaign(donationState.campaignId);
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  // Show error state
  if (error || !campaign) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
        <h2 className="text-xl font-bold mb-2">Campaign Not Found</h2>
        <p className="text-gray-500 mb-4">The campaign you&apos;re looking for doesn&apos;t exist or couldn&apos;t be loaded.</p>
        <p className="text-sm text-gray-400">Please try again later.</p>
      </div>
    );
  }

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
