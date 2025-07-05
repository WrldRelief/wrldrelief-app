"use client";

import { TabItem, Tabs } from "@worldcoin/mini-apps-ui-kit-react";
import { Home, ClipboardCheck, User, Compass, Community } from "iconoir-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const Navigation = () => {
  const [value, setValue] = useState("home");
  const userRole = "donor" as "donor" | "organization" | "recipient";
  const router = useRouter();
  const pathname = usePathname();

  // Update active tab based on current path
  useEffect(() => {
    if (pathname === "/home") {
      setValue("home");
    } else if (pathname === "/activity") {
      setValue("activity");
    } else if (pathname === "/explore") {
      setValue("explore");
    } else if (pathname === "/profile") {
      setValue("profile");
    }
  }, [pathname]);

  // Handle tab change and navigation
  const handleTabChange = (newValue: string) => {
    setValue(newValue);
    router.push(`/${newValue}`);
  };

  // Get tab label based on user role
  const getTabLabel = (tab: string): string => {
    switch (tab) {
      case "home":
        return "Home";
      case "activity":
        return "Activity";
      case "explore":
        return userRole === "donor"
          ? "Explore"
          : userRole === "organization"
          ? "Manage"
          : "Community";
      case "profile":
        return "Profile";
      default:
        return tab;
    }
  };

  // Get aria label based on user role
  const getAriaLabel = (tab: string): string => {
    switch (tab) {
      case "home":
        return userRole === "donor"
          ? "Navigate to donor dashboard"
          : userRole === "organization"
          ? "Navigate to organization dashboard"
          : "Navigate to aid programs";
      case "activity":
        return userRole === "donor"
          ? "Navigate to donation history"
          : userRole === "organization"
          ? "Navigate to distribution logs"
          : "Navigate to aid history";
      case "explore":
        return userRole === "donor"
          ? "Navigate to explore campaigns"
          : userRole === "organization"
          ? "Navigate to manage campaigns"
          : "Navigate to community resources";
      case "profile":
        return "Navigate to profile settings";
      default:
        return `Navigate to ${tab}`;
    }
  };

  // Get icon based on tab and user role
  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "home":
        return <Home />;
      case "activity":
        return <ClipboardCheck />; // Using ClipboardCheck for activity/history
      case "explore":
        return userRole === "recipient" ? <Community /> : <Compass />;
      case "profile":
        return <User />;
      default:
        return null;
    }
  };

  return (
    <div className="pt-2">
      <Tabs value={value} onValueChange={handleTabChange}>
        <TabItem
          value="home"
          icon={getTabIcon("home")}
          label={getTabLabel("home")}
          aria-label={getAriaLabel("home")}
        />
        <TabItem
          value="activity"
          icon={getTabIcon("activity")}
          label={getTabLabel("activity")}
          aria-label={getAriaLabel("activity")}
        />
        <TabItem
          value="explore"
          icon={getTabIcon("explore")}
          label={getTabLabel("explore")}
          aria-label={getAriaLabel("explore")}
        />
        <TabItem
          value="profile"
          icon={getTabIcon("profile")}
          label={getTabLabel("profile")}
          aria-label={getAriaLabel("profile")}
        />
      </Tabs>
    </div>
  );
};
