"use client";

import { Page } from "@/features/PageLayout";
import { Marble, TopBar } from "@worldcoin/mini-apps-ui-kit-react";
import { Map } from "@/features/Map";

export default function Home() {
  // const { user, authenticated } = usePrivy();
  // const router = useRouter();

  // Redirect to login page if not authenticated
  // useEffect(() => {
  //   if (!authenticated) {
  //     router.push("/");
  //   }
  // }, [authenticated, router]);

  // Extract display information from user data
  // const displayName = user?.wallet?.address?.substring(0, 8) || "Anonymous";
  const displayName = "Anonymous";

  return (
    <>
      <Page.Header className="p-0">
        <TopBar
          title="Map"
          endAdornment={
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold capitalize">{displayName}</p>
              <Marble className="w-12" />
            </div>
          }
        />
      </Page.Header>
      <Page.Main className="flex flex-col items-center justify-start mb-16 p-0">
        <Map />
      </Page.Main>
    </>
  );
}
