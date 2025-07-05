import React, { useState, useEffect } from "react";
import {
  createIncognitoAction,
  verifyProof,
} from "@/shared/auth/incognito-actions";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import { ISuccessResult, VerificationLevel } from "@worldcoin/idkit";
import dynamic from "next/dynamic";

// Client-side only imports
let MiniKit: any;

// IDKit widget for client-side only rendering
const DynamicIDKitWidget = dynamic(
  () => import("@worldcoin/idkit").then((mod) => mod.IDKitWidget),
  { ssr: false }
);

// Types based on verify.md
type VerifyCommandInput = {
  action: string;
  signal?: string;
  verification_level?: VerificationLevel; // Default: Orb
};

// type MiniAppVerifyActionSuccessPayload = {
//   status: "success";
//   proof: string;
//   merkle_root: string;
//   nullifier_hash: string;
//   verification_level: VerificationLevel;
//   version: number;
// };

interface WorldcoinVerificationProps {
  campaignId: number | string;
  onSuccess: () => void;
  onError?: (error: Error) => void;
  buttonText?: string;
  className?: string;
  userRole?: string; // User role (recipient, donor, organization)
  actionId?: string; // Optional custom action ID
  signal?: string; // Optional signal data
}

/**
 * A component for Worldcoin identity verification using automatically generated Incognito Actions
 * Optimized for both Mini Apps and regular web environments
 */
