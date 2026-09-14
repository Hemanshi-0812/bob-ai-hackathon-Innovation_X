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
        <Card sx={{ overflow: "hidden" }}>
          <Box sx={{ overflowX: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Asset</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Current Region</TableCell>
                  <TableCell>Idle</TableCell>
                  <TableCell>Redeployment Suggestion</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {idle.map((i) => (
                  <TableRow key={i.asset.assetId} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"JetBrains Mono", monospace', fontSize: "0.8125rem" }}>
                        {i.asset.assetId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip size="small" variant="outlined" label={i.asset.type} sx={{ textTransform: "capitalize", borderColor: tokens.border, fontWeight: 600 }} />
                    </TableCell>
                    <TableCell>{i.asset.currentRegion}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={`${i.idleHours.toFixed(1)}h`}
                        sx={{
                          bgcolor: i.idleHours > 24 ? tokens.redSoft : tokens.amberSoft,
                          color: i.idleHours > 24 ? "#991B1B" : "#92400E",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 420 }}>
                      <Typography variant="body2">{i.redeploymentSuggestion}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          {idle.length === 0 && (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 6, gap: 1 }}>
              <LocalShippingOutlinedIcon sx={{ fontSize: 32, color: "text.disabled" }} />
              <Typography variant="body2" color="text.secondary">No idle assets above the threshold right now.</Typography>
            </Box>
          )}
        </Card>
      )}
    </AppLayout>
  );
}
