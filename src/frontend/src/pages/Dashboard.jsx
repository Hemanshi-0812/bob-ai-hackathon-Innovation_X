import { useEffect, useState } from "react";
import { Grid, Card, Typography, Box, CircularProgress, Alert, Button, Stack, TextField, MenuItem } from "@mui/material";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import BoltIcon from "@mui/icons-material/Bolt";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import AppLayout from "../components/AppLayout.jsx";
import { api } from "../api/client.js";
import { tokens } from "../theme.js";
import { useAuth } from "../context/AuthContext.jsx";

const FLEET_COLORS = {
  idle: tokens.amber,
  in_transit: tokens.indigo,
  loading: "#64748B",
  maintenance: tokens.red,
};

const FLEET_LABELS = {
  idle: "Idle",
  in_transit: "In transit",
  loading: "Loading",
  maintenance: "Maintenance",
};

function StatCard({ label, value, sub, icon: Icon, accent }) {
  return (
    <Card sx={{ p: 2.75, height: "100%", position: "relative", overflow: "hidden" }}>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: accent ? `linear-gradient(135deg, ${accent}14 0%, rgba(255,255,255,0) 60%)` : "linear-gradient(135deg, rgba(79,70,229,0.08) 0%, rgba(255,255,255,0) 60%)",
        }}
      />
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <Typography variant="subtitle2" sx={{ textTransform: "uppercase", letterSpacing: "0.04em", fontSize: "0.6875rem" }}>
            {label}
          </Typography>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: accent ? `${accent}18` : "rgba(79,70,229,0.08)",
            }}
          >
            <Icon sx={{ fontSize: 18, color: accent || tokens.indigo }} />
          </Box>
        </Box>
        <Typography variant="h4" sx={{ mt: 1.5, fontWeight: 800, letterSpacing: "-0.03em" }}>{value}</Typography>
        {sub && (
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
            {sub}
          </Typography>
        )}
      </Box>
    </Card>
  );
}

function ChartCard({ title, children, height = 340 }) {
  return (
    <Card sx={{ p: 2.75, height }}>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>{title}</Typography>
      <Box sx={{ height: "calc(100% - 36px)" }}>{children}</Box>
    </Card>
  );
}

const tooltipStyle = {
  contentStyle: {
    borderRadius: 8,
    border: `1px solid ${tokens.border}`,
    boxShadow: "0 4px 10px rgba(15,23,42,0.08)",
    fontSize: 13,
  },
};

import UserDashboard from "./UserDashboard.jsx";

