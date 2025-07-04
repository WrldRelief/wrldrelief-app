"use client";

import { Page } from "@/features/PageLayout";
import { TopBar } from "@worldcoin/mini-apps-ui-kit-react";

const Activity = () => {
  return (
    <>
      <Page.Header className="p-0">
        <TopBar title={"Activity"} />
      </Page.Header>
      <Page.Main className="flex flex-col items-center justify-start mb-16">
        <div>Activity</div>
      </Page.Main>
    </>
  );
};

export default Activity;
