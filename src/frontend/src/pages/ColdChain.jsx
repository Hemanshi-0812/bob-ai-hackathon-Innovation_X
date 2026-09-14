import { useEffect, useState } from "react";
import {
  Card,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Typography,
  Stack,
  TextField,
  MenuItem,
  Chip,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
  CartesianGrid,
} from "recharts";
import AcUnitOutlinedIcon from "@mui/icons-material/AcUnitOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AppLayout from "../components/AppLayout.jsx";
import SeverityChip from "../components/SeverityChip.jsx";
import { api } from "../api/client.js";
import { tokens } from "../theme.js";

export default function ColdChain() {
  const [readings, setReadings] = useState(null);
  const [excursions, setExcursions] = useState(null);
  const [error, setError] = useState(null);
  const [selectedShipmentId, setSelectedShipmentId] = useState("");

  useEffect(() => {
    Promise.all([api.getColdChainReadings(), api.getColdChainExcursions()])
      .then(([r, e]) => {
        setReadings(r);
        setExcursions(e);
        const byShip = {};
        (r || []).forEach((item) => {
          byShip[item.shipmentId] = true;
        });
        const shipIds = Object.keys(byShip);
        if (shipIds.length > 0) {
          setSelectedShipmentId(shipIds[0]);
        }
      })
      .catch((e) => setError(e.message));
  }, []);

  // Group readings by shipment
  const byShipment = {};
  (readings || []).forEach((r) => {
    byShipment[r.shipmentId] = byShipment[r.shipmentId] || [];
    byShipment[r.shipmentId].push(r);
  });

  const availableShipmentIds = Object.keys(byShipment);

  const activeShipmentId = selectedShipmentId || availableShipmentIds[0] || "";
  const activeReadings = (byShipment[activeShipmentId] || [])
    .slice()
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const chartData = activeReadings.map((r) => ({
    time: new Date(r.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    temp: r.temperatureC,
  }));

  const latestReading = activeReadings[activeReadings.length - 1];
  const isOptimal = latestReading ? latestReading.temperatureC >= 2 && latestReading.temperatureC <= 8 : true;

  const relevantExcursions = (excursions || []).filter(
    (e) => !activeShipmentId || e.shipmentId === activeShipmentId
  );

  return (
    <AppLayout
      title="Cold-Chain IoT Sensor Telemetry"
      subtitle="Real-time pharmaceutical & perishable temperature logs with automated excursion detection"
    >
      {error && <Alert severity="error" sx={{ mb: 2.5 }}>{error}</Alert>}

      {!readings && !error && (
        <Box sx={{ display: "flex", justifyContent: "center", pt: 10 }}>
          <CircularProgress />
        </Box>
      )}

      {readings && (
        <>
          {/* Shipment Telemetry Selector Bar */}
          <Card sx={{ p: 2.5, mb: 3, border: `1px solid ${tokens.border}` }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <TextField
                  select
                  size="small"
                  label="Select Monitored Shipment"
                  value={activeShipmentId}
                  onChange={(e) => setSelectedShipmentId(e.target.value)}
                  sx={{ minWidth: 240 }}
                >
                  {availableShipmentIds.map((id) => (
                    <MenuItem key={id} value={id}>
                      {id} ({byShipment[id].length} readings)
                    </MenuItem>
                  ))}
                </TextField>

                {latestReading && (
                  <Chip
                    icon={isOptimal ? <CheckCircleOutlineIcon /> : <WarningAmberIcon />}
                    label={`Current Temp: ${latestReading.temperatureC}°C (${isOptimal ? "Safe Range" : "Excursion"})`}
                    color={isOptimal ? "success" : "error"}
                    sx={{ fontWeight: 700 }}
                  />
                )}
              </Box>

              <Typography variant="caption" color="text.secondary">
                Regulatory Target Range: <strong>2°C – 8°C</strong> · Sensor polling: Every 15 min
              </Typography>
            </Box>
          </Card>

          <Grid container spacing={2.5}>
            {/* Chart Card */}
            <Grid item xs={12} md={7}>
              <Card sx={{ p: 3, height: 420, border: `1px solid ${tokens.border}` }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>
                  Temperature Telemetry Curve — {activeShipmentId || "No Data"}
                </Typography>
                <Box sx={{ height: "calc(100% - 40px)" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid vertical={false} stroke={tokens.border} />
                      <XAxis
                        dataKey="time"
                        stroke={tokens.textMuted}
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: tokens.border }}
                      />
                      <YAxis stroke={tokens.textMuted} fontSize={11} unit="°C" tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 8,
                          border: `1px solid ${tokens.border}`,
                          fontSize: 13,
                          boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <ReferenceLine
                        y={2}
                        stroke={tokens.emerald}
                        strokeDasharray="4 4"
                        label={{ value: "Min Safe 2°C", fontSize: 10, fill: tokens.emerald }}
                      />
                      <ReferenceLine
                        y={8}
                        stroke={tokens.emerald}
                        strokeDasharray="4 4"
                        label={{ value: "Max Safe 8°C", fontSize: 10, fill: tokens.emerald }}
                      />
                      <Line
                        type="monotone"
                        dataKey="temp"
                        name="Measured Temp (°C)"
                        stroke={tokens.indigo}
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: tokens.indigo, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
            </Grid>

            {/* Excursions Log Card */}
            <Grid item xs={12} md={5}>
              <Card sx={{ p: 3, height: 420, display: "flex", flexDirection: "column", border: `1px solid ${tokens.border}` }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5 }}>
                  Temperature Excursions &amp; Regulatory Severity
                </Typography>
                <Box sx={{ overflowY: "auto", flexGrow: 1, pr: 0.5 }}>
                  <Stack spacing={1.5}>
                    {relevantExcursions.map((e, idx) => (
                      <Box
                        key={`${e.shipmentId}-${idx}`}
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: tokens.bg,
                          border: `1px solid ${tokens.border}`,
                        }}
                      >
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: '"JetBrains Mono", monospace' }}>
                            {e.shipmentId} · {e.temperatureC}°C
                          </Typography>
                          <SeverityChip severity={e.severity} />
                        </Box>
                        <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                          Safe Band: {e.allowedRangeC[0]}–{e.allowedRangeC[1]}°C · Action: <strong>{e.recommendedAction}</strong>
                        </Typography>
                      </Box>
                    ))}
                    {relevantExcursions.length === 0 && (
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 8, gap: 1 }}>
                        <AcUnitOutlinedIcon sx={{ fontSize: 36, color: tokens.emerald }} />
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "#065F46" }}>
                          Zero Excursions Recorded
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          This cargo has remained strictly within compliant temperature parameters throughout transit.
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </AppLayout>
  );
}
