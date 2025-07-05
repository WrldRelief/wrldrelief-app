import { NextRequest, NextResponse } from 'next/server';
import { TokenType } from '@/features/donation/model/types';
import { pendingPayments, PaymentRequest } from '@/shared/store/payments';


export async function POST(req: NextRequest) {
  try {
    // Generate a unique reference ID for this payment
    const reference = crypto.randomUUID().replace(/-/g, '');
    
    // Store the reference in our pending payments map
    // We'll add more details when the payment is confirmed
    pendingPayments.set(reference, {
      campaignId: 0, // Will be updated during confirmation
      disasterId: '',
      amount: 0,
      token: 'USDC'
    });
    
    // Return the reference ID to the client as per pay.md example
    return NextResponse.json({ 
      success: true, 
      id: reference, // Using 'id' as the key name to match pay.md example
      message: 'Payment reference created successfully'
    });
  } catch (error) {
    console.error('Error initiating payment:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to initiate payment' 
    }, { status: 500 });
  }
}
