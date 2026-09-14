import { useEffect, useState } from "react";
import {
  Card, Table, TableHead, TableRow, TableCell, TableBody,
  Box, CircularProgress, Alert, LinearProgress, Typography,
} from "@mui/material";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import AppLayout from "../components/AppLayout.jsx";
import DisruptionSelect from "../components/DisruptionSelect.jsx";
import { api } from "../api/client.js";
import { tokens } from "../theme.js";

function riskColor(score) {
  if (score >= 80) return tokens.red;
  if (score >= 55) return tokens.amber;
  return tokens.emerald;
}

export default function RiskAnalysis() {
  const [disruptions, setDisruptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [impacted, setImpacted] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getDisruptions().then((d) => {
      setDisruptions(d);
      if (d.length) setSelected(d[0].disruptionId);
    }).catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    if (!selected) return;
    setImpacted(null);
    api.getImpactedShipments(selected).then(setImpacted).catch((e) => setError(e.message));
  }, [selected]);

  return (
    <AppLayout title="Affected Shipment & Risk Analysis" subtitle="Quantified delay risk for shipments in an active disruption corridor">
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {disruptions.length > 0 && (
        <DisruptionSelect disruptions={disruptions} value={selected} onChange={setSelected} />
      )}
      {!impacted && !error && (
        <Box sx={{ display: "flex", justifyContent: "center", pt: 10 }}><CircularProgress /></Box>
      )}
      {impacted && (
        <Card sx={{ overflow: "hidden" }}>
          <Box sx={{ overflowX: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Shipment</TableCell>
                  <TableCell>Impact Reason</TableCell>
                  <TableCell>Est. Delay</TableCell>
                  <TableCell sx={{ width: 220 }}>Risk Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {impacted.map((i) => (
                  <TableRow key={i.shipment.shipmentId} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"JetBrains Mono", monospace', fontSize: "0.8125rem" }}>
                        {i.shipment.shipmentId}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">{i.shipment.carrier}</Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 380 }}>
                      <Typography variant="body2">{i.impactReason}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{i.delayEstimateHours}h</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                        <LinearProgress
                          variant="determinate"
                          value={i.riskScore}
                          sx={{
                            flexGrow: 1,
                            height: 6,
                            borderRadius: 3,
                            "& .MuiLinearProgress-bar": { bgcolor: riskColor(i.riskScore), borderRadius: 3 },
                          }}
                        />
                        <Typography variant="caption" sx={{ fontWeight: 700, minWidth: 24, textAlign: "right" }}>
                          {i.riskScore}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          {impacted.length === 0 && (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 6, gap: 1 }}>
              <InsightsOutlinedIcon sx={{ fontSize: 32, color: "text.disabled" }} />
              <Typography variant="body2" color="text.secondary">No shipments impacted by this disruption.</Typography>
            </Box>
          )}
        </Card>
      )}
    </AppLayout>
  );
}
