"use client";

import { DisasterLocation } from "@/entities/disaster";
import {
  getDisasterIcon,
  getUrgencyColorClass,
} from "@/features/DisasterDisplay";
import { usePagination } from "@/features/DisasterPagination";
import { ListItem } from "@worldcoin/mini-apps-ui-kit-react";
import React from "react";

interface DisasterListProps {
  disasters: DisasterLocation[];
  onDisasterSelect: (disaster: DisasterLocation) => void;
  itemsPerPage?: number;
}

export const DisasterList: React.FC<DisasterListProps> = ({
  disasters,
  onDisasterSelect,
  itemsPerPage = 5,
}) => {
  const { currentPage, currentPageItems, PaginationControls } = usePagination({
    totalItems: disasters.length,
    itemsPerPage,
  });

  // Get current page disasters
  const currentDisasters = currentPageItems
    .map((index) => disasters[index])
    .filter(Boolean);

  if (disasters.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 text-center text-gray-500">
        No disasters match your filters
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 gap-3">
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
            onClick={() => onDisasterSelect(disaster)}
          />
        ))}
      </div>

      {/* Pagination controls with added bottom padding to prevent nav overlap */}
      <div className="pb-20 pt-4">
        <PaginationControls />
      </div>
    </div>
  );
};

export default DisasterList;
