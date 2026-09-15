import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  LinearProgress,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import BoltIcon from "@mui/icons-material/Bolt";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import AltRouteOutlinedIcon from "@mui/icons-material/AltRouteOutlined";
import AcUnitOutlinedIcon from "@mui/icons-material/AcUnitOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SpeedIcon from "@mui/icons-material/Speed";
import DirectionsBoatFilledOutlinedIcon from "@mui/icons-material/DirectionsBoatFilledOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LoginIcon from "@mui/icons-material/Login";
import TerminalOutlinedIcon from "@mui/icons-material/TerminalOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import TrainOutlinedIcon from "@mui/icons-material/TrainOutlined";

import { useAuth } from "../context/AuthContext.jsx";
import { useColorTheme } from "../context/ThemeContext.jsx";

// 4 Interactive Disruption Scenarios for Live Sandbox
const SIMULATOR_SCENARIOS = [
  {
    id: "suez",
    tabLabel: "Suez Chokepoint",
    title: "Suez / Bab-el-Mandeb Maritime Chokepoint",
    mode: "Maritime Ocean Corridor",
    icon: DirectionsBoatFilledOutlinedIcon,
    severity: "CRITICAL THREAT",
    riskScore: 92,
    color: "#EF4444",
    impacted: "24 Container Vessels · $38M Freight",
    leadTime: "68h Advance Warning",
    aiAction: "Autonomous Cape of Good Hope diversion engaged (+9.2d ETA, 0% vessel risk). Intermodal rail transfers pre-reserved at Port of Durban.",
    statusLog: "SEC-OPS: Bab-el-Mandeb threat perimeter tripped. Automated reroute dispatch broadcast to 24 carriers.",
  },
  {
    id: "rotterdam",
    tabLabel: "Rotterdam Strike",
    title: "Rotterdam Dock Labor Strike",
    mode: "Port Terminal Operations",
    icon: DirectionsBoatFilledOutlinedIcon,
    severity: "HIGH THREAT",
    riskScore: 84,
    color: "#F59E0B",
    impacted: "14 Feeder Ships · 180 Reefer Units",
    leadTime: "48h Advance Warning",
    aiAction: "Automated diversion of incoming manifests to Antwerp & Wilhelmshaven terminals. 64 regional heavy-haul trucks engaged for overland bridge.",
    statusLog: "BERTH-OPS: Quay crane operations reduced to 18%. Offload manifests dynamically re-routed via EDI.",
  },
  {
    id: "blizzard",
    tabLabel: "I-80 Blizzard",
    title: "US Interstate 80 Blizzard (Rocky Mountain Pass)",
    mode: "Overland Commercial Trucking",
    icon: LocalShippingOutlinedIcon,
    severity: "ELEVATED RISK",
    riskScore: 68,
    color: "#06B6D4",
    impacted: "42 Semi-Trucks · Cold-Chain Pharma",
    leadTime: "24h Advance Warning",
    aiAction: "Autonomous southern corridor bypass engaged via I-40. Plug-in reefer staging bays locked to maintain -20°C pharma integrity.",
    statusLog: "IOT-TELEMETRY: Wyoming mountain pass closed. Turn-by-turn carrier detour transmitted to active fleets.",
  },
  {
    id: "nominal",
    tabLabel: "Nominal Flow",
    title: "All Corridors Clear (Shield Active)",
    mode: "Global Intermodal Network",
    icon: SecurityOutlinedIcon,
    severity: "NOMINAL FLOW",
    riskScore: 12,
    color: "#10B981",
    impacted: "0 Delayed Units · 100% On-Schedule",
    leadTime: "Continuous AI Radar",
    aiAction: "Optimal speed curves and thermal stability confirmed across all active ocean, rail, and highway freight corridors.",
    statusLog: "RADAR: 10 global trade corridors scanning at nominal frequency. Zero critical anomalies detected.",
  },
];

// Active Monitored Corridors
const MONITORED_CORRIDORS = [
  {
    name: "Trans-Pacific Artery",
    route: "Shanghai / Ningbo ➔ Los Angeles / LB",
    risk: 78,
    status: "Congestion",
    recommendation: "Divert: Port of Oakland",
    statusColor: "#F59E0B",
    icon: DirectionsBoatFilledOutlinedIcon,
  },
  {
    name: "North Atlantic Lane",
    route: "Rotterdam / Antwerp ➔ New York / Newark",
    risk: 24,
    status: "Nominal",
    recommendation: "Calm Seas · 0 Forecast Delays",
    statusColor: "#10B981",
    icon: DirectionsBoatFilledOutlinedIcon,
  },
  {
    name: "Trans-American Rail",
    route: "Chicago Rail Interchange ➔ Dallas ➔ LA",
    risk: 42,
    status: "Minor Delay",
    recommendation: "Intermodal Bypass Active (I-40)",
    statusColor: "#06B6D4",
    icon: TrainOutlinedIcon,
  },
  {
    name: "Asia-Europe Highway",
    route: "Singapore Hub ➔ Bab-el-Mandeb ➔ Suez",
    risk: 88,
    status: "Chokepoint Divert",
    recommendation: "Cape Route Active (+8.5d delta)",
    statusColor: "#EF4444",
    icon: DirectionsBoatFilledOutlinedIcon,
  },
];

