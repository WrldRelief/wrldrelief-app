"use client";

import { TransactionSuccess } from "@/features/donation/ui/TransactionSuccess";
import { DonationLayout } from "@/features/donation/ui/DonationLayout";
import { useDonation } from "@/features/donation/model/DonationContext";
import { useCampaign } from "@/entities/contracts/hooks";
import { Spinner } from "@worldcoin/mini-apps-ui-kit-react";

const SuccessPage = () => {
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
        <p className="text-gray-500 mb-4">The donation was successful, but campaign details couldn&apos;t be loaded.</p>
        <p className="text-sm text-gray-400">You can view your donation history in your profile.</p>
      </div>
    );
  }

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
