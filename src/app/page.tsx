import { Page } from "@/features/PageLayout";
import { AuthButton } from "@/features/AuthButton";

export default function Home() {
  return (
    <Page>
      <Page.Main className="flex flex-col items-center justify-center">
        <AuthButton />
      </Page.Main>
    </Page>
  );
}
