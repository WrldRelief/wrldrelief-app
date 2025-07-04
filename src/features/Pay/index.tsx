'use client';
import { Button, LiveFeedback } from '@worldcoin/mini-apps-ui-kit-react';
import { MiniKit, Tokens, tokenToDecimals } from '@worldcoin/minikit-js';
import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';

/**
 * This component is used to pay a user
 * The payment command simply does an ERC20 transfer
 * But, it also includes a reference field that you can search for on-chain
 */
export const Pay = () => {
  const [buttonState, setButtonState] = useState<
    'pending' | 'success' | 'failed' | undefined
  >(undefined);
  
  // Get Privy authentication status
  const { authenticated, user } = usePrivy();

  const onClickPay = async () => {
    // Check if user is authenticated with Privy
    if (!authenticated || !user) {
      console.error('User is not authenticated with Privy');
      setButtonState('failed');
      setTimeout(() => setButtonState(undefined), 2000);
      return;
    }
    
    try {
      // Lets use Alex's username to pay!
      const address = (await MiniKit.getUserByUsername('alex')).walletAddress;
      setButtonState('pending');

      const res = await fetch('/api/initiate-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          walletAddress: user?.wallet?.address || ''
        })
      });
      const { id } = await res.json();

    const result = await MiniKit.commandsAsync.pay({
      reference: id,
      to: address ?? '0x0000000000000000000000000000000000000000',
      tokens: [
        {
          symbol: Tokens.WLD,
          token_amount: tokenToDecimals(0.5, Tokens.WLD).toString(),
        },
        {
          symbol: Tokens.USDC,
          token_amount: tokenToDecimals(0.1, Tokens.USDC).toString(),
        },
      ],
      description: 'Test example payment for minikit',
    });

    console.log(result.finalPayload);
    if (result.finalPayload.status === 'success') {
      setButtonState('success');
      // It's important to actually check the transaction result on-chain
      // You should confirm the reference id matches for security
      // Read more here: https://docs.world.org/mini-apps/commands/pay#verifying-the-payment
    } else {
      setButtonState('failed');
      setTimeout(() => {
        setButtonState(undefined);
      }, 3000);
    }
    } catch (error) {
      console.error('Payment failed:', error);
      setButtonState('failed');
      setTimeout(() => {
        setButtonState(undefined);
      }, 3000);
    }
  };

  return (
    <div className="grid w-full gap-4">
      <p className="text-lg font-semibold">Pay</p>
      <LiveFeedback
        label={{
          failed: 'Payment failed',
          pending: 'Payment pending',
          success: 'Payment successful',
        }}
        state={buttonState}
        className="w-full"
      >
        <Button
          onClick={onClickPay}
          disabled={buttonState === 'pending' || !authenticated}
          size="lg"
          variant="primary"
          className="w-full"
        >
          Pay
        </Button>
      </LiveFeedback>
    </div>
  );
};
