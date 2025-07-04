"use client";

import { Page } from "@/features/PageLayout";
import { Button, TopBar } from "@worldcoin/mini-apps-ui-kit-react";
import { useRouter } from "next/navigation";

const Explore = () => {
  const router = useRouter();
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
        <Button onClick={() => router.push("/explore/1")}>diasater</Button>
      </Page.Main>
    </>
  );
};

export default Explore;
