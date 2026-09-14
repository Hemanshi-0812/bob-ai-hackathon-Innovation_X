import { useEffect, useState, useMemo } from "react";
import {
  Card,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  CircularProgress,
  Alert,
  LinearProgress,
  Typography,
  Grid,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import AltRouteOutlinedIcon from "@mui/icons-material/AltRouteOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AcUnitOutlinedIcon from "@mui/icons-material/AcUnitOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TuneIcon from "@mui/icons-material/Tune";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { useNavigate } from "react-router-dom";

import AppLayout from "../components/AppLayout.jsx";
import DisruptionSelect from "../components/DisruptionSelect.jsx";
import { api } from "../api/client.js";
import { tokens } from "../theme.js";
import { useColorTheme } from "../context/ThemeContext.jsx";

function riskColor(score) {
  if (score >= 80) return tokens.red;
  if (score >= 60) return tokens.amber;
  return tokens.emerald;
}

function riskLabel(score) {
  if (score >= 80) return "Critical Risk";
  if (score >= 60) return "Elevated Risk";
  return "Moderate Risk";
}

export default function RiskAnalysis() {
  const navigate = useNavigate();
  const { isDark } = useColorTheme();

  const [disruptions, setDisruptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [impacted, setImpacted] = useState(null);
  const [error, setError] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [riskTab, setRiskTab] = useState(0); // 0: All, 1: Critical (80+), 2: High (60-79), 3: Moderate (<60)
  const [selectedCorridorFilter, setSelectedCorridorFilter] = useState("ALL");

  // AI Mitigation Modal State
  const [detailItem, setDetailItem] = useState(null);

  useEffect(() => {
    api
      .getDisruptions()
      .then((d) => {
        setDisruptions(d);
        if (d.length) setSelected(d[0].disruptionId);
      })
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    if (!selected) return;
    setImpacted(null);
    api
      .getImpactedShipments(selected)
      .then(setImpacted)
      .catch((e) => setError(e.message));
  }, [selected]);

  const activeDisruption = useMemo(
    () => disruptions.find((d) => d.disruptionId === selected),
    [disruptions, selected]
  );

  // Computed metrics
  const metrics = useMemo(() => {
    if (!impacted || impacted.length === 0) {
      return { total: 0, critical: 0, maxDelay: 0, totalValue: 0, avgRisk: 0, corridors: [] };
    }
    const criticalCount = impacted.filter((i) => i.riskScore >= 80).length;
    const maxDelay = Math.max(...impacted.map((i) => i.delayEstimateHours || 0));
    const totalValue = impacted.reduce((acc, i) => acc + (i.shipment.cargoValueUsd || 150000), 0);
    const avgRisk = Math.round(impacted.reduce((acc, i) => acc + i.riskScore, 0) / impacted.length);

    // Group corridors
    const corridorMap = {};
    impacted.forEach((i) => {
      const key = `${i.shipment.origin} → ${i.shipment.destination}`;
      if (!corridorMap[key]) {
        corridorMap[key] = { key, origin: i.shipment.origin, destination: i.shipment.destination, count: 0, maxScore: 0 };
      }
      corridorMap[key].count += 1;
      if (i.riskScore > corridorMap[key].maxScore) {
        corridorMap[key].maxScore = i.riskScore;
      }
    });

    return {
      total: impacted.length,
      critical: criticalCount,
      maxDelay,
      totalValue,
      avgRisk,
      corridors: Object.values(corridorMap),
    };
  }, [impacted]);

  // Filtered shipments
  const filteredImpacted = useMemo(() => {
    if (!impacted) return [];
    return impacted.filter((i) => {
      // Risk tab filter
      if (riskTab === 1 && i.riskScore < 80) return false;
      if (riskTab === 2 && (i.riskScore < 60 || i.riskScore >= 80)) return false;
      if (riskTab === 3 && i.riskScore >= 60) return false;

      // Corridor filter
      if (selectedCorridorFilter !== "ALL") {
        const laneKey = `${i.shipment.origin} → ${i.shipment.destination}`;
        if (laneKey !== selectedCorridorFilter) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const sid = (i.shipment.shipmentId || "").toLowerCase();
        const carrier = (i.shipment.carrier || "").toLowerCase();
        const cargo = (i.shipment.cargoType || "").toLowerCase();
        const origin = (i.shipment.origin || "").toLowerCase();
        const dest = (i.shipment.destination || "").toLowerCase();
        return sid.includes(q) || carrier.includes(q) || cargo.includes(q) || origin.includes(q) || dest.includes(q);
      }

      return true;
    });
  }, [impacted, riskTab, selectedCorridorFilter, searchQuery]);

  // Chart data: top 8 impacted shipments
  const chartData = useMemo(() => {
    if (!impacted) return [];
    return impacted.slice(0, 8).map((i) => ({
      name: i.shipment.shipmentId,
      risk: i.riskScore,
      delay: i.delayEstimateHours,
      carrier: i.shipment.carrier,
    }));
  }, [impacted]);

  return (
    <AppLayout
      title="Lane Risk & Corridor Vulnerability Analysis"
      subtitle="Executive risk scoring, delay projections, and autonomous mitigation across active bottleneck corridors."
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2.5 }}>
          {error}
        </Alert>
      )}

      {/* Disruption Corridor Selector & Quick Actions */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ flexGrow: 1, maxWidth: 500 }}>
          {disruptions.length > 0 && (
            <DisruptionSelect disruptions={disruptions} value={selected} onChange={setSelected} />
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AltRouteOutlinedIcon />}
            onClick={() => navigate("/rerouting")}
            sx={{
              borderColor: tokens.borderStrong,
              color: "text.primary",
              fontWeight: 700,
              fontSize: "0.78rem",
            }}
          >
            Launch AI Reroute Engine
          </Button>

          <Button
            variant="contained"
            size="small"
            startIcon={<SmartToyOutlinedIcon />}
            onClick={() => {
              if (filteredImpacted.length > 0) setDetailItem(filteredImpacted[0]);
            }}
            sx={{
              background: tokens.gradientPrimary,
              fontWeight: 700,
              fontSize: "0.78rem",
              boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)",
            }}
          >
            Bob AI Mitigation Brief
          </Button>
        </Box>
      </Box>

      {/* Loading state */}
      {!impacted && !error && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
          <CircularProgress />
        </Box>
      )}

      {impacted && (
        <>
          {/* Executive KPI Summary Cards */}
          <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2.5, position: "relative", overflow: "hidden" }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: 700, color: "text.secondary" }}>
                    Impacted Cargo
                  </Typography>
                  <Box sx={{ width: 34, height: 34, borderRadius: 2, bgcolor: "rgba(99, 102, 241, 0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <LocalShippingOutlinedIcon sx={{ color: "#6366F1", fontSize: 18 }} />
                  </Box>
                </Box>
                <Typography variant="h4" sx={{ mt: 1.2, fontWeight: 900 }}>
                  {metrics.total} <Box component="span" sx={{ fontSize: "0.9rem", fontWeight: 600, color: "text.secondary" }}>Shipments</Box>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Across corridor: <strong>{activeDisruption?.region || "Active Zone"}</strong>
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: 700, color: "text.secondary" }}>
                    Critical Risk Flagged
                  </Typography>
                  <Box sx={{ width: 34, height: 34, borderRadius: 2, bgcolor: "rgba(239, 68, 68, 0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <WarningAmberOutlinedIcon sx={{ color: tokens.red, fontSize: 18 }} />
                  </Box>
                </Box>
                <Typography variant="h4" sx={{ mt: 1.2, fontWeight: 900, color: tokens.red }}>
                  {metrics.critical} <Box component="span" sx={{ fontSize: "0.9rem", fontWeight: 600, color: "text.secondary" }}>Score &ge; 80</Box>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Requires immediate lane diversion
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: 700, color: "text.secondary" }}>
                    Max Delay Projected
                  </Typography>
                  <Box sx={{ width: 34, height: 34, borderRadius: 2, bgcolor: "rgba(245, 158, 11, 0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <AccessTimeOutlinedIcon sx={{ color: tokens.amber, fontSize: 18 }} />
                  </Box>
                </Box>
                <Typography variant="h4" sx={{ mt: 1.2, fontWeight: 900, color: tokens.amber }}>
                  +{metrics.maxDelay}h
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Est. duration: {activeDisruption?.estimatedDurationHours || 0}h total
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: 700, color: "text.secondary" }}>
                    Value at Risk
                  </Typography>
                  <Box sx={{ width: 34, height: 34, borderRadius: 2, bgcolor: "rgba(16, 185, 129, 0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MonetizationOnOutlinedIcon sx={{ color: tokens.emerald, fontSize: 18 }} />
                  </Box>
                </Box>
                <Typography variant="h4" sx={{ mt: 1.2, fontWeight: 900, color: tokens.emerald }}>
                  ${(metrics.totalValue / 1000000).toFixed(1)}M
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Avg lane vulnerability: <strong>{metrics.avgRisk}/100</strong>
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Trade Lane Corridor Matrix Cards */}
          <Box sx={{ mb: 3.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                Corridor Vulnerability Matrix ({metrics.corridors.length} active trade lanes)
              </Typography>
              {selectedCorridorFilter !== "ALL" && (
                <Button size="small" onClick={() => setSelectedCorridorFilter("ALL")} sx={{ fontSize: "0.72rem", color: tokens.indigo }}>
                  Clear Corridor Filter
                </Button>
              )}
            </Box>

            <Grid container spacing={1.5}>
              {metrics.corridors.map((c) => {
                const isSelected = selectedCorridorFilter === c.key;
                return (
                  <Grid item xs={12} sm={6} md={3} key={c.key}>
                    <Card
                      onClick={() => setSelectedCorridorFilter(isSelected ? "ALL" : c.key)}
                      sx={{
                        p: 2,
                        cursor: "pointer",
                        border: isSelected ? `2px solid ${tokens.indigo}` : `1px solid ${tokens.border}`,
                        bgcolor: isSelected ? (isDark ? "rgba(99, 102, 241, 0.14)" : tokens.indigoSoft) : undefined,
                        transition: "all 140ms ease",
                        "&:hover": { transform: "translateY(-2px)", borderColor: tokens.indigo },
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.75 }}>
                        <Typography sx={{ fontWeight: 800, fontSize: "0.86rem" }}>
                          {c.origin} &rarr; {c.destination}
                        </Typography>
                        <Chip
                          size="small"
                          label={`Risk ${c.maxScore}`}
                          sx={{
                            height: 20,
                            fontSize: "0.64rem",
                            fontWeight: 800,
                            bgcolor: `${riskColor(c.maxScore)}20`,
                            color: riskColor(c.maxScore),
                            border: `1px solid ${riskColor(c.maxScore)}40`,
                          }}
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {c.count} {c.count === 1 ? "manifest" : "manifests"} impacted in corridor
                      </Typography>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>

          {/* Visual Analytics Chart: Delay vs Risk */}
          <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3, height: "100%" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, fontSize: "0.98rem" }}>
                      Projected Delay &amp; Risk Distribution
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Delay hours (bar height) vs quantified risk score (bar color) across priority shipments
                    </Typography>
                  </Box>
                  <Chip label="Real-Time Telemetry" size="small" sx={{ fontWeight: 700, fontSize: "0.68rem" }} />
                </Box>
                <Box sx={{ height: 240, width: "100%" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.06)" : "#E2E8F0"} />
                      <XAxis dataKey="name" stroke={isDark ? "#94A3B8" : "#64748B"} fontSize={11} tickLine={false} />
                      <YAxis stroke={isDark ? "#94A3B8" : "#64748B"} fontSize={11} tickLine={false} unit="h" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
                          borderColor: isDark ? "rgba(148, 163, 184, 0.2)" : "#E2E8F0",
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                      />
                      <Bar dataKey="delay" name="Est. Delay (Hours)" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={riskColor(entry.risk)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
            </Grid>

            {/* Severity Distribution & AI Copilot Card */}
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, fontSize: "0.98rem", mb: 0.5 }}>
                    Risk Severity Split
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Threshold allocation for current corridor
                  </Typography>

                  <Stack spacing={2} sx={{ mt: 2.5 }}>
                    <Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: tokens.red }}>
                          Critical Risk (&ge; 80)
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 800 }}>
                          {metrics.critical} ({metrics.total ? Math.round((metrics.critical / metrics.total) * 100) : 0}%)
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={metrics.total ? (metrics.critical / metrics.total) * 100 : 0}
                        sx={{ height: 6, borderRadius: 3, bgcolor: "rgba(239, 68, 68, 0.15)", "& .MuiLinearProgress-bar": { bgcolor: tokens.red } }}
                      />
                    </Box>

                    <Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: tokens.amber }}>
                          Elevated Risk (60-79)
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 800 }}>
                          {impacted.filter((i) => i.riskScore >= 60 && i.riskScore < 80).length}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={metrics.total ? (impacted.filter((i) => i.riskScore >= 60 && i.riskScore < 80).length / metrics.total) * 100 : 0}
                        sx={{ height: 6, borderRadius: 3, bgcolor: "rgba(245, 158, 11, 0.15)", "& .MuiLinearProgress-bar": { bgcolor: tokens.amber } }}
                      />
                    </Box>

                    <Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: tokens.emerald }}>
                          Moderate Risk (&lt; 60)
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 800 }}>
                          {impacted.filter((i) => i.riskScore < 60).length}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={metrics.total ? (impacted.filter((i) => i.riskScore < 60).length / metrics.total) * 100 : 0}
                        sx={{ height: 6, borderRadius: 3, bgcolor: "rgba(16, 185, 129, 0.15)", "& .MuiLinearProgress-bar": { bgcolor: tokens.emerald } }}
                      />
                    </Box>
                  </Stack>
                </Box>

                <Box sx={{ p: 2, borderRadius: 2, bgcolor: isDark ? "rgba(99, 102, 241, 0.08)" : tokens.indigoSoft, border: `1px solid ${tokens.border}`, mt: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75 }}>
                    <SmartToyOutlinedIcon sx={{ color: tokens.indigo, fontSize: 18 }} />
                    <Typography variant="caption" sx={{ fontWeight: 800, color: tokens.indigoDark }}>
                      Bob AI Proactive Advisory
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.4 }}>
                    Automated corridor reroute recommendations have been generated for all {metrics.critical} critical cargo manifests.
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>

          {/* Filter & Search Bar */}
          <Card sx={{ mb: 2, p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search by Shipment ID, Carrier, Cargo, or Origin/Dest…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={7}>
                <Box sx={{ display: "flex", justifyContent: { xs: "flex-start", md: "flex-end" } }}>
                  <Tabs
                    value={riskTab}
                    onChange={(e, val) => setRiskTab(val)}
                    sx={{
                      minHeight: 36,
                      "& .MuiTab-root": { minHeight: 36, py: 0.5, px: 1.5, fontSize: "0.78rem", fontWeight: 700 },
                    }}
                  >
                    <Tab label={`All (${impacted.length})`} />
                    <Tab label={`Critical (${metrics.critical})`} sx={{ color: tokens.red }} />
                    <Tab label="Elevated (60-79)" sx={{ color: tokens.amber }} />
                    <Tab label="Moderate (<60)" sx={{ color: tokens.emerald }} />
                  </Tabs>
                </Box>
              </Grid>
            </Grid>
          </Card>

          {/* Redesigned Shipment Risk Command Table */}
          <Card sx={{ overflow: "hidden" }}>
            <Box sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Shipment &amp; Carrier</TableCell>
                    <TableCell>Corridor (Origin &rarr; Dest)</TableCell>
                    <TableCell>Impact Driver &amp; Reason</TableCell>
                    <TableCell>Projected Delay</TableCell>
                    <TableCell sx={{ minWidth: 180 }}>Risk Score &amp; Tier</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredImpacted.map((i) => {
                    const isCold = i.shipment.isColdChain;
                    return (
                      <TableRow key={i.shipment.shipmentId} hover>
                        {/* Shipment & Carrier */}
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: '"JetBrains Mono", monospace', fontSize: "0.82rem" }}>
                                {i.shipment.shipmentId}
                              </Typography>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.25 }}>
                                <Typography variant="caption" color="text.secondary">
                                  {i.shipment.carrier} · {i.shipment.mode}
                                </Typography>
                                {isCold && (
                                  <Chip
                                    icon={<AcUnitOutlinedIcon sx={{ fontSize: "11px !important" }} />}
                                    label="Reefer"
                                    size="small"
                                    sx={{ height: 18, fontSize: "0.6rem", fontWeight: 700, bgcolor: "rgba(6, 182, 212, 0.15)", color: "#06B6D4" }}
                                  />
                                )}
                              </Box>
                            </Box>
                          </Box>
                        </TableCell>

                        {/* Corridor */}
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {i.shipment.origin} &rarr; {i.shipment.destination}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Current: <strong>{i.shipment.currentLocation}</strong>
                          </Typography>
                        </TableCell>

                        {/* Impact Reason */}
                        <TableCell sx={{ maxWidth: 320 }}>
                          <Typography variant="body2" sx={{ fontSize: "0.8rem", lineHeight: 1.35 }}>
                            {i.impactReason}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.3 }}>
                            Cargo: {i.shipment.cargoType}
                          </Typography>
                        </TableCell>

                        {/* Delay */}
                        <TableCell>
                          <Chip
                            size="small"
                            label={`+${i.delayEstimateHours}h delay`}
                            sx={{
                              fontWeight: 800,
                              fontSize: "0.72rem",
                              bgcolor: i.delayEstimateHours > 48 ? "rgba(239, 68, 68, 0.15)" : "rgba(245, 158, 11, 0.15)",
                              color: i.delayEstimateHours > 48 ? tokens.red : tokens.amber,
                            }}
                          />
                        </TableCell>

                        {/* Risk Score */}
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                            <LinearProgress
                              variant="determinate"
                              value={i.riskScore}
                              sx={{
                                flexGrow: 1,
                                height: 7,
                                borderRadius: 4,
                                "& .MuiLinearProgress-bar": { bgcolor: riskColor(i.riskScore), borderRadius: 4 },
                              }}
                            />
                            <Typography variant="caption" sx={{ fontWeight: 800, minWidth: 26, textAlign: "right", color: riskColor(i.riskScore) }}>
                              {i.riskScore}
                            </Typography>
                          </Box>
                          <Typography variant="caption" sx={{ fontSize: "0.68rem", color: "text.secondary" }}>
                            {riskLabel(i.riskScore)}
                          </Typography>
                        </TableCell>

                        {/* Actions */}
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => setDetailItem(i)}
                              sx={{ fontSize: "0.72rem", py: 0.3, px: 1, borderColor: tokens.borderStrong }}
                            >
                              Details
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => navigate("/rerouting")}
                              sx={{
                                fontSize: "0.72rem",
                                py: 0.3,
                                px: 1,
                                background: tokens.gradientPrimary,
                                fontWeight: 700,
                              }}
                            >
                              Reroute
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>

            {filteredImpacted.length === 0 && (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 8, gap: 1 }}>
                <InsightsOutlinedIcon sx={{ fontSize: 36, color: "text.disabled" }} />
                <Typography variant="body2" color="text.secondary">
                  No shipments matching current filter criteria.
                </Typography>
              </Box>
            )}
          </Card>
        </>
      )}

      {/* AI Lane Risk Mitigation Details Dialog */}
      <Dialog open={Boolean(detailItem)} onClose={() => setDetailItem(null)} maxWidth="sm" fullWidth>
        {detailItem && (
          <>
            <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 800 }}>
              <SmartToyOutlinedIcon sx={{ color: tokens.indigo }} />
              AI Lane Risk Assessment · {detailItem.shipment.shipmentId}
            </DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: 700, color: "text.secondary" }}>
                    Corridor &amp; Routing
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.25 }}>
                    {detailItem.shipment.origin} &rarr; {detailItem.shipment.destination} via {detailItem.shipment.currentLocation}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Carrier: {detailItem.shipment.carrier} · Mode: {detailItem.shipment.mode} · Cargo: {detailItem.shipment.cargoType}
                  </Typography>
                </Box>

                <Box sx={{ p: 2, borderRadius: 2, bgcolor: isDark ? "rgba(239, 68, 68, 0.1)" : "#FEF2F2", border: `1px solid rgba(239, 68, 68, 0.3)` }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: tokens.red }}>
                    Risk Vulnerability Score: {detailItem.riskScore}/100 ({riskLabel(detailItem.riskScore)})
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, fontSize: "0.84rem" }}>
                    {detailItem.impactReason}
                  </Typography>
                  <Typography variant="caption" sx={{ display: "block", mt: 1, fontWeight: 700 }}>
                    Projected Delay: +{detailItem.delayEstimateHours} Hours
                  </Typography>
                </Box>

                <Box sx={{ p: 2, borderRadius: 2, bgcolor: isDark ? "rgba(99, 102, 241, 0.08)" : tokens.indigoSoft, border: `1px solid ${tokens.border}` }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: tokens.indigoDark, display: "flex", alignItems: "center", gap: 0.75 }}>
                    <AltRouteOutlinedIcon fontSize="small" /> Bob AI Recommended Alternative Lane
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, fontSize: "0.84rem" }}>
                    Bypass bottleneck corridor <strong>{activeDisruption?.region}</strong> by switching to secondary intermodal route via rail interchange.
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                    <span>Estimated Transit Delta: <strong>-38 Hours saved</strong></span>
                    <span>Cost Variance: <strong>+$420 USD</strong></span>
                  </Box>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={() => setDetailItem(null)} sx={{ color: "text.secondary" }}>
                Close
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  setDetailItem(null);
                  navigate("/rerouting");
                }}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  background: tokens.gradientPrimary,
                  fontWeight: 700,
                }}
              >
                Execute AI Reroute
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </AppLayout>
  );
}
