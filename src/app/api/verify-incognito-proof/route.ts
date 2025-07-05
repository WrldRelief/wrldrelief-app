import { NextRequest, NextResponse } from "next/server";
import { verifyCloudProof, IVerifyResponse, ISuccessResult } from "@worldcoin/minikit-js";

interface IRequestPayload {
  payload: ISuccessResult;
  action: string;
  signal?: string;
}

/**
 * API route to verify Worldcoin Incognito Actions proofs
 * Based on verify.md reference implementation
 *
 * @param req - The incoming request containing the proof and action
 * @returns NextResponse with verification result
 */
export async function POST(req: NextRequest) {
  try {
    // Parse request payload according to reference implementation
    const { payload, action, signal } = await req.json() as IRequestPayload;
    
    // Get app_id from environment variables
    const app_id = process.env.NEXT_PUBLIC_APP_ID as `app_${string}` || 
                  "app_staging_d4f9c8c1c1f0c0a0c0a0c0a0c0a0c0a0" as `app_${string}`;
    
    // Use verifyCloudProof as per reference implementation
    const verifyRes = await verifyCloudProof(payload, app_id, action, signal) as IVerifyResponse;

    if (verifyRes.success) {
      // This is where you should perform backend actions if the verification succeeds
      // Such as, setting a user as "verified" in a database
      return NextResponse.json({ verifyRes, status: 200 });
    } else {
      // This is where you should handle errors from the World ID /verify endpoint.
      // Usually these errors are due to a user having already verified.
      return NextResponse.json({ verifyRes, status: 400 });
    }
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
