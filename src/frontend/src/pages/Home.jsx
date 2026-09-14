import { useState, useRef } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  Tabs,
  Tab,
  TextField,
  Alert,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  LinearProgress,
} from "@mui/material";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import BoltIcon from "@mui/icons-material/Bolt";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import AltRouteOutlinedIcon from "@mui/icons-material/AltRouteOutlined";
import AcUnitOutlinedIcon from "@mui/icons-material/AcUnitOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SpeedIcon from "@mui/icons-material/Speed";
import DirectionsBoatFilledOutlinedIcon from "@mui/icons-material/DirectionsBoatFilledOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import RadarOutlinedIcon from "@mui/icons-material/RadarOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import PlayCircleOutlineOutlinedIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { useAuth } from "../context/AuthContext.jsx";
import { useColorTheme } from "../context/ThemeContext.jsx";
import { tokens } from "../theme.js";

// Interactive Disruption Scenarios for Live Interactive Sandbox
const SIMULATOR_SCENARIOS = [
  {
    id: "suez",
    title: "Suez / Bab-el-Mandeb Chokepoint",
    mode: "Maritime Ocean",
    severity: "CRITICAL THREAT",
    riskScore: 92,
    color: "#EF4444",
    impacted: "24 Container Vessels · $38M Freight",
    leadTime: "68h Advance Notice",
    aiAction: "Autonomous Cape of Good Hope diversion engaged (+9.2d ETA, 0% vessel loss risk). Rail transfer pre-booked at Port of Durban.",
    statusLog: "DIS-1049: Maritime security perimeter triggered. Reroute dispatch transmitted to 24 carriers.",
  },
  {
    id: "rotterdam",
    title: "Rotterdam Dock Labor Strike",
    mode: "Port Terminal",
    severity: "HIGH THREAT",
    riskScore: 84,
    color: "#F59E0B",
    impacted: "14 Feeder Ships · 180 Reefer Units",
    leadTime: "48h Advance Notice",
    aiAction: "Automated diversion to Antwerp & Wilhelmshaven terminals. 64 regional heavy-haul trucks summoned for overland bridge.",
    statusLog: "DIS-1001: Berth operations at 18% capacity. Offload permits rerouted via API to North Sea hubs.",
  },
  {
    id: "blizzard",
    title: "US Interstate 80 Blizzard",
    mode: "Overland Trucking",
    severity: "ELEVATED",
    riskScore: 68,
    color: "#06B6D4",
    impacted: "42 Freight Semi-Trucks · Sensitive Pharma",
    leadTime: "24h Advance Notice",
    aiAction: "Autonomous southern corridor bypass via I-40. Plug-in reefer staging bays locked to maintain -20°C pharma integrity.",
    statusLog: "DIS-1033: Wyoming pass blocked by snowpack. Automated driver turn-by-turn bypass activated.",
  },
  {
    id: "nominal",
    title: "All Corridors Clear (Shield Active)",
    mode: "Global Intermodal",
    severity: "NOMINAL FLOW",
    riskScore: 12,
    color: "#10B981",
    impacted: "0 Delayed Units · 100% On-Schedule",
    leadTime: "Continuous AI Monitoring",
    aiAction: "Optimal speed curves and thermal stability confirmed across all ocean, rail, and highway freight assets.",
    statusLog: "SYSTEM: 10 global trade corridors scanning at nominal frequency. Zero critical anomalies.",
  },
];

