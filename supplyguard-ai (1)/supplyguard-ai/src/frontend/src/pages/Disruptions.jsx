import { useEffect, useState, useRef, useMemo } from "react";
import {
  Card,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Chip,
  Button,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
  Divider,
} from "@mui/material";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Circle,
  Popup,
  Polyline,
  useMap,
  useMapEvents,
} from "react-leaflet";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import LayersIcon from "@mui/icons-material/Layers";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import AltRouteOutlinedIcon from "@mui/icons-material/AltRouteOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PublicIcon from "@mui/icons-material/Public";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";

import AppLayout from "../components/AppLayout.jsx";
import SeverityChip from "../components/SeverityChip.jsx";
import { api } from "../api/client.js";
import { tokens } from "../theme.js";
import { useColorTheme } from "../context/ThemeContext.jsx";

// Map API Tile Provider Configurations (100% Free, High Performance, Zero Missing Tiles)
const MAP_PROVIDERS = {
  dark: {
    id: "dark",
    name: "Esri Dark Canvas (Ops)",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    refUrl: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ",
    maxZoom: 16,
  },
  light: {
    id: "light",
    name: "Esri Light Canvas (Clean Enterprise)",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    refUrl: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ",
    maxZoom: 16,
  },
  osm: {
    id: "osm",
    name: "OpenStreetMap Standard",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    subdomains: "abc",
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 19,
  },
  streets: {
    id: "streets",
    name: "World Navigation & Maritime",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
    maxZoom: 18,
  },
  satellite: {
    id: "satellite",
    name: "Esri World Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS",
    maxZoom: 18,
  },
};

// Global Maritime & Intermodal Shipping Lanes (Geodesic Corridors)
const GLOBAL_SHIPPING_LANES = [
  // Trans-Pacific: Asia-East (Shanghai 31.23, 121.47) -> US-West (San Francisco 37.77, -122.42)
  { id: "lane-tp", name: "Trans-Pacific North", coords: [[31.23, 121.47], [35.0, 150.0], [42.0, -160.0], [37.77, -122.42]], status: "congested" },
  // Asia-Europe via Suez: Asia-SE (Singapore 1.35, 103.82) -> Middle-East (Dubai 25.2, 55.27) -> EU-Med (Rome 41.9, 12.5) -> EU-North (Rotterdam 51.92, 4.48)
  { id: "lane-ae", name: "Asia-Europe Mega Loop", coords: [[1.35, 103.82], [10.0, 75.0], [25.2, 55.27], [27.0, 34.0], [31.5, 32.3], [41.9, 12.5], [36.0, -5.5], [51.92, 4.48]], status: "critical" },
  // Trans-Atlantic: EU-North (Rotterdam 51.92, 4.48) -> US-East (New York 40.71, -74.01)
  { id: "lane-ta", name: "North Atlantic Corridor", coords: [[51.92, 4.48], [48.0, -10.0], [44.0, -40.0], [40.71, -74.01]], status: "normal" },
  // Americas Loop: US-Gulf (Houston 29.76, -95.37) -> LatAm-East (Sao Paulo -23.55, -46.63)
  { id: "lane-am", name: "Pan-American Maritime Lane", coords: [[29.76, -95.37], [22.0, -85.0], [10.0, -65.0], [-5.0, -35.0], [-23.55, -46.63]], status: "normal" },
];

const SEVERITY_RADIUS = { low: 10, medium: 14, high: 18, critical: 24 };
const SEVERITY_COLOR = { low: "#0284C7", medium: "#0052FF", high: "#EA580C", critical: "#DC2626" };

// Map Controller for programmatic flyTo, cursor coordinate tracking, and auto invalidateSize
function MapApiController({ flyTarget, onCoordsChange, isFullscreen }) {
  const map = useMap();

  useEffect(() => {
    // Force Leaflet to recalculate dimensions so tiles render across the entire screen
    map.invalidateSize();
    const t1 = setTimeout(() => map.invalidateSize(), 100);
    const t2 = setTimeout(() => map.invalidateSize(), 300);
    const t3 = setTimeout(() => map.invalidateSize(), 600);
    const t4 = setTimeout(() => map.invalidateSize(), 1200);

    const handleResize = () => map.invalidateSize();
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      window.removeEventListener("resize", handleResize);
    };
  }, [map, isFullscreen]);

  useEffect(() => {
    if (flyTarget) {
      map.flyTo(flyTarget.coords, flyTarget.zoom || 5, {
        animate: true,
        duration: 1.2,
      });
    }
  }, [flyTarget, map]);

  useMapEvents({
    mousemove(e) {
      if (onCoordsChange) {
        onCoordsChange([e.latlng.lat.toFixed(2), e.latlng.lng.toFixed(2)]);
      }
    },
  });

  return null;
}

