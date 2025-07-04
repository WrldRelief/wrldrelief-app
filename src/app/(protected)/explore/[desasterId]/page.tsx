"use client";

import { MOCK_DISASTER_LOCATIONS } from "@/entities/disaster";
import { Page } from "@/features/PageLayout";
import RoleBasedRegionDetail from "@/widgets/RoleBasedRegionDetail";
import { TopBar } from "@worldcoin/mini-apps-ui-kit-react";

const DisasterDetail = () => {
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
        <RoleBasedRegionDetail region={MOCK_DISASTER_LOCATIONS[0]} />
      </Page.Main>
    </>
  );
};

export default DisasterDetail;
