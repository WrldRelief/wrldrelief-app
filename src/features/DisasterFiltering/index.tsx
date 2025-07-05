"use client";

import { DisasterLocation } from "@/entities/disaster";
import { useMemo, useState } from "react";
import type { Feature, Point } from "geojson";

// Disaster types list
export const disasterTypes = [
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

// Urgency levels list
export const urgencyLevels = ["critical", "high", "medium", "low"];

export interface DisasterFilterState {
  typeFilter: string;
  urgencyFilter: string;
  searchQuery: string;
}

export interface UseDisasterFilteringProps {
  disasters: DisasterLocation[];
  initialState?: Partial<DisasterFilterState>;
}

export interface UseDisasterFilteringResult {
  typeFilter: string;
  urgencyFilter: string;
  searchQuery: string;
  setTypeFilter: (type: string) => void;
  setUrgencyFilter: (urgency: string) => void;
  setSearchQuery: (query: string) => void;
  filteredDisasters: DisasterLocation[];
  filteredMarkers: Feature<Point, DisasterLocation>[];
}

export const useDisasterFiltering = ({
  disasters,
  initialState = {},
}: UseDisasterFilteringProps): UseDisasterFilteringResult => {
  // Filter state
  const [typeFilter, setTypeFilter] = useState<string>(
    initialState.typeFilter || ""
  );
  const [urgencyFilter, setUrgencyFilter] = useState<string>(
    initialState.urgencyFilter || ""
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    initialState.searchQuery || ""
  );

  // Filtered disasters based on filters
  const filteredDisasters = useMemo(() => {
    return disasters.filter((disaster) => {
      const matchesType = typeFilter === "" || disaster.type === typeFilter;
      const matchesUrgency =
        urgencyFilter === "" || disaster.urgency === urgencyFilter;
      const matchesSearch =
        searchQuery === "" ||
        disaster.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        disaster.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesType && matchesUrgency && matchesSearch;
    });
  }, [disasters, typeFilter, urgencyFilter, searchQuery]);

  // Convert filtered disasters to GeoJSON markers
  const filteredMarkers = useMemo<Feature<Point, DisasterLocation>[]>(() => {
    return filteredDisasters.map((loc) => ({
      type: "Feature" as const, // Use const assertion to ensure literal type
      properties: {
        ...loc, // Spread all properties from the DisasterLocation
      },
      geometry: {
        type: "Point" as const, // Use const assertion to ensure literal type
        coordinates: [loc.longitude, loc.latitude],
      },
    }));
  }, [filteredDisasters]);

  return {
    typeFilter,
    urgencyFilter,
    searchQuery,
    setTypeFilter,
    setUrgencyFilter,
    setSearchQuery,
    filteredDisasters,
    filteredMarkers,
  };
};
