"use client";

import { DisasterLocation } from "@/entities/disaster";
import { useDisasterFiltering } from "@/features/DisasterFiltering";
import { DisasterMap } from "@/widgets/DisasterReliefMap";
import { DisasterList } from "@/widgets/DisasterList";
import { DisasterFilter } from "@/widgets/DisasterFilter";
import { useRouter } from "next/navigation";
import { Page } from "@/features/PageLayout";
import { TopBar } from "@worldcoin/mini-apps-ui-kit-react";
import { useDisasterData } from "@/entities/disaster/disasterData";
import { useState, useEffect } from "react";

const Explore = () => {
  const router = useRouter();
  // 수정: useDisasterData 훅에서 이미 확장된 재난 데이터를 직접 사용
  const { data: disasterLocations, isLoading: loading, isError: error } = useDisasterData();
  
  // 디버깅을 위한 로그 추가
  useEffect(() => {
    console.log("재난 데이터 상태:", { 
      count: disasterLocations?.length || 0, 
      loading, 
      error,
      firstItem: disasterLocations?.[0] 
    });
  }, [disasterLocations, loading, error]);

  // Use the disaster filtering feature
  const {
    typeFilter,
    urgencyFilter,
    searchQuery,
    setTypeFilter,
    setUrgencyFilter,
    setSearchQuery,
    filteredDisasters,
    filteredMarkers,
  } = useDisasterFiltering({
    disasters: disasterLocations,
  });

  const handleDisasterSelect = (disaster: DisasterLocation) => {
    router.push(`/explore/${disaster.id}`);
  };

  return (
    <>
      <Page.Header>
        <TopBar title="Explore" />
      </Page.Header>
      <Page.Main>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-t-blue-500 border-b-blue-700 border-l-blue-500 border-r-blue-700 rounded-full animate-spin mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading disasters...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-red-500">
              <p>Error loading disaster data.</p>
              <p className="text-sm mt-2">Please try again later.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full gap-4">
            {/* Map */}
            <div className="h-[50vh]">
              <DisasterMap
                markers={filteredMarkers.length > 0 ? filteredMarkers : undefined}
                onMarkerSelect={handleDisasterSelect}
              />
            </div>

            {/* Filter controls */}
            <DisasterFilter
              typeFilter={typeFilter}
              urgencyFilter={urgencyFilter}
              searchQuery={searchQuery}
              onTypeFilterChange={setTypeFilter}
              onUrgencyFilterChange={setUrgencyFilter}
              onSearchQueryChange={setSearchQuery}
            />

            {/* Disaster list with pagination */}
            {disasterLocations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No disasters found.</p>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or check back later.</p>
              </div>
            ) : (
              <DisasterList
                disasters={filteredDisasters}
                onDisasterSelect={handleDisasterSelect}
              />
            )}
          </div>
        )}
      </Page.Main>
    </>
  );
};

export default Explore;
