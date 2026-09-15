import { useEffect, useState, useMemo } from "react";
import {
  Grid,
  Card,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Stack,
  TextField,
  MenuItem,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  LinearProgress,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import BoltIcon from "@mui/icons-material/Bolt";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AcUnitOutlinedIcon from "@mui/icons-material/AcUnitOutlined";
import AltRouteOutlinedIcon from "@mui/icons-material/AltRouteOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import SensorsOutlinedIcon from "@mui/icons-material/SensorsOutlined";
import { useNavigate } from "react-router-dom";

import AppLayout from "../components/AppLayout.jsx";
import UserDashboard from "./UserDashboard.jsx";
import { api } from "../api/client.js";
import { tokens } from "../theme.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useColorTheme } from "../context/ThemeContext.jsx";

const FLEET_PALETTE = {
  in_transit: {
    color: "#3B82F6",
    label: "In Transit",
    sub: "Actively hauling cargo",
  },
  loading: {
    color: "#0EA5E9",
    label: "Loading / Dock",
    sub: "Port & terminal handling",
  },
  idle: {
    color: "#F59E0B",
    label: "Idle / Standby",
    sub: "Available for deployment",
  },
  maintenance: {
    color: "#EF4444",
    label: "Maintenance",
    sub: "Depot service & repair",
  },
};

function ExecutiveKpiCard({
  label,
  value,
  badge,
  badgeColor = "info",
  sub,
  progress,
  progressColor,
  icon: Icon,
  accent = "#3B82F6",
  actionText = "Explore →",
  onAction,
  isDark = true,
}) {
  return (
    <Card
      sx={{
        p: 2.75,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
        border: `1px solid ${isDark ? `${accent}30` : `${accent}25`}`,
        background: isDark
          ? `linear-gradient(145deg, rgba(17, 26, 46, 0.92) 0%, rgba(13, 21, 39, 0.96) 100%)`
          : `linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 100%)`,
        backdropFilter: "blur(16px)",
        borderRadius: 3.5,
        boxShadow: isDark
          ? `0 10px 28px -6px rgba(0, 0, 0, 0.5), 0 0 0 1px ${accent}15`
          : `0 10px 25px -5px rgba(15, 23, 42, 0.06), 0 0 0 1px ${accent}15`,
        transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: isDark
            ? `0 20px 38px -8px rgba(0, 0, 0, 0.65), 0 0 20px ${accent}25`
            : `0 20px 35px -8px ${accent}20, 0 4px 12px rgba(15, 23, 42, 0.08)`,
          borderColor: accent,
          "& .kpi-action-arrow": {
            transform: "translateX(4px)",
            color: accent,
          },
        },
      }}
    >
      {/* Top illuminated line accent */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${accent} 0%, transparent 80%)`,
        }}
      />

      {/* Ambient background glow orb */}
      <Box
        sx={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accent}22 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <Box sx={{ position: "relative", zIndex: 1 }}>
        {/* Header line: Title + Icon Badge */}
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
          <Box>
            <Typography
              variant="caption"
              sx={{
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 700,
                color: isDark ? "#94A3B8" : "#64748B",
                display: "block",
                mb: 0.5,
              }}
            >
              {label}
            </Typography>
            {badge && (
              <Chip
                label={badge}
                size="small"
                sx={{
                  height: 20,
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  bgcolor: `${accent}18`,
                  color: accent,
                  border: `1px solid ${accent}35`,
                  borderRadius: 1.25,
                }}
              />
            )}
          </Box>

          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `linear-gradient(135deg, ${accent}25 0%, ${accent}08 100%)`,
              border: `1px solid ${accent}35`,
              color: accent,
              boxShadow: `0 6px 14px -2px ${accent}25`,
              flexShrink: 0,
            }}
          >
            <Icon sx={{ fontSize: 22 }} />
          </Box>
        </Box>

        {/* Primary Value */}
        <Typography
          variant="h3"
          sx={{
            mt: 1.75,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: isDark ? "#F8FAFC" : "#0A192F",
            lineHeight: 1.1,
          }}
        >
          {value}
        </Typography>

        {/* Subtitle & context */}
        {sub && (
          <Typography
            variant="body2"
            sx={{
              mt: 0.75,
              fontSize: "0.8125rem",
              color: isDark ? "#94A3B8" : "#475569",
              fontWeight: 500,
            }}
          >
            {sub}
          </Typography>
        )}

        {/* Optional Micro Progress Bar */}
        {typeof progress === "number" && (
          <Box sx={{ mt: 1.5 }}>
            <LinearProgress
              variant="determinate"
              value={Math.min(100, Math.max(0, progress))}
              sx={{
                height: 5,
                borderRadius: 3,
                bgcolor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
                "& .MuiLinearProgress-bar": {
                  background: progressColor || `linear-gradient(90deg, ${accent}88, ${accent})`,
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        )}
      </Box>

      {/* Bottom quick jump link */}
      {onAction && (
        <Box
          onClick={onAction}
          sx={{
            pt: 1.75,
            mt: 1.75,
            borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: isDark ? "#94A3B8" : "#475569",
              letterSpacing: "0.02em",
            }}
          >
            {actionText}
          </Typography>
          <ArrowForwardIcon
            className="kpi-action-arrow"
            sx={{
              fontSize: 14,
              color: isDark ? "#64748B" : "#94A3B8",
              transition: "transform 200ms ease, color 200ms ease",
            }}
          />
        </Box>
      )}
    </Card>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { isDark } = useColorTheme();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";
  const [adminViewMode, setAdminViewMode] = useState("admin"); // 'admin' | 'user_preview'

  // Non-admin regular users ALWAYS see the dedicated UserDashboard
  if (!isAdmin) {
    return <UserDashboard />;
  }

  // If Admin chose to preview the User Dashboard
  if (adminViewMode === "user_preview") {
    return (
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            p: 1.5,
            bgcolor: isDark ? "rgba(79, 70, 229, 0.2)" : "#EFF6FF",
            borderBottom: `1px solid ${tokens.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Chip label="ADMIN PREVIEW" size="small" color="primary" sx={{ fontWeight: 800 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Viewing the dedicated Shipper Portal from an operator perspective.
            </Typography>
          </Box>
          <Button
            size="small"
            variant="contained"
            onClick={() => setAdminViewMode("admin")}
            sx={{ fontWeight: 700 }}
          >
            Return to Executive Command Center
          </Button>
        </Box>
        <UserDashboard />
      </Box>
    );
  }

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [dispatchForm, setDispatchForm] = useState({
    region: user?.region || "US-West",
    type: "shipment_update",
    note: "",
    shipmentId: "",
  });
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadSummary = async (silent = false) => {
    try {
      if (!silent) setIsRefreshing(true);
      const res = await api.getDashboardSummary();
      setData(res);
      setError(null);
    } catch (e) {
      if (!silent) setError(e.message);
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadSummary();
    const interval = setInterval(() => {
      loadSummary(true);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user?.region) setDispatchForm((current) => ({ ...current, region: user.region }));
  }, [user]);

  const handleSubmitDispatch = async (event) => {
    event.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await api.addDashboardData({
        region: dispatchForm.region,
        type: dispatchForm.type,
        note: dispatchForm.note,
        shipmentId: dispatchForm.shipmentId || undefined,
      });
      setShowDispatchModal(false);
      setDispatchForm((current) => ({ ...current, note: "", shipmentId: "" }));
      await loadSummary(true);
    } catch (e) {
      setSubmitError(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      await api.triggerSimulatorTick();
      await loadSummary(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  // Compute fleet breakdown stats
  const totalFleetAssets = useMemo(() => {
    if (!data?.fleetStatusBreakdown) return data?.totals?.fleetAssets || 50;
    return data.fleetStatusBreakdown.reduce((acc, curr) => acc + (curr.count || 0), 0) || data?.totals?.fleetAssets || 50;
  }, [data]);

  const inTransitCount = useMemo(() => {
    return data?.fleetStatusBreakdown?.find((item) => item.status === "in_transit")?.count || 0;
  }, [data]);

  const fleetActiveRate = useMemo(() => {
    if (!totalFleetAssets) return 0;
    return Math.round((inTransitCount / totalFleetAssets) * 100);
  }, [inTransitCount, totalFleetAssets]);

  // Compute total cargo value formatted
  const totalCargoFormatted = useMemo(() => {
    const val = data?.totals?.totalCargoValueUsd || 148500000;
    return `$${(val / 1_000_000).toFixed(1)}M`;
  }, [data]);

  // At risk ratio
  const atRiskRatio = useMemo(() => {
    const atRisk = data?.totals?.atRiskCargoValueUsd || 0;
    const total = data?.totals?.totalCargoValueUsd || (atRisk * 1.25) || 1;
    return Math.min(100, Math.round((atRisk / total) * 100));
  }, [data]);

  return (
    <AppLayout
      title="Executive Command Center"
      subtitle="Autonomous AI logistics oversight, corridor resilience, and real-time intermodal defense"
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {!data && !error && (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 14 }}>
          <CircularProgress size={44} thickness={4} sx={{ color: "#3B82F6" }} />
          <Typography variant="body2" sx={{ mt: 2, color: "text.secondary", fontWeight: 600 }}>
            Initializing executive telemetry feeds...
          </Typography>
        </Box>
      )}

      {data && (
        <>
          {/* =================================================================== */}
          {/* 1. EXECUTIVE STATUS & TELEMETRY RIBBON                              */}
          {/* =================================================================== */}
          <Card
            sx={{
              p: { xs: 2, md: 2.5 },
              mb: 3,
              borderRadius: 3.5,
              position: "relative",
              overflow: "hidden",
              border: `1px solid ${isDark ? "rgba(59, 130, 246, 0.25)" : "rgba(59, 130, 246, 0.2)"}`,
              background: isDark
                ? "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(11, 18, 32, 0.98) 100%)"
                : "linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 100%)",
              boxShadow: isDark
                ? "0 16px 36px -4px rgba(0, 0, 0, 0.6)"
                : "0 12px 30px -4px rgba(15, 23, 42, 0.08)",
            }}
          >
            {/* Ambient subtle mesh gradient */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                backgroundImage: isDark
                  ? "radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.12) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 40%)"
                  : "radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 40%)",
                pointerEvents: "none",
              }}
            />

            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              {/* Left: Telematics Live Indicators */}
              <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                {/* Live Pulse Dot */}
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1.25,
                    px: 1.75,
                    py: 0.75,
                    borderRadius: 99,
                    bgcolor: isDark ? "rgba(16, 185, 129, 0.15)" : "#ECFDF5",
                    border: "1px solid rgba(16, 185, 129, 0.35)",
                    color: "#10B981",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    letterSpacing: "0.02em",
                  }}
                >
                  <Box
                    sx={{
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      bgcolor: "#10B981",
                      boxShadow: "0 0 0 0 rgba(16, 185, 129, 0.7)",
                      animation: "radarPulse 2s infinite",
                      "@keyframes radarPulse": {
                        "0%": { transform: "scale(0.95)", boxShadow: "0 0 0 0 rgba(16, 185, 129, 0.7)" },
                        "70%": { transform: "scale(1)", boxShadow: "0 0 0 8px rgba(16, 185, 129, 0)" },
                        "100%": { transform: "scale(0.95)", boxShadow: "0 0 0 0 rgba(16, 185, 129, 0)" },
                      },
                    }}
                  />
                  TELEMETRICS STREAMING • 12s AUTO-SYNC
                </Box>

                {/* Global stats pills */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                  <Chip
                    icon={<PublicOutlinedIcon sx={{ fontSize: 15, color: "#3B82F6 !important" }} />}
                    label={`10 Global Corridors Monitored`}
                    size="small"
                    sx={{
                      bgcolor: isDark ? "rgba(59, 130, 246, 0.12)" : "rgba(59, 130, 246, 0.08)",
                      color: isDark ? "#93C5FD" : "#1E40AF",
                      fontWeight: 600,
                      border: "1px solid rgba(59, 130, 246, 0.25)",
                    }}
                  />
                  <Chip
                    icon={<SensorsOutlinedIcon sx={{ fontSize: 15, color: "#10B981 !important" }} />}
                    label={`${data.totals.shipments} Active Manifests`}
                    size="small"
                    sx={{
                      bgcolor: isDark ? "rgba(16, 185, 129, 0.12)" : "rgba(16, 185, 129, 0.08)",
                      color: isDark ? "#A7F3D0" : "#065F46",
                      fontWeight: 600,
                      border: "1px solid rgba(16, 185, 129, 0.25)",
                    }}
                  />
                </Box>
              </Box>

              {/* Right: Quick Action Controls */}
              <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={isRefreshing ? <CircularProgress size={13} /> : <RefreshIcon sx={{ fontSize: 16 }} />}
                  onClick={() => loadSummary(false)}
                  disabled={isRefreshing}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 700,
                    borderColor: isDark ? "rgba(148, 163, 184, 0.25)" : "#CBD5E1",
                    color: isDark ? "#E2E8F0" : "#334155",
                    "&:hover": {
                      borderColor: "#3B82F6",
                      bgcolor: isDark ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.05)",
                    },
                  }}
                >
                  Refresh
                </Button>

                <Button
                  variant="outlined"
                  size="small"
                  startIcon={isSimulating ? <CircularProgress size={13} /> : <BoltIcon sx={{ color: "#F59E0B", fontSize: 18 }} />}
                  onClick={handleSimulate}
                  disabled={isSimulating}
                  sx={{
                    borderRadius: 2,
                    borderColor: "rgba(245, 158, 11, 0.5)",
                    color: isDark ? "#FDE68A" : "#B45309",
                    fontWeight: 700,
                    bgcolor: isDark ? "rgba(245, 158, 11, 0.08)" : "rgba(245, 158, 11, 0.05)",
                    "&:hover": {
                      borderColor: "#F59E0B",
                      bgcolor: isDark ? "rgba(245, 158, 11, 0.16)" : "rgba(245, 158, 11, 0.12)",
                    },
                  }}
                >
                  {isSimulating ? "Simulating..." : "Simulate 1 Step"}
                </Button>


                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddOutlinedIcon />}
                  onClick={() => setShowDispatchModal(true)}
                  sx={{
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #0284C7 0%, #2563EB 50%, #4F46E5 100%)",
                    fontWeight: 700,
                    boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #0369A1 0%, #1D4ED8 50%, #4338CA 100%)",
                      boxShadow: "0 6px 18px rgba(37, 99, 235, 0.45)",
                    },
                  }}
                >
                  Dispatch Note
                </Button>
              </Stack>
            </Box>
          </Card>

          {/* =================================================================== */}
          {/* 2. EXECUTIVE KPI CARDS (TOP 4 TILES)                                */}
          {/* =================================================================== */}
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            {/* Card 1: Active Disruptions */}
            <Grid item xs={12} sm={6} md={3}>
              <ExecutiveKpiCard
                label="Active Disruptions"
                value={data.totals.activeDisruptions}
                badge={data.totals.activeDisruptions > 0 ? "ELEVATED RISK" : "NORMAL"}
                sub={`${data.totals.activeDisruptions} transit chokepoints flagged`}
                progress={(data.totals.activeDisruptions / 10) * 100}
                progressColor="linear-gradient(90deg, #F59E0B, #EF4444)"
                icon={ReportProblemOutlinedIcon}
                accent="#F59E0B"
                actionText="Disruption Radar"
                onAction={() => navigate("/disruptions")}
                isDark={isDark}
              />
            </Grid>

            {/* Card 2: Impacted Shipments */}
            <Grid item xs={12} sm={6} md={3}>
              <ExecutiveKpiCard
                label="Impacted Shipments"
                value={data.totals.impactedShipments}
                badge={`ACROSS ${data.totals.shipments} MANIFESTS`}
                sub={`Cumulative corridor impact events`}
                progress={Math.min(100, Math.round((data.totals.impactedShipments / (data.totals.shipments || 1)) * 50))}
                progressColor="linear-gradient(90deg, #3B82F6, #6366F1)"
                icon={Inventory2OutlinedIcon}
                accent="#3B82F6"
                actionText="Audit Manifests"
                onAction={() => navigate("/shipments")}
                isDark={isDark}
              />
            </Grid>

            {/* Card 3: At-Risk Cargo Value */}
            <Grid item xs={12} sm={6} md={3}>
              <ExecutiveKpiCard
                label="At-Risk Cargo Value"
                value={`$${(data.totals.atRiskCargoValueUsd / 1_000_000).toFixed(1)}M`}
                badge={`${atRiskRatio}% OF PORTFOLIO`}
                sub={`Immediate financial exposure`}
                progress={atRiskRatio}
                progressColor="linear-gradient(90deg, #F43F5E, #DC2626)"
                icon={PaidOutlinedIcon}
                accent="#EF4444"
                actionText="Risk Analysis Engine"
                onAction={() => navigate("/risk-analysis")}
                isDark={isDark}
              />
            </Grid>

            {/* Card 4: Idle Fleet Assets */}
            <Grid item xs={12} sm={6} md={3}>
              <ExecutiveKpiCard
                label="Idle Fleet Assets"
                value={data.totals.idleAssets}
                badge={`${data.totals.idleAssets} READY TO REDEPLOY`}
                sub={`of ${totalFleetAssets} total intermodal fleet`}
                progress={Math.round((data.totals.idleAssets / (totalFleetAssets || 1)) * 100)}
                progressColor="linear-gradient(90deg, #10B981, #06B6D4)"
                icon={LocalShippingOutlinedIcon}
                accent="#10B981"
                actionText="Redeploy Fleet"
                onAction={() => navigate("/fleet")}
                isDark={isDark}
              />
            </Grid>
          </Grid>

          {/* =================================================================== */}
          {/* 3. VISUALIZATION CENTER: DONUT + BAR CHARTS                         */}
          {/* =================================================================== */}
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            {/* Donut Chart: Fleet Status Breakdown */}
            <Grid item xs={12} lg={5}>
              <Card
                sx={{
                  p: { xs: 2.5, md: 3 },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3.5,
                  position: "relative",
                  border: `1px solid ${isDark ? "rgba(148, 163, 184, 0.16)" : "#E2E8F0"}`,
                  background: isDark
                    ? "linear-gradient(180deg, #111A2E 0%, #0D1527 100%)"
                    : "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
                  boxShadow: isDark
                    ? "0 12px 30px rgba(0, 0, 0, 0.4)"
                    : "0 12px 28px rgba(15, 23, 42, 0.05)",
                }}
              >
                {/* Header */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: "-0.01em" }}>
                      Fleet Capacity & Utilization
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500 }}>
                      Real-time telemetry across tractors, reefers & containers
                    </Typography>
                  </Box>
                  <Chip
                    label={`${fleetActiveRate}% Deployed`}
                    size="small"
                    sx={{
                      bgcolor: isDark ? "rgba(16, 185, 129, 0.15)" : "#ECFDF5",
                      color: "#10B981",
                      fontWeight: 700,
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                    }}
                  />
                </Box>

                {/* Donut Chart with Center Metric */}
                <Box sx={{ position: "relative", height: 260, my: "auto" }}>
                  {/* Center Text inside Donut */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      textAlign: "center",
                      pointerEvents: "none",
                      zIndex: 2,
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 800,
                        lineHeight: 1,
                        letterSpacing: "-0.03em",
                        color: isDark ? "#F8FAFC" : "#0A192F",
                      }}
                    >
                      {totalFleetAssets}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        color: isDark ? "#94A3B8" : "#64748B",
                        textTransform: "uppercase",
                        display: "block",
                        mt: 0.5,
                      }}
                    >
                      TOTAL FLEET
                    </Typography>
                  </Box>

                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.fleetStatusBreakdown}
                        dataKey="count"
                        nameKey="status"
                        innerRadius={68}
                        outerRadius={98}
                        paddingAngle={4}
                        stroke="none"
                        cornerRadius={4}
                      >
                        {data.fleetStatusBreakdown.map((entry) => (
                          <Cell
                            key={entry.status}
                            fill={FLEET_PALETTE[entry.status]?.color || "#94A3B8"}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const p = payload[0];
                            const cfg = FLEET_PALETTE[p.name] || { label: p.name, color: "#94A3B8" };
                            const pct = Math.round(((p.value || 0) / (totalFleetAssets || 1)) * 100);
                            return (
                              <Box
                                sx={{
                                  p: 1.5,
                                  borderRadius: 2.5,
                                  bgcolor: isDark ? "rgba(15, 23, 42, 0.95)" : "#FFFFFF",
                                  border: `1px solid ${isDark ? "rgba(148, 163, 184, 0.2)" : "#E2E8F0"}`,
                                  boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
                                  backdropFilter: "blur(10px)",
                                }}
                              >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: cfg.color }} />
                                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                    {cfg.label}
                                  </Typography>
                                </Box>
                                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                  <strong>{p.value}</strong> units · {pct}% of fleet
                                </Typography>
                              </Box>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>

                {/* Segmented status breakdown chips below */}
                <Box
                  sx={{
                    pt: 2,
                    mt: 1,
                    borderTop: `1px solid ${isDark ? "rgba(148, 163, 184, 0.12)" : "#E2E8F0"}`,
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 1.5,
                  }}
                >
                  {data.fleetStatusBreakdown.map((item) => {
                    const cfg = FLEET_PALETTE[item.status] || { color: "#94A3B8", label: item.status, sub: "" };
                    const pct = Math.round((item.count / (totalFleetAssets || 1)) * 100);
                    return (
                      <Box
                        key={item.status}
                        onClick={() => navigate("/fleet")}
                        sx={{
                          p: 1.25,
                          borderRadius: 2,
                          bgcolor: isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)",
                          border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.04)"}`,
                          cursor: "pointer",
                          transition: "all 150ms ease",
                          "&:hover": {
                            bgcolor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
                            borderColor: cfg.color,
                          },
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                            <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: cfg.color }} />
                            <Typography variant="caption" sx={{ fontWeight: 700 }}>
                              {cfg.label}
                            </Typography>
                          </Box>
                          <Typography variant="caption" sx={{ fontWeight: 800 }}>
                            {item.count}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.25 }}>
                          <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.6875rem" }}>
                            {pct}% share
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Card>
            </Grid>

            {/* Bar Chart: Impacted Shipments per Disruption Corridor */}
            <Grid item xs={12} lg={7}>
              <Card
                sx={{
                  p: { xs: 2.5, md: 3 },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3.5,
                  position: "relative",
                  border: `1px solid ${isDark ? "rgba(148, 163, 184, 0.16)" : "#E2E8F0"}`,
                  background: isDark
                    ? "linear-gradient(180deg, #111A2E 0%, #0D1527 100%)"
                    : "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
                  boxShadow: isDark
                    ? "0 12px 30px rgba(0, 0, 0, 0.4)"
                    : "0 12px 28px rgba(15, 23, 42, 0.05)",
                }}
              >
                {/* Header */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: { xs: "flex-start", sm: "center" },
                    justifyContent: "space-between",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 1.5,
                    mb: 2.5,
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: "-0.01em" }}>
                      Disruption Impact by Transit Corridor
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500 }}>
                      Active shipment delays grouped by bottleneck corridor
                    </Typography>
                  </Box>

                  {/* Severity Legend Pills */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#EF4444" }} />
                      <Typography variant="caption" sx={{ fontSize: "0.7rem", fontWeight: 600, color: "text.secondary" }}>
                        Critical
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#F59E0B" }} />
                      <Typography variant="caption" sx={{ fontSize: "0.7rem", fontWeight: 600, color: "text.secondary" }}>
                        High
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#3B82F6" }} />
                      <Typography variant="caption" sx={{ fontSize: "0.7rem", fontWeight: 600, color: "text.secondary" }}>
                        Medium
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                {/* Bar Chart with Gradients */}
                <Box sx={{ flexGrow: 1, minHeight: 310 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.impactedByDisruption}
                      barSize={36}
                      margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                    >
                      <defs>
                        {/* Critical Severity Gradient */}
                        <linearGradient id="critBarGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#EF4444" stopOpacity={1} />
                          <stop offset="100%" stopColor="#991B1B" stopOpacity={0.8} />
                        </linearGradient>
                        {/* High Severity Gradient */}
                        <linearGradient id="highBarGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#F59E0B" stopOpacity={1} />
                          <stop offset="100%" stopColor="#D97706" stopOpacity={0.8} />
                        </linearGradient>
                        {/* Medium Severity Gradient */}
                        <linearGradient id="medBarGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                          <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0.8} />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        vertical={false}
                        stroke={isDark ? "rgba(148, 163, 184, 0.1)" : "#E2E8F0"}
                        strokeDasharray="4 4"
                      />
                      <XAxis
                        dataKey="disruptionId"
                        stroke={isDark ? "#64748B" : "#94A3B8"}
                        fontSize={12}
                        tickLine={false}
                        axisLine={{ stroke: isDark ? "rgba(148, 163, 184, 0.15)" : "#E2E8F0" }}
                      />
                      <YAxis
                        stroke={isDark ? "#64748B" : "#94A3B8"}
                        fontSize={12}
                        allowDecimals={false}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: isDark ? "rgba(59, 130, 246, 0.08)" : "rgba(59, 130, 246, 0.04)" }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const d = payload[0].payload;
                            const sev = d.severity?.toLowerCase();
                            const sevColor = sev === "critical" ? "#EF4444" : sev === "high" ? "#F59E0B" : "#3B82F6";
                            return (
                              <Box
                                sx={{
                                  p: 1.75,
                                  borderRadius: 2.5,
                                  bgcolor: isDark ? "rgba(15, 23, 42, 0.96)" : "#FFFFFF",
                                  border: `1px solid ${isDark ? "rgba(148, 163, 184, 0.2)" : "#E2E8F0"}`,
                                  boxShadow: "0 12px 28px rgba(0,0,0,0.3)",
                                  backdropFilter: "blur(12px)",
                                }}
                              >
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 1 }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                    {d.disruptionId}
                                  </Typography>
                                  <Chip
                                    label={(d.severity || "HIGH").toUpperCase()}
                                    size="small"
                                    sx={{
                                      height: 18,
                                      fontSize: "0.65rem",
                                      fontWeight: 800,
                                      bgcolor: `${sevColor}20`,
                                      color: sevColor,
                                      border: `1px solid ${sevColor}40`,
                                    }}
                                  />
                                </Box>
                                <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>
                                  Region: <strong>{d.region || "Global Hub"}</strong>
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: "#3B82F6" }}>
                                  {d.impactedCount} Shipments Delayed
                                </Typography>
                                <Typography variant="caption" sx={{ display: "block", mt: 1, color: isDark ? "#94A3B8" : "#64748B" }}>
                                  Click bar to inspect dynamic rerouting
                                </Typography>
                              </Box>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar
                        dataKey="impactedCount"
                        radius={[8, 8, 0, 0]}
                        onClick={() => navigate("/rerouting")}
                        cursor="pointer"
                      >
                        {data.impactedByDisruption.map((entry, index) => {
                          const sev = entry.severity?.toLowerCase();
                          const grad =
                            sev === "critical"
                              ? "url(#critBarGrad)"
                              : sev === "high"
                              ? "url(#highBarGrad)"
                              : "url(#medBarGrad)";
                          return <Cell key={`bar-${index}`} fill={grad} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
            </Grid>
          </Grid>

          {/* =================================================================== */}
          {/* 4. EXECUTIVE THREAT MITIGATION & ACTION MATRIX                      */}
          {/* =================================================================== */}
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5, letterSpacing: "-0.01em" }}>
            Operational Mitigation & Quick Actions
          </Typography>

          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            {/* Action Card 1: Cold-Chain Integrity */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  p: 2.75,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  borderRadius: 3.5,
                  position: "relative",
                  overflow: "hidden",
                  border: `1px solid ${data.totals.criticalColdChainExcursions > 0 ? "rgba(239, 68, 68, 0.35)" : "rgba(16, 185, 129, 0.3)"}`,
                  background: isDark
                    ? "linear-gradient(145deg, rgba(30, 27, 46, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)"
                    : "linear-gradient(145deg, #FFF5F5 0%, #FFFFFF 100%)",
                  boxShadow: isDark
                    ? "0 10px 25px rgba(0, 0, 0, 0.35)"
                    : "0 10px 25px rgba(15, 23, 42, 0.05)",
                  transition: "all 200ms ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    borderColor: data.totals.criticalColdChainExcursions > 0 ? "#EF4444" : "#10B981",
                  },
                }}
              >
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: data.totals.criticalColdChainExcursions > 0 ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)",
                        color: data.totals.criticalColdChainExcursions > 0 ? "#EF4444" : "#10B981",
                      }}
                    >
                      <AcUnitOutlinedIcon sx={{ fontSize: 22 }} />
                    </Box>
                    <Chip
                      label={data.totals.criticalColdChainExcursions > 0 ? "URGENT EXCURSION" : "STABLE TEMPERATURE"}
                      size="small"
                      sx={{
                        fontWeight: 800,
                        fontSize: "0.6875rem",
                        bgcolor: data.totals.criticalColdChainExcursions > 0 ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)",
                        color: data.totals.criticalColdChainExcursions > 0 ? "#EF4444" : "#10B981",
                        border: `1px solid ${data.totals.criticalColdChainExcursions > 0 ? "rgba(239, 68, 68, 0.3)" : "rgba(16, 185, 129, 0.3)"}`,
                      }}
                    />
                  </Box>

                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    Cold-Chain Excursion Watch
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                    {data.totals.criticalColdChainExcursions > 0
                      ? `${data.totals.criticalColdChainExcursions} high/critical temperature breaches detected across cold manifests.`
                      : "All monitored refrigerated containers within safe thermal bounds."}
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate("/coldchain")}
                  sx={{
                    mt: 2.5,
                    fontWeight: 700,
                    borderRadius: 2,
                    borderColor: data.totals.criticalColdChainExcursions > 0 ? "rgba(239, 68, 68, 0.5)" : "rgba(16, 185, 129, 0.5)",
                    color: data.totals.criticalColdChainExcursions > 0 ? "#EF4444" : "#10B981",
                    "&:hover": {
                      borderColor: data.totals.criticalColdChainExcursions > 0 ? "#EF4444" : "#10B981",
                      bgcolor: data.totals.criticalColdChainExcursions > 0 ? "rgba(239, 68, 68, 0.08)" : "rgba(16, 185, 129, 0.08)",
                    },
                  }}
                >
                  Inspect Cold-Chain Telemetry
                </Button>
              </Card>
            </Grid>

            {/* Action Card 2: Idle Fleet Redeployment */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  p: 2.75,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  borderRadius: 3.5,
                  position: "relative",
                  overflow: "hidden",
                  border: `1px solid ${data.totals.idleAssets > 0 ? "rgba(245, 158, 11, 0.35)" : "rgba(148, 163, 184, 0.2)"}`,
                  background: isDark
                    ? "linear-gradient(145deg, rgba(29, 27, 24, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)"
                    : "linear-gradient(145deg, #FFFDF5 0%, #FFFFFF 100%)",
                  boxShadow: isDark
                    ? "0 10px 25px rgba(0, 0, 0, 0.35)"
                    : "0 10px 25px rgba(15, 23, 42, 0.05)",
                  transition: "all 200ms ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    borderColor: "#F59E0B",
                  },
                }}
              >
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "rgba(245, 158, 11, 0.15)",
                        color: "#F59E0B",
                      }}
                    >
                      <LocalShippingOutlinedIcon sx={{ fontSize: 22 }} />
                    </Box>
                    <Chip
                      label={`${data.totals.idleAssets} ASSETS STANDBY`}
                      size="small"
                      sx={{
                        fontWeight: 800,
                        fontSize: "0.6875rem",
                        bgcolor: "rgba(245, 158, 11, 0.15)",
                        color: "#F59E0B",
                        border: "1px solid rgba(245, 158, 11, 0.3)",
                      }}
                    />
                  </Box>

                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    Fleet Readiness & Redeployment
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                    {data.totals.idleAssets > 0
                      ? `${data.totals.idleAssets} unassigned tractors & trailers available for dispatch to congested bottlenecks.`
                      : "All fleet assets actively deployed on live transit schedules."}
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate("/fleet")}
                  sx={{
                    mt: 2.5,
                    fontWeight: 700,
                    borderRadius: 2,
                    borderColor: "rgba(245, 158, 11, 0.5)",
                    color: "#F59E0B",
                    "&:hover": {
                      borderColor: "#F59E0B",
                      bgcolor: "rgba(245, 158, 11, 0.08)",
                    },
                  }}
                >
                  Redeploy Idle Assets
                </Button>
              </Card>
            </Grid>

            {/* Action Card 3: Dynamic Intermodal Rerouting */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  p: 2.75,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  borderRadius: 3.5,
                  position: "relative",
                  overflow: "hidden",
                  border: `1px solid ${data.totals.activeDisruptions > 0 ? "rgba(59, 130, 246, 0.35)" : "rgba(148, 163, 184, 0.2)"}`,
                  background: isDark
                    ? "linear-gradient(145deg, rgba(20, 28, 48, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)"
                    : "linear-gradient(145deg, #F0F7FF 0%, #FFFFFF 100%)",
                  boxShadow: isDark
                    ? "0 10px 25px rgba(0, 0, 0, 0.35)"
                    : "0 10px 25px rgba(15, 23, 42, 0.05)",
                  transition: "all 200ms ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    borderColor: "#3B82F6",
                  },
                }}
              >
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "rgba(59, 130, 246, 0.15)",
                        color: "#3B82F6",
                      }}
                    >
                      <AltRouteOutlinedIcon sx={{ fontSize: 22 }} />
                    </Box>
                    <Chip
                      label="AI PATHFINDER READY"
                      size="small"
                      sx={{
                        fontWeight: 800,
                        fontSize: "0.6875rem",
                        bgcolor: "rgba(59, 130, 246, 0.15)",
                        color: "#3B82F6",
                        border: "1px solid rgba(59, 130, 246, 0.3)",
                      }}
                    />
                  </Box>

                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    Dynamic Intermodal Rerouting
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                    Multi-modal solver ready to calculate alternate sea-to-rail corridors, bypass port strikes, and preserve deadlines.
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate("/rerouting")}
                  sx={{
                    mt: 2.5,
                    fontWeight: 700,
                    borderRadius: 2,
                    borderColor: "rgba(59, 130, 246, 0.5)",
                    color: "#3B82F6",
                    "&:hover": {
                      borderColor: "#3B82F6",
                      bgcolor: "rgba(59, 130, 246, 0.08)",
                    },
                  }}
                >
                  Launch AI Rerouting Engine
                </Button>
              </Card>
            </Grid>
          </Grid>

          {/* =================================================================== */}
          {/* 5. OPERATIONAL FIELD DISPATCH & INCIDENT STREAM                     */}
          {/* =================================================================== */}
          {data.dashboardEntries && data.dashboardEntries.length > 0 && (
            <Card
              sx={{
                p: { xs: 2.5, md: 3 },
                borderRadius: 3.5,
                border: `1px solid ${isDark ? "rgba(148, 163, 184, 0.16)" : "#E2E8F0"}`,
                background: isDark
                  ? "linear-gradient(180deg, #111A2E 0%, #0D1527 100%)"
                  : "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: "-0.01em" }}>
                    Recent Operational Dispatches & Notes
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Latest team checkpoints and regional corridor incident logs
                  </Typography>
                </Box>
                <Button
                  variant="text"
                  size="small"
                  startIcon={<AddOutlinedIcon />}
                  onClick={() => setShowDispatchModal(true)}
                  sx={{ fontWeight: 700 }}
                >
                  New Dispatch
                </Button>
              </Box>

              <Stack spacing={1.5}>
                {data.dashboardEntries.slice(-4).reverse().map((entry) => (
                  <Box
                    key={entry.id}
                    sx={{
                      p: 1.75,
                      borderRadius: 2.5,
                      bgcolor: isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)",
                      border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"}`,
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                        <Chip
                          label={entry.region || "Global"}
                          size="small"
                          sx={{ height: 20, fontSize: "0.6875rem", fontWeight: 700 }}
                        />
                        <Chip
                          label={entry.type?.replace("_", " ").toUpperCase() || "UPDATE"}
                          size="small"
                          variant="outlined"
                          sx={{ height: 20, fontSize: "0.65rem", fontWeight: 600 }}
                        />
                        {entry.shipmentId && (
                          <Typography variant="caption" sx={{ fontWeight: 700, color: "#3B82F6" }}>
                            Manifest #{entry.shipmentId}
                          </Typography>
                        )}
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {entry.note}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", whiteSpace: "nowrap" }}>
                      {entry.createdAt ? new Date(entry.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Recent"}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Card>
          )}

          {/* =================================================================== */}
          {/* 6. MODAL DIALOG: ADD OPERATIONAL DISPATCH                           */}
          {/* =================================================================== */}
          <Dialog
            open={showDispatchModal}
            onClose={() => !isSubmitting && setShowDispatchModal(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3.5,
                bgcolor: isDark ? "#0F172A" : "#FFFFFF",
                border: `1px solid ${isDark ? "rgba(148, 163, 184, 0.2)" : "#E2E8F0"}`,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              },
            }}
          >
            <DialogTitle
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontWeight: 800,
                borderBottom: `1px solid ${tokens.border}`,
                pb: 1.5,
              }}
            >
              Add Operational Dispatch
              <IconButton size="small" onClick={() => setShowDispatchModal(false)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </DialogTitle>

            <Box component="form" onSubmit={handleSubmitDispatch}>
              <DialogContent sx={{ display: "grid", gap: 2, pt: 2.5 }}>
                {submitError && (
                  <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {submitError}
                  </Alert>
                )}

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Corridor Region"
                      value={dispatchForm.region}
                      onChange={(event) =>
                        setDispatchForm({ ...dispatchForm, region: event.target.value })
                      }
                      size="small"
                    >
                      {[
                        "US-West",
                        "US-East",
                        "US-Gulf",
                        "EU-North",
                        "EU-Med",
                        "Asia-SE",
                        "Asia-East",
                        "LatAm-East",
                        "Middle-East",
                        "Africa-North",
                      ].map((region) => (
                        <MenuItem key={region} value={region}>
                          {region}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Dispatch Type"
                      value={dispatchForm.type}
                      onChange={(event) =>
                        setDispatchForm({ ...dispatchForm, type: event.target.value })
                      }
                      size="small"
                    >
                      <MenuItem value="shipment_update">Shipment update</MenuItem>
                      <MenuItem value="disruption_update">Disruption update</MenuItem>
                      <MenuItem value="fleet_update">Fleet update</MenuItem>
                      <MenuItem value="checkpoint">Checkpoint</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Shipment ID (Optional)"
                      placeholder="e.g. SHP-1002"
                      value={dispatchForm.shipmentId}
                      onChange={(event) =>
                        setDispatchForm({ ...dispatchForm, shipmentId: event.target.value })
                      }
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      minRows={3}
                      label="Operational Dispatch Notes"
                      placeholder="Enter telematics alert, checkpoint observation, or corridor advisory..."
                      value={dispatchForm.note}
                      onChange={(event) =>
                        setDispatchForm({ ...dispatchForm, note: event.target.value })
                      }
                      required
                    />
                  </Grid>
                </Grid>
              </DialogContent>

              <DialogActions sx={{ p: 2.5, pt: 1, borderTop: `1px solid ${tokens.border}` }}>
                <Button variant="text" onClick={() => setShowDispatchModal(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting || !dispatchForm.note}
                  startIcon={isSubmitting && <CircularProgress size={16} />}
                  sx={{
                    fontWeight: 700,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #0284C7 0%, #2563EB 50%, #4F46E5 100%)",
                  }}
                >
                  {isSubmitting ? "Broadcasting..." : "Broadcast Dispatch"}
                </Button>
              </DialogActions>
            </Box>
          </Dialog>
        </>
      )}
    </AppLayout>
  );
}
