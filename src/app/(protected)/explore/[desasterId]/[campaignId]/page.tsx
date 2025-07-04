"use client";

import { Page } from "@/features/PageLayout";
import RoleBasedCampaignDetail from "@/widgets/RoleBasedCampaignDetail";
import { TopBar } from "@worldcoin/mini-apps-ui-kit-react";

const CampaignDetail = () => {
  return (
    <>
      <Page.Header className="p-0">
        <TopBar
          title={"Explore"}
          // endAdornment={
          //   <div className="flex items-center gap-2">
          //     <p className="text-sm font-semibold capitalize">{displayName}</p>
          //     <Marble className="w-12" />
          //   </div>
          // }
        />
      </Page.Header>
      <Page.Main className="flex flex-col items-center justify-start mb-16">
        <RoleBasedCampaignDetail campaignId={0} />
      </Page.Main>
    </>
  );
};

export default CampaignDetail;
