"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button, Progress } from "@worldcoin/mini-apps-ui-kit-react";

interface DonationLayoutProps {
  children: React.ReactNode;
  title: string;
  step: number;
  totalSteps: number;
  onBack?: () => void;
  campaignName: string;
}

export const DonationLayout: React.FC<DonationLayoutProps> = ({
  children,
  title,
  step,
  totalSteps,
  onBack,
  campaignName,
}) => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="w-full max-w-md mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-6 gap-2">
          <Button
            onClick={() => router.back()}
            aria-label="Go back"
            size="icon"
            variant="secondary"
          >
            ←
          </Button>
          <h1 className="text-xl font-semibold ml-2 truncate">
            {campaignName}
          </h1>
        </div>

        {/* Progress steps */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm text-gray-500">{title}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <Progress
              value={parseFloat(((step / totalSteps) * 100).toFixed(2))}
              max={100}
            />
          </div>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
};
