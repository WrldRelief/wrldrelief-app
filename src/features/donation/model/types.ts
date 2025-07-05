export type DonationStep = 'amount' | 'confirm' | 'processing' | 'success';

export interface DonationState {
  campaignId: number;
  disasterId: string;
  amount: number;
  walletAddress: string;
  transactionId?: string;
  step: DonationStep;
}

export interface DonationParams {
  campaignId: number;
  disasterId: string;
  amount?: number;
  walletAddress?: string;
  transactionId?: string;
}
