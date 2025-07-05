"use client";

import { disasterTypes, urgencyLevels } from "@/features/DisasterFiltering";
import { capitalize } from "@/features/DisasterDisplay";
import React from "react";
import { Select, Button } from "@worldcoin/mini-apps-ui-kit-react";

interface DisasterFilterProps {
  typeFilter: string;
  urgencyFilter: string;
  searchQuery: string;
  onTypeFilterChange: (type: string) => void;
  onUrgencyFilterChange: (urgency: string) => void;
  onSearchQueryChange: (query: string) => void;
}

export const DisasterFilter: React.FC<DisasterFilterProps> = ({
  typeFilter,
  urgencyFilter,
  searchQuery,
  onTypeFilterChange,
  onUrgencyFilterChange,
  onSearchQueryChange,
}) => {
  return (
    <div>
      {/* <h3 className="text-lg font-semibold mb-2">Filter Disasters</h3> */}

      {/* Search field */}
      {/* <div className="mb-4">
        <input
          type="text"
          placeholder="Search disasters..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          aria-label="Search disasters"
        />
      </div>  */}

      {/* Filter selects using World UI Kit */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        {/* Type filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <Select
            onChange={(value) => onTypeFilterChange(value as string)}
            options={[
              ...disasterTypes.map((type) => ({
                label: capitalize(type),
                value: type,
              })),
            ]}
            value={typeFilter}
            placeholder="Select type"
          />
        </div>

        {/* Urgency filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Urgency
          </label>
          <Select
            onChange={(value) => onUrgencyFilterChange(value as string)}
            options={[
              ...urgencyLevels.map((level) => ({
                label: capitalize(level),
                value: level,
              })),
            ]}
            value={urgencyFilter}
            placeholder="Select urgency"
          />
        </div>
      </div>

      {/* Reset filters button */}
      {(typeFilter || urgencyFilter) && (
        <div className="mt-4 flex justify-end">
          <Button
            onClick={() => {
              onTypeFilterChange("");
              onUrgencyFilterChange("");
              onSearchQueryChange("");
            }}
            variant="secondary"
            size="sm"
            aria-label="Reset all filters"
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default DisasterFilter;