const WorldcoinVerification: React.FC<WorldcoinVerificationProps> = ({
  campaignId,
  onSuccess,
  onError,
  buttonText = "Verify Identity",
  className = "",
  userRole = "recipient",
  actionId: customActionId,
  signal = "",
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [actionId, setActionId] = useState<string | null>(
    customActionId || null
  );
  const [isMiniApp, setIsMiniApp] = useState<boolean>(false);

  // Initialize MiniKit and detect environment on component mount
  useEffect(() => {
    // Check if running in browser environment
    if (typeof window === "undefined") return;

    // Check if running in World App (has MiniKit)
    const checkEnvironment = () => {
      try {
        // Import MiniKit dynamically on client-side
        import("@worldcoin/minikit-js")
          .then((module) => {
            MiniKit = module.MiniKit;

            // Check if MiniKit is installed (running in World App)
            const isMiniAppEnv = MiniKit && MiniKit.isInstalled();
            console.log("World App environment detected:", isMiniAppEnv);
            setIsMiniApp(isMiniAppEnv);
          })
          .catch((err) => {
            console.error("Failed to load MiniKit:", err);
            setIsMiniApp(false);
          });
      } catch (error) {
        console.error("Error checking environment:", error);
        setIsMiniApp(false);
      }

      // Default to false until confirmed
      return false;
    };

    // Setup action ID for verification
    const setupAction = async () => {
      // If custom action ID is provided, use it
      if (customActionId) {
        setActionId(customActionId);
        return customActionId;
      }

      try {
        // Create or retrieve Incognito Action for the campaign
        const action = await createIncognitoAction(
          campaignId,
          `Campaign ${campaignId} Verification for ${userRole}`,
          `Verify ${userRole} for campaign ${campaignId}`
        );

        setActionId(action.id);
        return action.id;
      } catch (error) {
        console.error("Failed to setup action:", error);
        return null;
      }
    };

    const init = async () => {
      checkEnvironment();
      console.log("Setting up action...");
      const actionResult = await setupAction();
      console.log("Action setup complete:", actionResult);
    };

    init();
  }, [campaignId, userRole, customActionId]);

  // Handle IDKit verification success
  const handleIDKitVerify = async (proof: ISuccessResult) => {
    try {
      setIsVerifying(true);

      // Verify the proof on the backend
      await verifyProof(proof, campaignId);

      // Call success callback
      onSuccess();
    } catch (error) {
      console.error("IDKit verification failed:", error);
      if (onError && error instanceof Error) {
        onError(error);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle MiniKit verification in World App
  const handleMiniKitVerification = async () => {
    if (!MiniKit || !MiniKit.isInstalled()) {
      console.error("MiniKit is not available");
      if (onError) {
        onError(new Error("MiniKit is not available"));
      }
      return;
    }

    try {
      setIsVerifying(true);

      // Prepare verification payload based on verify.md
      const verifyPayload: VerifyCommandInput = {
        action: actionId || `campaign-${campaignId}`,
        signal: signal || `campaign-verification-${campaignId}-${userRole}`,
        verification_level: VerificationLevel.Orb,
      };

      console.log("Sending verify command with payload:", verifyPayload);

      // Send verify command to World App
      const { finalPayload } = await MiniKit.commandsAsync.verify(
        verifyPayload
      );

      // Check for error response
      if (finalPayload.status === "error") {
        console.error("Verification error:", finalPayload);
        if (onError) {
          onError(
            new Error(
              `Verification failed: ${finalPayload.error || "Unknown error"}`
            )
          );
        }
        return;
      }

      // Verify the proof on the backend
      const verifyResponse = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload: finalPayload as ISuccessResult,
          action: verifyPayload.action,
          signal: verifyPayload.signal,
          campaignId,
        }),
      });

      const verifyResponseJson = await verifyResponse.json();

      if (verifyResponseJson.status === 200) {
        console.log("Verification successful!");
        onSuccess();
      } else {
        console.error("Backend verification failed:", verifyResponseJson);
        if (onError) {
          onError(
            new Error(
              `Backend verification failed: ${
                verifyResponseJson.message || "Unknown error"
              }`
            )
          );
        }
      }
    } catch (error) {
      console.error("MiniKit verification failed:", error);
      if (onError && error instanceof Error) {
        onError(error);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // Render different components based on environment
  console.log(
    "Current environment:",
    isMiniApp ? "World App" : "Web",
    "Action ID:",
    actionId
  );

  // Worldcoin logo SVG component for buttons
  const WorldcoinLogo = () => (
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
  );

  // Button content with loading state
  const ButtonContent = () => (
    <div className="flex items-center justify-center">
      <WorldcoinLogo />
      {isVerifying ? "Verifying..." : buttonText}
    </div>
  );

  if (isMiniApp) {
    // World App environment - use MiniKit
    return (
      <Button
        onClick={handleMiniKitVerification}
        className={className}
        size="lg"
        disabled={isVerifying}
      >
        <ButtonContent />
      </Button>
    );
  } else {
    // Web environment - use IDKit
    // Use provided action ID or fallback to test ID
    const effectiveActionId = actionId || "wld_staging_1234567890";

    // Format app_id to match required format `app_${string}`
    const appId = (process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID ||
      "app_staging_d4f9c8c1c1f0c0a0c0a0c0a0c0a0c0a0") as `app_${string}`;

    console.log("IDKit configuration:", {
      action: effectiveActionId,
      appId: appId,
      signal: signal || `campaign-verification-${campaignId}-${userRole}`,
    });

    return (
      <>
        <DynamicIDKitWidget
          action={effectiveActionId}
          app_id={appId}
          onSuccess={handleIDKitVerify}
          action_description={`Verify ${userRole} for campaign ${campaignId}`}
          verification_level={"orb" as VerificationLevel}
          signal={signal || `campaign-verification-${campaignId}-${userRole}`}
        >
          {({ open }) => (
            <Button
              onClick={() => {
                console.log("Opening IDKit...");
                try {
                  open();
                } catch (error) {
                  console.error("Error opening IDKit:", error);
                }
              }}
              className={className}
              size="lg"
              disabled={isVerifying || !effectiveActionId}
            >
              <ButtonContent />
            </Button>
          )}
        </DynamicIDKitWidget>

        {/* Debug info */}
        <div className="text-xs text-gray-400 mt-1">
          Action ID: {effectiveActionId || "Loading..."}
        </div>
      </>
    );
  }
};

export default WorldcoinVerification;