export default function Dashboard() {
  const { user } = useAuth();
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
            bgcolor: tokens.indigoSoft,
            borderBottom: `1px solid ${tokens.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 700, color: tokens.indigoDark }}>
            👑 ADMIN PREVIEW MODE: You are viewing the dedicated Shipper User Module.
          </Typography>
          <Button size="small" variant="contained" onClick={() => setAdminViewMode("admin")}>
            Return to Executive Command Center
          </Button>
        </Box>
        <UserDashboard />
      </Box>
    );
  }

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    region: user?.region || "US-West",
    type: "shipment_update",
    note: "",
    shipmentId: "",
  });
  const [submitError, setSubmitError] = useState(null);

  const loadSummary = (silent = false) =>
    api.getDashboardSummary()
      .then(setData)
      .catch((e) => {
        if (!silent) setError(e.message);
      });

  useEffect(() => {
    loadSummary();
    const interval = setInterval(() => {
      loadSummary(true);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user?.region) setForm((current) => ({ ...current, region: user.region }));
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError(null);

    try {
      await api.addDashboardData({
        region: form.region,
        type: form.type,
        note: form.note,
        shipmentId: form.shipmentId || undefined,
      });
      setShowForm(false);
      setForm((current) => ({ ...current, note: "", shipmentId: "" }));
      await loadSummary();
    } catch (e) {
      setSubmitError(e.message);
    }
  };

  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      await api.triggerSimulatorTick();
      await loadSummary();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <AppLayout
      title="Executive Command Dashboard"
      subtitle="System-wide real-time operations across global shipments, disruptions, and fleets"
    >
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {!data && !error && (
        <Box sx={{ display: "flex", justifyContent: "center", pt: 10 }}><CircularProgress /></Box>
      )}
      {data && (
        <>
          <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 1.5, mb: 2.5 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "rgba(16, 185, 129, 0.1)",
                color: "#059669",
                px: 1.75,
                py: 0.75,
                borderRadius: "9999px",
                fontWeight: 700,
                fontSize: "0.8rem",
                border: "1px solid rgba(16, 185, 129, 0.2)",
              }}
            >
              <FiberManualRecordIcon sx={{ fontSize: 11 }} />
              Live Logistics Engine: Streaming Intermodal & IoT Updates
            </Box>

            <Stack direction="row" spacing={1.5}>
              <Button
                variant="outlined"
                startIcon={isSimulating ? <CircularProgress size={14} /> : <BoltIcon sx={{ color: "#F59E0B" }} />}
                onClick={handleSimulate}
                disabled={isSimulating}
                sx={{
                  borderColor: "rgba(245, 158, 11, 0.4)",
                  fontWeight: 700,
                  "&:hover": { borderColor: "#F59E0B", bgcolor: "rgba(245, 158, 11, 0.06)" },
                }}
              >
                {isSimulating ? "Simulating..." : "Simulate 1 Step"}
              </Button>

              <Button
                variant="outlined"
                onClick={() => setAdminViewMode("user_preview")}
                sx={{ borderColor: tokens.indigo, color: tokens.indigo }}
              >
                Preview as Shipper User
              </Button>
              {!showForm && (
                <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={() => setShowForm(true)}>
                  Add Operational Data
                </Button>
              )}
            </Stack>
          </Box>
          {showForm && (
                <Card sx={{ p: 2, width: "100%" }}>
                  <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 700 }}>Add dashboard update</Typography>
                  <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 1.5 }}>
                    <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
                      <TextField select label="Region" value={form.region} onChange={(event) => setForm({ ...form, region: event.target.value })} sx={{ minWidth: 180 }}>
                        {Array.from(new Set(["US-West", "US-East", "US-Gulf", "EU-North", "EU-Med", "Asia-SE", "Asia-East", "LatAm-East", "Middle-East", "Africa-North"])).map((region) => (
                          <MenuItem key={region} value={region}>{region}</MenuItem>
                        ))}
                      </TextField>
                      <TextField select label="Type" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} sx={{ minWidth: 180 }}>
                        <MenuItem value="shipment_update">Shipment update</MenuItem>
                        <MenuItem value="disruption_update">Disruption update</MenuItem>
                        <MenuItem value="fleet_update">Fleet update</MenuItem>
                        <MenuItem value="checkpoint">Checkpoint</MenuItem>
                      </TextField>
                      <TextField label="Shipment ID" value={form.shipmentId} onChange={(event) => setForm({ ...form, shipmentId: event.target.value })} sx={{ minWidth: 180 }} />
                    </Stack>
                    <TextField multiline minRows={3} label="Notes" value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} required />
                    {submitError && <Alert severity="error">{submitError}</Alert>}
                    <Stack direction="row" spacing={1.5} justifyContent="flex-end">
                      <Button variant="text" onClick={() => setShowForm(false)}>Cancel</Button>
                      <Button type="submit" variant="contained">Save data</Button>
                    </Stack>
                  </Box>
                </Card>
              )}
          <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                label="Active Disruptions"
                value={data.totals.activeDisruptions}
                icon={ReportProblemOutlinedIcon}
                accent={tokens.amber}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                label="Impacted Shipments"
                value={data.totals.impactedShipments}
                sub={`of ${data.totals.shipments} total`}
                icon={Inventory2OutlinedIcon}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                label="At-Risk Cargo Value"
                value={`$${(data.totals.atRiskCargoValueUsd / 1_000_000).toFixed(1)}M`}
                icon={PaidOutlinedIcon}
                accent={tokens.red}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                label="Idle Fleet Assets"
                value={data.totals.idleAssets}
                sub={`of ${data.totals.fleetAssets} total`}
                icon={LocalShippingOutlinedIcon}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2.5}>
            <Grid item xs={12} md={5}>
              <ChartCard title="Fleet Status Breakdown">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.fleetStatusBreakdown}
                      dataKey="count"
                      nameKey="status"
                      innerRadius={58}
                      outerRadius={92}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {data.fleetStatusBreakdown.map((entry) => (
                        <Cell key={entry.status} fill={FLEET_COLORS[entry.status] || "#94A3B8"} />
                      ))}
                    </Pie>
                    <Tooltip {...tooltipStyle} formatter={(v, n) => [v, FLEET_LABELS[n] || n]} />
                    <Legend
                      formatter={(value) => (
                        <span style={{ color: tokens.text, fontSize: 12 }}>{FLEET_LABELS[value] || value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </Grid>

            <Grid item xs={12} md={7}>
              <ChartCard title="Impacted Shipments per Disruption">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.impactedByDisruption} barSize={32}>
                    <CartesianGrid vertical={false} stroke={tokens.border} />
                    <XAxis dataKey="disruptionId" stroke={tokens.textMuted} fontSize={12} tickLine={false} axisLine={{ stroke: tokens.border }} />
                    <YAxis stroke={tokens.textMuted} fontSize={12} allowDecimals={false} tickLine={false} axisLine={false} />
                    <Tooltip {...tooltipStyle} cursor={{ fill: tokens.indigoSoft }} />
                    <Bar dataKey="impactedCount" name="Impacted shipments" fill={tokens.indigo} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </Grid>
          </Grid>

          <Alert
            severity={data.totals.criticalColdChainExcursions > 0 ? "warning" : "success"}
            sx={{ mt: 2.5 }}
          >
            {data.totals.criticalColdChainExcursions > 0
              ? `${data.totals.criticalColdChainExcursions} high/critical cold-chain excursion(s) need review — see Cold-Chain Monitoring.`
              : "No high-severity cold-chain excursions at this time."}
          </Alert>
        </>
      )}
    </AppLayout>
  );
}
