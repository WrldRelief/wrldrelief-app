export type DonationStep = 'amount' | 'confirm' | 'processing' | 'success';

export type PaymentMethod = 'standard' | 'worldapp';

export type TokenType = 'USDC' | 'WLD';

export interface DonationState {
  campaignId: number;
  disasterId: string;
  amount: number;
  walletAddress: string;
  transactionId?: string;
  step: DonationStep;
  paymentMethod: PaymentMethod;
  selectedToken: TokenType;
  paymentReference?: string;
}

export interface DonationParams {
  campaignId: number;
  disasterId: string;
  amount?: number;
  walletAddress?: string;
  transactionId?: string;
}

export interface PaymentResponse {
  success: boolean;
  reference?: string;
  message?: string;
  error?: string;
}
