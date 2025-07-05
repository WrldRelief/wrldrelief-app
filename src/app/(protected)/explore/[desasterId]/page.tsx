"use client";

import { MOCK_DISASTER_LOCATIONS } from "@/entities/disaster";
import { Page } from "@/features/PageLayout";
import { RegionDetail } from "@/widgets/RegionDetail";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

const DisasterDetail = () => {
  const router = useRouter();
  // Get disaster ID from URL params
  const params = useParams();
  const disasterId = parseInt(params.desasterId as string, 10) || 0;

  // Find the disaster by ID
  const disaster =
    MOCK_DISASTER_LOCATIONS.find(
      (d) => d.id.toString() === disasterId.toString()
    ) || MOCK_DISASTER_LOCATIONS[0];

  // Get disaster name for the title
  const disasterName = disaster ? disaster.name : "Disaster Details";

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
