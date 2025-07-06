"use client";

import React from "react";
import { DonationProvider } from "@/features/donation/model/DonationContext";
import { useParams } from "next/navigation";
import { useCampaign } from "@/entities/contracts";
import { Spinner } from "@worldcoin/mini-apps-ui-kit-react";

export default function DonationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const campaignId = parseInt(params.campaignId as string, 10);
  const disasterId = params.desasterId as string;

  // We don't need to check for campaign existence here anymore
  // The individual pages will handle loading/error states using the useCampaign hook
  // This prevents duplicate API calls and ensures consistent error handling
  
  return (
    <DonationProvider campaignId={campaignId} disasterId={disasterId}>
      {children}
    </DonationProvider>
  );
}
