"use client";

import { DonationAmountSelector } from "@/features/donation/ui/DonationAmountSelector";
import { DonationLayout } from "@/features/donation/ui/DonationLayout";
import { useDonation } from "@/features/donation/model/DonationContext";
import { useRouter } from "next/navigation";
import { MOCK_CAMPAIGNS } from "@/entities/campaign";

const DonatePage = () => {
  const { donationState } = useDonation();
  const router = useRouter();
  const campaign = MOCK_CAMPAIGNS.find(
    (c) => c.id === donationState.campaignId
  );

  if (!campaign) return null;

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
