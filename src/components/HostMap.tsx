"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { GeoJSONSource, MapLayerMouseEvent, Marker, Map as MapLibreMap } from "maplibre-gl";
import { getBaseMapStyle, getProviderBuildingLayer } from "@/lib/mapStyles";
import type { Coordinates, MapView, TeamCode, Venue } from "@/lib/types";

type MapMode = "world" | "flight" | "host" | "stadium";

type CountryMarker = {
  code: TeamCode;
  color: string;
  coordinates: Coordinates;
  flagSrc: string;
  name: string;
};

type HostMapProps = {
  countryMarkers: CountryMarker[];
  enableWorldSpin: boolean;
  flightStartCoordinates: Coordinates;
  focusVenueId?: string;
  mapView: MapView;
  mode: MapMode;
  onCountrySelect: (teamCode: TeamCode) => void;
  onHostSelect: () => void;
  onVenueSelect: (venueId: string) => void;
  progress: number;
  routeVenueIds: string[];
  showHostMarker: boolean;
  tournamentName: string;
  venues: Venue[];
};

const WORLD_VIEW: MapView = {
  center: [31, 8],
  zoom: 2.28,
  bearing: 0,
  pitch: 0
};

function clampLatitude(latitude: number) {
  return Math.max(-68, Math.min(72, latitude));
}

function wrapLongitude(longitude: number) {
  return ((((longitude + 180) % 360) + 360) % 360) - 180;
}

function getRouteCoordinates(venues: Venue[], routeVenueIds: string[]) {
  const venueById = new Map(venues.map((venue) => [venue.id, venue]));
  return routeVenueIds.flatMap((venueId) => {
    const venue = venueById.get(venueId);
    return venue ? [venue.coordinates] : [];
  });
}

function getRevealedRoute(routeCoordinates: Coordinates[], progress: number, fallback: Coordinates) {
  const clampedProgress = Math.max(0, Math.min(progress, 1));
  if (routeCoordinates.length === 0) return [fallback, fallback];
  if (routeCoordinates.length === 1) return [routeCoordinates[0], routeCoordinates[0]];

  const scaled = clampedProgress * (routeCoordinates.length - 1);
  const completedSegments = Math.floor(scaled);
  const currentPosition = interpolateRoute(routeCoordinates, clampedProgress) ?? routeCoordinates[0];

  return [...routeCoordinates.slice(0, completedSegments + 1), currentPosition];
}

function getFocusCoordinates(venues: Venue[], focusVenueId: string | undefined, fallback: Coordinates) {
  return venues.find((venue) => venue.id === focusVenueId)?.coordinates ?? fallback;
}

function interpolateRoute(route: Coordinates[], progress: number) {
  if (route.length === 0) return null;
  if (route.length === 1) return route[0];

  const clampedProgress = Math.max(0, Math.min(progress, 1));
  const scaled = clampedProgress * (route.length - 1);
  const startIndex = Math.min(Math.floor(scaled), route.length - 2);
  const localProgress = scaled - startIndex;
  const start = route[startIndex];
  const end = route[startIndex + 1];

  return [
    start[0] + (end[0] - start[0]) * localProgress,
    start[1] + (end[1] - start[1]) * localProgress
  ] satisfies Coordinates;
}

function getFirstTextLayerId(map: MapLibreMap) {
  return map.getStyle().layers?.find((layer) => layer.type === "symbol" && "layout" in layer && layer.layout?.["text-field"])?.id;
}

