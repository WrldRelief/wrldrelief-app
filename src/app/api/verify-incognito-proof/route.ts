import { NextRequest, NextResponse } from "next/server";

// Define the types for verification based on the actual package
interface VerificationResult {
  success: boolean;
  nullifier_hash?: string;
  action?: string;
  signal?: string;
}

/**
 * API route to verify Worldcoin Incognito Actions proofs
 * 
 * @param req - The incoming request containing the proof and action
 * @returns NextResponse with verification result
 */
export async function POST(req: NextRequest) {
  try {
    const { proof, action } = await req.json();

    // Verify the proof with Worldcoin's API using fetch
    const response = await fetch("https://developer.worldcoin.org/api/v1/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        proof,
        action,
        app_id: process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID || "app_staging_d4f9c8c1c1f0c0a0c0a0c0a0c0a0c0a0",
        // Optional: Include nullifier to prevent duplicate verifications
        // nullifier_nonce: proof.nullifier_nonce,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Verification failed with status: ${response.status}`);
    }
    
    const verifyRes: VerificationResult = await response.json();

    // Return the verification result
    return NextResponse.json({
      success: true,
      verification: verifyRes,
    });
  } catch (error) {
    console.error("Error verifying proof:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}