export default function Disruptions() {
  const navigate = useNavigate();
  const { isDark } = useColorTheme();

  const [disruptions, setDisruptions] = useState(null);
  const [error, setError] = useState(null);
  const [selectedDisruption, setSelectedDisruption] = useState(null);

  // Map API State - default to Esri Dark/Light for clean enterprise map without watermarks
  const [mapProvider, setMapProvider] = useState(() => (isDark ? "dark" : "light"));
  const [showWeatherOverlay, setShowWeatherOverlay] = useState(true);
  const [showShippingLanes, setShowShippingLanes] = useState(true);
  const [cursorCoords, setCursorCoords] = useState(["20.00", "30.00"]);
  const [flyTarget, setFlyTarget] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapCardRef = useRef(null);

  // Sync fullscreen state with document fullscreenchange event
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  // Keep map provider in sync with theme when theme toggles (unless user manually chose satellite/osm)
  useEffect(() => {
    if (mapProvider === "dark" || mapProvider === "light") {
      setMapProvider(isDark ? "dark" : "light");
    }
  }, [isDark]);

  useEffect(() => {
    api
      .getDisruptions()
      .then((data) => {
        setDisruptions(data);
        if (data.length > 0) {
          setSelectedDisruption(data[0]);
        }
      })
      .catch((e) => setError(e.message));
  }, []);

  const handleSelectDisruption = (d) => {
    setSelectedDisruption(d);
    if (d?.coords) {
      setFlyTarget({ coords: d.coords, zoom: 5 });
    }
  };

  const handleResetView = () => {
    setFlyTarget({ coords: [20, 20], zoom: 2 });
    setSelectedDisruption(null);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mapCardRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Filtered disruptions list
  const filteredDisruptions = useMemo(() => {
    if (!disruptions) return [];
    return disruptions.filter((d) => {
      if (severityFilter !== "ALL" && d.severity !== severityFilter) return false;
      if (typeFilter !== "ALL" && d.type !== typeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const id = (d.disruptionId || "").toLowerCase();
        const region = (d.region || "").toLowerCase();
        const desc = (d.description || "").toLowerCase();
        const type = (d.type || "").toLowerCase();
        return id.includes(q) || region.includes(q) || desc.includes(q) || type.includes(q);
      }
      return true;
    });
  }, [disruptions, severityFilter, typeFilter, searchQuery]);

  const activeProvider = MAP_PROVIDERS[mapProvider] || MAP_PROVIDERS.dark;

  return (
    <AppLayout
      title="Global Disruption Radar & Multi-Map Telemetry"
      subtitle={
        disruptions
          ? `${disruptions.length} active incidents tracked across global maritime & aerial corridors`
          : "Streaming live geospatial telemetry..."
      }
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2.5 }}>
          {error}
        </Alert>
      )}

      {/* Top Controls: Map Layer API Selector, Weather Toggle, Filters */}
      <Box sx={{ mb: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        {/* Search & Severity filter */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexGrow: 1, maxWidth: 640 }}>
          <TextField
            size="small"
            placeholder="Search incident, region, or keyword…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              displayEmpty
              sx={{ fontSize: "0.82rem" }}
            >
              <MenuItem value="ALL">All Severities</MenuItem>
              <MenuItem value="critical">Critical</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140, display: { xs: "none", sm: "block" } }}>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              displayEmpty
              sx={{ fontSize: "0.82rem" }}
            >
              <MenuItem value="ALL">All Incident Types</MenuItem>
              <MenuItem value="port_strike">Port Strikes</MenuItem>
              <MenuItem value="weather">Storm &amp; Weather</MenuItem>
              <MenuItem value="geopolitical">Geopolitical</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Map API Layer Switcher */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 190 }}>
            <InputLabel id="map-api-provider-label" sx={{ fontSize: "0.82rem" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <LayersIcon sx={{ fontSize: 16 }} /> Map API Layer
              </Box>
            </InputLabel>
            <Select
              labelId="map-api-provider-label"
              value={mapProvider}
              label="Map API Layer"
              onChange={(e) => setMapProvider(e.target.value)}
              sx={{ fontSize: "0.8rem", fontWeight: 700 }}
            >
              <MenuItem value="dark">Esri Dark Canvas (Ops)</MenuItem>
              <MenuItem value="light">Esri Light Canvas (Clean)</MenuItem>
              <MenuItem value="satellite">Esri World Satellite</MenuItem>
              <MenuItem value="streets">World Maritime &amp; Navigation</MenuItem>
              <MenuItem value="osm">OpenStreetMap Standard</MenuItem>
            </Select>
          </FormControl>

          <Tooltip title={showWeatherOverlay ? "Hide Weather Radar Overlay" : "Show Weather Radar Overlay"}>
            <Button
              size="small"
              variant={showWeatherOverlay ? "contained" : "outlined"}
              onClick={() => setShowWeatherOverlay((v) => !v)}
              startIcon={<CloudQueueIcon />}
              sx={{
                fontSize: "0.78rem",
                fontWeight: 700,
                borderColor: tokens.borderStrong,
                color: showWeatherOverlay ? "#fff" : "text.primary",
                background: showWeatherOverlay ? tokens.gradientPrimary : undefined,
              }}
            >
              Weather Radar
            </Button>
          </Tooltip>

          <Tooltip title="Reset Global Camera View">
            <IconButton
              size="small"
              onClick={handleResetView}
              sx={{ border: `1px solid ${tokens.border}`, p: 0.9 }}
            >
              <MyLocationIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Loading state */}
      {!disruptions && !error && (
        <Box sx={{ display: "flex", justifyContent: "center", pt: 12 }}>
          <CircularProgress />
        </Box>
      )}

      {disruptions && (
        <Grid container spacing={2.5}>
          {/* Main Interactive Map Card */}
          <Grid item xs={12} md={7} lg={8}>
            <Card
              ref={mapCardRef}
              sx={{
                height: isFullscreen ? "100vh" : 580,
                width: "100%",
                position: isFullscreen ? "fixed" : "relative",
                inset: isFullscreen ? 0 : undefined,
                zIndex: isFullscreen ? 9999 : undefined,
                overflow: "hidden",
                borderRadius: isFullscreen ? 0 : 2,
                border: isFullscreen ? "none" : `1px solid ${tokens.border}`,
                boxShadow: isFullscreen ? "none" : "0 14px 34px rgba(0,0,0,0.2)",
              }}
            >
              {/* Map Telemetry HUD Badge */}
              <Box
                sx={{
                  position: "absolute",
                  top: 14,
                  left: 14,
                  zIndex: 1000,
                  bgcolor: isDark ? "rgba(15, 23, 42, 0.88)" : "rgba(255, 255, 255, 0.92)",
                  backdropFilter: "blur(12px)",
                  border: `1px solid ${tokens.border}`,
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.75,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: tokens.emerald,
                      boxShadow: `0 0 8px ${tokens.emerald}`,
                    }}
                  />
                  <Typography variant="caption" sx={{ fontWeight: 800, fontSize: "0.72rem" }}>
                    RADAR API: {activeProvider.name.split(" ")[0]}
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ height: 14, my: "auto" }} />
                <Typography variant="caption" sx={{ color: "text.secondary", fontFamily: '"JetBrains Mono", monospace', fontSize: "0.7rem" }}>
                  {cursorCoords[0]}&deg;N, {cursorCoords[1]}&deg;E
                </Typography>
                <Divider orientation="vertical" flexItem sx={{ height: 14, my: "auto" }} />
                <Typography variant="caption" sx={{ color: tokens.indigo, fontWeight: 700, fontSize: "0.7rem" }}>
                  {filteredDisruptions.length} Hotspots
                </Typography>
              </Box>

              {/* Fullscreen & Lane Toggle HUD Controls */}
              <Box sx={{ position: "absolute", top: 14, right: 14, zIndex: 1000, display: "flex", gap: 1 }}>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => setShowShippingLanes((v) => !v)}
                  sx={{
                    bgcolor: showShippingLanes ? "rgba(6, 182, 212, 0.9)" : "rgba(15, 23, 42, 0.8)",
                    color: "#fff",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    px: 1.2,
                    py: 0.4,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {showShippingLanes ? "Corridors: ON" : "Corridors: OFF"}
                </Button>
                <IconButton
                  size="small"
                  onClick={toggleFullscreen}
                  sx={{
                    bgcolor: isDark ? "rgba(15, 23, 42, 0.85)" : "rgba(255, 255, 255, 0.9)",
                    border: `1px solid ${tokens.border}`,
                    color: tokens.text,
                    p: 0.6,
                  }}
                >
                  {isFullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
                </IconButton>
              </Box>

              {/* Leaflet MapContainer */}
              <MapContainer
                center={[20, 20]}
                zoom={2}
                minZoom={1.5}
                maxZoom={18}
                worldCopyJump={true}
                style={{
                  height: "100%",
                  width: "100%",
                  backgroundColor: isDark ? "#070B14" : "#F4F7FC",
                }}
                zoomControl={false}
              >
                <MapApiController
                  flyTarget={flyTarget}
                  onCoordsChange={setCursorCoords}
                  isFullscreen={isFullscreen}
                />

                {/* Primary Map API Tile Layer with infinite horizontal wrap */}
                <TileLayer
                  key={activeProvider.id}
                  url={activeProvider.url}
                  subdomains={activeProvider.subdomains || "abc"}
                  attribution={activeProvider.attribution}
                  maxZoom={activeProvider.maxZoom}
                  noWrap={false}
                />

                {/* High-definition reference overlay for borders & place labels */}
                {activeProvider.refUrl && (
                  <TileLayer
                    key={`${activeProvider.id}-ref`}
                    url={activeProvider.refUrl}
                    subdomains={activeProvider.subdomains || "abc"}
                    zIndex={350}
                    maxZoom={activeProvider.maxZoom}
                    noWrap={false}
                  />
                )}

                {/* Weather Radar Meteorological Overlay Footprints */}
                {showWeatherOverlay &&
                  disruptions
                    ?.filter((d) => d.type === "weather" || d.severity === "critical")
                    .map((d) => (
                      <Circle
                        key={`weather-radar-${d.disruptionId}`}
                        center={d.coords}
                        radius={650000}
                        pathOptions={{
                          color: "#06B6D4",
                          fillColor: "#06B6D4",
                          fillOpacity: 0.16,
                          weight: 1.5,
                          dashArray: "4, 6",
                        }}
                      />
                    ))}

                {/* Global Maritime Trade Corridors (Polylines) */}
                {showShippingLanes &&
                  GLOBAL_SHIPPING_LANES.map((lane) => (
                    <Polyline
                      key={lane.id}
                      positions={lane.coords}
                      pathOptions={{
                        color: lane.status === "critical" ? "#EF4444" : lane.status === "congested" ? "#F59E0B" : "#06B6D4",
                        weight: 2.5,
                        dashArray: lane.status === "critical" ? "6, 6" : undefined,
                        opacity: 0.65,
                      }}
                    />
                  ))}

                {/* Pulsating Radar Ripples & Hotspot Markers */}
                {filteredDisruptions.map((d) => {
                  const isSelected = selectedDisruption?.disruptionId === d.disruptionId;
                  const color = SEVERITY_COLOR[d.severity] || tokens.amber;
                  const radius = SEVERITY_RADIUS[d.severity] || 12;

                  return (
                    <Box component="span" key={d.disruptionId}>
                      {/* Outer Radar Ripple Wave */}
                      <Circle
                        center={d.coords}
                        radius={(SEVERITY_RADIUS[d.severity] || 12) * 22000}
                        pathOptions={{
                          color: color,
                          fillColor: color,
                          fillOpacity: isSelected ? 0.22 : 0.08,
                          weight: isSelected ? 2 : 1,
                          dashArray: "4, 8",
                        }}
                      />

                      {/* Disruption Epicenter Marker */}
                      <CircleMarker
                        center={d.coords}
                        radius={isSelected ? radius + 4 : radius}
                        pathOptions={{
                          color: isSelected ? "#FFFFFF" : color,
                          fillColor: color,
                          fillOpacity: 0.75,
                          weight: isSelected ? 3 : 2,
                        }}
                        eventHandlers={{
                          click: () => handleSelectDisruption(d),
                        }}
                      >
                        <Popup>
                          <Box sx={{ p: 0.5, maxWidth: 240 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
                              <Typography variant="caption" sx={{ fontWeight: 800, color: color, fontSize: "0.78rem" }}>
                                {d.disruptionId}
                              </Typography>
                              <Chip
                                size="small"
                                label={d.severity}
                                sx={{
                                  height: 18,
                                  fontSize: "0.6rem",
                                  fontWeight: 800,
                                  textTransform: "uppercase",
                                  bgcolor: `${color}20`,
                                  color: color,
                                }}
                              />
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
                              {d.region} Corridor Hotspot
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1.25 }}>
                              {d.description}
                            </Typography>
                            <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "text.secondary", mb: 1.5 }}>
                              <span>Est. Duration: <strong>{d.estimatedDurationHours}h</strong></span>
                              <span>Type: <strong>{d.type.replace("_", " ")}</strong></span>
                            </Box>
                            <Button
                              size="small"
                              variant="contained"
                              fullWidth
                              onClick={() => navigate("/risk-analysis")}
                              sx={{
                                py: 0.5,
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                background: tokens.gradientPrimary,
                              }}
                            >
                              Analyze Corridor Risk &rarr;
                            </Button>
                          </Box>
                        </Popup>
                      </CircleMarker>
                    </Box>
                  );
                })}
              </MapContainer>
            </Card>
          </Grid>

          {/* Right Disruption Hotspots List & Action Panel */}
          <Grid item xs={12} md={5} lg={4}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, maxHeight: 580, overflowY: "auto", pr: 0.5 }}>
              {filteredDisruptions.map((d) => {
                const isSelected = selectedDisruption?.disruptionId === d.disruptionId;
                const color = SEVERITY_COLOR[d.severity];

                return (
                  <Card
                    key={d.disruptionId}
                    onClick={() => handleSelectDisruption(d)}
                    sx={{
                      p: 2.25,
                      cursor: "pointer",
                      border: isSelected ? `2px solid ${tokens.indigo}` : `1px solid ${tokens.border}`,
                      bgcolor: isSelected ? (isDark ? "rgba(99, 102, 241, 0.12)" : tokens.indigoSoft) : undefined,
                      transition: "all 150ms ease",
                      "&:hover": { borderColor: tokens.indigo, transform: "translateY(-2px)" },
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1.5, mb: 1 }}>
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                          <Typography sx={{ fontWeight: 800, fontSize: "0.95rem" }}>
                            {d.disruptionId}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                            &bull; {d.region}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: "capitalize" }}>
                          {d.type.replace("_", " ")}
                        </Typography>
                      </Box>
                      <SeverityChip severity={d.severity} />
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.82rem", lineHeight: 1.4, mb: 1.5 }}>
                      {d.description}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pt: 1, borderTop: `1px solid ${tokens.border}` }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: color }}>
                        Duration: ~{d.estimatedDurationHours}h
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="text"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/risk-analysis");
                          }}
                          sx={{ fontSize: "0.72rem", py: 0.2, fontWeight: 700, color: tokens.indigo }}
                        >
                          Analyze Risk
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/rerouting");
                          }}
                          sx={{ fontSize: "0.72rem", py: 0.2, borderColor: tokens.borderStrong }}
                        >
                          Reroute
                        </Button>
                      </Stack>
                    </Box>
                  </Card>
                );
              })}

              {filteredDisruptions.length === 0 && (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 8, gap: 1 }}>
                  <WarningAmberIcon sx={{ fontSize: 36, color: "text.disabled" }} />
                  <Typography variant="body2" color="text.secondary">
                    No disruption incidents matching search criteria.
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      )}
    </AppLayout>
  );
}
