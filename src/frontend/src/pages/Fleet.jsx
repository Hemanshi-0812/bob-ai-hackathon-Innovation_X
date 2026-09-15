import { useEffect, useState } from "react";
import { Card, Table, TableHead, TableRow, TableCell, TableBody, Box, CircularProgress, Alert, Typography, Chip } from "@mui/material";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AppLayout from "../components/AppLayout.jsx";
import DisruptionSelect from "../components/DisruptionSelect.jsx";
import { api } from "../api/client.js";
import { tokens } from "../theme.js";

export default function Fleet() {
  const [disruptions, setDisruptions] = useState([]);
  const [selected, setSelected] = useState("");
  const [idle, setIdle] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getDisruptions().then(setDisruptions).catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    setIdle(null);
    api.getIdleFleet(selected || undefined).then(setIdle).catch((e) => setError(e.message));
  }, [selected]);

  return (
    <AppLayout title="Idle Fleet Detection & Redeployment" subtitle="Assets sitting idle above threshold, with suggested redeployment">
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <DisruptionSelect disruptions={disruptions} value={selected} onChange={setSelected} allowNone label="Target corridor" />
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2.5, mt: -1.5 }}>
        Select a disruption to get redeployment suggestions targeted at that corridor, or leave unset for a general idle-fleet view.
      </Typography>

      {!idle && !error && (
        <Box sx={{ display: "flex", justifyContent: "center", pt: 10 }}><CircularProgress /></Box>
      )}
      {idle && (
        <>
          <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
            <Chip
              icon={<LocalShippingOutlinedIcon />}
              label={`${idle.length} Idle Asset(s) Detected`}
              color="primary"
              sx={{ fontWeight: 700 }}
            />
            {selected && (
              <Chip
                label={`Target Corridor: ${disruptions.find((d) => d.disruptionId === selected)?.region || selected}`}
                variant="outlined"
                sx={{ fontWeight: 700, borderColor: tokens.indigo, color: tokens.indigo }}
              />
            )}
            <Chip
              label="Threshold: > 2.0h Inactive"
              size="small"
              variant="outlined"
              sx={{ color: "text.secondary", fontSize: "0.75rem" }}
            />
          </Box>

          <Card sx={{ overflow: "hidden", border: `1px solid ${tokens.border}`, boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
            <Box sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "rgba(248, 250, 252, 0.8)" }}>
                    <TableCell sx={{ fontWeight: 700 }}>Asset ID</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Current Region</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Capacity</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Idle Duration</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>AI Redeployment Suggestion</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {idle.map((i) => (
                    <TableRow key={i.asset.assetId} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: '"JetBrains Mono", monospace', fontSize: "0.8125rem", color: tokens.indigo }}>
                          {i.asset.assetId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip size="small" variant="outlined" label={i.asset.type} sx={{ textTransform: "capitalize", borderColor: tokens.border, fontWeight: 700 }} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{i.asset.currentRegion}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {Number(i.asset.capacityUnits || 0).toLocaleString()} units
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={`${i.idleHours.toFixed(1)}h idle`}
                          sx={{
                            fontWeight: 700,
                            bgcolor: i.idleHours > 24 ? tokens.redSoft : tokens.amberSoft,
                            color: i.idleHours > 24 ? "#991B1B" : "#92400E",
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ maxWidth: 460 }}>
                        <Typography variant="body2" sx={{ lineHeight: 1.5 }}>{i.redeploymentSuggestion}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            {idle.length === 0 && (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 8, gap: 1.5 }}>
                <LocalShippingOutlinedIcon sx={{ fontSize: 36, color: "text.disabled" }} />
                <Typography variant="body1" sx={{ fontWeight: 700 }}>No idle assets above the threshold right now.</Typography>
                <Typography variant="body2" color="text.secondary">All network fleet capacity is actively deployed on scheduled corridors.</Typography>
              </Box>
            )}
          </Card>
        </>
      )}
    </AppLayout>
  );
}
