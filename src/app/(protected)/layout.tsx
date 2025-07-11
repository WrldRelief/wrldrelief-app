import { auth } from "@/shared/auth";
import { Navigation } from "@/features/Navigation";
import { Page } from "@/features/PageLayout";

export default async function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // If the user is not authenticated, redirect to the login page
  if (!session) {
    console.log("Not authenticated");
    // redirect('/');
  }

  return (
    <Page>
      {children}
      <Page.Footer className="px-0 fixed bottom-0 w-full bg-white ">
        <Navigation />
      </Page.Footer>
    </Page>
  );
}
