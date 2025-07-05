import React from "react";
import { IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import { createIncognitoActionConfig, verifyProof } from "@/shared/auth/incognito-actions";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";

// Define the verification level enum to match IDKit's expectations
enum VerificationLevel {
  Orb = "orb",
  Device = "device"
}

interface WorldcoinVerificationProps {
  campaignId: number | string;
  onSuccess: () => void;
  onError?: (error: Error) => void;
  buttonText?: string;
  className?: string;
}

/**
 * A component that renders the Worldcoin IDKit widget for Incognito Actions verification
 */
const WorldcoinVerification: React.FC<WorldcoinVerificationProps> = ({
  campaignId,
  onSuccess,
  onError,
  buttonText = "Verify with Worldcoin",
  className = "",
}) => {
  const handleVerify = async (result: ISuccessResult) => {
    try {
      // Verify the proof with our backend
      await verifyProof(result, campaignId);
      
      // Call the onSuccess callback
      onSuccess();
    } catch (error) {
      console.error("Verification failed:", error);
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  };

  // Create the IDKit configuration
  const idkitConfig = createIncognitoActionConfig(campaignId, () => {});

  return (
    <IDKitWidget
      {...idkitConfig}
      onSuccess={handleVerify}
      verification_level={VerificationLevel.Orb}
      handleVerify={handleVerify}
      app_id={process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID as `app_${string}` || "app_staging_d4f9c8c1c1f0c0a0c0a0c0a0c0a0c0a0" as `app_${string}`}
    >
      {({ open }) => (
        <Button
          onClick={open}
          className={className}
          size="lg"
        >
          <div className="flex items-center justify-center">
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle cx="12" cy="12" r="5" fill="currentColor" />
            </svg>
            {buttonText}
          </div>
        </Button>
      )}
    </IDKitWidget>
  );
};

export default WorldcoinVerification;
