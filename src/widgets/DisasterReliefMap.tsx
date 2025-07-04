"use client";

import React from "react";
import { Map } from "@/features/Map";
import { DisasterLocation, MOCK_DISASTER_LOCATIONS } from "@/entities/disaster";
import type { Feature, Point } from "geojson";

const geojsonMarkers: Feature<Point, DisasterLocation>[] =
  MOCK_DISASTER_LOCATIONS.map((loc) => ({
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

/**
 * @interface DisasterMapProps
 * @description DisasterMap 컴포넌트의 Props 정의
 */
interface DisasterMapProps {
  onMarkerSelect: (location: DisasterLocation) => void; // 마커 클릭 시 상세 정보를 전달할 콜백
  markers?: Feature<Point, DisasterLocation>[];
}

// We'll use DisasterLocation directly as our GeoJSON feature properties

export const DisasterMap: React.FC<DisasterMapProps> = ({
  onMarkerSelect,
  markers,
}) => {
  const handleMarkerClick = (location: DisasterLocation) => {
    onMarkerSelect(location);
  };

  return (
    <div className="w-full h-[calc(50dvh)] relative">
      <Map
        initialCoords={{ lng: 5.37, lat: 43.3, zoom: 0.9 }} // 유럽 전역을 볼 수 있는 초기 중심/줌
        markers={markers || geojsonMarkers}
        onMarkerClick={handleMarkerClick}
        spinGlobe={true} // 지구본 회전 기능 활성화
        trackUserLocation={true}
      />
    </div>
  );
};
