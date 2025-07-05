"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { DisasterLocation } from "@/entities/disaster/types";

// Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

/**
 * @interface MapProps
 * @description Map 컴포넌트의 Props 정의
 */
interface MapProps {
  initialCoords?: {
    lng: number;
    lat: number;
    zoom: number;
    minZoom?: number;
    maxZoom?: number;
  };
  markers?: GeoJSON.Feature<GeoJSON.Point, DisasterLocation>[];
  onMarkerClick?: (properties: DisasterLocation) => void;
  spinGlobe?: boolean;
  trackUserLocation?: boolean;
}

// 지구본 회전 관련 상수
const SECONDS_PER_REVOLUTION = 120;
const MAX_SPIN_ZOOM = 2;
const SLOW_SPIN_ZOOM = 3;

/**
 * @description 지도를 표시하고 관리하는 Map 컴포넌트
 */
export const Map = ({
  initialCoords,
  markers,
  onMarkerClick,
  spinGlobe: enableSpin = false,
  trackUserLocation = false,
}: MapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const [isSpinning, setIsSpinning] = useState(enableSpin);
  const userInteractingRef = useRef(false);

  const defaultCoords = {
    lng: 126.978, // 서울 기준
    lat: 37.5665,
    zoom: 1.5,
  };

  const currentCoords = initialCoords || defaultCoords;

  const spinGlobeFn = useCallback(() => {
    const map = mapRef.current;
    if (!map || !isSpinning || userInteractingRef.current) {
      return;
    }

    const zoom = map.getZoom();
    if (zoom < MAX_SPIN_ZOOM) {
      let distancePerSecond = 360 / SECONDS_PER_REVOLUTION;
      if (zoom > SLOW_SPIN_ZOOM) {
        const zoomDif =
          (MAX_SPIN_ZOOM - zoom) / (MAX_SPIN_ZOOM - SLOW_SPIN_ZOOM);
        distancePerSecond *= zoomDif;
      }
      const center = map.getCenter();
      center.lng -= distancePerSecond;
      map.easeTo({ center, duration: 1000, easing: (n) => n });
    }
  }, [isSpinning]);

  // 맵 초기화 Effect
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [currentCoords.lng, currentCoords.lat],
      zoom: currentCoords.zoom,
      attributionControl: false,
      minZoom: initialCoords?.minZoom || 0.5,
      maxZoom: initialCoords?.maxZoom || 18,
    });

    mapRef.current = map;

    // 사용자 상호작용 이벤트 리스너
    const onInteractionStart = () => {
      userInteractingRef.current = true;
    };
    map.on("mousedown", onInteractionStart);
    map.on("touchstart", onInteractionStart);

    const onInteractionEnd = () => {
      userInteractingRef.current = false;
      spinGlobeFn();
    };
    map.on("mouseup", onInteractionEnd);
    map.on("touchend", onInteractionEnd);
    map.on("dragend", onInteractionEnd);
    map.on("pitchend", onInteractionEnd);
    map.on("rotateend", onInteractionEnd);

    map.on("moveend", spinGlobeFn);

    // Add GeolocateControl with trackUserLocation option
    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: trackUserLocation,
      showUserHeading: true,
      fitBoundsOptions: {
        zoom: 0.8,
        maxZoom: 14,
      },
    });

    map.addControl(geolocateControl, "top-right");

    // Automatically trigger the geolocate control if trackUserLocation is true
    if (trackUserLocation) {
      map.once("load", () => {
        setTimeout(() => {
          geolocateControl.trigger();
        }, 1000);
      });
    }

    spinGlobeFn();

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackUserLocation]); // Add trackUserLocation to the dependency array

  // 마커 핸들링 Effect
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !markers) return;

    // Define color constants for better readability
    const URGENCY_COLORS = {
      critical: "#ff0000", // Red
      high: "#ff4500", // Orange Red
      medium: "#ffd700", // Gold
      low: "#32cd32", // Lime Green
      default: "#808080", // Gray (fallback)
    };

    // Define marker size ranges based on affected population
    const POPULATION_MARKER_SIZES = [
      [0, 5], // Min population: 5px radius
      [1000, 7], // 1,000 people: 10px radius
      [5000, 9], // 5,000 people: 15px radius
      [10000, 11], // 10,000 people: 20px radius
      [50000, 13], // 50,000 people: 25px radius
      [100000, 15], // 100,000+ people: 30px radius
    ];

    const handleMarkers = () => {
      // GeoJSON data object with our markers
      const geoJsonData = {
        type: "FeatureCollection" as const,
        features: markers,
      };

      // Update existing source or create new one
      if (map.getSource("disaster-data")) {
        const source = map.getSource("disaster-data") as mapboxgl.GeoJSONSource;
        source.setData(geoJsonData);
      } else {
        // Add data source
        map.addSource("disaster-data", {
          type: "geojson",
          data: geoJsonData,
        });

        // Add visual layer for the markers
        map.addLayer({
          id: "disaster-circle-layer",
          type: "circle",
          source: "disaster-data",
          paint: {
            // Color based on urgency level
            "circle-color": [
              "match",
              ["get", "urgency"],
              "critical",
              URGENCY_COLORS.critical,
              "high",
              URGENCY_COLORS.high,
              "medium",
              URGENCY_COLORS.medium,
              "low",
              URGENCY_COLORS.low,
              URGENCY_COLORS.default,
            ],

            // Size based on affected population
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["get", "affectedPeople"],
              ...POPULATION_MARKER_SIZES.flat(),
            ],

            // Visual styling
            "circle-opacity": 0.7,
            "circle-stroke-color": "#ffffff",
            "circle-stroke-width": 1,
          },
        });

        if (onMarkerClick) {
          map.on("click", "disaster-circle-layer", (e) => {
            if (e.features && e.features[0]?.properties) {
              onMarkerClick(e.features[0].properties as DisasterLocation);
            }
          });
          map.on("mouseenter", "disaster-circle-layer", () => {
            map.getCanvas().style.cursor = "pointer";
          });
          map.on("mouseleave", "disaster-circle-layer", () => {
            map.getCanvas().style.cursor = "";
          });
        }
      }
    };

    if (map.isStyleLoaded()) {
      handleMarkers();
    } else {
      map.once("load", handleMarkers);
    }
  }, [markers, onMarkerClick]);

  // Prop에 따른 회전 상태 동기화 Effect
  useEffect(() => {
    setIsSpinning(enableSpin);
  }, [enableSpin]);

  // 회전 상태 변경 시 애니메이션 제어 Effect
  useEffect(() => {
    spinGlobeFn();
  }, [isSpinning, spinGlobeFn]);

  // Handle trackUserLocation changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Find the existing geolocate control
    const existingControls = map
      .getContainer()
      .querySelectorAll(".mapboxgl-ctrl-geolocate");

    if (existingControls.length > 0 && trackUserLocation) {
      // Simulate click on the geolocate button if trackUserLocation is enabled
      const geolocateButton = existingControls[0] as HTMLElement;
      if (
        geolocateButton &&
        !geolocateButton.classList.contains("mapboxgl-ctrl-geolocate-active")
      ) {
        geolocateButton.click();
      }
    }
  }, [trackUserLocation]);

  return (
    <div
      className="w-full h-full relative"
      style={{ isolation: "isolate", contain: "content" }}
    >
      <div
        ref={mapContainerRef}
        className="w-full h-full"
        aria-label="Interactive map"
        tabIndex={0}
        style={{
          transform: "translate3d(0,0,0)",
          willChange: "transform",
          backfaceVisibility: "hidden",
        }}
      />
    </div>
  );
};

export default Map;
