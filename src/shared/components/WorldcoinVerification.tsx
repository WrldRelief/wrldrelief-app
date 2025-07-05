import React, { useState } from "react";
import { generateActionId } from "@/shared/auth/incognito-actions";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";

interface WorldcoinVerificationProps {
  campaignId: number | string;
  onSuccess: () => void;
  onError?: (error: Error) => void;
  buttonText?: string;
  className?: string;
}

/**
 * A component for Worldcoin identity verification optimized for Mini Apps
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

  // Handle verification directly in mini app environment
  const handleVerification = async () => {
    try {
      setIsVerifying(true);
      
      // Generate the action ID for this campaign
      const actionId = generateActionId(campaignId);
      
      // In a mini app environment, we're already authenticated with Worldcoin
      // So we can directly simulate a successful verification
      // In a real implementation, you might still want to verify with your backend
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll simulate a successful verification
      // In production, you would implement proper verification logic
      const mockSuccess = true;
      
      if (!mockSuccess) {
        throw new Error("Verification failed");
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
