"use client";

import React from "react";
import { DonationProvider } from "@/features/donation/model/DonationContext";
import { useParams } from "next/navigation";
import { MOCK_CAMPAIGNS } from "@/entities/campaign";

export default function DonationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const campaignId = parseInt(params.campaignId as string, 10);
  const disasterId = params.desasterId as string;

  // Find campaign for title
  const campaign = MOCK_CAMPAIGNS.find((c) => c.id === campaignId);

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-xl font-semibold text-red-600 mb-4">
            Campaign Not Found
          </h1>
          <p className="text-gray-600">
            The campaign you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <DonationProvider campaignId={campaignId} disasterId={disasterId}>
      {children}
    </DonationProvider>
  );
}
