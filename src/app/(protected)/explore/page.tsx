"use client";

import { Page } from "@/features/PageLayout";
import { Button, ListItem, TopBar } from "@worldcoin/mini-apps-ui-kit-react";
import { useRouter } from "next/navigation";
import { DisasterMap } from "@/widgets/DisasterReliefMap";
import { DisasterLocation, MOCK_DISASTER_LOCATIONS } from "@/entities/disaster";
import { useState, useMemo } from "react";

// 재난 유형 목록
const disasterTypes = [
  "all",
  "earthquake",
  "flood",
  "wildfire",
  "famine",
  "conflict",
  "drought",
  "typhoon",
  "volcano",
  "tsunami",
  "cyclone",
  "storm",
  "heatwave",
  "economic",
  "other",
];

// 긴급도 목록
const urgencyLevels = ["all", "critical", "high", "medium", "low"];

const Explore = () => {
  const router = useRouter();
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 필터링된 재난 목록
  const filteredDisasters = useMemo(() => {
    return MOCK_DISASTER_LOCATIONS.filter((disaster) => {
      const matchesType = typeFilter === "all" || disaster.type === typeFilter;
      const matchesUrgency =
        urgencyFilter === "all" || disaster.urgency === urgencyFilter;
      const matchesSearch =
        searchQuery === "" ||
        disaster.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        disaster.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesType && matchesUrgency && matchesSearch;
    });
  }, [typeFilter, urgencyFilter, searchQuery]);

  // GeoJSON 마커 생성
  const filteredMarkers = useMemo(() => {
    return filteredDisasters.map((loc) => ({
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
    }));
  }, [filteredDisasters]);

  const handleDisasterSelect = (location: DisasterLocation) => {
    router.push(`/explore/${location.id}`);
  };

  // 재난 유형에 따른 아이콘 반환
  const getDisasterIcon = (type: string) => {
    switch (type) {
      case "earthquake":
        return "🌋";
      case "flood":
        return "🌊";
      case "wildfire":
        return "🔥";
      case "famine":
        return "🍽️";
      case "conflict":
        return "⚔️";
      case "drought":
        return "☀️";
      case "typhoon":
        return "🌀";
      case "volcano":
        return "🌋";
      case "tsunami":
        return "🌊";
      case "cyclone":
        return "🌀";
      case "storm":
        return "⛈️";
      case "heatwave":
        return "🔥";
      case "economic":
        return "💰";
      default:
        return "⚠️";
    }
  };

  // 긴급도에 따른 색상 클래스 반환
  const getUrgencyColorClass = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "text-red-600";
      case "high":
        return "text-orange-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

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

  return (
    <>
      <Page.Header className="p-0">
        <TopBar title={"Explore Disasters"} />
      </Page.Header>
      <Page.Main className="flex flex-col items-center justify-start mb-16">
        {/* 지도 컴포넌트 */}
        <div className="w-full mb-4">
          <h2 className="text-xl font-semibold px-4 py-2">
            Active Disaster Areas
          </h2>
          <DisasterMap
            onMarkerSelect={handleDisasterSelect}
            // 필터링된 마커만 전달
            markers={filteredMarkers.length > 0 ? filteredMarkers : undefined}
          />
        </div>

        {/* 필터링 컨트롤 */}
        <div className="w-full mb-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-2">Filter Disasters</h3>

            {/* 검색 필드 */}
            <div className="mb-3">
              <input
                type="text"
                placeholder="Search disasters..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* 필터 컨트롤 */}
            <div className="flex flex-wrap gap-2">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  {disasterTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Urgency
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={urgencyFilter}
                  onChange={(e) => setUrgencyFilter(e.target.value)}
                >
                  {urgencyLevels.map((level) => (
                    <option key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 재난 목록 */}
        <div className="w-full">
          <h3 className="text-lg font-semibold mb-2">
            Disaster List ({filteredDisasters.length})
          </h3>
          {filteredDisasters.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-4 text-center text-gray-500">
              No disasters match your filters
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-3 mb-4">
                {currentDisasters.map((disaster) => (
                  <ListItem
                    key={disaster.id}
                    label={disaster.name}
                    description={disaster.description}
                    startAdornment={
                      <div className="text-2xl" aria-hidden="true">
                        {getDisasterIcon(disaster.type)}
                      </div>
                    }
                    endAdornment={
                      <div className="flex flex-col items-end">
                        <span
                          className={`text-xs font-medium ${getUrgencyColorClass(
                            disaster.urgency
                          )}`}
                        >
                          {disaster.urgency.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {disaster.affectedPeople.toLocaleString()} affected
                        </span>
                      </div>
                    }
                    onClick={() => handleDisasterSelect(disaster)}
                  />
                ))}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4 mb-6">
                  <Button
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    size="icon"
                  >
                    &laquo;
                  </Button>

                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Show current page, first, last, and pages around current
                    const shouldShowPage =
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      Math.abs(pageNumber - currentPage) <= 1;

                    // Show ellipsis for gaps
                    if (!shouldShowPage) {
                      // Only show ellipsis once between gaps
                      if (pageNumber === 2 || pageNumber === totalPages - 1) {
                        return (
                          <span key={`ellipsis-${pageNumber}`} className="px-2">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }

                    return (
                      <Button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        size="icon"
                        variant={
                          currentPage === pageNumber ? "primary" : "secondary"
                        }
                        aria-label={`Page ${pageNumber}`}
                        aria-current={
                          currentPage === pageNumber ? "page" : undefined
                        }
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}

                  <Button
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                    size="icon"
                  >
                    &raquo;
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </Page.Main>
    </>
  );
};

export default Explore;
