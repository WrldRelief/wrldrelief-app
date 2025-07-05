import { TokenType } from '@/features/donation/model/types';

/**
 * Interface for payment request data
 */
export interface PaymentRequest {
  campaignId: number;
  disasterId: string;
  amount: number;
  token: TokenType;
}

/**
 * In-memory store for pending payments
 * In a production app, this would be replaced with a database
 */
export const pendingPayments = new Map<string, PaymentRequest>();
