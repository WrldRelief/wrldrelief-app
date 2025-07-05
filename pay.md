Using the command
Sending the command & handling the response
We currently support WLD and USDC payments on Worldchain. Below is the expected input for the Pay command. Since World App sponsors the gas fee, there is a minimum transfer amount of $0.1 for all tokens.

PayCommandInput
// Represents tokens you allow the user to pay with and amount for each
export type TokensPayload = {
symbol: Tokens;
token_amount: string;
};

export type PayCommandInput = {
reference: string;
to: string;
tokens: TokensPayload[];
network?: Network; // Optional
description: string;
};

Copy
Copied!
For convenience, we offer a public endpoint to query the current price of WLD in various currencies detailed here.

app/page.tsx
import { MiniKit, tokenToDecimals, Tokens, PayCommandInput } from '@worldcoin/minikit-js'

const sendPayment = async () => {
const res = await fetch('/api/initiate-payment', {
method: 'POST',
})
const { id } = await res.json()

const payload: PayCommandInput = {
reference: id,
to: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', // Test address
tokens: [
{
symbol: Tokens.WLD,
token_amount: tokenToDecimals(1, Tokens.WLD).toString(),
},
{
symbol: Tokens.USDC,
token_amount: tokenToDecimals(3, Tokens.USDC).toString(),
},
],
description: 'Test example payment for minikit',
}

if (!MiniKit.isInstalled()) {
return
}

const { finalPayload } = await MiniKit.commandsAsync.pay(payload)

if (finalPayload.status == 'success') {
const res = await fetch(`/api/confirm-payment`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(finalPayload),
})
const payment = await res.json()
if (payment.success) {
// Congrats your payment was successful!
}
}
}

Copy
Copied!
Verifying the payment
You should always verify the payment in your backend. Users can manipulate information in the frontend, so the response must be verified in a trusted environment.

Web2 applications can call our Developer Portal API to get the current status of the transaction. Since payments are executed on-chain, it can take up to a few minutes to confirm. You can choose to optimistically accept the payments once they've landed on-chain, or poll the endpoint to wait until it's successful mined.

Web3 applications can choose to search the on-chain event logs temselves via the TransferReference event emitted on-chain. Note for reference ID the value on chain will be the keccak256 hash of the reference ID.

TransferReference
event TransferReference(
address sender,
address indexed recipient,
uint256 amount,
address token,
string indexed referenceId,
bool indexed success
);

Copy
Copied!
In this example, we will show querying via Developer Portal API.

app/confirm-payment/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { MiniAppPaymentSuccessPayload } from '@worldcoin/minikit-js'

interface IRequestPayload {
payload: MiniAppPaymentSuccessPayload
}

export async function POST(req: NextRequest) {
const { payload } = (await req.json()) as IRequestPayload

    // IMPORTANT: Here we should fetch the reference you created in /initiate-payment to ensure the transaction we are verifying is the same one we initiated
    const reference = getReferenceFromDB()

    // 1. Check that the transaction we received from the mini app is the same one we sent
    if (payload.reference === reference) {
    	const response = await fetch(
    		`https://developer.worldcoin.org/api/v2/minikit/transaction/${payload.transaction_id}?app_id=${process.env.APP_ID}`,
    		{
    			method: 'GET',
    			headers: {
    				Authorization: `Bearer ${process.env.DEV_PORTAL_API_KEY}`,
    			},
    		}
    	)
    	const transaction = await response.json()

    	// 2. Here we optimistically confirm the transaction.
    	// Otherwise, you can poll until the status == mined
    	if (transaction.reference == reference && transaction.status != 'failed') {
    		return NextResponse.json({ success: true })
    	} else {
    		return NextResponse.json({ success: false })
    	}
    }

}

Copy
Copied!
Success Result on World App
If implemented correctly, the user will see the following drawer on World App.
