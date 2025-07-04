"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface LocationMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  className?: string;
}

export const LocationMap = ({
  latitude,
  longitude,
  zoom = 12,
  className = "h-40 w-full rounded-md",
}: LocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [longitude, latitude],
      zoom: zoom,
      interactive: false, // Disable map interaction since it's just for display
    });

    // Add a marker at the location
    new mapboxgl.Marker({ color: "#3B82F6" })
      .setLngLat([longitude, latitude])
      .addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [latitude, longitude, zoom]);

  return (
    <div className={className}>
      <div ref={mapContainer} className="h-full w-full rounded-md" />
    </div>
  );
};

export default LocationMap;
