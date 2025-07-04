"use client";

import { Provider as JotaiProvider } from "jotai";
import { PrivyProvider } from "@privy-io/react-auth";
import { MiniKitProvider } from "@worldcoin/minikit-js/minikit-provider";
import { UserRoleProvider } from "@/context/UserRoleContext";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <JotaiProvider>
      <MiniKitProvider>
        <PrivyProvider
          appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
          config={{
            loginMethods: ["wallet"],
            appearance: {
              theme: "light",
              accentColor: "#676FFF",
              logo: "https://assets.worldcoin.org/images/worldcoin-logo.svg",
            },
          }}
        >
          <UserRoleProvider>
            {children}
          </UserRoleProvider>
        </PrivyProvider>
      </MiniKitProvider>
    </JotaiProvider>
  );
}