// 3 Core Defense Pillars
const PLATFORM_PILLARS = [
  {
    icon: WarningAmberOutlinedIcon,
    title: "Predictive Disruption Radar",
    badge: "Satellite & Weather Feeds",
    description: "Surveillance of maritime chokepoints, adverse storm systems, and port labor strikes with 48 to 72 hours predictive lead notice before supply chain breakdown.",
  },
  {
    icon: AltRouteOutlinedIcon,
    title: "Autonomous Intermodal Rerouting",
    badge: "Dynamic Multi-Modal Dispatch",
    description: "Instant algorithmic re-routing across ocean vessels, rail interchanges, and trucking corridors to minimize transit deltas and eliminate stranded freight.",
  },
  {
    icon: AcUnitOutlinedIcon,
    title: "IoT Cold-Chain & AI Copilot",
    badge: "Sub-Zero Reefer Guard",
    description: "Precision sub-zero temperature telemetry for sensitive perishables and pharmaceuticals, coupled with Bob AI for real-time natural language cargo queries.",
  },
];

export default function Home() {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useColorTheme();
  const navigate = useNavigate();

  // Active Simulation Scenario State
  const [activeScenario, setActiveScenario] = useState(SIMULATOR_SCENARIOS[0]);

  const goToLogin = (role = "shipment_user") => {
    navigate(`/login?role=${role}`);
  };

  const ScenarioIcon = activeScenario.icon;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: isDark ? "#070B14" : "#F8FAFC",
        color: isDark ? "#F8FAFC" : "#0A192F",
        transition: "background-color 200ms ease, color 200ms ease",
        overflowX: "hidden",
      }}
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP NAVIGATION BAR                                         */}
      {/* ------------------------------------------------------------- */}
      <Box
        component="header"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1200,
          bgcolor: isDark ? "rgba(7, 11, 20, 0.9)" : "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: isDark ? "1px solid rgba(56, 189, 248, 0.15)" : "1px solid #E2E8F0",
          px: { xs: 2, sm: 4, md: 6 },
          py: 1.5,
          boxShadow: isDark ? "0 8px 30px rgba(0, 0, 0, 0.4)" : "0 2px 14px rgba(0, 82, 255, 0.04)",
        }}
      >
        <Box sx={{ maxWidth: 1320, mx: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Brand Logo & Name */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              textDecoration: "none",
              color: "inherit",
              transition: "transform 180ms ease",
              "&:hover": { transform: "translateY(-1px)" },
            }}
          >
            <Box
              component="img"
              src="/logo.png"
              alt="SupplyGuard AI Logo"
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2,
                objectFit: "contain",
                filter: isDark ? "drop-shadow(0 4px 12px rgba(56, 189, 248, 0.45))" : "drop-shadow(0 3px 8px rgba(0, 82, 255, 0.25))",
              }}
            />
            <Box>
              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: "1.18rem",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.1,
                  color: isDark ? "#FFFFFF" : "#0A192F",
                }}
              >
                SupplyGuard <Box component="span" sx={{ color: isDark ? "#38BDF8" : "#0052FF" }}>AI</Box>
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: isDark ? "#94A3B8" : "#64748B",
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  letterSpacing: "0.03em",
                  display: "block",
                }}
              >
                Autonomous Intermodal Freight Defense
              </Typography>
            </Box>
          </Box>

          {/* Clean Nav Links */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 3.5 }}>
            <Button
              href="#simulator"
              sx={{
                color: isDark ? "#94A3B8" : "#475569",
                fontWeight: 600,
                fontSize: "0.88rem",
                textTransform: "none",
                "&:hover": { color: isDark ? "#38BDF8" : "#0052FF" },
              }}
            >
              Live Simulator
            </Button>
            <Button
              href="#corridors"
              sx={{
                color: isDark ? "#94A3B8" : "#475569",
                fontWeight: 600,
                fontSize: "0.88rem",
                textTransform: "none",
                "&:hover": { color: isDark ? "#38BDF8" : "#0052FF" },
              }}
            >
              Trade Corridors
            </Button>
            <Button
              href="#pillars"
              sx={{
                color: isDark ? "#94A3B8" : "#475569",
                fontWeight: 600,
                fontSize: "0.88rem",
                textTransform: "none",
                "&:hover": { color: isDark ? "#38BDF8" : "#0052FF" },
              }}
            >
              Defense Pillars
            </Button>
            <Button
              onClick={() => goToLogin("shipment_user")}
              sx={{
                color: isDark ? "#94A3B8" : "#475569",
                fontWeight: 600,
                fontSize: "0.88rem",
                textTransform: "none",
                "&:hover": { color: isDark ? "#38BDF8" : "#0052FF" },
              }}
            >
              Sign In
            </Button>
          </Box>

          {/* Right Action Controls */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {/* Theme Toggle */}
            <Tooltip title={isDark ? "Switch to Light Mode" : "Switch to Dark Ops Mode"}>
              <IconButton
                onClick={toggleTheme}
                size="small"
                sx={{
                  border: isDark ? "1px solid rgba(56, 189, 248, 0.3)" : "1px solid #E2E8F0",
                  bgcolor: isDark ? "rgba(255, 255, 255, 0.05)" : "#FFFFFF",
                  color: isDark ? "#FDE047" : "#0052FF",
                  p: 0.9,
                  transition: "all 180ms ease",
                  "&:hover": {
                    bgcolor: isDark ? "rgba(253, 224, 71, 0.15)" : "#EFF6FF",
                    borderColor: isDark ? "#FDE047" : "#0052FF",
                  },
                }}
              >
                {isDark ? <LightModeOutlinedIcon fontSize="small" /> : <DarkModeOutlinedIcon fontSize="small" />}
              </IconButton>
            </Tooltip>

            {/* Portal Action CTA */}
            {user ? (
              <Button
                variant="contained"
                onClick={() => navigate("/dashboard")}
                endIcon={<ArrowForwardIcon fontSize="small" />}
                sx={{
                  background: isDark
                    ? "linear-gradient(135deg, #0284C7 0%, #2563EB 60%, #4F46E5 100%)"
                    : "linear-gradient(135deg, #0052FF 0%, #1D4ED8 100%)",
                  color: "#FFFFFF",
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  py: 0.85,
                  px: 2.2,
                  borderRadius: 2.2,
                  boxShadow: isDark ? "0 4px 16px rgba(37, 99, 235, 0.4)" : "0 4px 14px rgba(0, 82, 255, 0.25)",
                  textTransform: "none",
                  "&:hover": { opacity: 0.95 },
                }}
              >
                Open Console ({user.role === "admin" ? "Admin" : "Shipper"})
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() => goToLogin("shipment_user")}
                startIcon={<PersonOutlineIcon fontSize="small" />}
                sx={{
                  background: isDark
                    ? "linear-gradient(135deg, #0284C7 0%, #2563EB 60%, #4F46E5 100%)"
                    : "linear-gradient(135deg, #0052FF 0%, #1D4ED8 100%)",
                  color: "#FFFFFF",
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  py: 0.85,
                  px: 2.2,
                  borderRadius: 2.2,
                  boxShadow: isDark ? "0 4px 16px rgba(37, 99, 235, 0.35)" : "0 4px 14px rgba(0, 82, 255, 0.25)",
                  textTransform: "none",
                  "&:hover": { opacity: 0.95 },
                }}
              >
                Shipper Portal
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      {/* ------------------------------------------------------------- */}
      {/* 2. HERO SHOWCASE: PROPER, AIRY & IMPACTFUL                     */}
      {/* ------------------------------------------------------------- */}
      <Box
        sx={{
          pt: { xs: 7, md: 10 },
          pb: { xs: 6, md: 8 },
          position: "relative",
          bgcolor: isDark ? "#070B14" : "#F8FAFC",
          backgroundImage: isDark
            ? "radial-gradient(ellipse at 50% -10%, rgba(14, 165, 233, 0.22) 0%, rgba(7, 11, 20, 0.98) 65%)"
            : "radial-gradient(ellipse at 50% 0%, rgba(0, 82, 255, 0.06) 0%, transparent 65%)",
        }}
      >
        {/* Subtle Cybernetic Grid Pattern */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: isDark
              ? "linear-gradient(rgba(56, 189, 248, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.03) 1px, transparent 1px)"
              : "linear-gradient(rgba(0, 82, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 82, 255, 0.02) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse at center, black 35%, transparent 80%)",
            pointerEvents: "none",
          }}
        />

        <Container maxWidth="xl" sx={{ maxWidth: 1280, position: "relative" }}>
          {/* Main Hero Header (Centered, Authoritative & Attractive) */}
          <Box sx={{ textAlign: "center", maxWidth: 940, mx: "auto", mb: 5 }}>
            {/* Pulsing Status Pill */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.25,
                px: 2,
                py: 0.75,
                borderRadius: 50,
                bgcolor: isDark ? "rgba(15, 23, 42, 0.85)" : "#EFF6FF",
                border: isDark ? "1px solid rgba(56, 189, 248, 0.3)" : "1px solid #DBEAFE",
                boxShadow: isDark ? "0 0 20px rgba(56, 189, 248, 0.15)" : "none",
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "#10B981",
                  boxShadow: "0 0 10px #10B981",
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  fontSize: "0.76rem",
                  color: isDark ? "#E0F2FE" : "#0052FF",
                  textTransform: "uppercase",
                }}
              >
                LIVE DEFENSE RADAR ACTIVE · 14 GLOBAL TRADE LANES SHIELDED
              </Typography>
            </Box>

            {/* Monumental Headline */}
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.2rem" },
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 1.12,
                color: isDark ? "#FFFFFF" : "#0A192F",
                mb: 2.5,
              }}
            >
              Autonomous Intermodal{" "}
              <Box
                component="span"
                sx={{
                  background: isDark
                    ? "linear-gradient(135deg, #38BDF8 0%, #2563EB 50%, #06B6D4 100%)"
                    : "linear-gradient(135deg, #0052FF 0%, #1D4ED8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: "inline-block",
                }}
              >
                Supply Chain &amp; Fleet Defense
              </Box>
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="body1"
              sx={{
                color: isDark ? "#94A3B8" : "#475569",
                fontSize: { xs: "1.05rem", md: "1.22rem" },
                lineHeight: 1.65,
                maxWidth: 760,
                mx: "auto",
                mb: 4,
              }}
            >
              Protect ocean vessels, rail interchanges, and long-haul freight trucks with predictive disruption radar,
              automated multi-modal rerouting, and real-time cold-chain IoT telemetry.
            </Typography>

            {/* Action Buttons */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
              alignItems="center"
              sx={{ mb: 6 }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => goToLogin("shipment_user")}
                startIcon={<PersonOutlineIcon />}
                sx={{
                  py: 1.5,
                  px: 3.8,
                  fontSize: "0.96rem",
                  fontWeight: 800,
                  borderRadius: 2.5,
                  background: isDark
                    ? "linear-gradient(135deg, #0284C7 0%, #2563EB 100%)"
                    : "#0052FF",
                  boxShadow: isDark ? "0 8px 25px rgba(2, 132, 199, 0.4)" : "0 6px 20px rgba(0, 82, 255, 0.28)",
                  textTransform: "none",
                  "&:hover": { opacity: 0.95 },
                }}
              >
                Launch Shipper Portal
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => goToLogin("admin")}
                startIcon={<LoginIcon />}
                sx={{
                  py: 1.5,
                  px: 3.2,
                  fontSize: "0.96rem",
                  fontWeight: 700,
                  borderRadius: 2.5,
                  borderColor: isDark ? "rgba(56, 189, 248, 0.35)" : "rgba(0, 82, 255, 0.25)",
                  color: isDark ? "#38BDF8" : "#0052FF",
                  bgcolor: isDark ? "rgba(15, 23, 42, 0.5)" : "#FFFFFF",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: isDark ? "#38BDF8" : "#0052FF",
                    bgcolor: isDark ? "rgba(56, 189, 248, 0.1)" : "#EFF6FF",
                  },
                }}
              >
                Command Console Sign In
              </Button>
            </Stack>

            {/* Verified Key Performance Indicators (Proper 4-Item Glass Strip) */}
            <Card
              sx={{
                p: { xs: 2.5, sm: 3 },
                borderRadius: 3.5,
                bgcolor: isDark ? "rgba(11, 18, 32, 0.85)" : "#FFFFFF",
                backdropFilter: "blur(20px)",
                border: isDark ? "1px solid rgba(56, 189, 248, 0.2)" : "1px solid #E2E8F0",
                boxShadow: isDark ? "0 16px 40px rgba(0, 0, 0, 0.5)" : "0 8px 30px rgba(0, 82, 255, 0.06)",
              }}
            >
              <Grid container spacing={{ xs: 2, md: 3 }} alignItems="center">
                {[
                  { label: "Cargo Shielded", val: "$420M+", sub: "Active intermodal value", icon: SecurityOutlinedIcon, color: isDark ? "#38BDF8" : "#0052FF" },
                  { label: "Early Threat Lead", val: "48–72h", sub: "Predictive notice window", icon: SpeedIcon, color: "#10B981" },
                  { label: "AI Reroute Adoption", val: "94.2%", sub: "Autonomous execution", icon: AltRouteOutlinedIcon, color: isDark ? "#818CF8" : "#0052FF" },
                  { label: "Cold-Chain Integrity", val: "99.8%", sub: "-20°C reefer compliance", icon: AcUnitOutlinedIcon, color: "#F59E0B" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <Grid item xs={6} md={3} key={i}>
                      <Box sx={{ textAlign: "left", p: { xs: 1, sm: 1.5 } }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                          <Box sx={{ p: 0.75, borderRadius: 1.5, bgcolor: isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9" }}>
                            <Icon sx={{ fontSize: 18, color: item.color }} />
                          </Box>
                          <Typography variant="caption" sx={{ color: isDark ? "#94A3B8" : "#64748B", fontWeight: 700, fontSize: "0.72rem" }}>
                            {item.label}
                          </Typography>
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: item.color, letterSpacing: "-0.03em", my: 0.5 }}>
                          {item.val}
                        </Typography>
                        <Typography variant="caption" sx={{ color: isDark ? "#64748B" : "#94A3B8", fontSize: "0.7rem", display: "block" }}>
                          {item.sub}
                        </Typography>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Card>
          </Box>
        </Container>
      </Box>

      {/* ------------------------------------------------------------- */}
      {/* 3. INTERACTIVE DISRUPTION SIMULATOR (SHOWSTOPPER CENTERPIECE)  */}
      {/* ------------------------------------------------------------- */}
      <Box
        id="simulator"
        sx={{
          py: { xs: 6, md: 8 },
          bgcolor: isDark ? "#060A13" : "#F1F5F9",
          borderTop: isDark ? "1px solid rgba(56, 189, 248, 0.12)" : "1px solid #E2E8F0",
          borderBottom: isDark ? "1px solid rgba(56, 189, 248, 0.12)" : "1px solid #E2E8F0",
          position: "relative",
        }}
      >
        <Container maxWidth="xl" sx={{ maxWidth: 1280 }}>
          {/* Section Sub-header */}
          <Box sx={{ textAlign: "center", maxWidth: 720, mx: "auto", mb: 4 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 1.75,
                py: 0.5,
                borderRadius: 50,
                bgcolor: isDark ? "rgba(56, 189, 248, 0.12)" : "#EFF6FF",
                border: isDark ? "1px solid rgba(56, 189, 248, 0.3)" : "1px solid #DBEAFE",
                color: isDark ? "#38BDF8" : "#0052FF",
                mb: 1.5,
              }}
            >
              <BoltIcon sx={{ fontSize: 16 }} />
              <Typography sx={{ fontWeight: 800, fontSize: "0.74rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Interactive Disruption Sandbox
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: "-0.03em", color: isDark ? "#FFFFFF" : "#0A192F", mb: 1 }}>
              Test Autonomous Disruption Mitigation
            </Typography>
            <Typography variant="body2" sx={{ color: isDark ? "#94A3B8" : "#475569", fontSize: "0.98rem" }}>
              Select a real-world scenario below to observe how SupplyGuard AI calculates alternative routes, reroutes freight, and protects cargo in milliseconds.
            </Typography>
          </Box>

          {/* Interactive Simulator Deck (Command Terminal Style) */}
          <Card
            sx={{
              maxWidth: 1100,
              mx: "auto",
              borderRadius: 4,
              bgcolor: isDark ? "rgba(11, 18, 32, 0.94)" : "#FFFFFF",
              backdropFilter: "blur(24px)",
              border: isDark ? "1px solid rgba(56, 189, 248, 0.28)" : "1px solid #E2E8F0",
              boxShadow: isDark
                ? "0 25px 60px rgba(0, 0, 0, 0.6), 0 0 35px rgba(56, 189, 248, 0.12)"
                : "0 16px 45px rgba(0, 82, 255, 0.08)",
              overflow: "hidden",
            }}
          >
            {/* Terminal Top Chrome Bar */}
            <Box
              sx={{
                px: 3,
                py: 1.5,
                bgcolor: isDark ? "rgba(15, 23, 42, 0.9)" : "#F8FAFC",
                borderBottom: isDark ? "1px solid rgba(56, 189, 248, 0.15)" : "1px solid #E2E8F0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box sx={{ display: "flex", gap: 0.75 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#EF4444" }} />
                  <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#F59E0B" }} />
                  <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#10B981" }} />
                </Box>
                <Divider orientation="vertical" flexItem sx={{ mx: 0.5, bgcolor: isDark ? "rgba(255,255,255,0.1)" : "#CBD5E1" }} />
                <Typography sx={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: "0.78rem", color: isDark ? "#38BDF8" : "#0052FF" }}>
                  SG-DEFENSE ENGINE // LIVE SCENARIO SIMULATOR
                </Typography>
              </Box>

              <Chip
                size="small"
                label={activeScenario.severity}
                sx={{
                  height: 24,
                  fontSize: "0.68rem",
                  fontWeight: 900,
                  bgcolor: isDark ? `${activeScenario.color}22` : "#EFF6FF",
                  color: activeScenario.color,
                  border: `1px solid ${activeScenario.color}66`,
                }}
              />
            </Box>

            {/* Scenario Selector Pills Bar */}
            <Box
              sx={{
                p: { xs: 2, sm: 2.5 },
                bgcolor: isDark ? "rgba(7, 11, 20, 0.6)" : "#FAFCFF",
                borderBottom: isDark ? "1px solid rgba(148, 163, 184, 0.1)" : "1px solid #F1F5F9",
              }}
            >
              <Grid container spacing={1.5}>
                {SIMULATOR_SCENARIOS.map((sc) => {
                  const isSelected = activeScenario.id === sc.id;
                  const Icon = sc.icon;
                  return (
                    <Grid item xs={6} sm={3} key={sc.id}>
                      <Card
                        onClick={() => setActiveScenario(sc)}
                        sx={{
                          p: 1.75,
                          cursor: "pointer",
                          borderRadius: 2.5,
                          border: isSelected
                            ? `2px solid ${isDark ? "#38BDF8" : "#0052FF"}`
                            : `1px solid ${isDark ? "rgba(148, 163, 184, 0.15)" : "#E2E8F0"}`,
                          bgcolor: isSelected
                            ? isDark ? "rgba(56, 189, 248, 0.14)" : "#EFF6FF"
                            : isDark ? "rgba(15, 23, 42, 0.65)" : "#FFFFFF",
                          boxShadow: isSelected ? "0 4px 20px rgba(0, 82, 255, 0.15)" : "none",
                          transition: "all 180ms cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            borderColor: isDark ? "#38BDF8" : "#0052FF",
                          },
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.75 }}>
                          <Icon sx={{ fontSize: 18, color: isSelected ? (isDark ? "#38BDF8" : "#0052FF") : (isDark ? "#94A3B8" : "#64748B") }} />
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 800,
                              fontSize: "0.72rem",
                              color: sc.color,
                            }}
                          >
                            {sc.riskScore}%
                          </Typography>
                        </Box>
                        <Typography sx={{ fontWeight: 800, fontSize: "0.86rem", color: isDark ? "#FFFFFF" : "#0A192F", lineHeight: 1.2 }}>
                          {sc.tabLabel}
                        </Typography>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>

            {/* Main Interactive Diagnostic Content */}
            <Box sx={{ p: { xs: 2.5, sm: 4 } }}>
              <Grid container spacing={3.5} alignItems="stretch">
                {/* Left Panel: Threat Assessment & Metrics */}
                <Grid item xs={12} md={5}>
                  <Box
                    sx={{
                      p: 3,
                      height: "100%",
                      borderRadius: 3,
                      bgcolor: isDark ? "rgba(15, 23, 42, 0.7)" : "#F8FAFC",
                      border: isDark ? "1px solid rgba(56, 189, 248, 0.15)" : "1px solid #E2E8F0",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <ScenarioIcon sx={{ color: activeScenario.color, fontSize: 20 }} />
                        <Typography variant="caption" sx={{ color: isDark ? "#94A3B8" : "#64748B", fontWeight: 700, textTransform: "uppercase" }}>
                          {activeScenario.mode}
                        </Typography>
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 900, color: isDark ? "#FFFFFF" : "#0A192F", mb: 2, lineHeight: 1.2 }}>
                        {activeScenario.title}
                      </Typography>

                      {/* Vulnerability Index Progress */}
                      <Box sx={{ mb: 2.5 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
                          <Typography variant="caption" sx={{ color: isDark ? "#94A3B8" : "#475569", fontWeight: 700 }}>
                            Corridor Vulnerability Index
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 900, color: activeScenario.color }}>
                            {activeScenario.riskScore} / 100
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={activeScenario.riskScore}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0",
                            "& .MuiLinearProgress-bar": {
                              bgcolor: activeScenario.color,
                              borderRadius: 4,
                            },
                          }}
                        />
                      </Box>
                    </Box>

                    {/* At-Risk and Warning Lead Chips */}
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ p: 1.75, borderRadius: 2, bgcolor: isDark ? "rgba(7, 11, 20, 0.6)" : "#FFFFFF", border: isDark ? "1px solid rgba(148, 163, 184, 0.12)" : "1px solid #E2E8F0" }}>
                          <Typography variant="caption" sx={{ color: isDark ? "#94A3B8" : "#64748B", fontWeight: 700, display: "block" }}>
                            Impacted Assets
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 800, color: isDark ? "#FFFFFF" : "#0A192F", mt: 0.5, fontSize: "0.82rem" }}>
                            {activeScenario.impacted}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ p: 1.75, borderRadius: 2, bgcolor: isDark ? "rgba(7, 11, 20, 0.6)" : "#FFFFFF", border: isDark ? "1px solid rgba(148, 163, 184, 0.12)" : "1px solid #E2E8F0" }}>
                          <Typography variant="caption" sx={{ color: isDark ? "#94A3B8" : "#64748B", fontWeight: 700, display: "block" }}>
                            Advance Warning
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 800, color: "#10B981", mt: 0.5, fontSize: "0.82rem" }}>
                            {activeScenario.leadTime}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                {/* Right Panel: Autonomous AI Action & Terminal Feed */}
                <Grid item xs={12} md={7}>
                  <Box
                    sx={{
                      p: 3,
                      height: "100%",
                      borderRadius: 3,
                      bgcolor: isDark ? "rgba(7, 11, 20, 0.88)" : "#FFFFFF",
                      border: isDark ? "1px solid rgba(56, 189, 248, 0.22)" : "1px solid #E2E8F0",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 1.5 }}>
                        <Box sx={{ p: 0.75, borderRadius: 1.5, bgcolor: isDark ? "rgba(56, 189, 248, 0.15)" : "#EFF6FF" }}>
                          <SmartToyOutlinedIcon sx={{ color: isDark ? "#38BDF8" : "#0052FF", fontSize: 20 }} />
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 800, fontSize: "0.92rem", color: isDark ? "#FFFFFF" : "#0A192F" }}>
                            SupplyGuard AI Autonomous Action Plan
                          </Typography>
                          <Typography variant="caption" sx={{ color: isDark ? "#94A3B8" : "#64748B" }}>
                            Computed in 18ms by Neural Rerouting Model
                          </Typography>
                        </Box>
                      </Box>

                      <Typography
                        variant="body1"
                        sx={{
                          color: isDark ? "#E2E8F0" : "#334155",
                          fontSize: "0.95rem",
                          lineHeight: 1.6,
                          fontWeight: 500,
                          mb: 3,
                        }}
                      >
                        {activeScenario.aiAction}
                      </Typography>
                    </Box>

                    {/* Dark Terminal Feed Output */}
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: isDark ? "#04070D" : "#0F172A",
                        border: "1px solid rgba(56, 189, 248, 0.25)",
                        display: "flex",
                        alignItems: "center",
                        gap: 1.25,
                      }}
                    >
                      <TerminalOutlinedIcon sx={{ color: "#38BDF8", fontSize: 18, flexShrink: 0 }} />
                      <Typography
                        sx={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.76rem",
                          color: "#38BDF8",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {activeScenario.statusLog}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Container>
      </Box>

      {/* ------------------------------------------------------------- */}
      {/* 4. ACTIVE TRADE CORRIDORS (COMPACT 4-GRID DISPLAY)             */}
      {/* ------------------------------------------------------------- */}
      <Box id="corridors" sx={{ py: { xs: 6, md: 8 }, bgcolor: isDark ? "#070B14" : "#FFFFFF" }}>
        <Container maxWidth="xl" sx={{ maxWidth: 1280 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 3.5 }}>
            <Box>
              <Typography variant="overline" sx={{ color: isDark ? "#38BDF8" : "#0052FF", fontWeight: 800, letterSpacing: "0.12em" }}>
                INTERCONTINENTAL RADAR
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: isDark ? "#FFFFFF" : "#0A192F", letterSpacing: "-0.03em" }}>
                Active Monitored Corridors
              </Typography>
            </Box>
            <Chip
              label="Continuous Vector Telemetry"
              size="small"
              sx={{
                bgcolor: isDark ? "rgba(56, 189, 248, 0.12)" : "#EFF6FF",
                color: isDark ? "#38BDF8" : "#0052FF",
                fontWeight: 700,
                fontSize: "0.72rem",
              }}
            />
          </Box>

          <Grid container spacing={2.5}>
            {MONITORED_CORRIDORS.map((lane, idx) => {
              const Icon = lane.icon;
              return (
                <Grid item xs={12} sm={6} lg={3} key={idx}>
                  <Card
                    sx={{
                      p: 2.5,
                      height: "100%",
                      borderRadius: 3,
                      border: isDark ? "1px solid rgba(148, 163, 184, 0.12)" : "1px solid #E2E8F0",
                      bgcolor: isDark ? "rgba(15, 23, 42, 0.65)" : "#F8FAFC",
                      boxShadow: isDark ? "none" : "0 2px 10px rgba(0,0,0,0.02)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      transition: "all 180ms ease",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        borderColor: isDark ? "#38BDF8" : "#0052FF",
                        boxShadow: isDark ? "0 8px 24px rgba(0,0,0,0.4)" : "0 6px 20px rgba(0,82,255,0.08)",
                      },
                    }}
                  >
                    <Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                        <Box sx={{ p: 1, borderRadius: 2, bgcolor: isDark ? "rgba(56, 189, 248, 0.15)" : "#EFF6FF" }}>
                          <Icon sx={{ color: isDark ? "#38BDF8" : "#0052FF", fontSize: 20 }} />
                        </Box>
                        <Chip
                          size="small"
                          label={lane.status}
                          sx={{
                            height: 20,
                            fontSize: "0.64rem",
                            fontWeight: 800,
                            bgcolor: isDark ? `${lane.statusColor}22` : "#FFFFFF",
                            color: lane.statusColor,
                            border: `1px solid ${lane.statusColor}44`,
                          }}
                        />
                      </Box>
                      <Typography sx={{ fontWeight: 800, fontSize: "0.98rem", color: isDark ? "#FFFFFF" : "#0A192F", mb: 0.5 }}>
                        {lane.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: isDark ? "#94A3B8" : "#64748B", display: "block", mb: 2 }}>
                        {lane.route}
                      </Typography>
                    </Box>

                    <Box sx={{ pt: 1.5, borderTop: isDark ? "1px solid rgba(148, 163, 184, 0.1)" : "1px solid #E2E8F0" }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                        <Typography variant="caption" sx={{ color: isDark ? "#94A3B8" : "#64748B" }}>
                          Threat Score
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 900, color: lane.statusColor }}>
                          {lane.risk} / 100
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: isDark ? "#E2E8F0" : "#334155", fontSize: "0.72rem", display: "block" }}>
                        {lane.recommendation}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* ------------------------------------------------------------- */}
      {/* 5. 3 CORE DEFENSE PILLARS                                     */}
      {/* ------------------------------------------------------------- */}
      <Box
        id="pillars"
        sx={{
          py: { xs: 6, md: 8 },
          bgcolor: isDark ? "#060A13" : "#F8FAFC",
          borderTop: isDark ? "1px solid rgba(56, 189, 248, 0.1)" : "1px solid #E2E8F0",
        }}
      >
        <Container maxWidth="xl" sx={{ maxWidth: 1280 }}>
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Typography variant="overline" sx={{ color: isDark ? "#38BDF8" : "#0052FF", fontWeight: 800, letterSpacing: "0.12em" }}>
              ENTERPRISE PLATFORM ARSENAL
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: "-0.03em", color: isDark ? "#FFFFFF" : "#0A192F", mt: 0.5, mb: 1 }}>
              Engineered for Zero-Downtime Intermodal Logistics
            </Typography>
            <Typography variant="body2" sx={{ color: isDark ? "#94A3B8" : "#64748B", maxWidth: 600, mx: "auto", fontSize: "0.95rem" }}>
              Three interconnected architectural pillars safeguarding ocean vessels, freight trains, and cold-chain truck fleets.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {PLATFORM_PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <Grid item xs={12} md={4} key={idx}>
                  <Card
                    sx={{
                      p: 3.5,
                      height: "100%",
                      borderRadius: 3.5,
                      border: isDark ? "1px solid rgba(148, 163, 184, 0.12)" : "1px solid #E2E8F0",
                      bgcolor: isDark ? "rgba(15, 23, 42, 0.7)" : "#FFFFFF",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      transition: "transform 180ms ease, border-color 180ms ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        borderColor: isDark ? "#38BDF8" : "#0052FF",
                        boxShadow: isDark ? "0 12px 30px rgba(0,0,0,0.5)" : "0 8px 25px rgba(0,82,255,0.08)",
                      },
                    }}
                  >
                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2.5 }}>
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2,
                            bgcolor: isDark ? "rgba(56, 189, 248, 0.15)" : "#EFF6FF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Icon sx={{ color: isDark ? "#38BDF8" : "#0052FF", fontSize: 24 }} />
                        </Box>
                        <Chip
                          size="small"
                          label={pillar.badge}
                          sx={{
                            height: 22,
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            bgcolor: isDark ? "rgba(56, 189, 248, 0.12)" : "#EFF6FF",
                            color: isDark ? "#38BDF8" : "#0052FF",
                          }}
                        />
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: isDark ? "#FFFFFF" : "#0A192F", mb: 1.25 }}>
                        {pillar.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: isDark ? "#94A3B8" : "#475569", lineHeight: 1.6, fontSize: "0.92rem" }}>
                        {pillar.description}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* ------------------------------------------------------------- */}
      {/* 6. CALL-TO-ACTION STRIP                                       */}
      {/* ------------------------------------------------------------- */}
      <Box
        sx={{
          py: 6,
          bgcolor: isDark ? "#070B14" : "#FFFFFF",
          borderTop: isDark ? "1px solid rgba(56, 189, 248, 0.1)" : "1px solid #E2E8F0",
        }}
      >
        <Container maxWidth="xl" sx={{ maxWidth: 1100 }}>
          <Box
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 4,
              background: isDark
                ? "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(7, 11, 20, 0.95) 100%)"
                : "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
              border: isDark ? "1px solid rgba(56, 189, 248, 0.3)" : "1px solid #BFDBFE",
              textAlign: "center",
              position: "relative",
              boxShadow: isDark ? "0 12px 40px rgba(0, 0, 0, 0.4)" : "0 8px 30px rgba(0, 82, 255, 0.08)",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 900, color: isDark ? "#FFFFFF" : "#0A192F", mb: 1.5 }}>
              Ready to Fortify Your Intermodal Supply Chain?
            </Typography>
            <Typography variant="body1" sx={{ color: isDark ? "#94A3B8" : "#475569", maxWidth: 640, mx: "auto", mb: 3.5 }}>
              Join forward-thinking enterprise logistics teams. Monitor multi-modal cargo, get real-time disruption radar, and automate alternative routing.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
              <Button
                variant="contained"
                size="large"
                onClick={() => goToLogin("shipment_user")}
                startIcon={<PersonOutlineIcon />}
                sx={{
                  py: 1.3,
                  px: 3.5,
                  fontSize: "0.92rem",
                  fontWeight: 800,
                  borderRadius: 2,
                  bgcolor: isDark ? "#0284C7" : "#0052FF",
                  boxShadow: isDark ? "0 6px 20px rgba(2, 132, 199, 0.4)" : "0 4px 16px rgba(0, 82, 255, 0.3)",
                  textTransform: "none",
                  "&:hover": { bgcolor: isDark ? "#0369A1" : "#0043D1" },
                }}
              >
                Access Shipper Portal
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => goToLogin("admin")}
                startIcon={<LoginIcon />}
                sx={{
                  py: 1.3,
                  px: 3,
                  fontSize: "0.92rem",
                  fontWeight: 700,
                  borderRadius: 2,
                  borderColor: isDark ? "rgba(56, 189, 248, 0.4)" : "rgba(0, 82, 255, 0.3)",
                  color: isDark ? "#38BDF8" : "#0052FF",
                  bgcolor: isDark ? "transparent" : "#FFFFFF",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: isDark ? "#38BDF8" : "#0052FF",
                    bgcolor: isDark ? "rgba(56, 189, 248, 0.08)" : "#EFF6FF",
                  },
                }}
              >
                Admin Sign In
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* ------------------------------------------------------------- */}
      {/* 7. COMPACT SINGLE-ROW FOOTER                                  */}
      {/* ------------------------------------------------------------- */}
      <Box
        component="footer"
        sx={{
          py: 3,
          borderTop: isDark ? "1px solid rgba(148, 163, 184, 0.1)" : "1px solid #E2E8F0",
          bgcolor: isDark ? "#04070D" : "#FFFFFF",
        }}
      >
        <Container maxWidth="xl" sx={{ maxWidth: 1280 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              <Box
                component="img"
                src="/logo.png"
                alt="SupplyGuard AI Logo"
                sx={{ width: 28, height: 28, borderRadius: 1, objectFit: "contain" }}
              />
              <Typography sx={{ fontWeight: 800, fontSize: "0.86rem", color: isDark ? "#FFFFFF" : "#0A192F" }}>
                SupplyGuard AI <Box component="span" sx={{ color: isDark ? "#94A3B8" : "#64748B", fontWeight: 400, fontSize: "0.78rem" }}>· © 2026 Autonomous Intermodal Defense</Box>
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#10B981" }} />
                <Typography variant="caption" sx={{ color: isDark ? "#94A3B8" : "#475569", fontWeight: 700, fontSize: "0.75rem" }}>
                  99.98% Telemetry Uptime
                </Typography>
              </Box>
              <Button
                size="small"
                onClick={() => goToLogin("shipment_user")}
                sx={{
                  color: isDark ? "#94A3B8" : "#475569",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": { color: isDark ? "#38BDF8" : "#0052FF" },
                }}
              >
                Shipper Portal
              </Button>
              <Button
                size="small"
                onClick={toggleTheme}
                sx={{
                  color: isDark ? "#38BDF8" : "#0052FF",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                {isDark ? "☀️ Switch to Light" : "🌙 Switch to Dark Ops"}
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