export function HostMap({
  countryMarkers,
  enableWorldSpin,
  flightStartCoordinates,
  focusVenueId,
  mapView,
  mode,
  onCountrySelect,
  onHostSelect,
  onVenueSelect,
  progress,
  routeVenueIds,
  showHostMarker,
  tournamentName,
  venues
}: HostMapProps) {
  const mapNodeRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapInstanceKey, setMapInstanceKey] = useState(0);
  const [isGlobeDragging, setIsGlobeDragging] = useState(false);
  const countryMarkerRefs = useRef<Marker[]>([]);
  const extrusionLayersAddedRef = useRef(false);
  const cameraKeyRef = useRef("");
  const cameraTimeoutRef = useRef<number | null>(null);
  const isUserInteractingRef = useRef(false);
  const spinResumeTimerRef = useRef<number | null>(null);
  const onHostSelectRef = useRef(onHostSelect);
  const onCountrySelectRef = useRef(onCountrySelect);
  const onVenueSelectRef = useRef(onVenueSelect);
  const progressRef = useRef(progress);
  const modeRef = useRef(mode);
  const routeCoordinates = useMemo(() => getRouteCoordinates(venues, routeVenueIds), [routeVenueIds, venues]);
  const worldFlightCoordinates = useMemo(() => [flightStartCoordinates, mapView.center] satisfies Coordinates[], [flightStartCoordinates, mapView.center]);
  const focusedCoordinates = useMemo(
    () => getFocusCoordinates(venues, focusVenueId, mapView.center),
    [focusVenueId, mapView.center, venues]
  );
  const focusedRouteProgress = useMemo(() => {
    const focusedRouteIndex = focusVenueId ? routeVenueIds.indexOf(focusVenueId) : -1;
    return focusedRouteIndex > 0 ? focusedRouteIndex / Math.max(routeVenueIds.length - 1, 1) : 0;
  }, [focusVenueId, routeVenueIds]);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    onHostSelectRef.current = onHostSelect;
  }, [onHostSelect]);

  useEffect(() => {
    onCountrySelectRef.current = onCountrySelect;
  }, [onCountrySelect]);

  useEffect(() => {
    onVenueSelectRef.current = onVenueSelect;
  }, [onVenueSelect]);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      const maplibregl = await import("maplibre-gl");
      if (!mapNodeRef.current || !isMounted || mapRef.current) return;

      const map = new maplibregl.Map({
        container: mapNodeRef.current,
        center: modeRef.current === "host" ? mapView.center : WORLD_VIEW.center,
        zoom: modeRef.current === "host" ? mapView.zoom : WORLD_VIEW.zoom,
        bearing: modeRef.current === "host" ? mapView.bearing : WORLD_VIEW.bearing,
        pitch: modeRef.current === "host" ? mapView.pitch : WORLD_VIEW.pitch,
        minZoom: 1,
        maxZoom: 18,
        maxPitch: 80,
        attributionControl: false,
        dragRotate: true,
        style: getBaseMapStyle()
      });

      map.dragRotate.enable();
      map.touchZoomRotate.enable();
      map.touchZoomRotate.enableRotation();
      map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");
      map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");
      map.addControl(new maplibregl.ScaleControl({ unit: "metric" }), "bottom-right");

      function pauseWorldSpin() {
        if (modeRef.current !== "world") return;
        isUserInteractingRef.current = true;
        setIsGlobeDragging(true);
        if (spinResumeTimerRef.current) {
          window.clearTimeout(spinResumeTimerRef.current);
        }
      }

      function resumeWorldSpin() {
        setIsGlobeDragging(false);
        if (spinResumeTimerRef.current) {
          window.clearTimeout(spinResumeTimerRef.current);
        }
        spinResumeTimerRef.current = window.setTimeout(() => {
          isUserInteractingRef.current = false;
        }, 1600);
      }

      map.on("dragstart", pauseWorldSpin);
      map.on("rotatestart", pauseWorldSpin);
      map.on("pitchstart", pauseWorldSpin);
      map.on("dragend", resumeWorldSpin);
      map.on("rotateend", resumeWorldSpin);
      map.on("pitchend", resumeWorldSpin);

      let didSetupMapLayers = false;

      function setupMapLayers() {
        if (!isMounted || didSetupMapLayers) return;

        if (!map.isStyleLoaded()) {
          map.once("idle", setupMapLayers);
          return;
        }

        didSetupMapLayers = true;
        map.setProjection({ type: modeRef.current === "world" || modeRef.current === "flight" ? "globe" : "mercator" });

        for (const layer of map.getStyle().layers ?? []) {
          if (layer.type === "fill-extrusion") {
            map.removeLayer(layer.id);
          }
        }

        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: getRevealedRoute(
                modeRef.current === "flight" ? worldFlightCoordinates : routeCoordinates,
                progressRef.current,
                mapView.center
              )
            }
          }
        });

        map.addSource("venues", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: venues.map((venue) => ({
              type: "Feature",
              properties: { id: venue.id, name: venue.city },
              geometry: {
                type: "Point",
                coordinates: venue.coordinates
              }
            }))
          }
        });

        map.addSource("stadiums", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: venues.flatMap((venue) => {
              if (!venue.model) return [];

              return [
                {
                  type: "Feature",
                  properties: {
                    height: venue.model.heightMeters,
                    baseHeight: venue.model.baseHeightMeters ?? 0,
                    name: venue.name
                  },
                  geometry: {
                    type: "Polygon",
                    coordinates: [venue.model.footprint]
                  }
                }
              ];
            })
          }
        });

        map.addSource("host", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {
                  name: tournamentName
                },
                geometry: {
                  type: "Point",
                  coordinates: mapView.center
                }
              }
            ]
          }
        });

        map.addLayer({
          id: "host-halo",
          type: "circle",
          source: "host",
          paint: {
            "circle-color": "#ef9f27",
            "circle-radius": 28,
            "circle-blur": 0.7,
            "circle-opacity": showHostMarker && modeRef.current === "world" ? 0.85 : 0
          }
        });

        map.addLayer({
          id: "host-dot",
          type: "circle",
          source: "host",
          paint: {
            "circle-color": "#ffbd55",
            "circle-radius": 11,
            "circle-stroke-color": "#f4f0e7",
            "circle-stroke-width": 3,
            "circle-opacity": showHostMarker && modeRef.current === "world" ? 1 : 0,
            "circle-stroke-opacity": showHostMarker && modeRef.current === "world" ? 1 : 0
          }
        });

        map.addLayer({
          id: "host-label",
          type: "symbol",
          source: "host",
          layout: {
            "text-field": ["get", "name"],
            "text-size": 15,
            "text-offset": [0, 1.75],
            "text-anchor": "top"
          },
          paint: {
            "text-color": "#f4f0e7",
            "text-halo-color": "#10100e",
            "text-halo-width": 2,
            "text-opacity": showHostMarker && modeRef.current === "world" ? 1 : 0
          }
        });

        map.addLayer({
          id: "route-glow",
          type: "line",
          source: "route",
          paint: {
            "line-color": "#ffbd55",
            "line-width": 11,
            "line-blur": 6,
            "line-opacity": modeRef.current === "host" ? 0.34 : 0
          },
          layout: {
            "line-cap": "round",
            "line-join": "round"
          }
        });

        map.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          paint: {
            "line-color": "#ef9f27",
            "line-width": 5,
            "line-opacity": modeRef.current === "host" ? 0.92 : 0
          },
          layout: {
            "line-cap": "round",
            "line-join": "round"
          }
        });

        map.addLayer({
          id: "route-trail",
          type: "line",
          source: "route",
          paint: {
            "line-color": "#fff4d5",
            "line-width": 2,
            "line-opacity": 0,
            "line-dasharray": [0.2, 1.6]
          },
          layout: {
            "line-cap": "round",
            "line-join": "round"
          }
        });

        map.addLayer({
          id: "venue-pulse",
          type: "circle",
          source: "venues",
          paint: {
            "circle-color": "#10100e",
            "circle-radius": 10,
            "circle-stroke-color": "#ffbd55",
            "circle-stroke-width": 3,
            "circle-opacity": modeRef.current === "host" ? 1 : 0,
            "circle-stroke-opacity": modeRef.current === "host" ? 1 : 0
          }
        });

        map.addLayer({
          id: "venue-labels",
          type: "symbol",
          source: "venues",
          layout: {
            "text-field": ["get", "name"],
            "text-size": 12,
            "text-offset": [0, 1.5],
            "text-anchor": "top"
          },
          paint: {
            "text-color": "#f4f0e7",
            "text-halo-color": "#10100e",
            "text-halo-width": 1.5,
            "text-opacity": modeRef.current === "host" ? 1 : 0
          }
        });

        map.on("mouseenter", "host-dot", () => {
          map.getCanvas().style.cursor = "pointer";
        });

        map.on("mouseleave", "host-dot", () => {
          map.getCanvas().style.cursor = "";
        });

        map.on("click", "host-dot", () => {
          onHostSelectRef.current();
        });

        map.on("mouseenter", "venue-pulse", () => {
          map.getCanvas().style.cursor = "pointer";
        });

        map.on("mouseleave", "venue-pulse", () => {
          map.getCanvas().style.cursor = "";
        });

        map.on("click", "venue-pulse", (event: MapLayerMouseEvent) => {
          const venueId = event.features?.[0]?.properties?.id;
          if (typeof venueId === "string") {
            onVenueSelectRef.current(venueId);
          }
        });
      }

      map.on("load", setupMapLayers);

      mapRef.current = map;
      setMapInstanceKey((key) => key + 1);
      setIsMapReady(true);

    }

    initMap();

    return () => {
      isMounted = false;
      if (cameraTimeoutRef.current) {
        window.clearTimeout(cameraTimeoutRef.current);
      }
      if (spinResumeTimerRef.current) {
        window.clearTimeout(spinResumeTimerRef.current);
      }
      countryMarkerRefs.current.forEach((marker) => marker.remove());
      countryMarkerRefs.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
      setIsMapReady(false);
      setIsGlobeDragging(false);
      isUserInteractingRef.current = false;
      extrusionLayersAddedRef.current = false;
    };
  }, [mapView, showHostMarker, tournamentName, venues]);

  useEffect(() => {
    const map = mapRef.current;
    let isCancelled = false;

    function removeCountryMarkers() {
      countryMarkerRefs.current.forEach((marker) => marker.remove());
      countryMarkerRefs.current = [];
    }

    removeCountryMarkers();

    if (!isMapReady || !map || mode !== "world" || countryMarkers.length === 0) return;

    async function syncCountryMarkers() {
      const maplibregl = await import("maplibre-gl");
      if (isCancelled || !mapRef.current) return;

      removeCountryMarkers();
      countryMarkerRefs.current = countryMarkers.map((marker) => {
        const markerElement = document.createElement("button");
        markerElement.className = "country-flag-marker";
        markerElement.style.setProperty("--marker-color", marker.color);
        markerElement.type = "button";
        markerElement.title = marker.name;
        markerElement.setAttribute("aria-label", `${marker.name} tournament team`);
        markerElement.innerHTML = `<img alt="" src="${marker.flagSrc}" />`;
        markerElement.addEventListener("click", () => {
          onCountrySelectRef.current(marker.code);
        });

        return new maplibregl.Marker({
          element: markerElement,
          anchor: "center"
        })
          .setLngLat(marker.coordinates)
          .addTo(mapRef.current!);
      });
    }

    syncCountryMarkers();

    return () => {
      isCancelled = true;
      removeCountryMarkers();
    };
  }, [countryMarkers, isMapReady, mapInstanceKey, mode]);

  useEffect(() => {
    const map = mapRef.current;
    if (!isMapReady || !map || mode !== "world") return;
    if (!enableWorldSpin) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frameId = 0;
    let timerId = 0;
    let lastTime = performance.now();
    const degreesPerMillisecond = 0.00042;

    function spinWorld(now: number) {
      const activeMap = mapRef.current;
      if (!activeMap || modeRef.current !== "world") return;

      const elapsed = Math.min(now - lastTime, 80);
      lastTime = now;
      if (isUserInteractingRef.current) {
        frameId = window.requestAnimationFrame(spinWorld);
        return;
      }
      const center = activeMap.getCenter();
      const nextLng = wrapLongitude(center.lng + elapsed * degreesPerMillisecond);
      activeMap.setCenter([nextLng, center.lat]);
      frameId = window.requestAnimationFrame(spinWorld);
    }

    timerId = window.setTimeout(() => {
      lastTime = performance.now();
      frameId = window.requestAnimationFrame(spinWorld);
    }, 1050);

    return () => {
      window.clearTimeout(timerId);
      window.cancelAnimationFrame(frameId);
    };
  }, [enableWorldSpin, isMapReady, mapInstanceKey, mode]);

  useEffect(() => {
    const map = mapRef.current;
    if (!isMapReady || !map) return;

    if (mode === "world") {
      map.dragPan.disable();
    } else {
      map.dragPan.enable();
    }
  }, [isMapReady, mapInstanceKey, mode]);

  useEffect(() => {
    const map = mapRef.current;
    if (!isMapReady || !map) return;

    const activeMap = map;
    const canvas = activeMap.getCanvas();
    let isPointerDragging = false;
    let pointerId: number | null = null;
    let startX = 0;
    let startY = 0;
    let startLng = 0;
    let startLat = 0;
    const degreesPerPixel = 0.16;

    function pauseManualSpin() {
      isUserInteractingRef.current = true;
      setIsGlobeDragging(true);
      if (spinResumeTimerRef.current) {
        window.clearTimeout(spinResumeTimerRef.current);
      }
    }

    function resumeManualSpin() {
      setIsGlobeDragging(false);
      if (spinResumeTimerRef.current) {
        window.clearTimeout(spinResumeTimerRef.current);
      }
      spinResumeTimerRef.current = window.setTimeout(() => {
        isUserInteractingRef.current = false;
      }, 1600);
    }

    function handlePointerDown(event: PointerEvent) {
      if (modeRef.current !== "world" || event.button !== 0) return;

      isPointerDragging = true;
      pointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      const center = activeMap.getCenter();
      startLng = center.lng;
      startLat = center.lat;
      pauseManualSpin();
      activeMap.stop();
      canvas.setPointerCapture(pointerId);
      event.preventDefault();
    }

    function handlePointerMove(event: PointerEvent) {
      if (!isPointerDragging || pointerId !== event.pointerId || modeRef.current !== "world") return;

      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;
      activeMap.setCenter([
        wrapLongitude(startLng - deltaX * degreesPerPixel),
        clampLatitude(startLat + deltaY * degreesPerPixel)
      ]);
      event.preventDefault();
    }

    function handlePointerEnd(event: PointerEvent) {
      if (!isPointerDragging || pointerId !== event.pointerId) return;

      isPointerDragging = false;
      if (canvas.hasPointerCapture(pointerId)) {
        canvas.releasePointerCapture(pointerId);
      }
      pointerId = null;
      resumeManualSpin();
      event.preventDefault();
    }

    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerEnd);
    canvas.addEventListener("pointercancel", handlePointerEnd);
    canvas.addEventListener("lostpointercapture", handlePointerEnd);

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerEnd);
      canvas.removeEventListener("pointercancel", handlePointerEnd);
      canvas.removeEventListener("lostpointercapture", handlePointerEnd);
    };
  }, [isMapReady, mapInstanceKey]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map?.isStyleLoaded()) return;

    if (
      !map.getLayer("route-glow") ||
      !map.getLayer("route-line") ||
      !map.getLayer("route-trail") ||
      !map.getLayer("host-dot") ||
      !map.getLayer("venue-pulse")
    ) {
      return;
    }

    function removeExtrusionLayers() {
      if (!map) return;
      if (map.getLayer("provider-building-extrusion")) {
        map.removeLayer("provider-building-extrusion");
      }
      if (map.getLayer("stadium-extrusion")) {
        map.removeLayer("stadium-extrusion");
      }
      extrusionLayersAddedRef.current = false;
    }

    function clearPendingCameraFlight() {
      if (!cameraTimeoutRef.current) return;
      window.clearTimeout(cameraTimeoutRef.current);
      cameraTimeoutRef.current = null;
    }

    function ensureExtrusionLayers() {
      if (!map || extrusionLayersAddedRef.current) return;

      const labelLayerId = getFirstTextLayerId(map);
      const providerBuildingLayer = getProviderBuildingLayer();
      if (providerBuildingLayer && map.getSource(providerBuildingLayer.source)) {
        map.addLayer(providerBuildingLayer, labelLayerId);
      }

      if (map.getSource("stadiums")) {
        map.addLayer(
          {
            id: "stadium-extrusion",
            type: "fill-extrusion",
            source: "stadiums",
            paint: {
              "fill-extrusion-color": "#ef9f27",
              "fill-extrusion-height": ["get", "height"],
              "fill-extrusion-base": ["get", "baseHeight"],
              "fill-extrusion-opacity": modeRef.current === "stadium" ? 0.72 : 0
            }
          },
          labelLayerId
        );
      }

      extrusionLayersAddedRef.current = true;
    }

    const activeRouteCoordinates = mode === "flight" ? worldFlightCoordinates : routeCoordinates;
    const route = getRevealedRoute(activeRouteCoordinates, progress, mapView.center);
    const source = map.getSource("route") as GeoJSONSource | undefined;
    source?.setData({
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: route
      }
    });

    const venueSource = map.getSource("venues") as GeoJSONSource | undefined;
    venueSource?.setData({
      type: "FeatureCollection",
      features: venues.map((venue) => ({
        type: "Feature",
        properties: { id: venue.id, name: venue.city },
        geometry: {
          type: "Point",
          coordinates: venue.coordinates
        }
      }))
    });

    const stadiumSource = map.getSource("stadiums") as GeoJSONSource | undefined;
    stadiumSource?.setData({
      type: "FeatureCollection",
      features: venues.flatMap((venue) => {
        if (!venue.model) return [];

        return [
          {
            type: "Feature",
            properties: {
              height: venue.model.heightMeters,
              baseHeight: venue.model.baseHeightMeters ?? 0,
              name: venue.name
            },
            geometry: {
              type: "Polygon",
              coordinates: [venue.model.footprint]
            }
          }
        ];
      })
    });

    const hostSource = map.getSource("host") as GeoJSONSource | undefined;
    hostSource?.setData({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: tournamentName },
          geometry: {
            type: "Point",
            coordinates: mapView.center
          }
        }
      ]
    });

    const hostOpacity = showHostMarker && (mode === "world" || mode === "flight") ? 1 : 0;
    const venueOpacity = mode === "host" || mode === "stadium" ? 1 : 0;
    map.setPaintProperty("host-halo", "circle-opacity", showHostMarker && (mode === "world" || mode === "flight") ? 0.85 : 0);
    map.setPaintProperty("host-dot", "circle-opacity", hostOpacity);
    map.setPaintProperty("host-dot", "circle-stroke-opacity", hostOpacity);
    map.setPaintProperty("host-label", "text-opacity", hostOpacity);
    map.setPaintProperty("route-glow", "line-opacity", mode === "flight" ? 0.42 : mode === "host" ? 0.34 : mode === "stadium" ? 0.08 : 0);
    map.setPaintProperty("route-line", "line-opacity", mode === "flight" ? 0.95 : mode === "host" ? 0.92 : mode === "stadium" ? 0.2 : 0);
    map.setPaintProperty("route-trail", "line-opacity", mode === "flight" ? 0.78 : mode === "host" ? 0.5 : mode === "stadium" ? 0.12 : 0);
    map.setPaintProperty("venue-pulse", "circle-opacity", venueOpacity);
    map.setPaintProperty("venue-pulse", "circle-stroke-opacity", venueOpacity);
    map.setPaintProperty("venue-labels", "text-opacity", venueOpacity);
    if (map.getLayer("stadium-extrusion")) {
      map.setPaintProperty("stadium-extrusion", "fill-extrusion-opacity", mode === "stadium" ? 0.72 : 0);
    }

    const modeKey = `${mode}:${focusVenueId ?? "none"}`;
    const selectedVenue = venues.find((venue) => venue.id === focusVenueId);

    if (mode !== "stadium") {
      clearPendingCameraFlight();
      map.stop();
    }

    if (mode === "world") {
      if (cameraKeyRef.current === modeKey) return;
      cameraKeyRef.current = modeKey;
      removeExtrusionLayers();
      map.setProjection({ type: "globe" });
      map.easeTo({
        center: WORLD_VIEW.center,
        zoom: WORLD_VIEW.zoom,
        bearing: WORLD_VIEW.bearing,
        pitch: WORLD_VIEW.pitch,
        duration: 950
      });
      return;
    }

    if (mode === "flight") {
      removeExtrusionLayers();
      map.setProjection({ type: "globe" });
      const cameraKey = `${mode}:${progress.toFixed(2)}`;
      cameraKeyRef.current = cameraKey;
      map.easeTo({
        center: progress > 0.72 ? mapView.center : interpolateRoute(worldFlightCoordinates, progress) ?? mapView.center,
        zoom: WORLD_VIEW.zoom + progress * 2.45,
        bearing: WORLD_VIEW.bearing + progress * -18,
        pitch: WORLD_VIEW.pitch + progress * 30,
        duration: 220,
        essential: true
      });
      return;
    }

    map.setProjection({ type: "mercator" });
    ensureExtrusionLayers();

    if (mode === "stadium" && selectedVenue) {
      if (cameraKeyRef.current === modeKey) return;
      cameraKeyRef.current = modeKey;

      if (cameraTimeoutRef.current) {
        window.clearTimeout(cameraTimeoutRef.current);
      }

      map.flyTo({
        center: mapView.center,
        zoom: Math.max(mapView.zoom + 0.55, 4.9),
        bearing: mapView.bearing,
        pitch: mapView.pitch,
        duration: 850,
        essential: true
      });

      cameraTimeoutRef.current = window.setTimeout(() => {
        cameraTimeoutRef.current = null;
        map.flyTo({
          center: selectedVenue.stadiumView.center,
          zoom: selectedVenue.stadiumView.zoom,
          bearing: selectedVenue.stadiumView.bearing,
          pitch: selectedVenue.stadiumView.pitch,
          duration: 1700,
          essential: true
        });
      }, 720);
      return;
    }

    if (cameraKeyRef.current === modeKey) return;
    cameraKeyRef.current = modeKey;
    map.flyTo({
      center: focusedCoordinates,
      zoom: focusedRouteProgress > 0.75 ? Math.max(mapView.zoom + 1.1, 5.15) : mapView.zoom,
      bearing: mapView.bearing,
      pitch: mapView.pitch,
      duration: 1300,
      essential: true
    });
  }, [focusVenueId, focusedCoordinates, focusedRouteProgress, mapInstanceKey, mapView, mode, progress, routeCoordinates, showHostMarker, tournamentName, venues, worldFlightCoordinates]);

  return (
    <section className="tour-map" aria-label="Host map">
      <div className={`tour-map-canvas ${mode === "world" ? "is-world" : ""} ${isGlobeDragging ? "is-grabbing" : ""}`} ref={mapNodeRef} />
      <div className="map-vignette" />
    </section>
  );
}
