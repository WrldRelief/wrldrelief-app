"use client";

import { MOCK_DISASTER_LOCATIONS } from "@/entities/disaster";
import { useDisasterFiltering } from "@/features/DisasterFiltering";
import { DisasterMap } from "@/widgets/DisasterReliefMap";
import { DisasterList } from "@/widgets/DisasterList";
import { DisasterFilter } from "@/widgets/DisasterFilter";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Page } from "@/features/PageLayout";
import { TopBar } from "@worldcoin/mini-apps-ui-kit-react";

const Explore = () => {
  const router = useRouter();

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
    disasters: MOCK_DISASTER_LOCATIONS,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDisasters = filteredDisasters.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredDisasters.length / itemsPerPage);

  // Handle page changes
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleDisasterSelect = (disaster: any) => {
    router.push(`/explore/${disaster.id}`);
  };

  return (
    <>
      <Page.Header>
        <TopBar title="Explore" />
      </Page.Header>
      <Page.Main>
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

          <DisasterList
            disasters={filteredDisasters}
            onDisasterSelect={handleDisasterSelect}
            itemsPerPage={5}
          />
        </div>
      </Page.Main>
    </>
  );
};

export default Explore;
