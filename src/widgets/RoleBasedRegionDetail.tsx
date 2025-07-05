"use client";

import React, { useState } from "react";
import { DisasterLocation } from "@/entities/disaster";
import Image from "next/image";
// import { ResourceNeeds } from "@/features/ResourceNeeds";
import { useUserRole } from "@/context/UserRoleContext";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button, Tabs, TabItem } from "@worldcoin/mini-apps-ui-kit-react";
import { Activity, CheckCircle, Package } from "iconoir-react";
import CampaignList from "@/features/CampaignList";
import { Campaign, CampaignStatus, useCampaignsByDisaster } from "@/entities/contracts";
import { CampaignData } from "@/entities/campaign";

const Map = dynamic(() => import("@/features/Map").then((mod) => mod.Map), {
  ssr: false,
  loading: () => (
    <div className="h-48 w-full bg-gray-100 rounded-md animate-pulse" />
  ),
});

interface RoleBasedRegionDetailProps {
  region: DisasterLocation;
}

export const RoleBasedRegionDetail: React.FC<RoleBasedRegionDetailProps> = ({
  region,
}) => {
  const [activeTab, setActiveTab] = useState<
    "needed-items" | "active-campaigns" | "completed-campaigns"
  >("active-campaigns");
  const { userRole } = useUserRole();
  const router = useRouter();

  // Fetch campaigns by the selected disaster region from blockchain
  const { campaigns, loading, error } = useCampaignsByDisaster(region.id);
  
  // Adapter function to convert Campaign to CampaignData
  const adaptCampaignToCampaignData = (campaign: Campaign): CampaignData => ({
    ...campaign,
    updatedAt: campaign.createdAt, // Use createdAt as updatedAt since it's not in the contract
  });
  
  // Convert and filter campaigns by status
  const adaptedCampaigns = campaigns ? campaigns.map(adaptCampaignToCampaignData) : [];
  const activeCampaigns = adaptedCampaigns.filter(
    (campaign) => campaign.status === CampaignStatus.ACTIVE
  );
  const completedCampaigns = adaptedCampaigns.filter(
    (campaign) => campaign.status === CampaignStatus.ENDED
  );

  // Organization-specific actions
  const handleCreateCampaign = () => {
    router.push(`/organization/campaigns/create?regionId=${region.id}`);
  };

  // Recipient-specific actions
  const handleRegisterNeeds = () => {
    router.push(`/recipient/register-needs?regionId=${region.id}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col w-full bg-white rounded-lg shadow-md overflow-hidden p-6">
        <h1 className="text-2xl font-bold">{region.name}</h1>
        <p className="text-gray-600 mt-2">Loading campaigns...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col w-full bg-white rounded-lg shadow-md overflow-hidden p-6">
        <h1 className="text-2xl font-bold">{region.name}</h1>
        <p className="text-red-600 mt-2">Error loading campaigns: {error.message}</p>
        <Button onClick={() => window.location.reload()} variant="secondary" size="lg" className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-white rounded-lg shadow-md overflow-hidden">
      {/* Region header with image */}
      <div className="relative w-full h-48">
        <Image
          src={region.imageUrl}
          alt={region.name}
          fill
          className="object-cover"
          priority
        />

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <h1 className="text-2xl font-bold text-white">{region.name}</h1>
          <div className="flex items-center mt-2">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                region.urgency === "critical"
                  ? "bg-red-100 text-red-800"
                  : region.urgency === "high"
                  ? "bg-orange-100 text-orange-800"
                  : region.urgency === "medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {region.urgency.charAt(0).toUpperCase() + region.urgency.slice(1)}{" "}
              Urgency
            </span>
            <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              {region.type.charAt(0).toUpperCase() + region.type.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Region details */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-2">Disaster Information</h2>
        <p className="text-gray-700 mb-4">{region.description}</p>
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div className="col-span-2 ">
            <p className="font-medium text-gray-600 mb-2">Location</p>
            <div className="h-28 w-full rounded-md overflow-hidden border border-gray-200">
              <Map
                initialCoords={{
                  lng: region.longitude,
                  lat: region.latitude,
                  zoom: 7,
                  minZoom: 3,
                  maxZoom: 9,
                }}
                markers={[
                  {
                    type: "Feature",
                    geometry: {
                      type: "Point",
                      coordinates: [region.longitude, region.latitude],
                    },
                    properties: {
                      ...region,
                      id: "disaster-location",
                    },
                  },
                ]}
                onMarkerClick={() => {}}
              />
            </div>
          </div>
          <div>
            <p className="font-medium text-gray-600">Affected People</p>
            <p>{region.affectedPeople.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Tab navigation with Worldcoin UI Tabs */}
      <div className="px-4 pt-2">
        <Tabs
          value={activeTab}
          onValueChange={(value: string) =>
            setActiveTab(
              value as
                | "active-campaigns"
                | "completed-campaigns"
                | "needed-items"
            )
          }
          className="w-full"
        >
          <TabItem
            value="active-campaigns"
            label={`Active (${activeCampaigns.length})`}
            icon={<Activity width={16} height={16} />}
            className="flex-1 text-center"
          />
          <TabItem
            value="completed-campaigns"
            label={`Completed (${completedCampaigns.length})`}
            icon={<CheckCircle width={16} height={16} />}
            className="flex-1 text-center"
          />
          <TabItem
            value="needed-items"
            label="Needs"
            icon={<Package width={16} height={16} />}
            className="flex-1 text-center"
          />
        </Tabs>
      </div>

      {/* Tab content */}
      <div className="p-4">
        {activeTab === "active-campaigns" && (
          <>
            {activeCampaigns.length > 0 ? (
              <CampaignList campaigns={activeCampaigns} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                No active campaigns for this region yet.
                {userRole === "organization" && (
                  <div className="mt-4">
                    <Button size="sm" onClick={handleCreateCampaign}>
                      Create First Campaign
                    </Button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {activeTab === "completed-campaigns" && (
          <>
            {completedCampaigns.length > 0 ? (
              <CampaignList
                campaigns={completedCampaigns}
                // onCampaignClick={(campaign) =>
                //   router.push(`/explore/campaign/${campaign.id}`)
                // }
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                No completed campaigns for this region yet.
              </div>
            )}
          </>
        )}

        {activeTab === "needed-items" && (
          <div className="space-y-6 py-4">
            <div>
              <h3 className="text-lg font-medium mb-3">
                AI-Predicted Resource Needs
              </h3>
              {/* <ResourceNeeds resourceNeeds={region.predictedNeeds || {}} /> */}
            </div>

            {userRole === "recipient" && (
              <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
                <h4 className="font-medium text-gray-900">
                  Are these predictions accurate?
                </h4>
                <p className="text-sm text-gray-600">
                  Help us improve our AI predictions by providing feedback on
                  what resources are actually needed in your area.
                </p>
                <div className="pt-1">
                  <Button size="sm" onClick={handleRegisterNeeds}>
                    Update Resource Needs
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Role-specific actions */}
        <div className="mt-6">
          {userRole === "organization" && (
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Organization Actions
              </h2>
              <div className="flex flex-wrap gap-3">
                <Button size="sm" onClick={handleCreateCampaign}>
                  Create New Campaign
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    router.push(`/organization/analytics/region/${region.id}`)
                  }
                >
                  View Region Analytics
                </Button>
              </div>
            </div>
          )}

          {userRole === "recipient" && (
            <div className="p-6 bg-green-50 rounded-lg border border-green-100 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Recipient Actions
              </h2>
              <div className="flex flex-wrap gap-3">
                <Button size="sm" onClick={handleRegisterNeeds}>
                  Register Your Needs
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    router.push(`/recipient/aid-status?regionId=${region.id}`)
                  }
                >
                  Check Aid Status
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleBasedRegionDetail;
