"use client";
import { Button, LiveFeedback } from "@worldcoin/mini-apps-ui-kit-react";
import { useMiniKit } from "@worldcoin/minikit-js/minikit-provider";
import { MiniKit } from "@worldcoin/minikit-js";
import { useCallback, useEffect, useState } from "react";
import { useLoginWithSiwe } from "@privy-io/react-auth";
import type { User } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useUserModel } from "@/features/user/model";

/**
 * This component implements Sign-In with Ethereum (SIWE) authentication flow using Privy
 * The process involves:
 * 1. Getting a nonce from Privy
 * 2. Passing the nonce to Worldcoin walletAuth
 * 3. Sending the signed message and signature to Privy
 * 4. Accessing the user session data
 *
 * Read More: https://docs.world.org/mini-apps/commands/wallet-auth
 */
export const AuthButton = () => {
  const [isPending, setIsPending] = useState(false);
  const [localUser, setLocalUser] = useState<User | null>(null);
  const { isInstalled } = useMiniKit();
  const { generateSiweNonce, loginWithSiwe } = useLoginWithSiwe();
  const router = useRouter();
  const { updateUserInfo, fetchWorldcoinUserInfo } = useUserModel();

  const handleSiweAuth = useCallback(async () => {
    if (!isInstalled || isPending) {
      return;
    }

    setIsPending(true);
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
        const errorMessage = "Wallet authentication failed";
        console.error(errorMessage, result.finalPayload);
        throw new Error(errorMessage);
      }

      // Step 3: Send the signed message and signature to Privy
      const { message, signature } = result.finalPayload;
      const authenticatedUser = await loginWithSiwe({ message, signature });
      console.log("Authenticated with Privy", authenticatedUser);

      // Step 4: Access user session data and update global state
      if (authenticatedUser?.wallet?.address) {
        try {
          // Fetch user info from Worldcoin and update global state
          await fetchWorldcoinUserInfo(authenticatedUser.wallet.address);

          // Update additional user info from authenticatedUser if needed
          const userInfo = {
            isAuthenticated: true,
            address: authenticatedUser.wallet.address,
            displayName: authenticatedUser.wallet.address.substring(0, 8),
          };

          updateUserInfo(userInfo);

          // 로컬 스토리지에 인증 상태 저장
          // localStorage.setItem('auth_state', JSON.stringify(userInfo));
        } catch (error) {
          console.error("Failed to get user by address", error);
          // Still update the basic user info even if Worldcoin fetch fails
          const basicUserInfo = {
            isAuthenticated: true,
            address: authenticatedUser.wallet.address,
          };
          updateUserInfo(basicUserInfo);
          // localStorage.setItem("auth_state", JSON.stringify(basicUserInfo));
        }
      }

      setLocalUser(authenticatedUser);

      // Redirect to home page after successful login
      router.push("/home");
    } catch (error) {
      console.error("SIWE authentication error", error);
    } finally {
      setIsPending(false);
    }
  }, [
    isInstalled,
    isPending,
    generateSiweNonce,
    loginWithSiwe,
    router,
    updateUserInfo,
    fetchWorldcoinUserInfo,
  ]);

  const onClick = useCallback(() => {
    handleSiweAuth();
  }, [handleSiweAuth]);

  // 인증 상태 확인 및 유지
  const { user } = useUserModel();

  useEffect(() => {
    const authenticate = async () => {
      // 이미 인증된 상태라면 로그인 시도하지 않음
      if (user?.isAuthenticated) {
        setLocalUser(user as unknown as User);
        return;
      }

      // 로컬 스토리지에서 인증 상태 확인
      // const storedAuth = localStorage.getItem("auth_state");
      // if (storedAuth) {
      //   try {
      //     const parsedAuth = JSON.parse(storedAuth);
      //     if (parsedAuth.address) {
      //       // 저장된 인증 정보로 사용자 상태 복원
      //       updateUserInfo({
      //         isAuthenticated: true,
      //         address: parsedAuth.address,
      //         displayName:
      //           parsedAuth.displayName || parsedAuth.address.substring(0, 8),
      //       });
      //       setLocalUser({ wallet: { address: parsedAuth.address } } as User);
      //       return;
      //     }
      //   } catch (e) {
      //     console.error("Failed to parse stored auth", e);
      //     localStorage.removeItem("auth_state");
      //   }
      // }

      // 인증되지 않은 상태에서만 자동 로그인 시도
      if (isInstalled && !isPending && !localUser) {
        handleSiweAuth();
      }
    };

    authenticate();
  }, [isInstalled, isPending, localUser, handleSiweAuth, user, updateUserInfo]);

  return (
    <LiveFeedback
      label={{
        failed: "Failed to login",
        pending: "Logging in",
        success: "Logged in",
      }}
      state={isPending ? "pending" : localUser ? "success" : undefined}
    >
      <Button
        onClick={onClick}
        disabled={isPending || !!localUser}
        size="lg"
        variant="primary"
      >
        {localUser ? "Logged in with SIWE" : "Login with SIWE"}
      </Button>
    </LiveFeedback>
  );
};
