"use client";

import { Page } from "@/features/PageLayout";
import { TopBar } from "@worldcoin/mini-apps-ui-kit-react";
import { DisasterMap } from "@/widgets/DisasterReliefMap";
import { DefaultDonationStats } from "@/widgets/DonationStats";
import { useUserModel } from "@/features/user/model";
import { Marble } from "@worldcoin/mini-apps-ui-kit-react";

export default function Home() {
  const { user } = useUserModel();

  // const router = useRouter();

  // // Redirect to login page if not authenticated
  // useEffect(() => {
  //   if (!authenticated) {
  //     router.push("/");
  //   }
  // }, [authenticated, router]);

  // Extract display information from user data
  const displayName = user?.worldcoinInfo?.displayName || "Anonymous";

  console.log("home user", user);

  return (
    <>
      <Page.Header>
        <TopBar
          title="World Relief"
          endAdornment={
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold capitalize">{displayName}</p>
              <Marble
                src={user?.worldcoinInfo?.profilePictureUrl}
                className="w-12"
              />
            </div>
          }
        />
      </Page.Header>
      <Page.Main className="flex flex-col items-center justify-start mb-16 p-0">
        {/* Map Section - Takes remaining height */}
        <div className="w-full h-[calc(100vh-220px)]">
          <DisasterMap onMarkerSelect={() => {}} />
        </div>
        {/* Donation Stats Section */}
        <div className="w-full h-full max-w-4xl mb-4 p-4">
          <DefaultDonationStats />
        </div>
      </Page.Main>
    </>
  );
}
