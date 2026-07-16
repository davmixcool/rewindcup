"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  GeoJSONSource,
  Listener,
  MapLayerMouseEvent,
  MapStyleImageMissingEvent,
  Marker,
  Map as MapLibreMap
} from "maplibre-gl";
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

type CountryMarkerInstance = {
  code: TeamCode;
  marker: Marker;
};

type HostMapProps = {
  countryMarkers: CountryMarker[];
  countryFocusRequest: number;
  enableWorldSpin: boolean;
  focusVenueId?: string;
  isCameraTransitioning: boolean;
  mapView: MapView;
  mode: MapMode;
  onCountrySelect: (teamCode: TeamCode) => void;
  onFlightArrival: (venueId: string) => void;
  onHostSelect: () => void;
  onStadiumArrival: (venueId: string) => void;
  onVenueSelect: (venueId: string) => void;
  progress: number;
  routeVenueIds: string[];
  selectedCountryCode: TeamCode | null;
  showHostMarker: boolean;
  stadiumFocusRequest: number;
  tournamentName: string;
  venues: Venue[];
};

const WORLD_VIEW: MapView = {
  center: [31, 8],
  zoom: 2.28,
  bearing: 0,
  pitch: 0
};

const HOST_MAP_ACCENT = "#67c6fd";
const HOST_MAP_ACCENT_STRONG = "#0f73a8";

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

function setMapProjection(map: MapLibreMap, type: "globe" | "mercator") {
  if (map.getProjection().type === type) return;

  map.setProjection({ type });
}

