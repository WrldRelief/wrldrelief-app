import { MiniKit } from "@worldcoin/minikit-js";
import { useLoginWithSiwe } from "@privy-io/react-auth";

/**
 * Custom React Hook that authenticates a user via their wallet using Privy's SIWE flow.
 *
 * This hook:
 * 1. Gets a nonce from Privy
 * 2. Passes the nonce to Worldcoin walletAuth
 * 3. Sends the signed message and signature to Privy
 *
 * @returns {Object} Object containing the authentication function
 */
export const useWalletWithSiwe = () => {
  // Properly use the hook inside a custom React Hook
  const { generateSiweNonce, loginWithSiwe } = useLoginWithSiwe();

  /**
   * Executes the wallet authentication flow
   * @returns {Promise<any>} The authenticated user object from Privy
   * @throws {Error} If wallet authentication fails at any step
   */
  const authenticate = async () => {
    try {
      // Step 1: Get the nonce from Privy
      const privyNonce = await generateSiweNonce();
      console.log("Privy nonce generated", privyNonce);

      // Step 2: Pass the nonce to Worldcoin walletAuth
      const result = await MiniKit.commandsAsync.walletAuth({
        nonce: privyNonce,
        expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        notBefore: new Date(Date.now() - 24 * 60 * 60 * 1000),
        statement: `Authenticate with SIWE (${crypto
          .randomUUID()
          .replace(/-/g, "")}).`,
      });

      console.log("Worldcoin walletAuth result", result);
      if (!result) {
        throw new Error("No response from wallet auth");
      }

      if (result.finalPayload.status !== "success") {
        console.error(
          "Wallet authentication failed",
          result.finalPayload.error_code
        );
        throw new Error(
          `Wallet authentication failed: ${result.finalPayload.error_code}`
        );
      }

      // Step 3: Send the signed message and signature to Privy
      const { message, signature } = result.finalPayload;
      const user = await loginWithSiwe({ message, signature });
      console.log("Authenticated with Privy", user);

      // Step 4: Access user session data (optional)
      // const userInfo = await MiniKit.getUserByAddress(user.wallet.address);
      // console.log("User info from Worldcoin", userInfo);

      return user;
    } catch (error) {
      console.error("SIWE authentication error", error);
      throw error;
    }
  };

  return { authenticate };
};
