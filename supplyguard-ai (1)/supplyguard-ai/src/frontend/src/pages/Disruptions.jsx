import { useEffect, useState } from "react";
import { Card, Grid, Typography, Box, CircularProgress, Alert, Chip } from "@mui/material";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import AppLayout from "../components/AppLayout.jsx";
import SeverityChip from "../components/SeverityChip.jsx";
import { api } from "../api/client.js";
import { tokens } from "../theme.js";

const SEVERITY_RADIUS = { low: 8, medium: 11, high: 14, critical: 18 };
const SEVERITY_COLOR = { low: tokens.emerald, medium: tokens.amber, high: tokens.amber, critical: tokens.red };

export default function Disruptions() {
  const [disruptions, setDisruptions] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getDisruptions().then(setDisruptions).catch((e) => setError(e.message));
  }, []);

  return (
    <AppLayout
      title="Disruption Detection"
      subtitle={disruptions ? `${disruptions.length} active events being tracked` : undefined}
    >
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {!disruptions && !error && (
        <Box sx={{ display: "flex", justifyContent: "center", pt: 10 }}><CircularProgress /></Box>
      )}
      {disruptions && (
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={7}>
            <Card sx={{ height: 520, overflow: "hidden" }}>
              <MapContainer center={[20, 30]} zoom={2} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  attribution="&copy; OpenStreetMap contributors &copy; CARTO"
                />
                {disruptions.map((d) => (
                  <CircleMarker
                    key={d.disruptionId}
                    center={d.coords}
                    radius={SEVERITY_RADIUS[d.severity] || 10}
                    pathOptions={{
                      color: SEVERITY_COLOR[d.severity],
                      fillColor: SEVERITY_COLOR[d.severity],
                      fillOpacity: 0.45,
                      weight: 2,
                    }}
                  >
                    <Popup>
                      <strong>{d.disruptionId}</strong> — {d.region}
                      <br />
                      {d.description}
                      <br />
                      Severity: {d.severity} · Est. {d.estimatedDurationHours}h
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </Card>
          </Grid>

          <Grid item xs={12} md={5}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, maxHeight: 520, overflowY: "auto", pr: 0.5 }}>
              {disruptions.map((d) => (
                <Card key={d.disruptionId} sx={{ p: 2.25 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1.5 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: "0.9375rem" }}>
                      {d.disruptionId} <Box component="span" sx={{ color: "text.secondary", fontWeight: 500 }}>— {d.region}</Box>
                    </Typography>
                    <SeverityChip severity={d.severity} />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>{d.description}</Typography>
                  <Chip
                    size="small"
                    variant="outlined"
                    label={`${d.type.replace("_", " ")} · est. ${d.estimatedDurationHours}h`}
                    sx={{ mt: 1.25, textTransform: "capitalize", fontWeight: 600, color: "text.secondary", borderColor: tokens.border }}
                  />
                </Card>
              ))}
            </Box>
          </Grid>
        </Grid>
      )}
    </AppLayout>
  );
}