export function HostMap({
  countryMarkers,
  countryFocusRequest,
  enableWorldSpin,
  focusVenueId,
  isCameraTransitioning,
  mapView,
  mode,
  onCountrySelect,
  onFlightArrival,
  onHostSelect,
  onStadiumArrival,
  onVenueSelect,
  progress,
  routeVenueIds,
  selectedCountryCode,
  showHostMarker,
  stadiumFocusRequest,
  tournamentName,
  venues
}: HostMapProps) {
  const mapNodeRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [areMapLayersReady, setAreMapLayersReady] = useState(false);
  const [mapInstanceKey, setMapInstanceKey] = useState(0);
  const [isGlobeDragging, setIsGlobeDragging] = useState(false);
  const countryMarkerRefs = useRef<CountryMarkerInstance[]>([]);
  const selectedCountryCodeRef = useRef(selectedCountryCode);
  const extrusionLayersAddedRef = useRef(false);
  const cameraKeyRef = useRef("");
  const cameraTimeoutRef = useRef<number | null>(null);
  const flightArrivalListenerRef = useRef<Listener | null>(null);
  const stadiumArrivalListenerRef = useRef<Listener | null>(null);
  const stadiumIdleListenerRef = useRef<Listener | null>(null);
  const stadiumReadyTimeoutRef = useRef<number | null>(null);
  const isUserInteractingRef = useRef(false);
  const spinResumeTimerRef = useRef<number | null>(null);
  const onHostSelectRef = useRef(onHostSelect);
  const onCountrySelectRef = useRef(onCountrySelect);
  const onFlightArrivalRef = useRef(onFlightArrival);
  const onStadiumArrivalRef = useRef(onStadiumArrival);
  const onVenueSelectRef = useRef(onVenueSelect);
  const progressRef = useRef(progress);
  const modeRef = useRef(mode);
  const routeCoordinates = useMemo(() => getRouteCoordinates(venues, routeVenueIds), [routeVenueIds, venues]);
  const focusedCoordinates = useMemo(
    () => getFocusCoordinates(venues, focusVenueId, mapView.center),
    [focusVenueId, mapView.center, venues]
  );
  const focusedRouteProgress = useMemo(() => {
    const focusedRouteIndex = focusVenueId ? routeVenueIds.indexOf(focusVenueId) : -1;
    return focusedRouteIndex > 0 ? focusedRouteIndex / Math.max(routeVenueIds.length - 1, 1) : 0;
  }, [focusVenueId, routeVenueIds]);
  const selectedCountryMarker = useMemo(
    () => countryMarkers.find((marker) => marker.code === selectedCountryCode),
    [countryMarkers, selectedCountryCode]
  );

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
    onFlightArrivalRef.current = onFlightArrival;
  }, [onFlightArrival]);

  useEffect(() => {
    onStadiumArrivalRef.current = onStadiumArrival;
  }, [onStadiumArrival]);

  useEffect(() => {
    onVenueSelectRef.current = onVenueSelect;
  }, [onVenueSelect]);

  useEffect(() => {
    selectedCountryCodeRef.current = selectedCountryCode;
    countryMarkerRefs.current.forEach(({ code, marker }) => {
      const markerElement = marker.getElement();
      const isSelected = code === selectedCountryCode;
      markerElement.classList.toggle("is-selected", isSelected);
      markerElement.classList.toggle("is-muted", Boolean(selectedCountryCode && !isSelected));
      markerElement.setAttribute("aria-pressed", String(isSelected));
    });
  }, [selectedCountryCode]);

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
        style: getBaseMapStyle(),
        validateStyle: process.env.NODE_ENV !== "production"
      });

      map.on("styleimagemissing", (event: MapStyleImageMissingEvent) => {
        if (map.hasImage(event.id)) return;

        map.addImage(event.id, {
          width: 1,
          height: 1,
          data: new Uint8Array([0, 0, 0, 0])
        });
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
        setMapProjection(map, modeRef.current === "world" || modeRef.current === "flight" ? "globe" : "mercator");

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
                routeCoordinates,
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
            "circle-color": HOST_MAP_ACCENT,
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
            "circle-color": HOST_MAP_ACCENT,
            "circle-radius": 11,
            "circle-stroke-color": HOST_MAP_ACCENT_STRONG,
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
            "text-font": ["Noto Sans Regular"],
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
            "circle-color": HOST_MAP_ACCENT,
            "circle-radius": 10,
            "circle-stroke-color": HOST_MAP_ACCENT_STRONG,
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
            "text-font": ["Noto Sans Regular"],
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

        setAreMapLayersReady(true);
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
      if (flightArrivalListenerRef.current && mapRef.current) {
        mapRef.current.off("moveend", flightArrivalListenerRef.current);
        flightArrivalListenerRef.current = null;
      }
      if (stadiumArrivalListenerRef.current && mapRef.current) {
        mapRef.current.off("moveend", stadiumArrivalListenerRef.current);
        stadiumArrivalListenerRef.current = null;
      }
      if (stadiumIdleListenerRef.current && mapRef.current) {
        mapRef.current.off("idle", stadiumIdleListenerRef.current);
        stadiumIdleListenerRef.current = null;
      }
      if (stadiumReadyTimeoutRef.current) {
        window.clearTimeout(stadiumReadyTimeoutRef.current);
        stadiumReadyTimeoutRef.current = null;
      }
      if (spinResumeTimerRef.current) {
        window.clearTimeout(spinResumeTimerRef.current);
      }
      countryMarkerRefs.current.forEach(({ marker }) => marker.remove());
      countryMarkerRefs.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
      setIsMapReady(false);
      setAreMapLayersReady(false);
      setIsGlobeDragging(false);
      isUserInteractingRef.current = false;
      extrusionLayersAddedRef.current = false;
    };
  }, [mapView, showHostMarker, tournamentName, venues]);

  useEffect(() => {
    const map = mapRef.current;
    let isCancelled = false;

    function removeCountryMarkers() {
      countryMarkerRefs.current.forEach(({ marker }) => marker.remove());
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
        const isSelected = marker.code === selectedCountryCodeRef.current;
        markerElement.className = "country-flag-marker";
        markerElement.classList.toggle("is-selected", isSelected);
        markerElement.classList.toggle("is-muted", Boolean(selectedCountryCodeRef.current && !isSelected));
        markerElement.style.setProperty("--marker-color", marker.color);
        markerElement.type = "button";
        markerElement.title = marker.name;
        markerElement.setAttribute("aria-label", `${marker.name} tournament team`);
        markerElement.setAttribute("aria-pressed", String(isSelected));

        const markerDisc = document.createElement("span");
        markerDisc.className = "country-flag-disc";
        const markerImage = document.createElement("img");
        markerImage.alt = "";
        markerImage.src = marker.flagSrc;
        markerDisc.append(markerImage);

        const markerLabel = document.createElement("span");
        markerLabel.className = "country-flag-label";
        markerLabel.textContent = marker.name;
        markerElement.append(markerDisc, markerLabel);
        markerElement.addEventListener("click", () => {
          onCountrySelectRef.current(marker.code);
        });

        return {
          code: marker.code,
          marker: new maplibregl.Marker({
            element: markerElement,
            anchor: "center",
            subpixelPositioning: true
          })
            .setLngLat(marker.coordinates)
            .addTo(mapRef.current!)
        };
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
    if (!isMapReady || !map || mode !== "world" || !selectedCountryMarker) return;

    isUserInteractingRef.current = true;
    if (spinResumeTimerRef.current) {
      window.clearTimeout(spinResumeTimerRef.current);
    }

    map.stop();
    const nextZoom = Math.max(map.getZoom(), WORLD_VIEW.zoom + 0.42);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      map.jumpTo({
        center: selectedCountryMarker.coordinates,
        zoom: nextZoom,
        bearing: WORLD_VIEW.bearing,
        pitch: WORLD_VIEW.pitch
      });
      isUserInteractingRef.current = false;
      return;
    }

    map.easeTo({
      center: selectedCountryMarker.coordinates,
      zoom: nextZoom,
      bearing: WORLD_VIEW.bearing,
      pitch: WORLD_VIEW.pitch,
      duration: 760,
      essential: true,
      easing: (progress) => 1 - Math.pow(1 - progress, 3)
    });

    spinResumeTimerRef.current = window.setTimeout(() => {
      spinResumeTimerRef.current = null;
      isUserInteractingRef.current = false;
    }, 980);

    return () => {
      if (spinResumeTimerRef.current) {
        window.clearTimeout(spinResumeTimerRef.current);
        spinResumeTimerRef.current = null;
      }
      isUserInteractingRef.current = false;
    };
  }, [countryFocusRequest, isMapReady, mapInstanceKey, mode, selectedCountryMarker]);

  useEffect(() => {
    const map = mapRef.current;
    if (!isMapReady || !map || mode !== "world") return;
    if (!enableWorldSpin) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frameId = 0;
    let timerId = 0;
    let lastRenderTime = performance.now();
    const degreesPerMillisecond = 0.00042;
    const renderInterval = 1000 / 30;

    function spinWorld(now: number) {
      const activeMap = mapRef.current;
      if (!activeMap || modeRef.current !== "world") return;

      if (document.hidden || isUserInteractingRef.current || now - lastRenderTime < renderInterval) {
        if (document.hidden || isUserInteractingRef.current) {
          lastRenderTime = now;
        }
        frameId = window.requestAnimationFrame(spinWorld);
        return;
      }

      const elapsed = Math.min(now - lastRenderTime, 80);
      lastRenderTime = now;
      const center = activeMap.getCenter();
      const nextLng = wrapLongitude(center.lng + elapsed * degreesPerMillisecond);
      activeMap.setCenter([nextLng, center.lat]);
      frameId = window.requestAnimationFrame(spinWorld);
    }

    timerId = window.setTimeout(() => {
      lastRenderTime = performance.now();
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
    if (!areMapLayersReady || !map) return;

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

    function clearPendingFlightArrival() {
      if (!flightArrivalListenerRef.current) return;
      map?.off("moveend", flightArrivalListenerRef.current);
      flightArrivalListenerRef.current = null;
    }

    function clearPendingStadiumArrival() {
      if (stadiumArrivalListenerRef.current) {
        map?.off("moveend", stadiumArrivalListenerRef.current);
        stadiumArrivalListenerRef.current = null;
      }
      if (stadiumIdleListenerRef.current) {
        map?.off("idle", stadiumIdleListenerRef.current);
        stadiumIdleListenerRef.current = null;
      }
      if (stadiumReadyTimeoutRef.current) {
        window.clearTimeout(stadiumReadyTimeoutRef.current);
        stadiumReadyTimeoutRef.current = null;
      }
    }

    function reportStadiumArrivalWhenReady(venueId: string) {
      let didReportArrival = false;
      const reportArrival = () => {
        if (didReportArrival || modeRef.current !== "stadium") return;
        didReportArrival = true;
        if (stadiumIdleListenerRef.current === idleListener) {
          map?.off("idle", idleListener);
          stadiumIdleListenerRef.current = null;
        }
        if (stadiumReadyTimeoutRef.current) {
          window.clearTimeout(stadiumReadyTimeoutRef.current);
          stadiumReadyTimeoutRef.current = null;
        }
        onStadiumArrivalRef.current(venueId);
      };
      const idleListener: Listener = reportArrival;

      stadiumIdleListenerRef.current = idleListener;
      map?.once("idle", idleListener);
      stadiumReadyTimeoutRef.current = window.setTimeout(reportArrival, 1400);
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

    const route = getRevealedRoute(routeCoordinates, progress, mapView.center);
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
    map.setPaintProperty("route-glow", "line-opacity", mode === "host" ? 0.34 : mode === "stadium" ? 0.08 : 0);
    map.setPaintProperty("route-line", "line-opacity", mode === "host" ? 0.92 : mode === "stadium" ? 0.2 : 0);
    map.setPaintProperty("route-trail", "line-opacity", mode === "host" ? 0.5 : mode === "stadium" ? 0.12 : 0);
    map.setPaintProperty("venue-pulse", "circle-opacity", venueOpacity);
    map.setPaintProperty("venue-pulse", "circle-stroke-opacity", venueOpacity);
    map.setPaintProperty("venue-labels", "text-opacity", venueOpacity);
    if (map.getLayer("stadium-extrusion")) {
      map.setPaintProperty("stadium-extrusion", "fill-extrusion-opacity", mode === "stadium" ? 0.72 : 0);
    }

    const modeKey = mode === "world"
      ? "world"
      : `${mode}:${focusVenueId ?? "none"}${mode === "stadium" ? `:${stadiumFocusRequest}` : ""}`;
    const selectedVenue = venues.find((venue) => venue.id === focusVenueId);

    if (mode === "world") {
      if (cameraKeyRef.current === modeKey) return;
      cameraKeyRef.current = modeKey;
      clearPendingCameraFlight();
      clearPendingFlightArrival();
      clearPendingStadiumArrival();
      map.stop();
      removeExtrusionLayers();
      setMapProjection(map, "globe");
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        map.jumpTo(WORLD_VIEW);
      } else {
        map.easeTo({
          center: WORLD_VIEW.center,
          zoom: WORLD_VIEW.zoom,
          bearing: WORLD_VIEW.bearing,
          pitch: WORLD_VIEW.pitch,
          duration: 950
        });
      }
      return;
    }

    if (mode === "flight" && selectedVenue) {
      if (cameraKeyRef.current === modeKey) return;
      cameraKeyRef.current = modeKey;
      clearPendingCameraFlight();
      clearPendingFlightArrival();
      clearPendingStadiumArrival();
      map.stop();
      removeExtrusionLayers();
      setMapProjection(map, "globe");

      const arrivalListener: Listener = () => {
        if (flightArrivalListenerRef.current !== arrivalListener || modeRef.current !== "flight") return;
        flightArrivalListenerRef.current = null;
        onFlightArrivalRef.current(selectedVenue.id);
      };

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        map.jumpTo({
          center: focusedCoordinates,
          zoom: WORLD_VIEW.zoom + 1.25,
          bearing: -12,
          pitch: 18
        });
        onFlightArrivalRef.current(selectedVenue.id);
        return;
      }

      flightArrivalListenerRef.current = arrivalListener;
      map.once("moveend", arrivalListener);

      map.easeTo({
        center: focusedCoordinates,
        zoom: WORLD_VIEW.zoom + 1.25,
        bearing: -12,
        pitch: 18,
        duration: map.getZoom() > 8 ? 1450 : 1200,
        essential: true,
        easing: (flightProgress) => 1 - Math.pow(1 - flightProgress, 3)
      });
      return;
    }

    setMapProjection(map, "mercator");
    ensureExtrusionLayers();

    if (mode === "stadium" && selectedVenue) {
      if (cameraKeyRef.current === modeKey) return;
      cameraKeyRef.current = modeKey;

      clearPendingCameraFlight();
      clearPendingFlightArrival();
      clearPendingStadiumArrival();
      map.stop();

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        map.jumpTo({
          center: selectedVenue.stadiumView.center,
          zoom: selectedVenue.stadiumView.zoom,
          bearing: selectedVenue.stadiumView.bearing,
          pitch: selectedVenue.stadiumView.pitch
        });
        reportStadiumArrivalWhenReady(selectedVenue.id);
        return;
      }

      map.flyTo({
        center: mapView.center,
        zoom: Math.max(mapView.zoom - 0.35, 3.7),
        bearing: mapView.bearing,
        pitch: Math.min(mapView.pitch, 28),
        duration: 700,
        essential: true
      });

      cameraTimeoutRef.current = window.setTimeout(() => {
        cameraTimeoutRef.current = null;
        map.flyTo({
          center: selectedVenue.stadiumView.center,
          zoom: selectedVenue.stadiumView.zoom,
          bearing: selectedVenue.stadiumView.bearing,
          pitch: selectedVenue.stadiumView.pitch,
          duration: 1450,
          essential: true
        });
        const arrivalListener: Listener = () => {
          if (stadiumArrivalListenerRef.current !== arrivalListener) return;
          stadiumArrivalListenerRef.current = null;
          reportStadiumArrivalWhenReady(selectedVenue.id);
        };
        stadiumArrivalListenerRef.current = arrivalListener;
        map.once("moveend", arrivalListener);
      }, 600);
      return;
    }

    if (cameraKeyRef.current === modeKey) return;
    cameraKeyRef.current = modeKey;
    clearPendingCameraFlight();
    clearPendingFlightArrival();
    clearPendingStadiumArrival();
    map.stop();
    const focusedView = {
      center: focusedCoordinates,
      zoom: focusedRouteProgress > 0.75 ? Math.max(mapView.zoom + 1.1, 5.15) : mapView.zoom,
      bearing: mapView.bearing,
      pitch: mapView.pitch
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      map.jumpTo(focusedView);
    } else {
      map.flyTo({
        ...focusedView,
        duration: 1300
      });
    }
  }, [areMapLayersReady, focusVenueId, focusedCoordinates, focusedRouteProgress, mapInstanceKey, mapView, mode, progress, routeCoordinates, showHostMarker, stadiumFocusRequest, tournamentName, venues]);

  return (
    <section className={`tour-map ${isCameraTransitioning ? "is-transitioning" : ""}`} aria-label="Host map">
      <div className={`tour-map-canvas ${mode === "world" ? "is-world" : ""} ${isGlobeDragging ? "is-grabbing" : ""}`} ref={mapNodeRef} />
      {!isCameraTransitioning && showHostMarker && mode === "world" ? (
        <div aria-label="Map locations" className="map-keyboard-actions" role="group">
          <button onClick={onHostSelect} type="button">Open {tournamentName} host map</button>
        </div>
      ) : null}
      {!isCameraTransitioning && (mode === "host" || mode === "stadium") && venues.length > 0 ? (
        <div aria-label="Map locations" className="map-keyboard-actions" role="group">
          {venues.map((venue) => (
            <button
              aria-pressed={venue.id === focusVenueId}
              key={venue.id}
              onClick={() => onVenueSelect(venue.id)}
              type="button"
            >
              Open {venue.name}, {venue.city}
            </button>
          ))}
        </div>
      ) : null}
      <div aria-hidden="true" className="map-vignette" />
    </section>
  );
}
