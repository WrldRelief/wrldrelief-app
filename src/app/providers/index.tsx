"use client";
import { MiniKitProvider } from "@worldcoin/minikit-js/minikit-provider";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { PrivyProvider } from "@privy-io/react-auth";

const ErudaProvider = dynamic(
  () => import("@/app/providers/Eruda").then((c) => c.ErudaProvider),
  { ssr: false }
);

// Define props for ClientProviders
interface ClientProvidersProps {
  children: ReactNode;
}

/**
 * ClientProvider wraps the app with essential context providers.
 *
 * - ErudaProvider:
 *     - Should be used only in development.
 *     - Enables an in-browser console for logging and debugging.
 *
 * - MiniKitProvider:
 *     - Required for MiniKit functionality.
 *
 * This component ensures both providers are available to all child components.
 */
export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ErudaProvider>
      <PrivyProvider appId="cmbxk8d2h00welg0la3ct3shb">
        <MiniKitProvider>{children}</MiniKitProvider>
      </PrivyProvider>
    </ErudaProvider>
  );
}
