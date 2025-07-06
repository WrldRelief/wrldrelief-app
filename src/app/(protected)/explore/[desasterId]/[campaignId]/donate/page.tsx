"use client";

import { DonationAmountSelector } from "@/features/donation/ui/DonationAmountSelector";
import { DonationLayout } from "@/features/donation/ui/DonationLayout";
import { useDonation } from "@/features/donation/model/DonationContext";
import { useRouter } from "next/navigation";
import { useCampaign } from "@/entities/contracts/hooks";
import { Spinner } from "@worldcoin/mini-apps-ui-kit-react";

const DonatePage = () => {
  const { donationState } = useDonation();
  const router = useRouter();
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
        <button 
          onClick={() => router.push(`/explore/${donationState.disasterId}`)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Return to Disaster Page
        </button>
      </div>
    );
  }

  const handleBack = () => {
    router.push(
      `/explore/${donationState.disasterId}/${donationState.campaignId}`
    );
  };

  return (
    <DonationLayout
      title="Select Amount"
      step={1}
      totalSteps={3}
      onBack={handleBack}
      campaignName={campaign.name}
    >
      <DonationAmountSelector />
    </DonationLayout>
  );
};

export default DonatePage;
