import { useEffect, useState } from "react";
import { Card, Box, CircularProgress, Alert, Typography, Chip, Stack } from "@mui/material";
import AltRouteOutlinedIcon from "@mui/icons-material/AltRouteOutlined";
import AppLayout from "../components/AppLayout.jsx";
import DisruptionSelect from "../components/DisruptionSelect.jsx";
import { api } from "../api/client.js";
import { tokens } from "../theme.js";

export default function Rerouting() {
  const [disruptions, setDisruptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [recs, setRecs] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getDisruptions().then((d) => {
      setDisruptions(d);
      if (d.length) setSelected(d[0].disruptionId);
      else setSelected(null);
    }).catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    if (!selected) return;
    setRecs(null);
    api.getRerouteRecommendations(selected).then(setRecs).catch((e) => setError(e.message));
  }, [selected]);

  return (
    <AppLayout title="AI Rerouting Recommendation" subtitle="Bob's suggested carrier and route alternatives per shipment">
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {disruptions.length > 0 && (
        <DisruptionSelect disruptions={disruptions} value={selected} onChange={setSelected} />
      )}
      {!recs && !error && disruptions.length === 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, py: 10 }}>
          <AltRouteOutlinedIcon sx={{ fontSize: 32, color: "text.disabled" }} />
          <Typography variant="body2" color="text.secondary">No disruptions are available for your region yet.</Typography>
        </Box>
      )}
      {!recs && !error && disruptions.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", pt: 10 }}><CircularProgress /></Box>
      )}
      {recs && (
        <Stack spacing={1.5}>
          {recs.map((r) => {
            const isReroute = r.recommendedAction === "reroute";
            return (
              <Card key={r.shipmentId} sx={{ p: 2.25 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.75 }}>
                  <Typography sx={{ fontWeight: 700, fontFamily: '"JetBrains Mono", monospace', fontSize: "0.875rem" }}>
                    {r.shipmentId}
                  </Typography>
                  <Chip
                    size="small"
                    label={r.recommendedAction.toUpperCase()}
                    sx={{
                      bgcolor: isReroute ? tokens.amberSoft : "#F1F5F9",
                      color: isReroute ? "#92400E" : tokens.textMuted,
                    }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">{r.rationale}</Typography>
                {r.alternateCarrier && (
                  <Stack direction="row" spacing={1} sx={{ mt: 1.25 }} flexWrap="wrap" useFlexGap>
                    <Chip size="small" variant="outlined" label={`Carrier: ${r.alternateCarrier}`} sx={{ borderColor: tokens.border, fontWeight: 600 }} />
                    {r.alternateRoute && (
                      <Chip size="small" variant="outlined" label={`Route: ${r.alternateRoute.join(" → ")}`} sx={{ borderColor: tokens.border, fontWeight: 600 }} />
                    )}
                    <Chip size="small" label={`Confidence: ${Math.round(r.confidence * 100)}%`} sx={{ bgcolor: tokens.indigoSoft, color: tokens.indigoDark }} />
                  </Stack>
                )}
              </Card>
            );
          })}
          {recs.length === 0 && (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 6, gap: 1 }}>
              <AltRouteOutlinedIcon sx={{ fontSize: 32, color: "text.disabled" }} />
              <Typography variant="body2" color="text.secondary">No recommendations — no shipments impacted by this disruption.</Typography>
            </Box>
          )}
        </Stack>
      )}
    </AppLayout>
  );
}
