"use client";

import { Page } from "@/features/PageLayout";
import { CampaignDetail } from "@/widgets/CampaignDetail";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import { useParams, useRouter } from "next/navigation";
import { UserRoleProvider } from "@/context/UserRoleContext";
import { useEffect, useState } from "react";

const CampaignDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Get campaign ID and disaster ID from URL params
  const campaignId = parseInt(params.campaignId as string, 10);
  const disasterId = params.desasterId as string;

  // Find the campaign by ID
  // const campaign = MOCK_CAMPAIGNS.find((c) => c.id === campaignId);

  // Get campaign name for the title
  // const campaignName = campaign ? campaign.name : "Campaign Details";

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    // Navigate back to the disaster detail page
    router.push(`/explore/${disasterId}`);
  };

  return (
    <UserRoleProvider>
      <Page.Header>
        <Button
          onClick={handleBack}
          aria-label="Go back"
          size="icon"
          variant="secondary"
        >
          ←
        </Button>
      </Page.Header>
      <Page.Main className="flex flex-col items-center justify-start mb-16 px-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-64 w-full">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-200 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <CampaignDetail campaignId={campaignId} />
        )}
      </Page.Main>
    </UserRoleProvider>
  );
};

export default CampaignDetailPage;
