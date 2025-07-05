"use client";

import React, { useState } from "react";
import { DisasterLocation } from "@/entities/disaster/types";
import Image from "next/image";
import { useUserRole } from "@/context/UserRoleContext";
import { useRouter } from "next/navigation";
import { Button, Tabs, TabItem } from "@worldcoin/mini-apps-ui-kit-react";
import { Activity, CheckCircle, Package } from "iconoir-react";
import { MOCK_CAMPAIGNS } from "@/entities/campaign";
import { getUrgencyBgClass } from "@/features/DisasterDisplay";
import dynamic from "next/dynamic";

// Dynamically import Map to avoid SSR issues
const Map = dynamic(() => import("@/features/Map").then((mod) => mod.Map), {
  ssr: false,
  loading: () => (
    <div className="h-48 w-full bg-gray-100 rounded-md animate-pulse" />
  ),
});

interface RegionDetailProps {
  region: DisasterLocation;
}

export const RegionDetail: React.FC<RegionDetailProps> = ({ region }) => {
  const [activeTab, setActiveTab] = useState<
    "needed-items" | "active-campaigns" | "completed-campaigns"
  >("active-campaigns");
  const { userRole } = useUserRole();
  const router = useRouter();

  // Filter campaigns by the selected disaster region
  const campaigns = MOCK_CAMPAIGNS.filter(
    (campaign) => campaign.disasterId === region.id
  );
  const activeCampaigns = campaigns.filter(
    (campaign) => campaign.status === "ACTIVE"
  );
  const completedCampaigns = campaigns.filter(
    (campaign) => campaign.status === "ENDED"
  );

  // Organization-specific actions
  const handleCreateCampaign = () => {
    router.push(`/organization/campaigns/create?regionId=${region.id}`);
  };

  // Recipient-specific actions
  const handleRegisterNeeds = () => {
    router.push(`/recipient/register-needs?regionId=${region.id}`);
  };

  return (
    <div className="flex flex-col w-full bg-white rounded-lg shadow-md overflow-hidden">
      {/* Region header with image */}
      <div className="relative w-full h-48">
        <Image
          src={region.imageUrl || "/images/default.jpg"}
          alt={region.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <h1 className="text-2xl font-bold text-white">{region.name}</h1>
          <div className="flex items-center mt-2">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${getUrgencyBgClass(
                region.urgency
              )}`}
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
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-600">Affected People</p>
            <p>{region.affectedPeople.toLocaleString()}</p>
          </div>
          <div>
            <p className="font-medium text-gray-600">Location</p>
            <p>
              {region.latitude.toFixed(4)}, {region.longitude.toFixed(4)}
            </p>
          </div>
        </div>
      </div>

      {/* Map view */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-2">Location</h2>
        <div className="h-48 rounded-md overflow-hidden">
          <Map
            initialCoords={{
              lng: region.longitude,
              lat: region.latitude,
              zoom: 5,
            }}
            markers={[
              {
                type: "Feature",
                properties: {
                  id: region.id,
                  name: region.name,
                  type: region.type,
                  urgency: region.urgency,
                  affectedPeople: region.affectedPeople,
                  predictedNeeds: region.predictedNeeds,
                  description: region.description,
                  latitude: region.latitude,
                  longitude: region.longitude,
                  imageUrl: region.imageUrl,
                },
                geometry: {
                  type: "Point",
                  coordinates: [region.longitude, region.latitude],
                },
              },
            ]}
            spinGlobe={false}
            trackUserLocation={false}
          />
        </div>
      </div>

      {/* Role-based actions */}
      {userRole === "organization" && (
        <div className="p-4 border-b bg-blue-50">
          <h2 className="text-lg font-semibold mb-2">Organization Actions</h2>
          <Button
            className="w-full"
            onClick={handleCreateCampaign}
            aria-label="Create a new campaign for this disaster"
          >
            Create New Campaign
          </Button>
        </div>
      )}

      {userRole === "recipient" && (
        <div className="p-4 border-b bg-green-50">
          <h2 className="text-lg font-semibold mb-2">Request Assistance</h2>
          <Button
            className="w-full"
            onClick={handleRegisterNeeds}
            aria-label="Register your needs for this disaster"
          >
            Register Your Needs
          </Button>
        </div>
      )}

      {/* Tabs for different sections */}
      <div className="p-4">
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(
              value as
                | "needed-items"
                | "active-campaigns"
                | "completed-campaigns"
            )
          }
        >
          <TabItem
            value="active-campaigns"
            icon={<Activity width={20} height={20} />}
            label={`Active Campaigns (${activeCampaigns.length})`}
            aria-label="View active campaigns"
          />
          <TabItem
            value="completed-campaigns"
            icon={<CheckCircle width={20} height={20} />}
            label={`Completed (${completedCampaigns.length})`}
            aria-label="View completed campaigns"
          />
          <TabItem
            value="needed-items"
            icon={<Package width={20} height={20} />}
            label="Needed Items"
            aria-label="View needed items"
          />
        </Tabs>

        {/* Tab content */}
        <div className="mt-4">
          {activeTab === "active-campaigns" && (
            <div>
              {activeCampaigns.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No active campaigns for this disaster yet.
                  {userRole === "organization" && (
                    <div className="mt-4">
                      <Button
                        onClick={handleCreateCampaign}
                        aria-label="Create a new campaign for this disaster"
                      >
                        Create First Campaign
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {activeCampaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() =>
                        router.push(`/explore/${region.id}/${campaign.id}`)
                      }
                    >
                      <h3 className="font-semibold">{campaign.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {campaign.description}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Active
                        </span>
                        <span className="text-xs text-gray-500">
                          By {campaign.organizer}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "completed-campaigns" && (
            <div>
              {completedCampaigns.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No completed campaigns for this disaster yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {completedCampaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() =>
                        router.push(`/explore/${region.id}/${campaign.id}`)
                      }
                    >
                      <h3 className="font-semibold">{campaign.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {campaign.description}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Completed
                        </span>
                        <span className="text-xs text-gray-500">
                          By {campaign.organizer}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "needed-items" && (
            <div>
              <h3 className="font-semibold mb-2">
                AI Predicted Resource Needs
              </h3>
              <div className="space-y-2">
                {region.predictedNeeds &&
                  Object.entries(region.predictedNeeds).map(
                    ([need, amount]) => (
                      <div
                        key={need}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                      >
                        <span className="font-medium">
                          {need.charAt(0).toUpperCase() + need.slice(1)}
                        </span>
                        <span className="text-gray-600">{amount}</span>
                      </div>
                    )
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegionDetail;
