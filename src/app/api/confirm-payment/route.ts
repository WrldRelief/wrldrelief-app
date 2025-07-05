import { NextRequest, NextResponse } from 'next/server';
import { TokenType } from '@/features/donation/model/types';

interface PaymentConfirmationRequest {
  payload: {
    reference: string;
    transaction_id: string;
    status: 'success' | 'failed';
  };
  reference: string;
  campaignId: number;
  amount: number;
  token: TokenType;
}

// In a real app, this would verify with the World Developer Portal API
export async function POST(req: NextRequest) {
  try {
    const data = await req.json() as PaymentConfirmationRequest;
    const { payload, reference } = data;
    
    // Validate that the transaction reference matches what we expect
    if (payload.reference !== reference) {
      return NextResponse.json({ 
        success: false, 
        error: 'Reference mismatch' 
      }, { status: 400 });
    }
    
    // Check transaction status
    if (payload.status !== 'success') {
      return NextResponse.json({ 
        success: false, 
        error: 'Transaction failed' 
      }, { status: 400 });
    }
    
    // In a production app, we would verify the transaction with the World Developer Portal API:
    // const response = await fetch(
    //   `https://developer.worldcoin.org/api/v2/minikit/transaction/${payload.transaction_id}?app_id=${process.env.APP_ID}`,
    //   {
    //     method: 'GET',
    //     headers: {
    //       Authorization: `Bearer ${process.env.DEV_PORTAL_API_KEY}`,
    //     },
    //   }
    // );
    // const transaction = await response.json();
    // if (transaction.reference !== reference || transaction.status === 'failed') {
    //   return NextResponse.json({ success: false, error: 'Invalid transaction' });
    // }
    
    // For demo purposes, we'll just assume the transaction is valid
    
    // In a real app, we would update our database to mark the donation as complete
    
    return NextResponse.json({ 
      success: true,
      message: 'Payment confirmed successfully',
      transactionId: payload.transaction_id
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to confirm payment' 
    }, { status: 500 });
  }
}
