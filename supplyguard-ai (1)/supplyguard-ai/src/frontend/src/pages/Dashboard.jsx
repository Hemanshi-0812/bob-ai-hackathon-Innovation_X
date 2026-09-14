import { useEffect, useState } from "react";
import { Grid, Card, Typography, Box, CircularProgress, Alert } from "@mui/material";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AppLayout from "../components/AppLayout.jsx";
import { api } from "../api/client.js";
import { tokens } from "../theme.js";

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
    <Card sx={{ p: 2.75, height: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <Typography variant="subtitle2" sx={{ textTransform: "uppercase", letterSpacing: "0.04em", fontSize: "0.6875rem" }}>
          {label}
        </Typography>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: accent ? `${accent}17` : tokens.indigoSoft,
          }}
        >
          <Icon sx={{ fontSize: 17, color: accent || tokens.indigo }} />
        </Box>
      </Box>
      <Typography variant="h4" sx={{ mt: 1.5 }}>{value}</Typography>
      {sub && (
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
          {sub}
        </Typography>
      )}
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

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getDashboardSummary().then(setData).catch((e) => setError(e.message));
  }, []);

  return (
    <AppLayout title="Executive Dashboard" subtitle="Live view across shipments, disruptions, and fleet">
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {!data && !error && (
        <Box sx={{ display: "flex", justifyContent: "center", pt: 10 }}><CircularProgress /></Box>
      )}
      {data && (
        <>
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
