import { ISuccessResult } from "@worldcoin/idkit";

// Define the IDKit configuration type based on the actual package
interface IDKitConfig {
  app_id: string;
  action: string;
  onSuccess: (result: ISuccessResult) => void;
  action_description?: string;
  nullifier_nonce?: string;
  verification_level?: "orb" | "device";
}

/**
 * Generates a unique action ID for a specific campaign
 * This ensures each campaign has its own verification flow
 * 
 * @param campaignId - The unique identifier for the campaign
 * @returns A string action ID in the format 'campaign-verification-{campaignId}'
 */
export const generateActionId = (campaignId: number | string): string => {
  return `campaign-verification-${campaignId}`;
};

/**
 * Creates configuration for Worldcoin's IDKit with Incognito Actions
 * 
 * @param campaignId - The unique identifier for the campaign
 * @param onSuccess - Callback function to execute when verification succeeds
 * @returns IDKitConfig object for the IDKit component
 */
export const createIncognitoActionConfig = (
  campaignId: number | string,
  onSuccess: () => void
): IDKitConfig => {
  return {
    app_id: process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID || "app_staging_d4f9c8c1c1f0c0a0c0a0c0a0c0a0c0a0",
    action: generateActionId(campaignId),
    onSuccess,
    // Enable Incognito Actions mode
    action_description: `Verify for aid distribution in campaign #${campaignId}`,
    // Use nullifier_nonce to prevent duplicate verifications for the same user in the same campaign
    nullifier_nonce: `campaign-${campaignId}`,
  };
};

/**
 * Verifies a proof from Worldcoin's IDKit
 * 
 * @param proof - The proof object from IDKit
 * @param campaignId - The campaign ID associated with this verification
 * @returns Promise resolving to verification result
 */
export const verifyProof = async (proof: any, campaignId: number | string) => {
  try {
    // Call your backend API to verify the proof
    const response = await fetch("/api/verify-incognito-proof", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        proof,
        action: generateActionId(campaignId),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to verify proof");
    }

    return await response.json();
  } catch (error) {
    console.error("Error verifying proof:", error);
    throw error;
  }
};
