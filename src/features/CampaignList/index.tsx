"use client";

import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import { useRouter } from "next/navigation";
import React from "react";
import { CampaignData } from "@/entities/campaign";

interface CampaignListProps {
  campaigns: CampaignData[];
}

const CampaignList: React.FC<CampaignListProps> = (campaigns) => {
  const router = useRouter();

  if (!campaigns) {
    return <div>No campaigns available</div>;
  }

  return (
    <div>
      <Button onClick={() => router.push("/explore/1/1")}>campaign</Button>
    </div>
  );
};

export default CampaignList;
