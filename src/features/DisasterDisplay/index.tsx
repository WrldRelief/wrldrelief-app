"use client";

/**
 * Utility functions for displaying disaster information
 */

// Get emoji icon based on disaster type
export const getDisasterIcon = (type: string): string => {
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

// Get color class based on urgency level
export const getUrgencyColorClass = (urgency: string): string => {
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

// Get background color class based on urgency level
export const getUrgencyBgClass = (urgency: string): string => {
  switch (urgency) {
    case "critical":
      return "bg-red-100 text-red-800";
    case "high":
      return "bg-orange-100 text-orange-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Format number with commas
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

// Capitalize first letter of a string
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
