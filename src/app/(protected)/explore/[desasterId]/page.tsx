"use client";

import { DisasterLocationExtended } from "@/entities/disaster/types";
import { Page } from "@/features/PageLayout";
import { RegionDetail } from "@/widgets/RegionDetail";
import { Button, Spinner } from "@worldcoin/mini-apps-ui-kit-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useDisasterData } from "@/entities/disaster/disasterData";
import { useState, useEffect } from "react";

const DisasterDetail = () => {
  const router = useRouter();
  // Get disaster ID from URL params
  const params = useParams();
  const disasterId = params.desasterId as string;
  
  const { data: disasters, isLoading: loading, isError: error } = useDisasterData();
  const [disaster, setDisaster] = useState<DisasterLocationExtended | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Find the disaster by ID from on-chain data
  useEffect(() => {
    if (disasters && disasters.length > 0) {
      const foundDisaster = disasters.find(d => d.id === disasterId);
      if (foundDisaster) {
        // foundDisaster is already extended, no need to call extendDisasterData again
        setDisaster(foundDisaster);
      } else {
        setNotFound(true);
      }
    }
  }, [disasters, disasterId]);

  // Handle loading and error states
  if (loading) {
    return (
      <Page.Main className="flex flex-col items-center justify-center h-full">
        <Spinner />
        <p className="mt-4 text-gray-600">Loading disaster details...</p>
      </Page.Main>
    );
  }

  if (error || notFound || !disaster) {
    return (
      <>
        <Page.Header>
          <Button
            onClick={() => router.back()}
            aria-label="Go back"
            size="icon"
            variant="secondary"
          >
            ←
          </Button>
        </Page.Header>
        <Page.Main className="flex flex-col items-center justify-center h-full">
          <h2 className="text-xl font-bold mb-2">Disaster Not Found</h2>
          <p className="text-gray-500 mb-4">There aren&apos;t any active campaigns for this disaster yet. If you&apos;re an organization, you can create a campaign to help those affected by this disaster.</p>
          <Button onClick={() => router.push('/explore')} variant="primary">
            Return to Explore
          </Button>
        </Page.Main>
      </>
    );
  }

  return (
    <>
      <Page.Header>
        <Button
          onClick={() => router.back()}
          aria-label="Go back"
          size="icon"
          variant="secondary"
        >
          ←
        </Button>
      </Page.Header>
      <Page.Main className="flex flex-col items-center justify-start mb-16">
        <RegionDetail region={disaster} />
      </Page.Main>
    </>
  );
};

export default DisasterDetail;
