import { NextRequest, NextResponse } from "next/server";
import { TokenType } from "@/features/donation/model/types";
import { MiniAppPaymentSuccessPayload } from "@worldcoin/minikit-js";

interface PaymentConfirmationRequest {
  payload: MiniAppPaymentSuccessPayload;
  reference: string;
  campaignId: number;
  amount: number;
  token: TokenType;
}

// In-memory store for pending payments (replace with database in production)
import { pendingPayments } from "@/shared/store/payments";

export async function POST(req: NextRequest) {
  try {
    const data = (await req.json()) as PaymentConfirmationRequest;
    const { payload, reference } = data;

    console.log("Confirming payment:", {
      reference,
      transactionId: payload.transaction_id,
    });

    // Validate that we have a pending payment with this reference
    const pendingPayment = pendingPayments.get(reference);
    if (!pendingPayment) {
      console.error("Payment reference not found:", reference);
      return NextResponse.json(
        {
          success: false,
          error: "Payment reference not found",
        },
        { status: 400 }
      );
    }

    // Validate that the transaction reference matches what we expect
    if (payload.reference !== reference) {
      console.error("Reference mismatch:", {
        expected: reference,
        received: payload.reference,
      });
      return NextResponse.json(
        {
          success: false,
          error: "Reference mismatch",
        },
        { status: 400 }
      );
    }

    // Check transaction status
    if (payload.status !== "success") {
      console.error("Transaction failed:", payload);
      return NextResponse.json(
        {
          success: false,
          error: "Transaction failed",
        },
        { status: 400 }
      );
    }

    // Verify the transaction with the World Developer Portal API
    try {
      // 환경 변수가 설정되어 있는지 확인
      const appId = process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID;
      const apiKey = process.env.WORLDCOIN_API_KEY;
      
      if (!apiKey || !appId) {
        console.warn("WORLDCOIN_API_KEY or NEXT_PUBLIC_WORLDCOIN_APP_ID not set. Skipping transaction verification with World Developer Portal.");
        console.log("For demo purposes, assuming the transaction is valid.");
      } else {
        // 실제 API 호출로 트랜잭션 검증
        console.log(`Verifying transaction ${payload.transaction_id} with World Developer Portal`);
        const response = await fetch(
          `https://developer.worldcoin.org/api/v2/minikit/transaction/${payload.transaction_id}?app_id=${appId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          }
        );
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`API responded with status: ${response.status}`, errorText);
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const transaction = await response.json();
        console.log('Transaction verification response:', transaction);
        
        if (transaction.reference !== reference || transaction.status === 'failed') {
          return NextResponse.json({ 
            success: false, 
            error: 'Invalid transaction: reference mismatch or failed status' 
          }, { status: 400 });
        }
        
        console.log("Payment verified successfully with World Developer Portal");
      }
      
      // 트랜잭션이 유효하다고 판단

      // In a real app, we would update our database to mark the donation as complete
      // Remove the payment from pending payments
      pendingPayments.delete(reference);

      return NextResponse.json({
        success: true,
        message: "Payment confirmed successfully",
        transactionId: payload.transaction_id,
      });
    } catch (verifyError) {
      console.error(
        "Error verifying transaction with World Developer Portal:",
        verifyError
      );
      return NextResponse.json(
        {
          success: false,
          error: "Failed to verify transaction with World Developer Portal",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error confirming payment:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to confirm payment",
      },
      { status: 500 }
    );
  }
}
