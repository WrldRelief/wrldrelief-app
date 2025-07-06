"use client";

import { Page } from "@/features/PageLayout";
import { TopBar } from "@worldcoin/mini-apps-ui-kit-react";
import { DisasterMap } from "@/widgets/DisasterReliefMap";
import { DefaultDonationStats } from "@/widgets/DonationStats";
import { useUserModel } from "@/features/user/model";
import { Marble } from "@worldcoin/mini-apps-ui-kit-react";
import { useDisasterData } from "@/entities/disaster/disasterData";
import { DisasterLocationExtended } from "@/entities/disaster/types";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import type { Feature, Point } from "geojson";

export default function Home() {
  const { user } = useUserModel();
  const router = useRouter();
  const { data: disasterLocations, isLoading, isError } = useDisasterData();

  // 디버깅을 위한 로그 추가
  useEffect(() => {
    console.log("홈 화면 재난 데이터 상태:", {
      count: disasterLocations?.length || 0,
      isLoading,
      isError,
      firstItem: disasterLocations?.[0],
    });
  }, [disasterLocations, isLoading, isError]);

  // Extract display information from user data
  const displayName = user?.worldcoinInfo?.displayName || "Anonymous";

  // 재난 데이터를 GeoJSON 형식으로 변환
  const disasterGeoJsonMarkers = useMemo(() => {
    if (!disasterLocations) return [];
    
    return disasterLocations.map((loc) => ({
      type: "Feature",
      properties: {
        id: loc.id,
        name: loc.name,
        type: loc.type,
        urgency: loc.urgency,
        affectedPeople: loc.affectedPeople,
        predictedNeeds: loc.predictedNeeds,
        description: loc.description,
        imageUrl: loc.imageUrl,
        latitude: loc.latitude,
        longitude: loc.longitude,
      },
      geometry: {
        type: "Point",
        coordinates: [loc.longitude, loc.latitude],
      },
    })) as Feature<Point, DisasterLocationExtended>[];
  }, [disasterLocations]);

  // 재난 선택 핸들러
  const handleDisasterSelect = (disaster: { id: string }) => {
    router.push(`/explore/${disaster.id}`);
  };

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
        {isLoading ? (
          <div className="flex items-center justify-center h-[calc(100vh-220px)] w-full">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-t-blue-500 border-b-blue-700 border-l-blue-500 border-r-blue-700 rounded-full animate-spin mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading disasters...</p>
            </div>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center h-[calc(100vh-220px)] w-full">
            <div className="text-center text-red-500">
              <p>Error loading disaster data.</p>
              <p className="text-sm mt-2">Please try again later.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Map Section - Takes remaining height */}
            <div className="w-full h-[calc(100vh-400px)]">
              <DisasterMap
                markers={disasterGeoJsonMarkers}
                onMarkerSelect={handleDisasterSelect}
              />
            </div>
            {/* Donation Stats Section */}
            <div className="w-full h-full max-w-4xl mb-4 p-4">
              <DefaultDonationStats />
            </div>
          </>
        )}
      </Page.Main>
    </>
  );
}