export default function Home() {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useColorTheme();
  const navigate = useNavigate();

  // Interactive Disruption Simulator state
  const [activeScenario, setActiveScenario] = useState(SIMULATOR_SCENARIOS[0]);

  const goToLogin = (role = "admin") => {
    navigate(`/login?role=${role}`);
  };

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
      {/* Top Navigation Bar with Light/Dark Mode Switcher */}
      <Box
        component="header"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1200,
          bgcolor: isDark ? "rgba(7, 11, 20, 0.88)" : "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: isDark ? "1px solid rgba(56, 189, 248, 0.15)" : "1px solid #E2E8F0",
          px: { xs: 2, md: 5 },
          py: 1.5,
          boxShadow: isDark ? "0 8px 30px rgba(0, 0, 0, 0.4)" : "0 2px 14px rgba(0, 82, 255, 0.04)",
        }}
      >
        <Box sx={{ maxWidth: 1440, mx: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
                width: 44,
                height: 44,
                borderRadius: 2,
                objectFit: "contain",
                filter: isDark ? "drop-shadow(0 4px 12px rgba(56, 189, 248, 0.4))" : "drop-shadow(0 4px 10px rgba(0, 82, 255, 0.25))",
              }}
            />
            <Box>
              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: "1.2rem",
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
                Global Intermodal Freight Defense
              </Typography>
            </Box>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 3.5 }}>
            <Button
              href="#simulator"
              sx={{ color: isDark ? "#94A3B8" : "#475569", fontWeight: 600, fontSize: "0.88rem", "&:hover": { color: isDark ? "#38BDF8" : "#0052FF" } }}
            >
              Live Simulator
            </Button>
            <Button
              href="#corridors"
              sx={{ color: isDark ? "#94A3B8" : "#475569", fontWeight: 600, fontSize: "0.88rem", "&:hover": { color: isDark ? "#38BDF8" : "#0052FF" } }}
            >
              Corridor Radar
            </Button>
            <Button
              href="#capabilities"
              sx={{ color: isDark ? "#94A3B8" : "#475569", fontWeight: 600, fontSize: "0.88rem", "&:hover": { color: isDark ? "#38BDF8" : "#0052FF" } }}
            >
              Platform Arsenal
            </Button>
            <Button
              onClick={() => goToLogin("admin")}
              sx={{ color: isDark ? "#94A3B8" : "#475569", fontWeight: 600, fontSize: "0.88rem", "&:hover": { color: isDark ? "#38BDF8" : "#0052FF" } }}
            >
              Sign In
            </Button>
          </Box>

          {/* Right Controls: Light/Dark Mode Switcher & Portal CTAs */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {/* Light / Dark Mode Toggle Button */}
            <Tooltip title={isDark ? "Switch to Light Mode" : "Switch to Dark Ops Mode"}>
              <IconButton
                onClick={toggleTheme}
                size="small"
                sx={{
                  border: isDark ? "1px solid rgba(56, 189, 248, 0.3)" : "1px solid #E2E8F0",
                  bgcolor: isDark ? "rgba(255,255,255,0.06)" : "#FFFFFF",
                  color: isDark ? "#FDE047" : "#0052FF",
                  p: 0.9,
                  transition: "all 150ms ease",
                  "&:hover": {
                    bgcolor: isDark ? "rgba(253, 224, 71, 0.15)" : "#EFF6FF",
                    borderColor: isDark ? "#FDE047" : "#0052FF",
                  },
                }}
              >
                {isDark ? <LightModeOutlinedIcon fontSize="small" /> : <DarkModeOutlinedIcon fontSize="small" />}
              </IconButton>
            </Tooltip>

            {user ? (
              <Button
                variant="contained"
                onClick={() => navigate("/dashboard")}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  background: isDark
                    ? "linear-gradient(135deg, #0284C7 0%, #2563EB 50%, #4F46E5 100%)"
                    : "#0052FF",
                  color: "#FFFFFF",
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  py: 0.9,
                  px: 2.5,
                  borderRadius: 2.5,
                  boxShadow: isDark ? "0 4px 16px rgba(37, 99, 235, 0.4)" : "0 4px 14px rgba(0, 82, 255, 0.25)",
                  "&:hover": { bgcolor: "#0043D1" },
                }}
              >
                Console ({user.role === "admin" ? "Admin" : "Shipper"})
              </Button>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => goToLogin("shipment_user")}
                  startIcon={<PersonOutlineIcon />}
                  sx={{
                    borderColor: isDark ? "rgba(56, 189, 248, 0.35)" : "rgba(0, 82, 255, 0.3)",
                    color: isDark ? "#38BDF8" : "#0052FF",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    borderRadius: 2,
                    px: 1.75,
                    py: 0.65,
                    bgcolor: isDark ? "transparent" : "#FFFFFF",
                    "&:hover": {
                      borderColor: isDark ? "#38BDF8" : "#0052FF",
                      bgcolor: isDark ? "rgba(56, 189, 248, 0.08)" : "#EFF6FF",
                    },
                  }}
                >
                  Shipper Hub
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => goToLogin("admin")}
                  startIcon={<ShieldOutlinedIcon />}
                  sx={{
                    background: isDark
                      ? "linear-gradient(135deg, #0284C7 0%, #2563EB 50%, #4F46E5 100%)"
                      : "#0052FF",
                    color: "#FFFFFF",
                    fontWeight: 800,
                    fontSize: "0.82rem",
                    borderRadius: 2,
                    px: 2,
                    py: 0.65,
                    boxShadow: isDark ? "0 4px 14px rgba(37, 99, 235, 0.35)" : "0 4px 14px rgba(0, 82, 255, 0.25)",
                    "&:hover": { bgcolor: "#0043D1" },
                  }}
                >
                  Admin Command
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* HERO SECTION: ADAPTIVE CYBER DARK / EXECUTIVE LIGHT */}
      <Box
        sx={{
          pt: { xs: 8, md: 12 },
          pb: { xs: 9, md: 14 },
          position: "relative",
          bgcolor: isDark ? "#070B14" : "#F8FAFC",
          backgroundImage: isDark
            ? "radial-gradient(ellipse at 50% -10%, rgba(14, 165, 233, 0.22) 0%, rgba(7, 11, 20, 0.95) 60%, #070B14 100%)"
            : "radial-gradient(ellipse at 50% 10%, rgba(0, 82, 255, 0.06) 0%, transparent 65%)",
        }}
      >
        {/* Subtle Background Pattern */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: isDark
              ? "linear-gradient(rgba(56, 189, 248, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.03) 1px, transparent 1px)"
              : "linear-gradient(rgba(0, 82, 255, 0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 82, 255, 0.025) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
            pointerEvents: "none",
          }}
        />

        <Container maxWidth="xl">
          <Grid container spacing={{ xs: 6, lg: 7 }} alignItems="center">
            {/* Left Column: Mission, Headline & Direct Gateway */}
            <Grid item xs={12} lg={7}>
              {/* Clean Status Pill */}
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1.25,
                  px: 2,
                  py: 0.75,
                  borderRadius: 50,
                  bgcolor: isDark ? "rgba(15, 23, 42, 0.8)" : "#EFF6FF",
                  border: isDark ? "1px solid rgba(56, 189, 248, 0.3)" : "1px solid #DBEAFE",
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: isDark ? "#10B981" : "#0052FF",
                    boxShadow: isDark ? "0 0 10px #10B981" : "0 0 10px #0052FF",
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 800,
                    letterSpacing: "0.06em",
                    fontSize: "0.78rem",
                    color: isDark ? "#E0F2FE" : "#0052FF",
                    textTransform: "uppercase",
                  }}
                >
                  GLOBAL DEFENSE PROTOCOL ACTIVE · 14 TRADE LANES MONITORED
                </Typography>
              </Box>

              {/* Main Headline */}
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.6rem", sm: "3.6rem", md: "4.3rem" },
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.1,
                  color: isDark ? "#FFFFFF" : "#0A192F",
                  mb: 3,
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
                  fontSize: { xs: "1.05rem", md: "1.2rem" },
                  lineHeight: 1.65,
                  maxWidth: 680,
                  mb: 4.5,
                }}
              >
                Protect ocean vessels, rail interchanges, and commercial freight trucks with predictive disruption radar,
                automated rerouting intelligence, and continuous IoT cold-chain telemetry.
              </Typography>

              {/* Action Buttons */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ xs: "stretch", sm: "center" }}
                sx={{ mb: 6 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => goToLogin("admin")}
                  startIcon={<ShieldOutlinedIcon />}
                  sx={{
                    py: 1.6,
                    px: 3.5,
                    fontSize: "0.98rem",
                    fontWeight: 800,
                    borderRadius: 2.5,
                    bgcolor: isDark ? "#0284C7" : "#0052FF",
                    boxShadow: isDark ? "0 8px 24px rgba(2, 132, 199, 0.4)" : "0 6px 20px rgba(0, 82, 255, 0.3)",
                    "&:hover": { bgcolor: isDark ? "#0369A1" : "#0043D1" },
                  }}
                >
                  Admin Command Console
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => goToLogin("shipment_user")}
                  startIcon={<PersonOutlineIcon />}
                  sx={{
                    py: 1.6,
                    px: 3.5,
                    fontSize: "0.98rem",
                    fontWeight: 800,
                    borderRadius: 2.5,
                    borderColor: isDark ? "rgba(56, 189, 248, 0.35)" : "rgba(0, 82, 255, 0.3)",
                    color: isDark ? "#38BDF8" : "#0052FF",
                    bgcolor: isDark ? "transparent" : "#FFFFFF",
                    "&:hover": {
                      borderColor: isDark ? "#38BDF8" : "#0052FF",
                      bgcolor: isDark ? "rgba(56, 189, 248, 0.08)" : "#EFF6FF",
                    },
                  }}
                >
                  Shipper User Portal
                </Button>
                <Button
                  variant="text"
                  size="large"
                  href="#simulator"
                  startIcon={<PlayCircleOutlineOutlinedIcon />}
                  sx={{
                    py: 1.6,
                    px: 2.5,
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: isDark ? "#94A3B8" : "#475569",
                    "&:hover": { color: isDark ? "#38BDF8" : "#0052FF" },
                  }}
                >
                  Test Live Simulator
                </Button>
              </Stack>

              {/* Verified Metrics Ribbon */}
              <Grid container spacing={2}>
                {[
                  { label: "Cargo Under Defense", val: "$420M+", icon: SecurityOutlinedIcon, color: isDark ? "#38BDF8" : "#0052FF" },
                  { label: "Early Warning Lead", val: "48-72h", icon: SpeedIcon, color: isDark ? "#10B981" : "#0284C7" },
                  { label: "AI Reroute Adoption", val: "94.2%", icon: AltRouteOutlinedIcon, color: isDark ? "#818CF8" : "#0052FF" },
                  { label: "Cold-Chain Integrity", val: "99.8%", icon: AcUnitOutlinedIcon, color: isDark ? "#F59E0B" : "#0284C7" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <Grid item xs={6} sm={3} key={i}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2.5,
                          bgcolor: isDark ? "rgba(15, 23, 42, 0.65)" : "#FFFFFF",
                          border: isDark ? "1px solid rgba(148, 163, 184, 0.12)" : "1px solid #E2E8F0",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.5 }}>
                          <Icon sx={{ fontSize: 16, color: item.color }} />
                          <Typography variant="caption" sx={{ color: isDark ? "#94A3B8" : "#64748B", fontWeight: 700, fontSize: "0.68rem" }}>
                            {item.label}
                          </Typography>
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: item.color, letterSpacing: "-0.02em" }}>
                          {item.val}
                        </Typography>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>

            {/* Right Column: Hero Card with Fixed Transparent Shield Logo */}
            <Grid item xs={12} lg={5}>
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 4,
                  p: { xs: 3, sm: 4.5 },
                  bgcolor: isDark ? "rgba(11, 18, 32, 0.88)" : "#FFFFFF",
                  backdropFilter: "blur(20px)",
                  border: isDark ? "1px solid rgba(56, 189, 248, 0.25)" : "1px solid #E2E8F0",
                  boxShadow: isDark
                    ? "0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(56, 189, 248, 0.15)"
                    : "0 20px 50px rgba(0, 82, 255, 0.08)",
                }}
              >
                {/* Header status bar */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <RadarOutlinedIcon sx={{ color: isDark ? "#38BDF8" : "#0052FF", fontSize: 20 }} />
                    <Typography sx={{ fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.05em", color: isDark ? "#38BDF8" : "#0052FF" }}>
                      INTERMODAL COMMAND RADAR
                    </Typography>
                  </Box>
                  <Chip
                    size="small"
                    label="SHIELD ONLINE"
                    sx={{
                      height: 22,
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      bgcolor: isDark ? "rgba(16, 185, 129, 0.15)" : "#EFF6FF",
                      color: isDark ? "#10B981" : "#0052FF",
                      border: isDark ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid #DBEAFE",
                    }}
                  />
                </Box>

                {/* Central Brand Showcase: Transparent Shield Logo without clipping */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 2,
                    position: "relative",
                  }}
                >
                  {/* Clean transparent logo without white square box */}
                  <Box
                    component="img"
                    src="/logo.png"
                    alt="SupplyGuard AI Official Shield Logo"
                    sx={{
                      width: { xs: 180, sm: 210 },
                      height: { xs: 180, sm: 210 },
                      objectFit: "contain",
                      filter: isDark
                        ? "drop-shadow(0 14px 28px rgba(6, 182, 212, 0.45))"
                        : "drop-shadow(0 12px 24px rgba(0, 82, 255, 0.25))",
                      mb: 2,
                      transition: "transform 250ms ease",
                      "&:hover": { transform: "scale(1.04)" },
                    }}
                  />

                  {/* Legible Title cleanly placed below image with zero overlap */}
                  <Typography
                    sx={{
                      fontWeight: 900,
                      fontSize: "1.35rem",
                      letterSpacing: "-0.02em",
                      color: isDark ? "#FFFFFF" : "#0A192F",
                      textAlign: "center",
                    }}
                  >
                    SupplyGuard <Box component="span" sx={{ color: isDark ? "#38BDF8" : "#0052FF" }}>AI</Box>
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: isDark ? "#94A3B8" : "#64748B",
                      fontWeight: 600,
                      textAlign: "center",
                      maxWidth: 320,
                      lineHeight: 1.4,
                      mt: 0.5,
                      display: "block",
                    }}
                  >
                    Autonomous Vessel &amp; Commercial Overland Fleet Protection
                  </Typography>
                </Box>

                {/* Live Telemetry Node Pills */}
                <Stack spacing={1.5} sx={{ mt: 2.5 }}>
                  <Box
                    sx={{
                      p: 1.75,
                      borderRadius: 2.5,
                      bgcolor: isDark ? "rgba(15, 23, 42, 0.85)" : "#F8FAFC",
                      border: isDark ? "1px solid rgba(56, 189, 248, 0.15)" : "1px solid #E2E8F0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                      <Box sx={{ p: 0.75, borderRadius: 1.5, bgcolor: isDark ? "rgba(56, 189, 248, 0.15)" : "#EFF6FF" }}>
                        <DirectionsBoatFilledOutlinedIcon sx={{ color: isDark ? "#38BDF8" : "#0052FF", fontSize: 18 }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 800, fontSize: "0.82rem", color: isDark ? "#FFFFFF" : "#0A192F" }}>
                          Vessel SG-Titan (Ocean Freight)
                        </Typography>
                        <Typography variant="caption" sx={{ color: isDark ? "#94A3B8" : "#64748B" }}>
                          Rotterdam ➔ Newark · Speed 21 kn · Wave 0.4m
                        </Typography>
                      </Box>
                    </Box>
                    <Chip size="small" label="ON SCHEDULE" sx={{ height: 20, fontSize: "0.64rem", fontWeight: 800, bgcolor: isDark ? "rgba(16,185,129,0.15)" : "#EFF6FF", color: isDark ? "#10B981" : "#0052FF" }} />
                  </Box>

                  <Box
                    sx={{
                      p: 1.75,
                      borderRadius: 2.5,
                      bgcolor: isDark ? "rgba(15, 23, 42, 0.85)" : "#F8FAFC",
                      border: isDark ? "1px solid rgba(56, 189, 248, 0.15)" : "1px solid #E2E8F0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                      <Box sx={{ p: 0.75, borderRadius: 1.5, bgcolor: isDark ? "rgba(16, 185, 129, 0.15)" : "#EFF6FF" }}>
                        <LocalShippingOutlinedIcon sx={{ color: isDark ? "#10B981" : "#0052FF", fontSize: 18 }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 800, fontSize: "0.82rem", color: isDark ? "#FFFFFF" : "#0A192F" }}>
                          Fleet Semi-Truck #842 (Overland)
                        </Typography>
                        <Typography variant="caption" sx={{ color: isDark ? "#94A3B8" : "#64748B" }}>
                          I-80 Midwest Highway · Temp: -19.4°C [Locked]
                        </Typography>
                      </Box>
                    </Box>
                    <Chip size="small" label="CRYO SAFE" sx={{ height: 20, fontSize: "0.64rem", fontWeight: 800, bgcolor: isDark ? "rgba(6,182,212,0.15)" : "#EFF6FF", color: isDark ? "#06B6D4" : "#0052FF" }} />
                  </Box>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* UNIQUE INTERACTIVE FEATURE: LIVE DISRUPTION TELEMETRY SIMULATOR */}
      <Box
        id="simulator"
        sx={{
          py: { xs: 8, md: 12 },
          bgcolor: isDark ? "#060A13" : "#F8FAFC",
          borderTop: isDark ? "1px solid rgba(56, 189, 248, 0.1)" : "1px solid #E2E8F0",
          borderBottom: isDark ? "1px solid rgba(56, 189, 248, 0.1)" : "1px solid #E2E8F0",
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ textAlign: "center", maxWidth: 800, mx: "auto", mb: 6 }}>
            <Chip
              icon={<BoltIcon sx={{ fontSize: "14px !important", color: (isDark ? "#38BDF8" : "#0052FF") + " !important" }} />}
              label="Interactive Disruption Sandbox"
              size="small"
              sx={{
                mb: 1.5,
                fontWeight: 800,
                letterSpacing: "0.05em",
                bgcolor: isDark ? "rgba(56, 189, 248, 0.15)" : "#EFF6FF",
                color: isDark ? "#38BDF8" : "#0052FF",
                border: isDark ? "1px solid rgba(56, 189, 248, 0.3)" : "1px solid #DBEAFE",
              }}
            />
            <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: "-0.03em", color: isDark ? "#FFFFFF" : "#0A192F", mb: 1.5 }}>
              Test Autonomous Disruption Mitigation
            </Typography>
            <Typography variant="body1" sx={{ color: isDark ? "#94A3B8" : "#475569", maxWidth: 640, mx: "auto" }}>
              Select a real-world scenario below to simulate how SupplyGuard AI automatically detects threats,
              recomputes carrier routes, and secures freight in milliseconds.
            </Typography>
          </Box>

          {/* Scenario Selector Cards */}
          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            {SIMULATOR_SCENARIOS.map((sc) => {
              const isSelected = activeScenario.id === sc.id;
              return (
                <Grid item xs={12} sm={6} md={3} key={sc.id}>
                  <Card
                    onClick={() => setActiveScenario(sc)}
                    sx={{
                      p: 2.5,
                      cursor: "pointer",
                      borderRadius: 3,
                      border: isSelected
                        ? `2px solid ${isDark ? "#38BDF8" : "#0052FF"}`
                        : `1px solid ${isDark ? "rgba(148, 163, 184, 0.15)" : "#E2E8F0"}`,
                      bgcolor: isSelected
                        ? isDark ? "rgba(56, 189, 248, 0.12)" : "#EFF6FF"
                        : isDark ? "rgba(15, 23, 42, 0.65)" : "#FFFFFF",
                      boxShadow: isSelected ? `0 8px 24px rgba(0, 82, 255, 0.15)` : "none",
                      transition: "all 180ms ease",
                      "&:hover": { transform: "translateY(-3px)", borderColor: isDark ? "#38BDF8" : "#0052FF" },
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.25 }}>
                      <Chip
                        size="small"
                        label={sc.severity}
                        sx={{
                          height: 20,
                          fontSize: "0.62rem",
                          fontWeight: 800,
                          bgcolor: isSelected ? (isDark ? "#38BDF8" : "#0052FF") : (isDark ? "rgba(255,255,255,0.08)" : "#F1F5F9"),
                          color: isSelected ? "#FFFFFF" : (isDark ? "#94A3B8" : "#475569"),
                        }}
                      />
                      <Typography variant="caption" sx={{ color: isDark ? "#94A3B8" : "#64748B", fontWeight: 700 }}>
                        {sc.mode}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 800, fontSize: "0.95rem", lineHeight: 1.25, color: isDark ? "#FFFFFF" : "#0A192F", mb: 1 }}>
                      {sc.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: isDark ? "#94A3B8" : "#64748B", display: "block" }}>
                      Risk Index: <strong style={{ color: isDark ? "#38BDF8" : "#0052FF" }}>{sc.riskScore} / 100</strong>
                    </Typography>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Active Simulation Diagnostic Board */}
          <Card
            sx={{
              borderRadius: 3.5,
              border: isDark ? "1px solid rgba(56, 189, 248, 0.2)" : "1px solid #E2E8F0",
              bgcolor: isDark ? "rgba(11, 18, 32, 0.9)" : "#FFFFFF",
              boxShadow: isDark ? "0 20px 50px rgba(0,0,0,0.5)" : "0 12px 36px rgba(0, 82, 255, 0.06)",
              p: { xs: 3, md: 4.5 },
            }}
          >
            <Grid container spacing={4} alignItems="center">
              {/* Left: Risk Metric & Fleet Impact */}
              <Grid item xs={12} md={5}>
                <Typography variant="caption" sx={{ color: isDark ? "#38BDF8" : "#0052FF", textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.06em" }}>
                  SIMULATED INCIDENT TELEMETRY
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, color: isDark ? "#FFFFFF" : "#0A192F", mt: 0.5, mb: 2 }}>
                  {activeScenario.title}
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? "#94A3B8" : "#475569" }}>
                      Corridor Vulnerability Score
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 900, color: isDark ? "#38BDF8" : "#0052FF" }}>
                      {activeScenario.riskScore}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={activeScenario.riskScore}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: isDark ? "rgba(255,255,255,0.08)" : "#EFF6FF",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: isDark ? "#38BDF8" : "#0052FF",
                        borderRadius: 5,
                      },
                    }}
                  />
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ p: 1.75, borderRadius: 2, bgcolor: isDark ? "rgba(15, 23, 42, 0.7)" : "#F8FAFC", border: isDark ? "1px solid rgba(148, 163, 184, 0.12)" : "1px solid #E2E8F0" }}>
                      <Typography variant="caption" sx={{ color: isDark ? "#94A3B8" : "#64748B", fontWeight: 700 }}>
                        At-Risk Fleet Units
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: isDark ? "#FFFFFF" : "#0A192F", mt: 0.25 }}>
                        {activeScenario.impacted}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ p: 1.75, borderRadius: 2, bgcolor: isDark ? "rgba(15, 23, 42, 0.7)" : "#F8FAFC", border: isDark ? "1px solid rgba(148, 163, 184, 0.12)" : "1px solid #E2E8F0" }}>
                      <Typography variant="caption" sx={{ color: isDark ? "#94A3B8" : "#64748B", fontWeight: 700 }}>
                        Advance Predictive Window
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: isDark ? "#10B981" : "#0052FF", mt: 0.25 }}>
                        {activeScenario.leadTime}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              {/* Right: Autonomous AI Mitigation Output */}
              <Grid item xs={12} md={7}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    bgcolor: isDark ? "rgba(7, 11, 20, 0.85)" : "#F8FAFC",
                    border: isDark ? "1px solid rgba(56, 189, 248, 0.2)" : "1px solid #E2E8F0",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 1.5,
                        bgcolor: isDark ? "rgba(56, 189, 248, 0.15)" : "#EFF6FF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <SmartToyOutlinedIcon sx={{ color: isDark ? "#38BDF8" : "#0052FF", fontSize: 18 }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: "0.92rem", color: isDark ? "#FFFFFF" : "#0A192F" }}>
                        SupplyGuard Autonomous Mitigation Plan
                      </Typography>
                      <Typography variant="caption" sx={{ color: isDark ? "#94A3B8" : "#64748B" }}>
                        Calculated by AI Rerouting Engine
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      lineHeight: 1.65,
                      color: isDark ? "#E2E8F0" : "#334155",
                      fontWeight: 500,
                      mb: 2.5,
                    }}
                  >
                    {activeScenario.aiAction}
                  </Typography>

                  <Divider sx={{ my: 1.5, borderColor: isDark ? "rgba(148, 163, 184, 0.1)" : "#E2E8F0" }} />

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <InfoOutlinedIcon sx={{ fontSize: 16, color: isDark ? "#38BDF8" : "#0052FF" }} />
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.74rem",
                        color: isDark ? "#94A3B8" : "#475569",
                      }}
                    >
                      {activeScenario.statusLog}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Container>
      </Box>

      {/* MONITORED GLOBAL CORRIDORS */}
      <Box id="corridors" sx={{ py: { xs: 8, md: 12 }, bgcolor: isDark ? "#070B14" : "#FFFFFF" }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: "center", mb: 7 }}>
            <Typography variant="overline" sx={{ color: isDark ? "#38BDF8" : "#0052FF", fontWeight: 800, letterSpacing: "0.12em" }}>
              INTERCONTINENTAL INTELLIGENCE
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: "-0.03em", color: isDark ? "#FFFFFF" : "#0A192F", mt: 0.5, mb: 1.5 }}>
              Monitored Global Trade Arteries
            </Typography>
            <Typography variant="body1" sx={{ color: isDark ? "#94A3B8" : "#475569", maxWidth: 640, mx: "auto" }}>
              Continuous real-time telemetry across world container lanes, intermodal railways, and long-haul highways.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {[
              {
                corridor: "Trans-Pacific Maritime Artery",
                ports: "Shanghai / Ningbo ➔ Los Angeles / Long Beach",
                risk: "78 / 100",
                status: "Congestion Alert",
                lead: "Divert recommendation: Oakland Port",
                icon: DirectionsBoatFilledOutlinedIcon,
              },
              {
                corridor: "North Atlantic Maritime Lane",
                ports: "Rotterdam / Antwerp ➔ New York / Newark",
                risk: "24 / 100",
                status: "Nominal Flow",
                lead: "Weather calm · 0 delays forecasted",
                icon: DirectionsBoatFilledOutlinedIcon,
              },
              {
                corridor: "Trans-American Interstate Freight",
                ports: "Chicago Rail Hub ➔ Dallas ➔ Los Angeles",
                risk: "42 / 100",
                status: "Minor Weather Delay",
                lead: "Alternative route active via I-40 corridor",
                icon: LocalShippingOutlinedIcon,
              },
              {
                corridor: "Asia-Europe Maritime Corridor",
                ports: "Singapore Hub ➔ Suez ➔ Rotterdam",
                risk: "88 / 100",
                status: "Chokepoint Divert",
                lead: "Cape route diversion in effect (+8d delta)",
                icon: DirectionsBoatFilledOutlinedIcon,
              },
            ].map((lane, idx) => {
              const Icon = lane.icon;
              return (
                <Grid item xs={12} sm={6} lg={3} key={idx}>
                  <Card
                    sx={{
                      p: 3,
                      height: "100%",
                      borderRadius: 3,
                      border: isDark ? "1px solid rgba(148, 163, 184, 0.12)" : "1px solid #E2E8F0",
                      bgcolor: isDark ? "rgba(15, 23, 42, 0.75)" : "#FFFFFF",
                      boxShadow: isDark ? "none" : "0 2px 10px rgba(0,0,0,0.03)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      transition: "all 180ms ease",
                      "&:hover": { transform: "translateY(-4px)", borderColor: isDark ? "#38BDF8" : "#0052FF" },
                    }}
                  >
                    <Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Box sx={{ p: 1, borderRadius: 2, bgcolor: isDark ? "rgba(56, 189, 248, 0.15)" : "#EFF6FF" }}>
                          <Icon sx={{ color: isDark ? "#38BDF8" : "#0052FF", fontSize: 20 }} />
                        </Box>
                        <Chip
                          size="small"
                          label={lane.status}
                          sx={{
                            height: 20,
                            fontSize: "0.65rem",
                            fontWeight: 800,
                            bgcolor: isDark ? "rgba(56, 189, 248, 0.15)" : "#EFF6FF",
                            color: isDark ? "#38BDF8" : "#0052FF",
                          }}
                        />
                      </Box>
                      <Typography sx={{ fontWeight: 800, fontSize: "1.05rem", lineHeight: 1.25, color: isDark ? "#FFFFFF" : "#0A192F", mb: 1 }}>
                        {lane.corridor}
                      </Typography>
                      <Typography variant="caption" sx={{ color: isDark ? "#94A3B8" : "#64748B", display: "block", mb: 2 }}>
                        {lane.ports}
                      </Typography>
                    </Box>

                    <Box sx={{ pt: 2, borderTop: isDark ? "1px solid rgba(148, 163, 184, 0.1)" : "1px solid #E2E8F0" }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="caption" sx={{ color: isDark ? "#94A3B8" : "#64748B" }}>
                          Threat Score
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: isDark ? "#38BDF8" : "#0052FF" }}>
                          {lane.risk}
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: isDark ? "#CBD5E1" : "#475569", fontSize: "0.72rem", display: "block" }}>
                        {lane.lead}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* PLATFORM CAPABILITIES & ARSENAL */}
      <Box id="capabilities" sx={{ py: { xs: 8, md: 12 }, bgcolor: isDark ? "#060A13" : "#F8FAFC", borderTop: isDark ? "1px solid rgba(56, 189, 248, 0.1)" : "1px solid #E2E8F0" }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography variant="overline" sx={{ color: isDark ? "#38BDF8" : "#0052FF", fontWeight: 800, letterSpacing: "0.12em" }}>
              ENTERPRISE PLATFORM ARSENAL
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: "-0.03em", color: isDark ? "#FFFFFF" : "#0A192F", mt: 0.5, mb: 1.5 }}>
              Engineered for Zero-Downtime Intermodal Logistics
            </Typography>
            <Typography variant="body1" sx={{ color: isDark ? "#94A3B8" : "#475569", maxWidth: 640, mx: "auto" }}>
              From ocean container tracking to automated route re-computation, explore how SupplyGuard AI safeguards freight integrity.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Feature 1 */}
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ p: 3.5, height: "100%", borderRadius: 3, border: isDark ? "1px solid rgba(148, 163, 184, 0.12)" : "1px solid #E2E8F0", bgcolor: isDark ? "rgba(15, 23, 42, 0.7)" : "#FFFFFF" }}>
                <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: isDark ? "rgba(56, 189, 248, 0.15)" : "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", mb: 2.5 }}>
                  <WarningAmberOutlinedIcon sx={{ color: isDark ? "#38BDF8" : "#0052FF", fontSize: 24 }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: isDark ? "#FFFFFF" : "#0A192F", mb: 1.25 }}>
                  Global Disruption Radar
                </Typography>
                <Typography variant="body2" sx={{ color: isDark ? "#94A3B8" : "#475569", lineHeight: 1.6, mb: 2.5 }}>
                  Track severe weather fronts, maritime labor strikes, and canal bottlenecks in real time.
                  Multi-provider interactive maps with continuous vector telemetry.
                </Typography>
                <Chip size="small" label="Multi-Satellite Feeds" sx={{ bgcolor: isDark ? "rgba(56, 189, 248, 0.15)" : "#EFF6FF", color: isDark ? "#38BDF8" : "#0052FF", fontSize: "0.72rem", fontWeight: 700 }} />
              </Card>
            </Grid>

            {/* Feature 2 */}
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ p: 3.5, height: "100%", borderRadius: 3, border: isDark ? "1px solid rgba(148, 163, 184, 0.12)" : "1px solid #E2E8F0", bgcolor: isDark ? "rgba(15, 23, 42, 0.7)" : "#FFFFFF" }}>
                <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: isDark ? "rgba(56, 189, 248, 0.15)" : "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", mb: 2.5 }}>
                  <InsightsOutlinedIcon sx={{ color: isDark ? "#38BDF8" : "#0052FF", fontSize: 24 }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: isDark ? "#FFFFFF" : "#0A192F", mb: 1.25 }}>
                  Lane Vulnerability Scoring
                </Typography>
                <Typography variant="body2" sx={{ color: isDark ? "#94A3B8" : "#475569", lineHeight: 1.6, mb: 2.5 }}>
                  Quantifiable risk scoring across international shipping corridors. Evaluates carrier reliability,
                  port congestion, and weather indices to pinpoint vulnerable cargo.
                </Typography>
                <Chip size="small" label="Corridor Scoring" sx={{ bgcolor: isDark ? "rgba(56, 189, 248, 0.15)" : "#EFF6FF", color: isDark ? "#38BDF8" : "#0052FF", fontSize: "0.72rem", fontWeight: 700 }} />
              </Card>
            </Grid>

            {/* Feature 3 */}
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ p: 3.5, height: "100%", borderRadius: 3, border: isDark ? "1px solid rgba(148, 163, 184, 0.12)" : "1px solid #E2E8F0", bgcolor: isDark ? "rgba(15, 23, 42, 0.7)" : "#FFFFFF" }}>
                <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: isDark ? "rgba(56, 189, 248, 0.15)" : "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", mb: 2.5 }}>
                  <AltRouteOutlinedIcon sx={{ color: isDark ? "#38BDF8" : "#0052FF", fontSize: 24 }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: isDark ? "#FFFFFF" : "#0A192F", mb: 1.25 }}>
                  Autonomous Intermodal Rerouting
                </Typography>
                <Typography variant="body2" sx={{ color: isDark ? "#94A3B8" : "#475569", lineHeight: 1.6, mb: 2.5 }}>
                  Instant alternative routing paths when corridors are obstructed. Balances transit time delta,
                  additional fuel surcharges, and intermodal capacity between rail, ship, and truck.
                </Typography>
                <Chip size="small" label="Vessel ➔ Rail Interchange" sx={{ bgcolor: isDark ? "rgba(56, 189, 248, 0.15)" : "#EFF6FF", color: isDark ? "#38BDF8" : "#0052FF", fontSize: "0.72rem", fontWeight: 700 }} />
              </Card>
            </Grid>

            {/* Feature 4 */}
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ p: 3.5, height: "100%", borderRadius: 3, border: isDark ? "1px solid rgba(148, 163, 184, 0.12)" : "1px solid #E2E8F0", bgcolor: isDark ? "rgba(15, 23, 42, 0.7)" : "#FFFFFF" }}>
                <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: isDark ? "rgba(56, 189, 248, 0.15)" : "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", mb: 2.5 }}>
                  <AcUnitOutlinedIcon sx={{ color: isDark ? "#38BDF8" : "#0052FF", fontSize: 24 }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: isDark ? "#FFFFFF" : "#0A192F", mb: 1.25 }}>
                  IoT Cold-Chain Telemetry
                </Typography>
                <Typography variant="body2" sx={{ color: isDark ? "#94A3B8" : "#475569", lineHeight: 1.6, mb: 2.5 }}>
                  Continuous micro-telemetry monitoring of sensitive pharmaceuticals and perishable freight.
                  Automated reefer anomaly alerts before temperature thresholds are breached.
                </Typography>
                <Chip size="small" label="-20°C Reefer Safeguard" sx={{ bgcolor: isDark ? "rgba(56, 189, 248, 0.15)" : "#EFF6FF", color: isDark ? "#38BDF8" : "#0052FF", fontSize: "0.72rem", fontWeight: 700 }} />
              </Card>
            </Grid>

            {/* Feature 5 */}
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ p: 3.5, height: "100%", borderRadius: 3, border: isDark ? "1px solid rgba(148, 163, 184, 0.12)" : "1px solid #E2E8F0", bgcolor: isDark ? "rgba(15, 23, 42, 0.7)" : "#FFFFFF" }}>
                <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: isDark ? "rgba(56, 189, 248, 0.15)" : "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", mb: 2.5 }}>
                  <SmartToyOutlinedIcon sx={{ color: isDark ? "#38BDF8" : "#0052FF", fontSize: 24 }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: isDark ? "#FFFFFF" : "#0A192F", mb: 1.25 }}>
                  Bob AI Cargo Copilot
                </Typography>
                <Typography variant="body2" sx={{ color: isDark ? "#94A3B8" : "#475569", lineHeight: 1.6, mb: 2.5 }}>
                  Natural language cargo intelligence. Ask Bob about active shipment delays, alternate carrier costs,
                  or customs clearance bottlenecks and receive actionable recommendations.
                </Typography>
                <Chip size="small" label="Natural Language Cargo Intel" sx={{ bgcolor: isDark ? "rgba(56, 189, 248, 0.15)" : "#EFF6FF", color: isDark ? "#38BDF8" : "#0052FF", fontSize: "0.72rem", fontWeight: 700 }} />
              </Card>
            </Grid>

            {/* Feature 6 */}
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ p: 3.5, height: "100%", borderRadius: 3, border: isDark ? "1px solid rgba(148, 163, 184, 0.12)" : "1px solid #E2E8F0", bgcolor: isDark ? "rgba(15, 23, 42, 0.7)" : "#FFFFFF" }}>
                <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: isDark ? "rgba(56, 189, 248, 0.15)" : "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", mb: 2.5 }}>
                  <SecurityOutlinedIcon sx={{ color: isDark ? "#38BDF8" : "#0052FF", fontSize: 24 }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: isDark ? "#FFFFFF" : "#0A192F", mb: 1.25 }}>
                  Zero-Trust Access Demarcation
                </Typography>
                <Typography variant="body2" sx={{ color: isDark ? "#94A3B8" : "#475569", lineHeight: 1.6, mb: 2.5 }}>
                  Strict demarcation between external Shipper tracking workspaces and privileged Executive Command
                  consoles with encrypted JWT authentication and automated security audit trails.
                </Typography>
                <Chip size="small" label="SOC2 Type II Ready" sx={{ bgcolor: isDark ? "rgba(56, 189, 248, 0.15)" : "#EFF6FF", color: isDark ? "#38BDF8" : "#0052FF", fontSize: "0.72rem", fontWeight: 700 }} />
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* FOOTER */}
      <Box
        component="footer"
        sx={{
          py: 5,
          borderTop: isDark ? "1px solid rgba(148, 163, 184, 0.1)" : "1px solid #E2E8F0",
          bgcolor: isDark ? "#04070D" : "#FFFFFF",
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                component="img"
                src="/logo.png"
                alt="SupplyGuard AI Logo"
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1.5,
                  objectFit: "contain",
                  filter: isDark ? "drop-shadow(0 2px 6px rgba(56, 189, 248, 0.4))" : "drop-shadow(0 2px 6px rgba(0, 82, 255, 0.2))",
                }}
              />
              <Box>
                <Typography sx={{ fontWeight: 900, fontSize: "0.95rem", color: isDark ? "#FFFFFF" : "#0A192F" }}>
                  SupplyGuard <Box component="span" sx={{ color: isDark ? "#38BDF8" : "#0052FF" }}>AI</Box>
                </Typography>
                <Typography variant="caption" sx={{ color: isDark ? "#94A3B8" : "#64748B", fontSize: "0.68rem" }}>
                  Autonomous Intermodal Logistics Defense · © 2026 SupplyGuard AI Inc.
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: isDark ? "#10B981" : "#0052FF", boxShadow: isDark ? "0 0 8px #10B981" : "0 0 8px #0052FF" }} />
                <Typography variant="caption" sx={{ color: isDark ? "#94A3B8" : "#475569", fontWeight: 700 }}>
                  Telemetry Online: 99.98% Uptime
                </Typography>
              </Box>
              <Button size="small" onClick={() => goToLogin("shipment_user")} sx={{ color: isDark ? "#94A3B8" : "#475569", fontSize: "0.8rem", fontWeight: 600, "&:hover": { color: isDark ? "#38BDF8" : "#0052FF" } }}>
                Shipper Access
              </Button>
              <Button size="small" onClick={() => goToLogin("admin")} sx={{ color: isDark ? "#94A3B8" : "#475569", fontSize: "0.8rem", fontWeight: 600, "&:hover": { color: isDark ? "#38BDF8" : "#0052FF" } }}>
                Admin Command
              </Button>
              <Button size="small" onClick={toggleTheme} sx={{ color: isDark ? "#38BDF8" : "#0052FF", fontSize: "0.8rem", fontWeight: 700 }}>
                {isDark ? "☀️ Switch to Light" : "🌙 Switch to Dark Ops"}
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
