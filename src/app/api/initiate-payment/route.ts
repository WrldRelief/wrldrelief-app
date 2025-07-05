import { NextRequest, NextResponse } from 'next/server';
import { TokenType } from '@/features/donation/model/types';

interface PaymentRequest {
  campaignId: number;
  disasterId: string;
  amount: number;
  token: TokenType;
}

// In a real app, we would store this in a database
const pendingPayments = new Map<string, PaymentRequest>();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json() as PaymentRequest;
    const { campaignId, disasterId, amount, token } = data;
    
    // Validate request data
    if (!campaignId || !disasterId || !amount || !token) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }
    
    // Generate a unique reference ID for this payment
    const reference = crypto.randomUUID().replace(/-/g, '');
    
    // Store payment details (in a real app, this would go to a database)
    pendingPayments.set(reference, {
      campaignId,
      disasterId,
      amount,
      token
    });
    
    // Return the reference ID to the client
    return NextResponse.json({ 
      success: true, 
      reference,
      message: 'Payment initiated successfully'
    });
  } catch (error) {
    console.error('Error initiating payment:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to initiate payment' 
    }, { status: 500 });
  }
}
