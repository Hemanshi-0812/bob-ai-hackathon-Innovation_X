import { useEffect, useState } from "react";
import { Card, Grid, Box, CircularProgress, Alert, Typography, Stack } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Legend, CartesianGrid } from "recharts";
import AcUnitOutlinedIcon from "@mui/icons-material/AcUnitOutlined";
import AppLayout from "../components/AppLayout.jsx";
import SeverityChip from "../components/SeverityChip.jsx";
import { api } from "../api/client.js";
import { tokens } from "../theme.js";

export default function ColdChain() {
  const [readings, setReadings] = useState(null);
  const [excursions, setExcursions] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([api.getColdChainReadings(), api.getColdChainExcursions()])
      .then(([r, e]) => {
        setReadings(r);
        setExcursions(e);
      })
      .catch((e) => setError(e.message));
  }, []);

  // Group readings by shipment for the chart, pick the first shipment with data
  const byShipment = {};
  (readings || []).forEach((r) => {
    byShipment[r.shipmentId] = byShipment[r.shipmentId] || [];
    byShipment[r.shipmentId].push(r);
  });
  const firstShipmentId = Object.keys(byShipment)[0];
  const chartData = firstShipmentId
    ? byShipment[firstShipmentId]
        .slice()
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        .map((r) => ({ time: new Date(r.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), temp: r.temperatureC }))
    : [];

  return (
    <AppLayout title="Cold-Chain IoT Monitoring" subtitle="Temperature telemetry and regulatory excursion severity">
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {!readings && !error && (
        <Box sx={{ display: "flex", justifyContent: "center", pt: 10 }}><CircularProgress /></Box>
      )}
      {readings && (
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2.75, height: 380 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Temperature Log {firstShipmentId ? `— ${firstShipmentId}` : ""}
              </Typography>
              <Box sx={{ height: "calc(100% - 36px)" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid vertical={false} stroke={tokens.border} />
                    <XAxis dataKey="time" stroke={tokens.textMuted} fontSize={11} tickLine={false} axisLine={{ stroke: tokens.border }} />
                    <YAxis stroke={tokens.textMuted} fontSize={11} unit="°C" tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: `1px solid ${tokens.border}`, fontSize: 13 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <ReferenceLine y={2} stroke={tokens.emerald} strokeDasharray="4 4" label={{ value: "min 2°C", fontSize: 10, fill: tokens.emerald }} />
                    <ReferenceLine y={8} stroke={tokens.emerald} strokeDasharray="4 4" label={{ value: "max 8°C", fontSize: 10, fill: tokens.emerald }} />
                    <Line type="monotone" dataKey="temp" name="Temperature (°C)" stroke={tokens.indigo} strokeWidth={2.5} dot={{ r: 3, fill: tokens.indigo, strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2.75, height: 380, display: "flex", flexDirection: "column" }}>
              <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
                Temperature Excursions &amp; Severity
              </Typography>
              <Box sx={{ overflowY: "auto", flexGrow: 1 }}>
                <Stack spacing={1.25}>
                  {(excursions || []).map((e, idx) => (
                    <Box key={`${e.shipmentId}-${idx}`} sx={{ borderBottom: `1px solid ${tokens.border}`, pb: 1.25 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>
                          {e.shipmentId} <Box component="span" sx={{ fontFamily: "inherit", color: "text.secondary" }}>— {e.temperatureC}°C</Box>
                        </Typography>
                        <SeverityChip severity={e.severity} />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Allowed {e.allowedRangeC[0]}–{e.allowedRangeC[1]}°C · {e.recommendedAction}
                      </Typography>
                    </Box>
                  ))}
                  {excursions && excursions.length === 0 && (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 6, gap: 1 }}>
                      <AcUnitOutlinedIcon sx={{ fontSize: 32, color: "text.disabled" }} />
                      <Typography variant="body2" color="text.secondary">No temperature excursions detected.</Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}
    </AppLayout>
  );
}
