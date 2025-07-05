import React, { useState } from "react";
import { generateActionId } from "@/shared/auth/incognito-actions";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import { MiniKit, VerificationLevel } from "@worldcoin/minikit-js";

interface WorldcoinVerificationProps {
  campaignId: number | string;
  onSuccess: () => void;
  onError?: (error: Error) => void;
  buttonText?: string;
  className?: string;
}

/**
 * A component for Worldcoin Incognito Actions verification optimized for Mini Apps
 * This version assumes the user is already connected to Worldcoin
 */
const WorldcoinVerification: React.FC<WorldcoinVerificationProps> = ({
  campaignId,
  onSuccess,
  onError,
  buttonText = "Verify Identity",
  className = "",
}) => {
  const [isVerifying, setIsVerifying] = useState(false);

  // Handle verification using MiniKit's verify API
  const handleVerification = async () => {
    try {
      setIsVerifying(true);
      
      // Generate the action ID for this campaign
      const actionId = generateActionId(campaignId);
      
      // Use MiniKit's verify API to generate a proof
      const result = await MiniKit.commandsAsync.verify({
        action: actionId,
        verification_level: VerificationLevel.Orb,
      });
      
      if (!result || result.finalPayload.status !== "success") {
        throw new Error("Verification failed");
      }
      
      // Verify the proof with our backend
      const response = await fetch("/api/verify-incognito-proof", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload: result.finalPayload,
          action: actionId,
          campaignId,
        }),
      });
      
      const data = await response.json();
      if (!data.success) {
        throw new Error("Backend verification failed");
      }
      
      // Call the onSuccess callback
      onSuccess();
    } catch (error) {
      console.error("Verification failed:", error);
      if (onError && error instanceof Error) {
        onError(error);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Button
      onClick={handleVerification}
      className={className}
      size="lg"
      disabled={isVerifying}
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
        {isVerifying ? "Verifying..." : buttonText}
      </div>
    </Button>
  );
};

export default WorldcoinVerification;
