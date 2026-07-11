import type { ExpressionSpecification, FillExtrusionLayerSpecification, StyleSpecification } from "maplibre-gl";

const defaultVectorStyleUrl = "/map-styles/liberty.json";

const osmRasterStyle: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "&copy; OpenStreetMap contributors"
    }
  },
  layers: [
    {
      id: "osm",
      type: "raster",
      source: "osm"
    }
  ]
};

export function getBaseMapStyle() {
  if (process.env.NEXT_PUBLIC_MAP_STYLE_URL === "osm-raster") return osmRasterStyle;
  return process.env.NEXT_PUBLIC_MAP_STYLE_URL || defaultVectorStyleUrl;
}

export function getProviderBuildingLayer(): FillExtrusionLayerSpecification | null {
  const source = process.env.NEXT_PUBLIC_MAP_BUILDING_SOURCE || "openmaptiles";
  const sourceLayer = process.env.NEXT_PUBLIC_MAP_BUILDING_SOURCE_LAYER || "building";

  if (!source || !sourceLayer) return null;

  const buildingHeight = [
    "to-number",
    ["coalesce", ["get", "render_height"], ["get", "height"], 0],
    0
  ] as ExpressionSpecification;
  const buildingBase = [
    "to-number",
    ["coalesce", ["get", "render_min_height"], ["get", "min_height"], 0],
    0
  ] as ExpressionSpecification;

  return {
    id: "provider-building-extrusion",
    type: "fill-extrusion",
    source,
    "source-layer": sourceLayer,
    minzoom: Number(process.env.NEXT_PUBLIC_MAP_BUILDING_MIN_ZOOM ?? 13),
    filter: ["all", ["!=", ["get", "hide_3d"], true]],
    paint: {
      "fill-extrusion-color": [
        "interpolate",
        ["linear"],
        buildingHeight,
        0,
        "#e8e2d8",
        15,
        "#d8cfc0",
        45,
        "#b8a894",
        90,
        "#8f7d68",
        180,
        "#6b5a48",
        350,
        "#54463a"
      ],
      "fill-extrusion-height": ["interpolate", ["linear"], ["zoom"], 13, 0, 14.5, buildingHeight],
      "fill-extrusion-base": ["interpolate", ["linear"], ["zoom"], 13, 0, 14.5, buildingBase],
      "fill-extrusion-opacity": 0.9,
      "fill-extrusion-vertical-gradient": true
    }
  };
}

export function getMapStyleStatus() {
  const hasVectorStyle = Boolean(process.env.NEXT_PUBLIC_MAP_STYLE_URL);
  const hasBuildingLayer = Boolean(
    process.env.NEXT_PUBLIC_MAP_BUILDING_SOURCE || process.env.NEXT_PUBLIC_MAP_BUILDING_SOURCE_LAYER
  );

  if (process.env.NEXT_PUBLIC_MAP_STYLE_URL === "osm-raster") return "OSM raster";
  if (!hasVectorStyle) return "OSM 3D";
  if (hasVectorStyle && hasBuildingLayer) return "Vector 3D ready";
  if (hasVectorStyle) return "Vector map";
  return "OSM fallback";
}
